import { lazy } from 'react';

import { GrafanaRouteComponent } from '~/core/navigation/types';

export const SafeDynamicImport = (loader: () => Promise<any>): GrafanaRouteComponent => lazy(loader);
