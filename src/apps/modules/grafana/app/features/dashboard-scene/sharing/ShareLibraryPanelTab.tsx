import { config } from '@runtime/index';
import { SceneComponentProps, SceneObjectBase, SceneObjectRef, VizPanel } from '@scenes/index';
import { LibraryPanel } from '@schema/index';
import { t } from '@grafana-module/app/core/internationalization';
import { ShareLibraryPanel } from '@grafana-module/app/features/dashboard/components/ShareModal/ShareLibraryPanel';
import { shareDashboardType } from '@grafana-module/app/features/dashboard/components/ShareModal/utils';
import { DashboardModel } from '@grafana-module/app/features/dashboard/state/DashboardModel';
import { PanelModel } from '@grafana-module/app/features/dashboard/state/PanelModel';

import { DashboardGridItem } from '../scene/layout-default/DashboardGridItem';
import { gridItemToPanel, transformSceneToSaveModel } from '../serialization/transformSceneToSaveModel';
import { getDashboardSceneFor } from '../utils/utils';

import { SceneShareTabState } from './types';

export interface ShareLibraryPanelTabState extends SceneShareTabState {
  panelRef?: SceneObjectRef<VizPanel>;
}

export class ShareLibraryPanelTab extends SceneObjectBase<ShareLibraryPanelTabState> {
  public tabId = shareDashboardType.libraryPanel;
  static Component = ShareLibraryPanelTabRenderer;

  public getTabLabel() {
    return config.featureToggles.newDashboardSharingComponent
      ? t('share-panel.drawer.new-library-panel-title', 'New library panel')
      : t('share-modal.tab-title.library-panel', 'Library panel');
  }
}

function ShareLibraryPanelTabRenderer({ model }: SceneComponentProps<ShareLibraryPanelTab>) {
  const { panelRef, modalRef } = model.useState();

  if (!panelRef) {
    return null;
  }

  const panel = panelRef.resolve();
  const parent = panel.parent;

  if (parent instanceof DashboardGridItem) {
    const dashboardScene = getDashboardSceneFor(model);
    const panelJson = gridItemToPanel(parent);
    const panelModel = new PanelModel(panelJson);

    const dashboardJson = transformSceneToSaveModel(dashboardScene);
    const dashboardModel = new DashboardModel(dashboardJson);

    return (
      <ShareLibraryPanel
        initialFolderUid={dashboardScene.state.meta.folderUid}
        dashboard={dashboardModel}
        panel={panelModel}
        onDismiss={() => {
          modalRef ? modalRef.resolve().onDismiss() : dashboardScene.closeModal();
        }}
        onCreateLibraryPanel={(libPanel: LibraryPanel) => dashboardScene.createLibraryPanel(panel, libPanel)}
      />
    );
  }

  return null;
}
