import {
  AnnotationQuery,
  Dashboard,
  defaultDashboardCursorSync,
  defaultVariableModel,
  Panel,
  RowPanel,
  VariableModel,
} from '@schema/index';
import { GetVariables } from '~/features/variables/state/selectors';
import { DashboardMeta } from '~/types';

import { DashboardModel } from '../DashboardModel';

export function createDashboardModelFixture(
  dashboardInput: Partial<Dashboard> = {},
  meta?: DashboardMeta,
  getVariablesFromState?: GetVariables
): DashboardModel {
  const dashboardJson: Dashboard = {
    editable: true,
    graphTooltip: defaultDashboardCursorSync,
    schemaVersion: 1,
    version: 1,
    timezone: '',
    ...dashboardInput,
  };

  return new DashboardModel(dashboardJson, meta, { getVariablesFromState });
}

export function createPanelSaveModel(panelInput: Partial<Panel | RowPanel> = {}): Panel {
  return {
    type: 'timeseries',
    ...panelInput,
  };
}

export function createAnnotationJSONFixture(annotationInput: Partial<AnnotationQuery>): AnnotationQuery {
  // @ts-expect-error
  return {
    datasource: {
      type: 'foo',
      uid: 'bar',
    },
    enable: true,
    type: 'anno',
    ...annotationInput,
  };
}

export function createVariableJSONFixture(annotationInput: Partial<VariableModel>): VariableModel {
  return {
    ...defaultVariableModel,
    name: 'foo.variable',
    type: 'constant',
    ...annotationInput,
  };
}
