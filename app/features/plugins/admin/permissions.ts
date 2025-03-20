import { config } from '~/core/config';
import { contextSrv } from '~/core/services/context_srv';
import { AccessControlAction } from '~/types';

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
