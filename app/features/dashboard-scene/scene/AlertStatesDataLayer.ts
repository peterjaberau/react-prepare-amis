import { from, map, Observable, Unsubscribable } from 'rxjs';

import { AlertState, AlertStateInfo, DataTopic, LoadingState, toDataFrame } from '@data/index';
import { config } from '@runtime/index';
import {
  SceneDataLayerBase,
  SceneDataLayerProvider,
  SceneDataLayerProviderState,
  sceneGraph,
  SceneTimeRangeLike,
} from '@scenes/index';
import { notifyApp } from '~/core/actions';
import { createErrorNotification } from '~/core/copy/appNotification';
import { contextSrv } from '~/core/core';
import { getMessageFromError } from '~/core/utils/errors';
import { alertRuleApi } from '~/features/alerting/unified/api/alertRuleApi';
import { ungroupRulesByFileName } from '~/features/alerting/unified/api/prometheus';
import { Annotation } from '~/features/alerting/unified/utils/constants';
import { GRAFANA_RULES_SOURCE_NAME } from '~/features/alerting/unified/utils/datasource';
import { prometheusRuleType } from '~/features/alerting/unified/utils/rules';
import { dispatch } from '~/store/store';
import { AccessControlAction } from '~/types';
import { RuleNamespace } from '~/types/unified-alerting';
import { PromAlertingRuleState, PromRuleGroupDTO } from '~/types/unified-alerting-dto';

import { getDashboardSceneFor } from '../utils/utils';

interface AlertStatesDataLayerState extends SceneDataLayerProviderState {}

export class AlertStatesDataLayer
  extends SceneDataLayerBase<AlertStatesDataLayerState>
  implements SceneDataLayerProvider
{
  private hasAlertRules = true;
  private _timeRangeSub: Unsubscribable | undefined;
  public topic = DataTopic.AlertStates;

  public constructor(initialState: AlertStatesDataLayerState) {
    super({
      isEnabled: true,
      ...initialState,
      isHidden: true,
    });
  }

  public onEnable(): void {
    const timeRange = sceneGraph.getTimeRange(this);

    this._timeRangeSub = timeRange.subscribeToState(() => {
      this.runWithTimeRange(timeRange);
    });
  }

  public onDisable(): void {
    this._timeRangeSub?.unsubscribe();
  }

  public runLayer() {
    const timeRange = sceneGraph.getTimeRange(this);
    this.runWithTimeRange(timeRange);
  }

  private async runWithTimeRange(timeRange: SceneTimeRangeLike) {
    const dashboard = getDashboardSceneFor(this);
    const { uid, id } = dashboard.state;

    if (this.querySub) {
      this.querySub.unsubscribe();
    }

    if (!this.canWork(timeRange)) {
      return;
    }
    const fetchData: () => Promise<RuleNamespace[]> = async () => {
      const promRules = await dispatch(
        alertRuleApi.endpoints.prometheusRuleNamespaces.initiate(
          {
            ruleSourceName: GRAFANA_RULES_SOURCE_NAME,
            dashboardUid: uid,
          },
          { forceRefetch: true }
        )
      );
      if (promRules.error) {
        throw new Error(`Unexpected alert rules response.`);
      }
      return promRules.data;
    };
    const res: Observable<PromRuleGroupDTO[]> = from(fetchData()).pipe(
      map((namespaces: RuleNamespace[]) => ungroupRulesByFileName(namespaces))
    );

    const alerStatesExecution = res.pipe(
      map((groups: PromRuleGroupDTO[]) => {
        this.hasAlertRules = false;
        const panelIdToAlertState: Record<number, AlertStateInfo> = {};
        groups.forEach((group) =>
          group.rules.forEach((rule) => {
            if (prometheusRuleType.alertingRule(rule) && rule.annotations?.[Annotation.panelID]) {
              this.hasAlertRules = true;
              const panelId = Number(rule.annotations[Annotation.panelID]);
              const state = promAlertStateToAlertState(rule.state);

              // there can be multiple alerts per panel, so we make sure we get the most severe state:
              // alerting > pending > ok
              if (!panelIdToAlertState[panelId]) {
                panelIdToAlertState[panelId] = {
                  state,
                  id: Object.keys(panelIdToAlertState).length,
                  panelId,
                  dashboardId: id!,
                };
              } else if (state === AlertState.Alerting && panelIdToAlertState[panelId].state !== AlertState.Alerting) {
                panelIdToAlertState[panelId].state = AlertState.Alerting;
              } else if (
                state === AlertState.Pending &&
                panelIdToAlertState[panelId].state !== AlertState.Alerting &&
                panelIdToAlertState[panelId].state !== AlertState.Pending
              ) {
                panelIdToAlertState[panelId].state = AlertState.Pending;
              }
            }
          })
        );
        return Object.values(panelIdToAlertState);
      })
    );

    this.querySub = alerStatesExecution.subscribe({
      next: (stateUpdate) => {
        const frame = toDataFrame(stateUpdate);
        this.publishResults({
          state: LoadingState.Done,
          series: [
            {
              ...frame,
              meta: {
                ...frame.meta,
                dataTopic: DataTopic.AlertStates,
              },
            },
          ],
          timeRange: timeRange.state.value,
        });
      },
      error: (err) => {
        this.handleError(err);
        this.publishResults({
          state: LoadingState.Error,
          series: [],
          errors: [
            {
              message: getMessageFromError(err),
            },
          ],
          timeRange: timeRange.state.value,
        });
      },
    });
  }

  private canWork(timeRange: SceneTimeRangeLike): boolean {
    const dashboard = getDashboardSceneFor(this);
    const { uid } = dashboard.state;

    if (!uid) {
      return false;
    }

    // Cannot fetch rules while on a public dashboard since it's unauthenticated
    if (config.publicDashboardAccessToken) {
      return false;
    }

    if (timeRange.state.value.raw.to !== 'now') {
      return false;
    }

    if (this.hasAlertRules === false) {
      return false;
    }

    const hasRuleReadPermission =
      contextSrv.hasPermission(AccessControlAction.AlertingRuleRead) &&
      contextSrv.hasPermission(AccessControlAction.AlertingRuleExternalRead);

    if (!hasRuleReadPermission) {
      return false;
    }

    return true;
  }

  private handleError = (err: unknown) => {
    const notification = createErrorNotification('AlertStatesDataLayer', getMessageFromError(err));
    dispatch(notifyApp(notification));
  };
}

export function promAlertStateToAlertState(state: PromAlertingRuleState): AlertState {
  if (state === PromAlertingRuleState.Firing) {
    return AlertState.Alerting;
  } else if (state === PromAlertingRuleState.Pending) {
    return AlertState.Pending;
  }
  return AlertState.OK;
}
