import * as React from 'react';

import { Modal, ModalTabsHeader, TabContent, Themeable2, withTheme2 } from '@grafana-ui/index';
import { config } from '@grafana-module/app/core/config';
import { contextSrv } from '@grafana-module/app/core/core';
import { t } from '@grafana-module/app/core/internationalization';
import { SharePublicDashboard } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboard';
import { isPublicDashboardsEnabled } from '@grafana-module/app/features/dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { DashboardModel } from '@grafana-module/app/features/dashboard/state/DashboardModel';
import { PanelModel } from '@grafana-module/app/features/dashboard/state/PanelModel';
import { DashboardInteractions } from '@grafana-module/app/features/dashboard-scene/utils/interactions';
import { isPanelModelLibraryPanel } from '@grafana-module/app/features/library-panels/guard';
import { AccessControlAction } from '@grafana-module/app/types';

import { ShareEmbed } from './ShareEmbed';
import { ShareExport } from './ShareExport';
import { ShareLibraryPanel } from './ShareLibraryPanel';
import { ShareLink } from './ShareLink';
import { ShareSnapshot } from './ShareSnapshot';
import { ShareModalTabModel } from './types';
import { getTrackingSource, shareDashboardType } from './utils';

const customDashboardTabs: ShareModalTabModel[] = [];
const customPanelTabs: ShareModalTabModel[] = [];

export function addDashboardShareTab(tab: ShareModalTabModel) {
  customDashboardTabs.push(tab);
}

export function addPanelShareTab(tab: ShareModalTabModel) {
  customPanelTabs.push(tab);
}

function getTabs(canEditDashboard: boolean, panel?: PanelModel, activeTab?: string) {
  const linkLabel = t('share-modal.tab-title.link', 'Link');
  const tabs: ShareModalTabModel[] = [{ label: linkLabel, value: shareDashboardType.link, component: ShareLink }];

  if (
    contextSrv.isSignedIn &&
    config.snapshotEnabled &&
    contextSrv.hasPermission(AccessControlAction.SnapshotsCreate)
  ) {
    const snapshotLabel = t('share-modal.tab-title.snapshot', 'Snapshot');
    tabs.push({ label: snapshotLabel, value: shareDashboardType.snapshot, component: ShareSnapshot });
  }

  if (panel) {
    const embedLabel = t('share-modal.tab-title.embed', 'Embed');
    tabs.push({ label: embedLabel, value: shareDashboardType.embed, component: ShareEmbed });

    if (!isPanelModelLibraryPanel(panel)) {
      const libraryPanelLabel = t('share-modal.tab-title.library-panel', 'Library panel');
      tabs.push({ label: libraryPanelLabel, value: shareDashboardType.libraryPanel, component: ShareLibraryPanel });
    }
    tabs.push(...customPanelTabs);
  } else {
    const exportLabel = t('share-modal.tab-title.export', 'Export');
    tabs.push({
      label: exportLabel,
      value: shareDashboardType.export,
      component: ShareExport,
    });
    tabs.push(...customDashboardTabs);

    if (isPublicDashboardsEnabled()) {
      tabs.push({
        label: t('share-modal.tab-title.public-dashboard-title', 'Public dashboard'),
        value: shareDashboardType.publicDashboard,
        component: SharePublicDashboard,
      });
    }
  }

  const at = tabs.find((t) => t.value === activeTab);

  return {
    tabs,
    activeTab: at?.value ?? tabs[0].value,
  };
}

interface Props extends Themeable2 {
  dashboard: DashboardModel;
  panel?: PanelModel;
  activeTab?: string;
  onDismiss(): void;
}

interface State {
  tabs: ShareModalTabModel[];
  activeTab: string;
}

function getInitialState(props: Props): State {
  const { tabs, activeTab } = getTabs(props.dashboard.canEditDashboard(), props.panel, props.activeTab);

  return {
    tabs,
    activeTab,
  };
}

class UnthemedShareModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = getInitialState(props);
  }

  onSelectTab: React.ComponentProps<typeof ModalTabsHeader>['onChangeTab'] = (t) => {
    this.setState((prevState) => ({ ...prevState, activeTab: t.value }));
    DashboardInteractions.sharingCategoryClicked({
      item: t.value,
      shareResource: getTrackingSource(this.props.panel),
    });
  };

  getActiveTab() {
    const { tabs, activeTab } = this.state;
    return tabs.find((t) => t.value === activeTab)!;
  }

  renderTitle() {
    const { panel } = this.props;
    const { activeTab } = this.state;
    const title = panel ? t('share-modal.panel.title', 'Share Panel') : t('share-modal.dashboard.title', 'Share');
    const canEditDashboard = this.props.dashboard.canEditDashboard();
    const tabs = getTabs(canEditDashboard, this.props.panel, this.state.activeTab).tabs;

    return (
      <ModalTabsHeader
        title={title}
        icon="share-alt"
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={this.onSelectTab}
      />
    );
  }

  render() {
    const { dashboard, panel } = this.props;
    const activeTabModel = this.getActiveTab();
    const ActiveTab = activeTabModel.component;

    return (
      <Modal isOpen={true} title={this.renderTitle()} onDismiss={this.props.onDismiss}>
        <TabContent>
          <ActiveTab dashboard={dashboard} panel={panel} onDismiss={this.props.onDismiss} />
        </TabContent>
      </Modal>
    );
  }
}

export const ShareModal = withTheme2(UnthemedShareModal);
