import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom-v5-compat';

import { PageLayoutType } from '@data/index';
import { SceneComponentProps } from '@scenes/index';
import { Page } from '@grafana-module/app/core/components/Page/Page';
import { getNavModel } from '@grafana-module/app/core/selectors/navModel';
import { useSelector } from '@grafana-module/app/types';

import { DashboardEditPaneSplitter } from '../edit-pane/DashboardEditPaneSplitter';

import { DashboardScene } from './DashboardScene';
import { PanelSearchLayout } from './PanelSearchLayout';
import { DashboardAngularDeprecationBanner } from './angular/DashboardAngularDeprecationBanner';
import { Badge } from '@grafana-ui/index';

export function DashboardSceneRenderer({ model }: SceneComponentProps<DashboardScene>) {
  const { controls, overlay, editview, editPanel, viewPanelScene, panelSearch, panelsPerRow, isEditing } =
    model.useState();
  const { type } = useParams();
  const location = useLocation();
  const navIndex = useSelector((state) => state.navIndex);
  const pageNav = model.getPageNav(location, navIndex);
  const bodyToRender = model.getBodyToRender();
  const navModel = getNavModel(navIndex, `dashboards/${type === 'snapshot' ? 'snapshots' : 'browse'}`);
  const isSettingsOpen = editview !== undefined;

  // Remember scroll pos when going into view panel, edit panel or settings
  useMemo(() => {
    if (viewPanelScene || isSettingsOpen || editPanel) {
      model.rememberScrollPos();
    }
  }, [isSettingsOpen, editPanel, viewPanelScene, model]);

  // Restore scroll pos when coming back
  useEffect(() => {
    if (!viewPanelScene && !isSettingsOpen && !editPanel) {
      model.restoreScrollPos();
    }
  }, [isSettingsOpen, editPanel, viewPanelScene, model]);

  if (editview) {
    return (
      <>
        <editview.Component model={editview} />
        {overlay && <overlay.Component model={overlay} />}
      </>
    );
  }

  function renderBody() {
    if (panelSearch || panelsPerRow) {
      return <PanelSearchLayout panelSearch={panelSearch} panelsPerRow={panelsPerRow} dashboard={model} />;
    }

    return (
      <>
        <DashboardAngularDeprecationBanner dashboard={model} key="angular-deprecation-banner" />
        <bodyToRender.Component model={bodyToRender} />
      </>
    );
  }

  return (
    <Page navModel={navModel} pageNav={pageNav} layout={PageLayoutType.Custom} >
      <Badge text={"DashboardSceneRenderer"} color={"darkgrey"} style={{ position: 'absolute', top: 0, left: 0, zIndex:1000}}  />
      {editPanel && <editPanel.Component model={editPanel} />}
      {!editPanel && (
        <DashboardEditPaneSplitter
          dashboard={model}
          isEditing={isEditing}
          controls={controls && <controls.Component model={controls} />}
          body={renderBody()}
        />
      )}
      {overlay && <overlay.Component model={overlay} />}
    </Page>
  );
}
