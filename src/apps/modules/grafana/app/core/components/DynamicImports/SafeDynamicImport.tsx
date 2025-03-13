import { lazy } from 'react';

import { GrafanaRouteComponent } from '@grafana-module/app/core/navigation/types';

export const SafeDynamicImport = (loader: () => Promise<any>): GrafanaRouteComponent => lazy(loader);
