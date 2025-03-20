import { lazy } from 'react';

import { EmbeddedDashboardProps } from '@runtime/index';

export function EmbeddedDashboardLazy(props: EmbeddedDashboardProps) {
  return <Component {...props} />;
}

const Component = lazy(async () => {
  const { EmbeddedDashboard } = await import(/* webpackChunkName: "EmbeddedDashboard" */ './EmbeddedDashboard');
  return { default: EmbeddedDashboard };
});
