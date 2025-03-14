import { uniq } from 'lodash';

import { SafeDynamicImport } from '@grafana-module/app/core/components/DynamicImports/SafeDynamicImport';
import { config } from '@grafana-module/app/core/config';
import { RouteDescriptor } from '@grafana-module/app/core/navigation/types';

const profileRoutes: RouteDescriptor[] = [
  {
    path: '/profile',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "UserProfileEditPage" */ '@grafana-module/app/features/profile/UserProfileEditPage')
    ),
  },
  {
    path: '/profile/password',
    component: SafeDynamicImport(
      () => import(/* webPackChunkName: "ChangePasswordPage" */ '@grafana-module/app/features/profile/ChangePasswordPage')
    ),
  },
  {
    path: '/profile/select-org',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "SelectOrgPage" */ '@grafana-module/app/features/org/SelectOrgPage')
    ),
  },
  {
    path: '/profile/notifications',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "NotificationsPage"*/ '@grafana-module/app/features/notifications/NotificationsPage')
    ),
  },
];

export function getProfileRoutes(cfg = config): RouteDescriptor[] {
  if (cfg.profileEnabled) {
    return profileRoutes;
  }

  const uniquePaths = uniq(profileRoutes.map((route) => route.path));
  return uniquePaths.map((path) => ({
    path,
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "ProfileFeatureTogglePage"*/ '@grafana-module/app/features/profile/FeatureTogglePage')
    ),
  }));
}
