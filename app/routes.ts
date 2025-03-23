import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"
import { publicRoutes } from "./app/route"

export const adminRoutes = []
export const adminAuthRoutes = []

// ======================================= route =======================================

const routes = [...publicRoutes]

// ======================================= export =======================================

export default [
  ...routes,
  // route("/api/v1/*", "apis.server/index.ts"),
] satisfies RouteConfig;


/*

export default [
  index("routes/index.tsx"),
  route("*?", "routes/catchall.tsx"),

  layout("routes/routes.tsx", [

    // all dashboards
    route("d", "features/dashboard/dashboards/index.tsx", [

      // dashboard creation + editing
      layout("features/dashboard/editing/index.tsx", [
        route("new", "features/dashboard/editing/dashboard-new.tsx"),
        route("edit/:uid", "features/dashboard/editing/dashboard-edit.tsx"),
      ]),

      // single dashboard
      route(":uid", "features/dashboard/dashboard/index.tsx", [

        // dashboard settings & configuration
        route("settings", "features/dashboard/dashboard/settings/index.tsx"),
        route("configure", "features/dashboard/dashboard/configure/index.tsx"),
      ])
    ]),


    route("ds", "features/datasource/datasources/index.tsx", [

      layout("features/datasource/editing/index.tsx", [
        route("new", "features/datasource/editing/new-datasource.tsx"),
        route("edit/:uid", "features/datasource/editing/edit-datasource.tsx"),
      ]),

      route(":uid", "features/datasource/datasource/index.tsx", [
        route("settings", "features/datasource/datasource/settings/index.tsx"),
        route("configure", "features/datasource/datasource/configure/index.tsx"),
      ])
    ]),


    route("a/uid", "features/datasource/datasources/index.tsx", [

      layout("features/datasource/editing/index.tsx", [
        route("new", "features/datasource/editing/new-datasource.tsx"),
        route("edit/:uid", "features/datasource/editing/edit-datasource.tsx"),
      ]),

      layout("features/datasource/editing/index.tsx", [
        route("new", "features/datasource/editing/new-datasource.tsx"),
        route("edit/:uid", "features/datasource/editing/edit-datasource.tsx"),
      ]),

      route("a", "features/plugins/index.tsx", [
        route(":pluginId", "features/plugins/plugin/index.tsx"),
      ])
    ]),




  ]),






  { path: "/", element: <HomePage /> },

  // Dashboards
  { path: "/d/:uid/:slug?", element: <DashboardPage /> },
  { path: "/dashboard/new", element: <DashboardPage /> },
  { path: "/dashboard/new-with-ds/:datasourceUid", element: <DashboardPage /> },
  { path: "/dashboard/:type/:slug", element: <DashboardPage /> },
  { path: "/dashboard/import", element: <DashboardPage /> },
  { path: "/dashboards", element: <DashboardPage /> },
  { path: "/dashboards/f/:uid/:slug", element: <DashboardPage /> },
  { path: "/dashboards/f/:uid", element: <DashboardPage /> },

  // Data Sources
  { path: "/datasources", element: <DashboardPage /> },
  { path: "/datasources/edit/:uid", element: <DashboardPage /> },
  { path: "/datasources/edit/:uid/dashboards", element: <DashboardPage /> },
  { path: "/datasources/new", element: <DashboardPage /> },

  // Admin
  { path: "/admin", element: <AdminPage /> },
  { path: "/admin/general", element: <AdminPage /> },
  { path: "/admin/plugins", element: <AdminPage /> },
  { path: "/admin/extensions", element: <AdminPage /> },
  { path: "/admin/access", element: <AdminPage /> },
  { path: "/admin/authentication", element: <AdminPage /> },
  { path: "/admin/authentication/ldap", element: <AdminPage /> },
  { path: "/admin/authentication/:provider", element: <AdminPage /> },
  { path: "/admin/settings", element: <AdminPage /> },
  { path: "/admin/upgrading", element: <AdminPage /> },
  { path: "/admin/users", element: <AdminPage /> },
  { path: "/admin/users/create", element: <AdminPage /> },
  { path: "/admin/users/edit/:id", element: <AdminPage /> },
  { path: "/admin/orgs", element: <AdminPage /> },
  { path: "/admin/orgs/edit/:id", element: <AdminPage /> },

  // Alerting
  { path: "/alerting", element: <DashboardPage /> },
  { path: "/alerting/home", element: <DashboardPage /> },
  { path: "/alerting/list", element: <DashboardPage /> },
  { path: "/alerting/routes", element: <DashboardPage /> },
  { path: "/alerting/routes/mute-timing/new", element: <DashboardPage /> },
  { path: "/alerting/routes/mute-timing/edit", element: <DashboardPage /> },
  { path: "/alerting/silences", element: <DashboardPage /> },
  { path: "/alerting/silence/new", element: <DashboardPage /> },
  { path: "/alerting/silence/:id/edit", element: <DashboardPage /> },
  { path: "/alerting/notifications", element: <DashboardPage /> },

  // Plugins
  { path: "/plugins", element: <DashboardPage /> },
  { path: "/plugins/browse", element: <DashboardPage /> },
  { path: "/plugins/:pluginId/", element: <DashboardPage /> },

  // Authentication & Profile
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <LoginPage /> },
  { path: "/user/password/reset", element: <LoginPage /> },
  { path: "/profile", element: <DashboardPage /> },
  { path: "/profile/password", element: <DashboardPage /> },

  // Catch-all Route
  { path: "*", element: <NotFoundPage /> },







route("pages/Root.tsx", "routes/Root.tsx", [
  route("pages/Home.tsx", "routes/Home.tsx"),
  route("pages/About.tsx", "routes/About.tsx"),
  layout("layouts/MainLayout.tsx", [
    route("pages/Dashboard.tsx", "routes/Dashboard.tsx", [
      layout("layouts/DashboardLayout.tsx", [
        route("pages/Dashboard/Overview.tsx", "routes/Dashboard/Overview.tsx"),
        route("pages/Dashboard/Settings.tsx", "routes/Dashboard/Settings.tsx"),
      ]),
    ]),
    route("pages/Profile.tsx", "routes/Profile.tsx"),
    route("pages/Settings.tsx", "routes/Settings.tsx"),
  ]),
])





  index("routes/home.tsx"),

  route("cs-dashboard", "routes/cs-dashboard.tsx"),

  route("cs-configurabe-dashboard", "routes/cs-configurabe-dashboard.tsx"),


    // example: http://localhost:3010/cloudscape/1/page1
    // example: http://localhost:3010/cloudscape/render-dashboard-dynamic/render-antd-button
  route("cloudscape", "plugins/cloudscape/app/index/route.tsx"),
  route("cloudscape/:sessionId", "plugins/cloudscape/services/session/route.tsx", [
    layout("plugins/cloudscape/app/layout/index/route.tsx", [
        layout("plugins/cloudscape/route.tsx", [
          layout("plugins/cloudscape/app/layout/frame/route.tsx", [
            route(":pageId", "plugins/cloudscape/app/page/route.tsx"),
          ])
        ]),
    ]),
  ]),


  // example: http://localhost:3010/webbuilder-ds/1/page1
  route("webbuilder-ds", "plugins/webbuilder-ds/app/index/route.tsx"),
  route("webbuilder-ds/:sessionId", "plugins/webbuilder-ds/services/session/route.tsx", [
    layout("plugins/webbuilder-ds/app/layout/index/route.tsx", [
      layout("plugins/webbuilder-ds/route.tsx", [
        layout("plugins/webbuilder-ds/app/layout/frame/route.tsx", [
          route(":pageId", "plugins/webbuilder-ds/app/page/route.tsx"),
        ])
      ]),
    ]),
  ]),




  route("patterns", "plugins/patterns/admin-console/index/route.tsx"),
  route("patterns/:sessionId", "plugins/patterns/admin-console/session/route.tsx", [
    layout("plugins/patterns/admin-console/layout/index/route.tsx", [
      layout("plugins/patterns/admin-console/layout/frame/route.tsx", [
        layout("plugins/patterns/admin-console/layout/sidenav/route.tsx", [
          route(":pageId", "plugins/patterns/admin-console/page/route.tsx"),
        ])
      ])
    ]),
  ]),


] satisfies RouteConfig

*/
