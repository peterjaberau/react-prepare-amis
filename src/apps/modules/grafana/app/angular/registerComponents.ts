import { getBackendSrv, getDataSourceSrv } from '@runtime/index';
import { contextSrv } from '@grafana-module/app/core/core';
import { getDashboardSrv } from '@grafana-module/app/features/dashboard/services/DashboardSrv';
import { validationSrv } from '@grafana-module/app/features/manage-dashboards/services/ValidationSrv';
import { getLinkSrv } from '@grafana-module/app/features/panel/panellinks/link_srv';

import coreModule from './core_module';
import { UtilSrv } from './services/UtilSrv';
import { AnnotationsSrv } from './services/annotations_srv';

export function registerComponents() {
  coreModule.factory('backendSrv', () => getBackendSrv());
  coreModule.factory('contextSrv', () => contextSrv);
  coreModule.factory('dashboardSrv', () => getDashboardSrv());
  coreModule.factory('datasourceSrv', () => getDataSourceSrv());
  coreModule.factory('linkSrv', () => getLinkSrv());
  coreModule.factory('validationSrv', () => validationSrv);
  coreModule.service('annotationsSrv', AnnotationsSrv);
  coreModule.service('utilSrv', UtilSrv);
}
