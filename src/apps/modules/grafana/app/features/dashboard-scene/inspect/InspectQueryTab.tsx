import {
  SceneComponentProps,
  sceneGraph,
  SceneObjectBase,
  SceneObjectState,
  SceneObjectRef,
  VizPanel,
} from '@scenes/index';
import { t } from '@grafana-module/app/core/internationalization';
import { QueryInspector } from '@grafana-module/app/features/inspector/QueryInspector';
import { InspectTab } from '@grafana-module/app/features/inspector/types';

import { getQueryRunnerFor } from '../utils/utils';

export interface InspectQueryTabState extends SceneObjectState {
  panelRef: SceneObjectRef<VizPanel>;
}

export class InspectQueryTab extends SceneObjectBase<InspectQueryTabState> {
  public getTabLabel() {
    return t('dashboard.inspect.query-tab', 'Query');
  }

  public getTabValue() {
    return InspectTab.Query;
  }

  public onRefreshQuery = () => {
    const queryRunner = getQueryRunnerFor(this.state.panelRef.resolve());

    if (queryRunner) {
      queryRunner.runQueries();
    }
  };

  static Component = ({ model }: SceneComponentProps<InspectQueryTab>) => {
    const data = sceneGraph.getData(model.state.panelRef.resolve()).useState();

    if (!data.data) {
      return null;
    }

    return <QueryInspector data={data.data} onRefreshQuery={model.onRefreshQuery} />;
  };
}
