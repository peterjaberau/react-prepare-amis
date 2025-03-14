import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { isTruthy } from '@data/index';
import { NavLandingPage } from '@grafana-module/app/core/components/NavLandingPage/NavLandingPage';
import { PageNotFound } from '@grafana-module/app/core/components/PageNotFound/PageNotFound';
import config from '@grafana-module/app/core/config';
import { contextSrv } from '@grafana-module/app/core/services/context_srv';
import LdapPage from '@grafana-module/app/features/admin/ldap/LdapPage';
import { getAlertingRoutes } from '@grafana-module/app/features/alerting/routes';
import { isAdmin, isLocalDevEnv, isOpenSourceEdition } from '@grafana-module/app/features/alerting/unified/utils/misc';
import { ConnectionsRedirectNotice } from '@grafana-module/app/features/connections/components/ConnectionsRedirectNotice';
import { ROUTES as CONNECTIONS_ROUTES } from '@grafana-module/app/features/connections/constants';
import { getRoutes as getDataConnectionsRoutes } from '@grafana-module/app/features/connections/routes';
import { DATASOURCES_ROUTES } from '@grafana-module/app/features/datasources/constants';
import { ConfigureIRM } from '@grafana-module/app/features/gops/configuration-tracker/components/ConfigureIRM';
import { getRoutes as getPluginCatalogRoutes } from '@grafana-module/app/features/plugins/admin/routes';
import { getAppPluginRoutes } from '@grafana-module/app/features/plugins/routes';
import { getProfileRoutes } from '@grafana-module/app/features/profile/routes';
import { AccessControlAction, DashboardRoutes } from '@grafana-module/app/types';

import { SafeDynamicImport } from '../core/components/DynamicImports/SafeDynamicImport';
import { RouteDescriptor } from '../core/navigation/types';
import { getPublicDashboardRoutes } from '../features/dashboard/routes';

const isDevEnv = config.buildInfo.env === 'development';
export const extraRoutes: RouteDescriptor[] = [];

