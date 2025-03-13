import { sceneGraph } from '@scenes/index';
import { ScopesFacade } from '@grafana-module/app/features/scopes';

export interface DashboardScopesFacadeState {
  reloadOnParamsChange?: boolean;
  uid?: string;
}

export class DashboardScopesFacade extends ScopesFacade {
  constructor({ reloadOnParamsChange, uid }: DashboardScopesFacadeState) {
    super({
      handler: (facade) => {
        if (!reloadOnParamsChange || !uid) {
          sceneGraph.getTimeRange(facade).onRefresh();
        }
      },
    });
  }
}
