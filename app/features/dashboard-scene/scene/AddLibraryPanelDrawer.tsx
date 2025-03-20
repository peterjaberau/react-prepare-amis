import { SceneComponentProps, SceneObjectBase, SceneObjectRef, SceneObjectState, VizPanel } from '@scenes/index';
import { LibraryPanel } from '@schema/index';
import { Drawer } from '@grafana-ui/index';
import { t } from '~/core/internationalization';
import {
  LibraryPanelsSearch,
  LibraryPanelsSearchVariant,
} from '~/features/library-panels/components/LibraryPanelsSearch/LibraryPanelsSearch';

import { getDashboardSceneFor, getDefaultVizPanel } from '../utils/utils';

import { LibraryPanelBehavior } from './LibraryPanelBehavior';
import { DashboardGridItem } from './layout-default/DashboardGridItem';

export interface AddLibraryPanelDrawerState extends SceneObjectState {
  panelToReplaceRef?: SceneObjectRef<VizPanel>;
}

export class AddLibraryPanelDrawer extends SceneObjectBase<AddLibraryPanelDrawerState> {
  public onClose = () => {
    getDashboardSceneFor(this).closeModal();
  };

  public onAddLibraryPanel = (panelInfo: LibraryPanel) => {
    const dashboard = getDashboardSceneFor(this);
    const newPanel = getDefaultVizPanel();

    newPanel.setState({
      // Panel title takes precedence over library panel title when resolving the library panel
      title: panelInfo.model.title,
      hoverHeader: !panelInfo.model.title,
      $behaviors: [new LibraryPanelBehavior({ uid: panelInfo.uid, name: panelInfo.name })],
    });

    const panelToReplace = this.state.panelToReplaceRef?.resolve();

    if (panelToReplace) {
      const gridItemToReplace = panelToReplace.parent;

      if (!(gridItemToReplace instanceof DashboardGridItem)) {
        throw new Error('Trying to replace a panel that does not have a DashboardGridItem');
      }

      gridItemToReplace.setState({ body: newPanel });
    } else {
      dashboard.addPanel(newPanel);
    }

    this.onClose();
  };

  static Component = ({ model }: SceneComponentProps<AddLibraryPanelDrawer>) => {
    const title = t('library-panel.add-widget.title', 'Add panel from panel library');

    return (
      <Drawer title={title} onClose={model.onClose}>
        <LibraryPanelsSearch
          onClick={model.onAddLibraryPanel}
          variant={LibraryPanelsSearchVariant.Tight}
          showPanelFilter
        />
      </Drawer>
    );
  };
}