export function getAppRoutes(): RouteDescriptor[] {
  return [
    // Based on the Grafana configuration standalone plugin pages can even override and extend existing core pages, or they can register new routes under existing ones.
    // In order to make it possible we need to register them first due to how `<Switch>` is evaluating routes. (This will be unnecessary once/when we upgrade to React Router v6 and start using `<Routes>` instead.)
    ...getAppPluginRoutes(),
    {
      path: '/',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Home,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPageProxy" */ '../features/dashboard/containers/DashboardPageProxy')
      ),
    },
    {
      path: '/d/:uid/:slug?',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Normal,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPageProxy" */ '../features/dashboard/containers/DashboardPageProxy')
      ),
    },
    {
      path: '/dashboard/new',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.DashboardsCreate]),
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.New,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPageProxy')
      ),
    },
    {
      path: '/dashboard/new-with-ds/:datasourceUid',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.DashboardsCreate]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/NewDashboardWithDS')
      ),
    },
    {
      path: '/dashboard/:type/:slug',
      pageClass: 'page-dashboard',
      routeName: DashboardRoutes.Normal,
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardPage" */ '../features/dashboard/containers/DashboardPageProxy')
      ),
    },
    {
      // We currently have no core usage of the embedded dashboard so is to have a page for e2e to test
      path: '/dashboards/embedding-test',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "DashboardPage"*/ '@grafana-module/app/features/dashboard-scene/embedding/EmbeddedDashboardTestPage'
          )
      ),
    },
    {
      path: '/d-solo/:uid/:slug?',
      routeName: DashboardRoutes.Normal,
      chromeless: true,
      component: SafeDynamicImport(() =>
        config.featureToggles.dashboardSceneSolo
          ? import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard-scene/solo/SoloPanelPage')
          : import(/* webpackChunkName: "SoloPanelPageOld" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    // This route handles embedding of snapshot/scripted dashboard panels
    {
      path: '/dashboard-solo/:type/:slug',
      routeName: DashboardRoutes.Normal,
      chromeless: true,
      component: SafeDynamicImport(() =>
        config.featureToggles.dashboardSceneSolo
          ? import(/* webpackChunkName: "SoloPanelPage" */ '../features/dashboard-scene/solo/SoloPanelPage')
          : import(/* webpackChunkName: "SoloPanelPageOld" */ '../features/dashboard/containers/SoloPanelPage')
      ),
    },
    {
      path: '/dashboard/import',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardImport"*/ '@grafana-module/app/features/manage-dashboards/DashboardImportPage')
      ),
    },
    {
      path: DATASOURCES_ROUTES.List,
      component: () => <Navigate replace to={CONNECTIONS_ROUTES.DataSources} />,
    },
    {
      path: DATASOURCES_ROUTES.Edit,
      component: DataSourceEditRoute,
    },
    {
      path: DATASOURCES_ROUTES.Dashboards,
      component: DataSourceDashboardRoute,
    },
    {
      path: DATASOURCES_ROUTES.New,
      component: () => <Navigate replace to={CONNECTIONS_ROUTES.DataSourcesNew} />,
    },
    {
      path: '/datasources/correlations',
      component: SafeDynamicImport(() =>
        config.featureToggles.correlations
          ? import(/* webpackChunkName: "CorrelationsPage" */ '@grafana-module/app/features/correlations/CorrelationsPage')
          : import(
              /* webpackChunkName: "CorrelationsFeatureToggle" */ '@grafana-module/app/features/correlations/CorrelationsFeatureToggle'
            )
      ),
    },
    {
      path: '/dashboards',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ '@grafana-module/app/features/browse-dashboards/BrowseDashboardsPage')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ '@grafana-module/app/features/browse-dashboards/BrowseDashboardsPage')
      ),
    },
    {
      path: '/dashboards/f/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "DashboardListPage"*/ '@grafana-module/app/features/browse-dashboards/BrowseDashboardsPage')
      ),
    },
    {
      path: '/explore',
      pageClass: 'page-explore',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.DataSourcesExplore]),
      component: SafeDynamicImport(() =>
        config.exploreEnabled
          ? import(/* webpackChunkName: "explore" */ '@grafana-module/app/features/explore/ExplorePage')
          : import(/* webpackChunkName: "explore-feature-toggle-page" */ '@grafana-module/app/features/explore/FeatureTogglePage')
      ),
    },
    {
      path: '/drilldown',
      component: () => <NavLandingPage navId="drilldown" />,
    },
    {
      path: '/apps',
      component: () => <NavLandingPage navId="apps" />,
    },
    {
      path: '/alerts-and-incidents',
      component: () => {
        return (
          <NavLandingPage
            navId="alerts-and-incidents"
            header={(!isOpenSourceEdition() && isAdmin()) || isLocalDevEnv() ? <ConfigureIRM /> : undefined}
          />
        );
      },
    },
    {
      path: '/testing-and-synthetics',
      component: () => <NavLandingPage navId="testing-and-synthetics" />,
    },
    {
      path: '/monitoring',
      component: () => <NavLandingPage navId="monitoring" />,
    },
    {
      path: '/infrastructure',
      component: () => <NavLandingPage navId="infrastructure" />,
    },
    {
      path: '/frontend',
      component: () => <NavLandingPage navId="frontend" />,
    },
    {
      path: '/admin/general',
      component: () => <NavLandingPage navId="cfg/general" />,
    },
    {
      path: '/admin/plugins',
      component: () => <NavLandingPage navId="cfg/plugins" />,
    },
    {
      path: '/admin/extensions',
      navId: 'extensions',
      roles: () =>
        contextSrv.evaluatePermission([AccessControlAction.PluginsInstall, AccessControlAction.PluginsWrite]),
      component:
        isDevEnv || config.featureToggles.enableExtensionsAdminPage
          ? SafeDynamicImport(
              () =>
                import(/* webpackChunkName: "PluginExtensionsLog" */ '@grafana-module/app/features/plugins/extensions/logs/LogViewer')
            )
          : () => <Navigate replace to="/admin" />,
    },
    {
      path: '/admin/access',
      component: () => <NavLandingPage navId="cfg/access" />,
    },
    {
      path: '/org',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "OrgDetailsPage" */ '../features/org/OrgDetailsPage')
      ),
    },
    {
      path: '/org/new',
      component: SafeDynamicImport(() => import(/* webpackChunkName: "NewOrgPage" */ '@grafana-module/app/features/org/NewOrgPage')),
    },
    {
      path: '/org/users',
      // Org users page has been combined with admin users
      component: () => <Navigate replace to={'/admin/users'} />,
    },
    {
      path: '/org/users/invite',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserInvitePage" */ '@grafana-module/app/features/org/UserInvitePage')
      ),
    },
    {
      path: '/org/apikeys',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.ActionAPIKeysRead]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ApiKeysPage" */ '@grafana-module/app/features/api-keys/ApiKeysPage')
      ),
    },
    {
      path: '/org/serviceaccounts',
      roles: () =>
        contextSrv.evaluatePermission([
          AccessControlAction.ServiceAccountsRead,
          AccessControlAction.ServiceAccountsCreate,
        ]),
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "ServiceAccountsPage" */ '@grafana-module/app/features/serviceaccounts/ServiceAccountsListPage')
      ),
    },
    {
      path: '/org/serviceaccounts/create',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "ServiceAccountCreatePage" */ '@grafana-module/app/features/serviceaccounts/ServiceAccountCreatePage'
          )
      ),
    },
    {
      path: '/org/serviceaccounts/:id',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ServiceAccountPage" */ '@grafana-module/app/features/serviceaccounts/ServiceAccountPage')
      ),
    },
    {
      path: '/org/teams',
      roles: () =>
        contextSrv.evaluatePermission([AccessControlAction.ActionTeamsRead, AccessControlAction.ActionTeamsCreate]),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamList" */ '@grafana-module/app/features/teams/TeamList')),
    },
    {
      path: '/org/teams/new',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.ActionTeamsCreate]),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "CreateTeam" */ '@grafana-module/app/features/teams/CreateTeam')),
    },
    {
      path: '/org/teams/edit/:uid/:page?',
      roles: () =>
        contextSrv.evaluatePermission([AccessControlAction.ActionTeamsRead, AccessControlAction.ActionTeamsCreate]),
      component: SafeDynamicImport(() => import(/* webpackChunkName: "TeamPages" */ '@grafana-module/app/features/teams/TeamPages')),
    },
    // ADMIN
    {
      path: '/admin',
      component: () => <NavLandingPage navId="cfg" header={<ConnectionsRedirectNotice />} />,
    },
    {
      path: '/admin/authentication',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.SettingsWrite]),
      component:
        config.licenseInfo.enabledFeatures?.saml || config.ldapEnabled || config.featureToggles.ssoSettingsApi
          ? SafeDynamicImport(
              () =>
                import(/* webpackChunkName: "AdminAuthentication" */ '../features/auth-config/AuthProvidersListPage')
            )
          : () => <Navigate replace to="/admin" />,
    },
    {
      path: '/admin/authentication/ldap',
      component: config.featureToggles.ssoSettingsLDAP
        ? SafeDynamicImport(
            () => import(/* webpackChunkName: "LdapSettingsPage" */ '@grafana-module/app/features/admin/ldap/LdapSettingsPage')
          )
        : LdapPage,
    },
    {
      path: '/admin/authentication/:provider',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.SettingsWrite]),
      component: config.featureToggles.ssoSettingsApi
        ? SafeDynamicImport(
            () => import(/* webpackChunkName: "AdminAuthentication" */ '../features/auth-config/ProviderConfigPage')
          )
        : () => <Navigate replace to="/admin" />,
    },
    {
      path: '/admin/settings',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminSettings" */ '@grafana-module/app/features/admin/AdminSettings')
      ),
    },
    {
      path: '/admin/upgrading',
      component: SafeDynamicImport(() => import('@grafana-module/app/features/admin/UpgradePage')),
    },
    {
      path: '/admin/users',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserListPage" */ '@grafana-module/app/features/admin/UserListPage')
      ),
    },
    {
      path: '/admin/users/create',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserCreatePage" */ '@grafana-module/app/features/admin/UserCreatePage')
      ),
    },
    {
      path: '/admin/users/edit/:id',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "UserAdminPage" */ '@grafana-module/app/features/admin/UserAdminPage')
      ),
    },
    {
      path: '/admin/orgs',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminListOrgsPage" */ '@grafana-module/app/features/admin/AdminListOrgsPage')
      ),
    },
    {
      path: '/admin/orgs/edit/:id',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "AdminEditOrgPage" */ '@grafana-module/app/features/admin/AdminEditOrgPage')
      ),
    },
    {
      path: '/admin/featuretoggles',
      component: config.featureToggles.featureToggleAdminPage
        ? SafeDynamicImport(
            () => import(/* webpackChunkName: "AdminFeatureTogglesPage" */ '@grafana-module/app/features/admin/AdminFeatureTogglesPage')
          )
        : () => <Navigate replace to="/admin" />,
    },
    {
      path: '/admin/stats',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "ServerStats" */ '@grafana-module/app/features/admin/ServerStats')
      ),
    },
    config.featureToggles.onPremToCloudMigrations && {
      path: '/admin/migrate-to-cloud',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.MigrationAssistantMigrate]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "MigrateToCloud" */ '@grafana-module/app/features/migrate-to-cloud/MigrateToCloud')
      ),
    },
    // LOGIN / SIGNUP
    {
      path: '/login',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "LoginPage" */ '@grafana-module/app/core/components/Login/LoginPage')
      ),
      pageClass: 'login-page',
      chromeless: true,
    },
    {
      path: '/invite/:code',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SignupInvited" */ '@grafana-module/app/features/invites/SignupInvited')
      ),
      chromeless: true,
    },
    {
      path: '/verify',
      component: !config.verifyEmailEnabled
        ? () => <Navigate replace to="/signup" />
        : SafeDynamicImport(
            () => import(/* webpackChunkName "VerifyEmailPage"*/ '@grafana-module/app/core/components/Signup/VerifyEmailPage')
          ),
      pageClass: 'login-page',
      chromeless: true,
    },
    {
      path: '/signup',
      component: config.disableUserSignUp
        ? () => <Navigate replace to="/login" />
        : SafeDynamicImport(() => import(/* webpackChunkName "SignupPage"*/ '@grafana-module/app/core/components/Signup/SignupPage')),
      pageClass: 'login-page',
      chromeless: true,
    },
    {
      path: '/user/password/send-reset-email',
      chromeless: true,
      component: SafeDynamicImport(
        () =>
          import(/* webpackChunkName: "SendResetMailPage" */ '@grafana-module/app/core/components/ForgottenPassword/SendResetMailPage')
      ),
    },
    {
      path: '/user/password/reset',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "ChangePasswordPage" */ '@grafana-module/app/core/components/ForgottenPassword/ChangePasswordPage'
          )
      ),
      pageClass: 'login-page',
      chromeless: true,
    },
    {
      path: '/dashboard/snapshots',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.SnapshotsRead]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SnapshotListPage" */ '@grafana-module/app/features/manage-dashboards/SnapshotListPage')
      ),
    },
    config.featureToggles.dashboardRestore && {
      path: '/dashboard/recently-deleted',
      roles: () => ['Admin', 'ServerAdmin'],
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "RecentlyDeletedPage" */ '@grafana-module/app/features/browse-dashboards/RecentlyDeletedPage')
      ),
    },
    {
      path: '/playlists',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistPage"*/ '@grafana-module/app/features/playlist/PlaylistPage')
      ),
    },
    {
      path: '/playlists/play/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistStartPage"*/ '@grafana-module/app/features/playlist/PlaylistStartPage')
      ),
    },
    {
      path: '/playlists/new',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistNewPage"*/ '@grafana-module/app/features/playlist/PlaylistNewPage')
      ),
    },
    {
      path: '/playlists/edit/:uid',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "PlaylistEditPage"*/ '@grafana-module/app/features/playlist/PlaylistEditPage')
      ),
    },
    {
      path: '/sandbox/benchmarks',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "BenchmarksPage"*/ '@grafana-module/app/features/sandbox/BenchmarksPage')
      ),
    },
    {
      path: '/sandbox/test',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "TestStuffPage"*/ '@grafana-module/app/features/sandbox/TestStuffPage')
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug/library-panels',
      component: SafeDynamicImport(
        () =>
          import(
            /* webpackChunkName: "FolderLibraryPanelsPage"*/ '@grafana-module/app/features/browse-dashboards/BrowseFolderLibraryPanelsPage'
          )
      ),
    },
    {
      path: '/dashboards/f/:uid/:slug/alerting',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.AlertingRuleRead]),
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "FolderAlerting"*/ '@grafana-module/app/features/browse-dashboards/BrowseFolderAlertingPage')
      ),
    },
    {
      path: '/library-panels',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "LibraryPanelsPage"*/ '@grafana-module/app/features/library-panels/LibraryPanelsPage')
      ),
    },
    {
      path: '/notifications',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "NotificationsPage"*/ '@grafana-module/app/features/notifications/NotificationsPage')
      ),
    },
    config.featureToggles.exploreMetrics && {
      path: '/explore/metrics/*',
      roles: () => contextSrv.evaluatePermission([AccessControlAction.DataSourcesExplore]),
      ...(config.featureToggles.exploreMetricsUseExternalAppPlugin
        ? {
            component: SafeDynamicImport(
              () =>
                import(/* webpackChunkName: "MetricsDrilldownRedirect"*/ '@grafana-module/app/features/trails/RedirectToDrilldownApp')
            ),
          }
        : {
            chromeless: false,
            component: SafeDynamicImport(
              () => import(/* webpackChunkName: "DataTrailsPage"*/ '@grafana-module/app/features/trails/DataTrailsPage')
            ),
          }),
    },
    {
      path: '/bookmarks',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "BookmarksPage"*/ '@grafana-module/app/features/bookmarks/BookmarksPage')
      ),
    },
    ...getPluginCatalogRoutes(),
    ...getSupportBundleRoutes(),
    ...getAlertingRoutes(),
    ...getProfileRoutes(),
    ...extraRoutes,
    ...getPublicDashboardRoutes(),
    ...getDataConnectionsRoutes(),
    {
      path: '/goto/*',
      component: HandleGoToRedirect,
    },
    {
      path: '/*',
      component: PageNotFound,
    },
  ].filter(isTruthy);
}

export function getSupportBundleRoutes(cfg = config): RouteDescriptor[] {
  if (!cfg.supportBundlesEnabled) {
    return [];
  }

  return [
    {
      path: '/support-bundles',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SupportBundles" */ '@grafana-module/app/features/support-bundles/SupportBundles')
      ),
    },
    {
      path: '/support-bundles/create',
      component: SafeDynamicImport(
        () => import(/* webpackChunkName: "SupportBundlesCreate" */ '@grafana-module/app/features/support-bundles/SupportBundlesCreate')
      ),
    },
  ];
}

function DataSourceDashboardRoute() {
  const { uid = '' } = useParams();
  return <Navigate replace to={CONNECTIONS_ROUTES.DataSourcesDashboards.replace(':uid', uid)} />;
}

function DataSourceEditRoute() {
  const { uid = '' } = useParams();
  return <Navigate replace to={CONNECTIONS_ROUTES.DataSourcesEdit.replace(':uid', uid)} />;
}

// Explicitly send "goto" URLs to server, bypassing client-side routing
function HandleGoToRedirect() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.location.href = pathname;
  }, [pathname]);

  return null;
}
