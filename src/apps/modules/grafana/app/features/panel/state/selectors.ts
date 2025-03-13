import { PanelModel } from '@grafana-module/app/features/dashboard/state/PanelModel';
import { StoreState } from '@grafana-module/app/types';

import { PanelState } from './reducers';

export function getPanelStateForModel(state: StoreState, model: PanelModel): PanelState | undefined {
  return state.panels[model.key];
}
