import { SafeDynamicImport } from '@grafana-module/app/core/components/DynamicImports/SafeDynamicImport';
import { RouteDescriptor } from '@grafana-module/app/core/navigation/types';

import { ROUTE_BASE_ID } from './constants';

export function getRoutes(): RouteDescriptor[] {
  return [
    {
      path: `/${ROUTE_BASE_ID}/*`,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "Connections"*/ '@grafana-module/app/features/connections/Connections')
      ),
    },
  ];
}
