import { isEmpty } from 'lodash';

import { Labels } from '@data/index';
import { labelsMatchMatchers } from '@grafana-module/app/features/alerting/unified/utils/alertmanager';
import { parsePromQLStyleMatcherLooseSafe } from '@grafana-module/app/features/alerting/unified/utils/matchers';
import { Alert, hasAlertState } from '@grafana-module/app/types/unified-alerting';
import { GrafanaAlertState, PromAlertingRuleState } from '@grafana-module/app/types/unified-alerting-dto';

import { UnifiedAlertListOptions } from './types';

function hasLabelFilter(alertInstanceLabelFilter: string, labels: Labels) {
  const matchers = parsePromQLStyleMatcherLooseSafe(alertInstanceLabelFilter);
  return labelsMatchMatchers(labels, matchers);
}

export function filterAlerts(
  options: Pick<UnifiedAlertListOptions, 'stateFilter' | 'alertInstanceLabelFilter'>,
  alerts: Alert[]
): Alert[] {
  const { stateFilter, alertInstanceLabelFilter } = options;

  if (isEmpty(stateFilter)) {
    return alerts;
  }

  return alerts.filter((alert) => {
    return (
      ((stateFilter.firing &&
        (hasAlertState(alert, GrafanaAlertState.Alerting) || hasAlertState(alert, PromAlertingRuleState.Firing))) ||
        (stateFilter.pending &&
          (hasAlertState(alert, GrafanaAlertState.Pending) || hasAlertState(alert, PromAlertingRuleState.Pending))) ||
        (stateFilter.noData && hasAlertState(alert, GrafanaAlertState.NoData)) ||
        (stateFilter.normal && hasAlertState(alert, GrafanaAlertState.Normal)) ||
        (stateFilter.error && hasAlertState(alert, GrafanaAlertState.Error)) ||
        (stateFilter.inactive && hasAlertState(alert, PromAlertingRuleState.Inactive))) &&
      (alertInstanceLabelFilter ? hasLabelFilter(options.alertInstanceLabelFilter, alert.labels) : true)
    );
  });
}
