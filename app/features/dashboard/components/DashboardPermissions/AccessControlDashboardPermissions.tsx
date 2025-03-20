import { Permissions } from '@grafana-module/app/core/components/AccessControl';
import { Page } from '@grafana-module/app/core/components/Page/Page';
import { contextSrv } from '@grafana-module/app/core/core';
import { AccessControlAction } from '@grafana-module/app/types';

import { SettingsPageProps } from '../DashboardSettings/types';

export const AccessControlDashboardPermissions = ({ dashboard, sectionNav }: SettingsPageProps) => {
  const canSetPermissions = contextSrv.hasPermission(AccessControlAction.DashboardsPermissionsWrite);
  const pageNav = sectionNav.node.parentItem;

  return (
    <Page navModel={sectionNav} pageNav={pageNav}>
      <Permissions resource={'dashboards'} resourceId={dashboard.uid} canSetPermissions={canSetPermissions} />
    </Page>
  );
};
