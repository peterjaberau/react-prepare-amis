import { uniq } from 'lodash-es';

import { SafeDynamicImport } from '~/core/components/DynamicImports/SafeDynamicImport';
import { config } from '~/core/config';
import { RouteDescriptor } from '~/core/navigation/types';

const profileRoutes: RouteDescriptor[] = [
  {
    path: '/profile',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "UserProfileEditPage" */ '~/features/profile/UserProfileEditPage')
    ),
  },
  {
    path: '/profile/password',
    component: SafeDynamicImport(
      () => import(/* webPackChunkName: "ChangePasswordPage" */ '~/features/profile/ChangePasswordPage')
    ),
  },
  {
    path: '/profile/select-org',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "SelectOrgPage" */ '~/features/org/SelectOrgPage')
    ),
  },
  {
    path: '/profile/notifications',
    component: SafeDynamicImport(
      () => import(/* webpackChunkName: "NotificationsPage"*/ '~/features/notifications/NotificationsPage')
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
      () => import(/* webpackChunkName: "ProfileFeatureTogglePage"*/ '~/features/profile/FeatureTogglePage')
    ),
  }));
}
