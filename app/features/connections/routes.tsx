import { SafeDynamicImport } from '~/core/components/DynamicImports/SafeDynamicImport';
import { RouteDescriptor } from '~/core/navigation/types';

import { ROUTE_BASE_ID } from './constants';

export function getRoutes(): RouteDescriptor[] {
  return [
    {
      path: `/${ROUTE_BASE_ID}/*`,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "Connections"*/ '~/features/connections/Connections')
      ),
    },
  ];
}
