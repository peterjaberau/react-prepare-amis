import { config } from '@grafana-module/app/core/config';
import { contextSrv } from '@grafana-module/app/core/services/context_srv';
import { AccessControlAction } from '@grafana-module/app/types';

export function isGrafanaAdmin(): boolean {
  return config.bootData.user.isGrafanaAdmin;
}

export function isOrgAdmin() {
  return contextSrv.hasRole('Admin');
}

export function isDataSourceEditor() {
  return (
    contextSrv.hasPermission(AccessControlAction.DataSourcesCreate) &&
    contextSrv.hasPermission(AccessControlAction.DataSourcesWrite)
  );
}
