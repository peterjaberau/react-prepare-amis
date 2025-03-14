import { contextSrv } from '@grafana-module/app/core/services/context_srv';
import { AccessControlAction } from '@grafana-module/app/types';

export function getAddToDashboardTitle(): string {
  const canCreateDashboard = contextSrv.hasPermission(AccessControlAction.DashboardsCreate);
  const canWriteDashboard = contextSrv.hasPermission(AccessControlAction.DashboardsWrite);

  if (canCreateDashboard && !canWriteDashboard) {
    return 'Add panel to new dashboard';
  }

  if (canWriteDashboard && !canCreateDashboard) {
    return 'Add panel to existing dashboard';
  }

  return 'Add panel to dashboard';
}
