const data = {
  "public.app.AppWrapper": {
    app: {
      context: {
        backend: {},
        chrome: {},
        keybinding: {},
        location: {},
        newAssetsChecker: {},
      },
      config: {
        GoogleAnalytics4SendManualPageViews: false,
        allowOrgCreate: true,
        analytics: { enabled: true },
        analyticsConsoleReporting: false,
        angularSupportEnabled: false,
        anonymousDeviceLimit: 0,
        anonymousEnabled: false,
        appSubUrl: "",
        appUrl: "http://localhost:3000/",
        applicationInsightsConnectionString: "",
        applicationInsightsEndpointUrl: "",
      },
      apps: {
        "grafana-exploretraces-app": {
          id: "grafana-exploretraces-app",
          path: "public/plugins/grafana-exploretraces-app/module.js",
          version: "0.2.3",
          preload: true,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [
              {
                targets: ["grafana-lokiexplore-app/toolbar-open-related/v1"],
                title: "open traces",
                description: "Open traces",
              },
            ],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=11.3.0",
            grafanaVersion: "*",
            plugins: [],
            extensions: {
              exposedComponents: [],
            },
          },
        },
        "grafana-llm-app": {
          id: "grafana-llm-app",
          path: "public/plugins/grafana-llm-app/module.js",
          version: "0.12.0",
          preload: false,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=9.5.2",
            grafanaVersion: "*",
            plugins: [],
            extensions: {
              exposedComponents: [],
            },
          },
        },
        "grafana-lokiexplore-app": {
          id: "grafana-lokiexplore-app",
          path: "public/plugins/grafana-lokiexplore-app/module.js",
          version: "1.0.8",
          preload: true,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [
              {
                targets: [
                  "grafana/dashboard/panel/menu",
                  "grafana/explore/toolbar/action",
                ],
                title: "Open in Grafana Logs Drilldown",
                description:
                  "Open current query in the Grafana Logs Drilldown view",
              },
            ],
            addedComponents: [],
            exposedComponents: [
              {
                id: "grafana-lokiexplore-app/open-in-explore-logs-button/v1",
                title: "Open in Explore Logs button",
                description:
                  "A button that opens a logs view in the Explore Logs app.",
              },
            ],
            extensionPoints: [
              {
                id: "grafana-lokiexplore-app/investigation/v1",
                title: "",
                description: "",
              },
              {
                id: "grafana-lokiexplore-app/toolbar-open-related/v1",
                title: "Open related signals like metrics/traces/profiles",
                description: "",
              },
            ],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=11.3.0",
            grafanaVersion: "*",
            plugins: [],
            extensions: {
              exposedComponents: [
                "grafana-adaptivelogs-app/temporary-exemptions/v1",
              ],
            },
          },
        },
        "grafana-pyroscope-app": {
          id: "grafana-pyroscope-app",
          path: "public/plugins/grafana-pyroscope-app/module.js",
          version: "1.1.0",
          preload: true,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [
              {
                targets: ["grafana/explore/toolbar/action"],
                title: "Open in Grafana Profiles Drilldown",
                description: "Try our new queryless experience for profiles",
              },
            ],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [
              {
                id: "grafana-pyroscope-app/investigation/v1",
                title: "",
                description: "",
              },
            ],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=11.5.0",
            grafanaVersion: "*",
            plugins: [],
            extensions: {
              exposedComponents: [],
            },
          },
        },
        "grafana-resourcesexporter-app": {
          id: "grafana-resourcesexporter-app",
          path: "public/plugins/grafana-resourcesexporter-app/module.js",
          version: "0.1.0",
          preload: false,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=10.3.3",
            grafanaVersion: "*",
            plugins: [],
            extensions: {
              exposedComponents: [],
            },
          },
        },
        "redis-app": {
          id: "redis-app",
          path: "public/plugins/redis-app/module.js",
          version: "2.2.1",
          preload: false,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=8.0.0",
            grafanaVersion: "8.x.x",
            plugins: [
              {
                id: "redis-datasource",
                type: "datasource",
                name: "Redis Data Source",
                version: "^2.1.1",
              },
            ],
            extensions: {
              exposedComponents: [],
            },
          },
        },
        "redis-explorer-app": {
          id: "redis-explorer-app",
          path: "public/plugins/redis-explorer-app/module.js",
          version: "2.1.1",
          preload: false,
          angular: {
            detected: false,
            hideDeprecation: false,
          },
          loadingStrategy: "script",
          extensions: {
            addedLinks: [],
            addedComponents: [],
            exposedComponents: [],
            extensionPoints: [],
            addedFunctions: [],
          },
          dependencies: {
            grafanaDependency: ">=8.0.0",
            grafanaVersion: "8.x.x",
            plugins: [
              {
                id: "redis-app",
                type: "app",
                name: "Redis Application plugin",
                version: "^2.2.1",
              },
            ],
            extensions: {
              exposedComponents: [],
            },
          },
        },
      },
      auth: {
        AuthProxyEnableLoginToken: false,
        OAuthSkipOrgRoleUpdateSync: false,
        SAMLSkipOrgRoleSync: false,
        LDAPSkipOrgRoleSync: false,
        GoogleSkipOrgRoleSync: false,
        GenericOAuthSkipOrgRoleSync: false,
        JWTAuthSkipOrgRoleSync: false,
        GrafanaComSkipOrgRoleSync: false,
        AzureADSkipOrgRoleSync: false,
        GithubSkipOrgRoleSync: false,
        GitLabSkipOrgRoleSync: false,
        OktaSkipOrgRoleSync: false,
        disableLogin: false,
        basicAuthStrongPasswordPolicy: false,
        passwordlessEnabled: false,
      },
      bootData: {
        assets: {
          jsFiles: [
            {
              filePath: "public/build/runtime~app.eafbb75d56bd90c56fff.js",
              integrity:
                "sha256-3k1LAaQyFsiQnYAa8+OXcniCr1WpZgKUr23qN1nZNoY= sha384-GHboM9C3jk2kdkv0Xcyv71I960Upq63CEbPiAgepXIff/gqnQU9H5de8lDdk/Vdc sha512-Y9Bcc1pbL7/wEci8YcUcQR3M6xmIBvE84y46JjPtpec2mqIZg02BaeJdHJUIj2InapJXI/xuZZ2Imr6Dtf02CA==",
            },
            {
              filePath: "public/build/app.89783389f401049f4bf7.js",
              integrity:
                "sha256-x8sEgfYCwdclswGX/aXtAQTZCKrWrcsO4C/PMmoFepU= sha384-KItAIO7NrU5AqCaaTMaGjDPsCV+Qrk64DLOZEqEBKU9VgZXr2yRLAPto964aJpYE sha512-t8dZm0JXXRyfFJA5ADWRfCvYDK62YpQOnxI98j/VxAJtYDylggSgvyhPxvhKsjRjW6yyYKFpGNA6D/FRCEm3BQ==",
            },
          ],
          cssFiles: [
            {
              filePath: "public/build/grafana.app.a22ab66eb8fdb519f31d.css",
              integrity:
                "sha256-jaXZiuDlHKJB8ib5SKeOrsCoAIkxEW5FBD4A0jEWyHk= sha384-2jos4BHwyChflsMqjJhnYMuap5MK3RSavu5IJjs/XpsQzQ/fCeaDExBXmqz1no+y sha512-5vZoLqz8LR6aVySQt26fq2SJpxWwX4LRQ68g0kEIF2HH+1NZfVlfifU4DPX0J5vh7KIqHta2J7riukedBvxKyg==",
            },
          ],
          dark: "public/build/grafana.dark.db9cb71bee4a95df8f0c.css",
          light: "public/build/grafana.light.95bc5b110a37949bd2eb.css",
          swagger: [
            {
              filePath: "public/build/runtime~swagger.3e66f3f295ce8b59a941.js",
              integrity:
                "sha256-QmbIxRoYh6pmBMck9zlytucbAjT7kmy412ikvVqQYNw= sha384-DgaNl6I1ZZ8iwJ3CjTeqTfEjBRAc9pV6tdxmZGjN+u3Hn04OSRxDP+OLhNvZlBkr sha512-4HjzbDamP3uENpbCnXM8RxkcTl6NvFhtsl/CBGEdLrCu2qgGy2j/9bFXme+CEO9kll6L20FJOLk5re5d8jz8rQ==",
            },
            {
              filePath: "public/build/swagger.894172b558a8ac2e820c.js",
              integrity:
                "sha256-1DLtHVfyXSsMWQgYJvE8p+LtUgR7KAhEJHlkzhV7uLY= sha384-NvTt4GffExM8VUpWqRIc44vx5yQz5Snza9/0NtyRRYHqzp5IYVEUC9XFirDR04j0 sha512-QloFBkBkB8TNLgkHGdqR7+dLcV8D/DbMlvxR9T2S6jYfswY/7ap4Vopf2LZ6Qwvy7OZxskwHrEBNaSciU5wafA==",
            },
          ],
          swaggerCssFiles: [
            {
              filePath: "public/build/grafana.swagger.f62b01f041844e190d68.css",
              integrity:
                "sha256-ysTiP44SFGXLZswR/QKuNknr/oaMfr2K6PvnehaZPzo= sha384-DCSoXHa/0I+EOVulaG+bFaKcTNcAhU9YunP8tXAZpfgWWhB+onM4tzDM+8p/sQzh sha512-1axih32d16ACXBP1hzrCiUuv20deOQvwcbwBhsH/wElSflgHZmBXHaJf9oqkRGIs5LteVAsYB3on3AkcMgMmow==",
            },
          ],
        },
        navTree: [
          {
            id: "home",
            text: "Home",
            icon: "home-alt",
            url: "/",
            sortWeight: -2000,
          },
          {
            id: "bookmarks",
            text: "Bookmarks",
            icon: "bookmark",
            url: "/bookmarks",
            sortWeight: -1900,
            emptyMessageId: "bookmarks-empty",
          },
          {
            id: "starred",
            text: "Starred",
            icon: "star",
            url: "/dashboards?starred",
            sortWeight: -1800,
            emptyMessageId: "starred-empty",
          },
          {
            id: "dashboards/browse",
            text: "Dashboards",
            subTitle: "Create and manage dashboards to visualize your data",
            icon: "apps",
            url: "/dashboards",
            sortWeight: -1700,
            children: [
              {
                id: "dashboards/playlists",
                text: "Playlists",
                subTitle:
                  "Groups of dashboards that are displayed in a sequence",
                icon: "presentation-play",
                url: "/playlists",
              },
              {
                id: "dashboards/snapshots",
                text: "Snapshots",
                subTitle:
                  "Interactive, publicly available, point-in-time representations of dashboards",
                icon: "camera",
                url: "/dashboard/snapshots",
              },
              {
                id: "dashboards/library-panels",
                text: "Library panels",
                subTitle:
                  "Reusable panels that can be added to multiple dashboards",
                icon: "library-panel",
                url: "/library-panels",
              },
              {
                id: "dashboards/public",
                text: "Public dashboards",
                icon: "library-panel",
                url: "/dashboard/public",
              },
              {
                id: "dashboards/new",
                text: "New dashboard",
                icon: "plus",
                url: "/dashboard/new",
                hideFromTabs: true,
                isCreateAction: true,
              },
              {
                id: "dashboards/import",
                text: "Import dashboard",
                subTitle: "Import dashboard from file or Grafana.com",
                icon: "plus",
                url: "/dashboard/import",
                hideFromTabs: true,
                isCreateAction: true,
              },
            ],
          },
          {
            id: "explore",
            text: "Explore",
            subTitle: "Explore your data",
            icon: "compass",
            url: "/explore",
            sortWeight: -1600,
          },
          {
            id: "drilldown",
            text: "Drilldown",
            subTitle:
              "Drill down into your data using Grafana's powerful queryless apps",
            icon: "drilldown",
            url: "/drilldown",
            sortWeight: -1500,
            children: [
              {
                id: "explore/metrics",
                text: "Metrics",
                subTitle: "Queryless exploration of your metrics",
                icon: "code-branch",
                url: "/explore/metrics",
              },
              {
                id: "plugin-page-grafana-lokiexplore-app",
                text: "Logs",
                subTitle: "Query-less exploration of log data stored in Loki",
                img: "public/plugins/grafana-lokiexplore-app/img/logo.svg",
                url: "/a/grafana-lokiexplore-app/explore",
                sortWeight: 2,
                isSection: true,
                pluginId: "grafana-lokiexplore-app",
              },
              {
                id: "plugin-page-grafana-exploretraces-app",
                text: "Traces",
                subTitle:
                  "Grafana app plugin that allows users for a query-less way to navigate and visualize trace data stored in Tempo.",
                img: "public/plugins/grafana-exploretraces-app/img/logo.svg",
                url: "/a/grafana-exploretraces-app/",
                sortWeight: 3,
                isSection: true,
                pluginId: "grafana-exploretraces-app",
              },
              {
                id: "plugin-page-grafana-pyroscope-app",
                text: "Profiles",
                subTitle:
                  "Continuous profiling service powered by Grafana Pyroscope",
                img: "public/plugins/grafana-pyroscope-app/img/logo.svg",
                url: "/a/grafana-pyroscope-app/explore",
                sortWeight: 4,
                isSection: true,
                pluginId: "grafana-pyroscope-app",
              },
            ],
            isNew: true,
          },
          {
            id: "alerting",
            text: "Alerting",
            subTitle:
              "Learn about problems in your systems moments after they occur",
            icon: "bell",
            url: "/alerting",
            sortWeight: -1400,
            children: [
              {
                id: "alert-list",
                text: "Alert rules",
                subTitle: "Rules that determine whether an alert will fire",
                icon: "list-ul",
                url: "/alerting/list",
              },
              {
                id: "receivers",
                text: "Contact points",
                subTitle:
                  "Choose how to notify your contact points when an alert instance fires",
                icon: "comment-alt-share",
                url: "/alerting/notifications",
              },
              {
                id: "am-routes",
                text: "Notification policies",
                subTitle: "Determine how alerts are routed to contact points",
                icon: "sitemap",
                url: "/alerting/routes",
              },
              {
                id: "silences",
                text: "Silences",
                subTitle: "Stop notifications from one or more alerting rules",
                icon: "bell-slash",
                url: "/alerting/silences",
              },
              {
                id: "groups",
                text: "Alert groups",
                subTitle: "See grouped alerts with active notifications",
                icon: "layer-group",
                url: "/alerting/groups",
              },
              {
                id: "alerting-admin",
                text: "Settings",
                icon: "cog",
                url: "/alerting/admin",
              },
              {
                id: "alert",
                text: "Create alert rule",
                subTitle: "Create an alert rule",
                icon: "plus",
                url: "/alerting/new",
                hideFromTabs: true,
                isCreateAction: true,
              },
            ],
          },
          {
            id: "connections",
            text: "Connections",
            icon: "adjust-circle",
            url: "/connections",
            sortWeight: -500,
            children: [
              {
                id: "connections-add-new-connection",
                text: "Add new connection",
                subTitle: "Browse and create new connections",
                url: "/connections/add-new-connection",
                keywords: [
                  "csv",
                  "graphite",
                  "json",
                  "loki",
                  "prometheus",
                  "sql",
                  "tempo",
                ],
              },
              {
                id: "connections-datasources",
                text: "Data sources",
                subTitle:
                  "View and manage your connected data source connections",
                url: "/connections/datasources",
              },
            ],
          },
          {
            id: "cfg",
            text: "Administration",
            subTitle: "Organization: Main Org.",
            icon: "cog",
            url: "/admin",
            sortWeight: -200,
            children: [
              {
                id: "cfg/general",
                text: "General",
                subTitle:
                  "Manage default preferences and settings across Grafana",
                icon: "shield",
                url: "/admin/general",
                children: [
                  {
                    id: "upgrading",
                    text: "Stats and license",
                    icon: "unlock",
                    url: "/admin/upgrading",
                    sortWeight: -1,
                  },
                  {
                    id: "org-settings",
                    text: "Default preferences",
                    subTitle: "Manage preferences across an organization",
                    icon: "sliders-v-alt",
                    url: "/org",
                  },
                  {
                    id: "server-settings",
                    text: "Settings",
                    subTitle:
                      "View the settings defined in your Grafana config",
                    icon: "sliders-v-alt",
                    url: "/admin/settings",
                  },
                  {
                    id: "global-orgs",
                    text: "Organizations",
                    subTitle:
                      "Isolated instances of Grafana running on the same server",
                    icon: "building",
                    url: "/admin/orgs",
                  },
                  {
                    id: "migrate-to-cloud",
                    text: "Migrate to Grafana Cloud",
                    subTitle:
                      "Copy configuration from your self-managed installation to a cloud stack",
                    url: "/admin/migrate-to-cloud",
                  },
                ],
              },
              {
                id: "cfg/plugins",
                text: "Plugins and data",
                subTitle:
                  "Install plugins and define the relationships between data",
                icon: "shield",
                url: "/admin/plugins",
                children: [
                  {
                    id: "plugins",
                    text: "Plugins",
                    subTitle: "Extend the Grafana experience with plugins",
                    icon: "plug",
                    url: "/plugins",
                  },
                  {
                    id: "correlations",
                    text: "Correlations",
                    subTitle: "Add and configure correlations",
                    icon: "gf-glue",
                    url: "/datasources/correlations",
                  },
                  {
                    id: "extensions",
                    text: "Extensions",
                    subTitle: "Extend the UI of plugins and Grafana",
                    icon: "plug",
                    url: "/admin/extensions",
                  },
                ],
              },
              {
                id: "cfg/access",
                text: "Users and access",
                subTitle:
                  "Configure access for individual users, teams, and service accounts",
                icon: "shield",
                url: "/admin/access",
                children: [
                  {
                    id: "global-users",
                    text: "Users",
                    subTitle: "Manage users in Grafana",
                    icon: "user",
                    url: "/admin/users",
                  },
                  {
                    id: "teams",
                    text: "Teams",
                    subTitle:
                      "Groups of users that have common dashboard and permission needs",
                    icon: "users-alt",
                    url: "/org/teams",
                  },
                  {
                    id: "serviceaccounts",
                    text: "Service accounts",
                    subTitle:
                      "Use service accounts to run automated workloads in Grafana",
                    icon: "gf-service-account",
                    url: "/org/serviceaccounts",
                  },
                ],
              },
              {
                id: "authentication",
                text: "Authentication",
                subTitle:
                  "Manage your auth settings and configure single sign-on",
                icon: "signin",
                url: "/admin/authentication",
                isSection: true,
              },
            ],
          },
          {
            id: "profile",
            text: "Admin",
            subTitle: "admin",
            img: "/avatar/46d229b033af06a191ff2267bca9ae56",
            url: "/profile",
            sortWeight: -100,
            roundIcon: true,
            children: [
              {
                id: "profile/settings",
                text: "Profile",
                icon: "sliders-v-alt",
                url: "/profile",
              },
              {
                id: "profile/notifications",
                text: "Notification history",
                icon: "bell",
                url: "/profile/notifications",
              },
              {
                id: "profile/password",
                text: "Change password",
                icon: "lock",
                url: "/profile/password",
              },
              {
                id: "sign-out",
                text: "Sign out",
                icon: "arrow-from-right",
                url: "/logout",
                target: "_self",
                hideFromTabs: true,
              },
            ],
          },
          {
            id: "help",
            text: "Help",
            subTitle: "Grafana v11.6.0-pre (22a6dc6b52)",
            icon: "question-circle",
            url: "#",
            children: [
              {
                id: "support-bundles",
                text: "Support bundles",
                icon: "wrench",
                url: "/support-bundles",
              },
            ],
          },
        ],
        settings: {
          analyticsConsoleReporting: false,
          angularSupportEnabled: false,
          anonymousDeviceLimit: 0,
          anonymousEnabled: false,
          appSubUrl: "",
          appUrl: "http://localhost:3000/",
          applicationInsightsConnectionString: "",
          applicationInsightsEndpointUrl: "",
          apps: {
            "grafana-exploretraces-app": {
              id: "grafana-exploretraces-app",
              path: "public/plugins/grafana-exploretraces-app/module.js",
              version: "0.2.3",
              preload: true,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [
                  {
                    targets: [
                      "grafana-lokiexplore-app/toolbar-open-related/v1",
                    ],
                    title: "open traces",
                    description: "Open traces",
                  },
                ],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=11.3.0",
                grafanaVersion: "*",
                plugins: [],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
            "grafana-llm-app": {
              id: "grafana-llm-app",
              path: "public/plugins/grafana-llm-app/module.js",
              version: "0.12.0",
              preload: false,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=9.5.2",
                grafanaVersion: "*",
                plugins: [],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
            "grafana-lokiexplore-app": {
              id: "grafana-lokiexplore-app",
              path: "public/plugins/grafana-lokiexplore-app/module.js",
              version: "1.0.8",
              preload: true,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [
                  {
                    targets: [
                      "grafana/dashboard/panel/menu",
                      "grafana/explore/toolbar/action",
                    ],
                    title: "Open in Grafana Logs Drilldown",
                    description:
                      "Open current query in the Grafana Logs Drilldown view",
                  },
                ],
                addedComponents: [],
                exposedComponents: [
                  {
                    id: "grafana-lokiexplore-app/open-in-explore-logs-button/v1",
                    title: "Open in Explore Logs button",
                    description:
                      "A button that opens a logs view in the Explore Logs app.",
                  },
                ],
                extensionPoints: [
                  {
                    id: "grafana-lokiexplore-app/investigation/v1",
                    title: "",
                    description: "",
                  },
                  {
                    id: "grafana-lokiexplore-app/toolbar-open-related/v1",
                    title: "Open related signals like metrics/traces/profiles",
                    description: "",
                  },
                ],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=11.3.0",
                grafanaVersion: "*",
                plugins: [],
                extensions: {
                  exposedComponents: [
                    "grafana-adaptivelogs-app/temporary-exemptions/v1",
                  ],
                },
              },
            },
            "grafana-pyroscope-app": {
              id: "grafana-pyroscope-app",
              path: "public/plugins/grafana-pyroscope-app/module.js",
              version: "1.1.0",
              preload: true,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [
                  {
                    targets: ["grafana/explore/toolbar/action"],
                    title: "Open in Grafana Profiles Drilldown",
                    description:
                      "Try our new queryless experience for profiles",
                  },
                ],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [
                  {
                    id: "grafana-pyroscope-app/investigation/v1",
                    title: "",
                    description: "",
                  },
                ],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=11.5.0",
                grafanaVersion: "*",
                plugins: [],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
            "grafana-resourcesexporter-app": {
              id: "grafana-resourcesexporter-app",
              path: "public/plugins/grafana-resourcesexporter-app/module.js",
              version: "0.1.0",
              preload: false,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=10.3.3",
                grafanaVersion: "*",
                plugins: [],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
            "redis-app": {
              id: "redis-app",
              path: "public/plugins/redis-app/module.js",
              version: "2.2.1",
              preload: false,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=8.0.0",
                grafanaVersion: "8.x.x",
                plugins: [
                  {
                    id: "redis-datasource",
                    type: "datasource",
                    name: "Redis Data Source",
                    version: "^2.1.1",
                  },
                ],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
            "redis-explorer-app": {
              id: "redis-explorer-app",
              path: "public/plugins/redis-explorer-app/module.js",
              version: "2.1.1",
              preload: false,
              angular: {
                detected: false,
                hideDeprecation: false,
              },
              loadingStrategy: "script",
              extensions: {
                addedLinks: [],
                addedComponents: [],
                exposedComponents: [],
                extensionPoints: [],
                addedFunctions: [],
              },
              dependencies: {
                grafanaDependency: ">=8.0.0",
                grafanaVersion: "8.x.x",
                plugins: [
                  {
                    id: "redis-app",
                    type: "app",
                    name: "Redis Application plugin",
                    version: "^2.2.1",
                  },
                ],
                extensions: {
                  exposedComponents: [],
                },
              },
            },
          },
          auth: {
            AuthProxyEnableLoginToken: false,
            OAuthSkipOrgRoleUpdateSync: false,
            SAMLSkipOrgRoleSync: false,
            LDAPSkipOrgRoleSync: false,
            GoogleSkipOrgRoleSync: false,
            GenericOAuthSkipOrgRoleSync: false,
            JWTAuthSkipOrgRoleSync: false,
            GrafanaComSkipOrgRoleSync: false,
            AzureADSkipOrgRoleSync: false,
            GithubSkipOrgRoleSync: false,
            GitLabSkipOrgRoleSync: false,
            OktaSkipOrgRoleSync: false,
            disableLogin: false,
            basicAuthStrongPasswordPolicy: false,
            passwordlessEnabled: false,
          },
          datasources: {
            "-- Dashboard --": {
              type: "datasource",
              name: "-- Dashboard --",
              meta: {
                id: "dashboard",
                type: "datasource",
                name: "-- Dashboard --",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Uses the result set from another panel in the same dashboard",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/dashboard/img/icn-reusequeries.svg",
                    large:
                      "public/app/plugins/datasource/dashboard/img/icn-reusequeries.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "",
                preload: false,
                backend: false,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                builtIn: true,
                streaming: false,
                signature: "internal",
                module: "core:plugin/dashboard",
                baseUrl: "public/app/plugins/datasource/dashboard",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              isDefault: false,
              preload: false,
              jsonData: {},
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "-- Grafana --": {
              id: -1,
              uid: "grafana",
              type: "datasource",
              name: "-- Grafana --",
              meta: {
                id: "grafana",
                type: "datasource",
                name: "-- Grafana --",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "A built-in data source that generates random walk data and can poll the Testdata data source. This helps you test visualizations and run experiments.",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana/img/icn-grafanadb.svg",
                    large:
                      "public/app/plugins/datasource/grafana/img/icn-grafanadb.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                builtIn: true,
                streaming: false,
                signature: "internal",
                module: "core:plugin/grafana",
                baseUrl: "public/app/plugins/datasource/grafana",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              isDefault: false,
              preload: false,
              jsonData: {},
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "-- Mixed --": {
              type: "datasource",
              name: "-- Mixed --",
              meta: {
                id: "mixed",
                type: "datasource",
                name: "-- Mixed --",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Lets you query multiple data sources in the same panel.",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mixed/img/icn-mixeddatasources.svg",
                    large:
                      "public/app/plugins/datasource/mixed/img/icn-mixeddatasources.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "",
                preload: false,
                backend: false,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                builtIn: true,
                mixed: true,
                streaming: false,
                signature: "internal",
                module: "core:plugin/mixed",
                baseUrl: "public/app/plugins/datasource/mixed",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              isDefault: false,
              preload: false,
              jsonData: {},
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            cloudwatch: {
              id: 31,
              uid: "beebgrrqmylmod",
              type: "cloudwatch",
              name: "cloudwatch",
              meta: {
                id: "cloudwatch",
                type: "datasource",
                name: "CloudWatch",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Data source for Amazon AWS monitoring service",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/cloudwatch/img/amazon-web-services.png",
                    large:
                      "public/app/plugins/datasource/cloudwatch/img/amazon-web-services.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: ["aws", "amazon"],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "EC2",
                    path: "dashboards/ec2.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "EBS",
                    path: "dashboards/EBS.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Lambda",
                    path: "dashboards/Lambda.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Logs",
                    path: "dashboards/Logs.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "RDS",
                    path: "dashboards/RDS.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "cloud",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/cloudwatch",
                baseUrl: "public/app/plugins/datasource/cloudwatch",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/beebgrrqmylmod",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/cloudwatch",
              jsonData: {
                authType: "keys",
              },
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-alertmanager": {
              id: 4,
              uid: "gdev-alertmanager",
              type: "alertmanager",
              name: "gdev-alertmanager",
              meta: {
                id: "alertmanager",
                type: "datasource",
                name: "Alertmanager",
                info: {
                  author: {
                    name: "Prometheus alertmanager",
                    url: "https://grafana.com",
                  },
                  description:
                    "Add external Alertmanagers (supports Prometheus and Mimir implementations) so you can use the Grafana Alerting UI to manage silences, contact points, and notification policies.",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://prometheus.io/docs/alerting/latest/alertmanager/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/alertmanager/img/logo.svg",
                    large:
                      "public/app/plugins/datasource/alertmanager/img/logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: [
                    "alerts",
                    "alerting",
                    "prometheus",
                    "alertmanager",
                    "mimir",
                    "cortex",
                  ],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "",
                preload: false,
                backend: false,
                routes: [
                  {
                    path: "alertmanager/api/v2/silences",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "alertmanager/api/v2/silence",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "alertmanager/api/v2/silences",
                    method: "GET",
                    reqRole: "Viewer",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "",
                    method: "PUT",
                    reqRole: "Editor",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "alertmanager/api/v2/alerts",
                    method: "GET",
                    reqRole: "Viewer",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/alerts",
                    method: "GET",
                    reqRole: "Admin",
                    reqAction: "",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                ],
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: false,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                signature: "internal",
                module: "core:plugin/alertmanager",
                baseUrl: "public/app/plugins/datasource/alertmanager",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-alertmanager",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/alertmanager",
              jsonData: {
                implementation: "prometheus",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-cloudwatch": {
              id: 24,
              uid: "gdev-cloudwatch",
              type: "cloudwatch",
              name: "gdev-cloudwatch",
              meta: {
                id: "cloudwatch",
                type: "datasource",
                name: "CloudWatch",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Data source for Amazon AWS monitoring service",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/cloudwatch/img/amazon-web-services.png",
                    large:
                      "public/app/plugins/datasource/cloudwatch/img/amazon-web-services.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: ["aws", "amazon"],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "EC2",
                    path: "dashboards/ec2.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "EBS",
                    path: "dashboards/EBS.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Lambda",
                    path: "dashboards/Lambda.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Logs",
                    path: "dashboards/Logs.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "RDS",
                    path: "dashboards/RDS.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "cloud",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/cloudwatch",
                baseUrl: "public/app/plugins/datasource/cloudwatch",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-cloudwatch",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/cloudwatch",
              jsonData: {
                authType: "credentials",
                customMetricsNamespaces: "CWAgent",
                defaultRegion: "eu-west-2",
              },
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-elasticsearch": {
              id: 14,
              uid: "gdev-elasticsearch",
              type: "elasticsearch",
              name: "gdev-elasticsearch",
              meta: {
                id: "elasticsearch",
                type: "datasource",
                name: "Elasticsearch",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source logging & analytics database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://grafana.com/docs/features/datasources/elasticsearch/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                    large:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: [
                    "elasticsearch",
                    "datasource",
                    "database",
                    "logs",
                    "nosql",
                    "traces",
                  ],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "logging",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/elasticsearch",
                baseUrl: "public/app/plugins/datasource/elasticsearch",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-elasticsearch",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/elasticsearch",
              jsonData: {
                index: "[logs-]YYYY.MM.DD",
                interval: "Daily",
                logLevelField: "level",
                logMessageField: "line",
                timeField: "@timestamp",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-elasticsearch-filebeat": {
              id: 15,
              uid: "P7D95068EFA5BD6AD",
              type: "elasticsearch",
              name: "gdev-elasticsearch-filebeat",
              meta: {
                id: "elasticsearch",
                type: "datasource",
                name: "Elasticsearch",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source logging & analytics database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://grafana.com/docs/features/datasources/elasticsearch/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                    large:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: [
                    "elasticsearch",
                    "datasource",
                    "database",
                    "logs",
                    "nosql",
                    "traces",
                  ],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "logging",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/elasticsearch",
                baseUrl: "public/app/plugins/datasource/elasticsearch",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P7D95068EFA5BD6AD",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/elasticsearch",
              jsonData: {
                index: "[filebeat-]YYYY.MM.DD",
                interval: "Daily",
                logLevelField: "fields.level",
                logMessageField: "message",
                timeField: "@timestamp",
                timeInterval: "10s",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-elasticsearch-metricbeat": {
              id: 16,
              uid: "P686FCD4D7E84A649",
              type: "elasticsearch",
              name: "gdev-elasticsearch-metricbeat",
              meta: {
                id: "elasticsearch",
                type: "datasource",
                name: "Elasticsearch",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source logging & analytics database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://grafana.com/docs/features/datasources/elasticsearch/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                    large:
                      "public/app/plugins/datasource/elasticsearch/img/elasticsearch.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: [
                    "elasticsearch",
                    "datasource",
                    "database",
                    "logs",
                    "nosql",
                    "traces",
                  ],
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "logging",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/elasticsearch",
                baseUrl: "public/app/plugins/datasource/elasticsearch",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P686FCD4D7E84A649",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/elasticsearch",
              jsonData: {
                index: "[metricbeat-]YYYY.MM.DD",
                interval: "Daily",
                timeField: "@timestamp",
                timeInterval: "10s",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-graphite": {
              id: 1,
              uid: "P6798F81BB5440721",
              type: "graphite",
              name: "gdev-graphite",
              meta: {
                id: "graphite",
                type: "datasource",
                name: "Graphite",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://graphiteapp.org/",
                    },
                    {
                      name: "Graphite 1.1 Release",
                      url: "https://grafana.com/blog/2018/01/11/graphite-1.1-teaching-an-old-dog-new-tricks/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                    large:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Graphite Carbon Metrics",
                    path: "dashboards/carbon_metrics.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Metrictank (Graphite alternative)",
                    path: "dashboards/metrictank.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  cacheTimeout: true,
                  maxDataPoints: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/graphite",
                baseUrl: "public/app/plugins/datasource/graphite",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P6798F81BB5440721",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/graphite",
              jsonData: {
                graphiteVersion: "1.1",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-graphite-0.9": {
              id: 3,
              uid: "P967B9090E9495159",
              type: "graphite",
              name: "gdev-graphite-0.9",
              meta: {
                id: "graphite",
                type: "datasource",
                name: "Graphite",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://graphiteapp.org/",
                    },
                    {
                      name: "Graphite 1.1 Release",
                      url: "https://grafana.com/blog/2018/01/11/graphite-1.1-teaching-an-old-dog-new-tricks/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                    large:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Graphite Carbon Metrics",
                    path: "dashboards/carbon_metrics.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Metrictank (Graphite alternative)",
                    path: "dashboards/metrictank.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  cacheTimeout: true,
                  maxDataPoints: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/graphite",
                baseUrl: "public/app/plugins/datasource/graphite",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P967B9090E9495159",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/graphite",
              jsonData: {
                graphiteVersion: "0.9",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-graphite-1.0": {
              id: 2,
              uid: "P2B3FA8147A5E257E",
              type: "graphite",
              name: "gdev-graphite-1.0",
              meta: {
                id: "graphite",
                type: "datasource",
                name: "Graphite",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://graphiteapp.org/",
                    },
                    {
                      name: "Graphite 1.1 Release",
                      url: "https://grafana.com/blog/2018/01/11/graphite-1.1-teaching-an-old-dog-new-tricks/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                    large:
                      "public/app/plugins/datasource/graphite/img/graphite_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Graphite Carbon Metrics",
                    path: "dashboards/carbon_metrics.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Metrictank (Graphite alternative)",
                    path: "dashboards/metrictank.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  cacheTimeout: true,
                  maxDataPoints: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/graphite",
                baseUrl: "public/app/plugins/datasource/graphite",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P2B3FA8147A5E257E",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/graphite",
              jsonData: {
                graphiteVersion: "1.0",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-influxdb-flux": {
              id: 9,
              uid: "P49A45DF074423DFB",
              type: "influxdb",
              name: "gdev-influxdb-flux",
              meta: {
                id: "influxdb",
                type: "datasource",
                name: "InfluxDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                    large:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/influxdb",
                baseUrl: "public/app/plugins/datasource/influxdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P49A45DF074423DFB",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/influxdb",
              jsonData: {
                defaultBucket: "mybucket",
                organization: "myorg",
                version: "Flux",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-influxdb-influxql": {
              id: 10,
              uid: "P8E9168127D59652D",
              type: "influxdb",
              name: "gdev-influxdb-influxql",
              meta: {
                id: "influxdb",
                type: "datasource",
                name: "InfluxDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                    large:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/influxdb",
                baseUrl: "public/app/plugins/datasource/influxdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P8E9168127D59652D",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/influxdb",
              jsonData: {
                dbName: "mybucket",
                httpHeaderName1: "Authorization",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-influxdb1-influxql": {
              id: 8,
              uid: "P15396BDD62B2BE29",
              type: "influxdb",
              name: "gdev-influxdb1-influxql",
              meta: {
                id: "influxdb",
                type: "datasource",
                name: "InfluxDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                    large:
                      "public/app/plugins/datasource/influxdb/img/influxdb_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/influxdb",
                baseUrl: "public/app/plugins/datasource/influxdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P15396BDD62B2BE29",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/influxdb",
              jsonData: {
                dbName: "site",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-jaeger": {
              id: 26,
              uid: "gdev-jaeger",
              type: "jaeger",
              name: "gdev-jaeger",
              meta: {
                id: "jaeger",
                type: "datasource",
                name: "Jaeger",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source, end-to-end distributed tracing",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://www.jaegertracing.io",
                    },
                    {
                      name: "GitHub Project",
                      url: "https://github.com/jaegertracing/jaeger",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/jaeger/img/jaeger_logo.svg",
                    large:
                      "public/app/plugins/datasource/jaeger/img/jaeger_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tracing",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: true,
                streaming: false,
                signature: "internal",
                module: "public/plugins/jaeger/module.js",
                baseUrl: "public/app/plugins/datasource/jaeger",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-jaeger",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/jaeger/module.js",
              jsonData: {},
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-loki": {
              id: 25,
              uid: "PDDA8E780A17E7EF1",
              type: "loki",
              name: "gdev-loki",
              meta: {
                id: "loki",
                type: "datasource",
                name: "Loki",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Like Prometheus but for logs. OSS logging solution from Grafana Labs",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://grafana.com/loki",
                    },
                    {
                      name: "GitHub Project",
                      url: "https://github.com/grafana/loki",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/loki/img/loki_icon.svg",
                    large:
                      "public/app/plugins/datasource/loki/img/loki_icon.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "logging",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  maxDataPoints: true,
                },
                streaming: true,
                signature: "internal",
                module: "core:plugin/loki",
                baseUrl: "public/app/plugins/datasource/loki",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/PDDA8E780A17E7EF1",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/loki",
              jsonData: {
                derivedFields: [
                  {
                    datasourceUid: "gdev-jaeger",
                    matcherRegex: "traceID=(\\w+)",
                    name: "traceID",
                    url: "${__value.raw}",
                  },
                  {
                    datasourceUid: "gdev-zipkin",
                    matcherRegex: "traceID=(\\w+)",
                    name: "traceID",
                    url: "${__value.raw}",
                  },
                  {
                    datasourceUid: "gdev-tempo",
                    matcherRegex: "traceID=(\\w+)",
                    name: "traceID",
                    url: "${__value.raw}",
                  },
                ],
                manageAlerts: false,
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-mssql": {
              id: 19,
              uid: "P6B08AC199690F328",
              type: "mssql",
              name: "gdev-mssql",
              meta: {
                id: "mssql",
                type: "datasource",
                name: "Microsoft SQL Server",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Data source for Microsoft SQL Server compatible databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                    large:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.4.0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_mssql",
                signature: "internal",
                module: "public/plugins/mssql/module.js",
                baseUrl: "public/app/plugins/datasource/mssql",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P6B08AC199690F328",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/mssql/module.js",
              jsonData: {
                database: "grafana",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-mssql-ds-tests": {
              id: 21,
              uid: "P3AC514B6406627C2",
              type: "mssql",
              name: "gdev-mssql-ds-tests",
              meta: {
                id: "mssql",
                type: "datasource",
                name: "Microsoft SQL Server",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Data source for Microsoft SQL Server compatible databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                    large:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.4.0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_mssql",
                signature: "internal",
                module: "public/plugins/mssql/module.js",
                baseUrl: "public/app/plugins/datasource/mssql",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P3AC514B6406627C2",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/mssql/module.js",
              jsonData: {
                database: "grafanatest",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-mssql-tls": {
              id: 20,
              uid: "PB8EB3547D9522A75",
              type: "mssql",
              name: "gdev-mssql-tls",
              meta: {
                id: "mssql",
                type: "datasource",
                name: "Microsoft SQL Server",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Data source for Microsoft SQL Server compatible databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                    large:
                      "public/app/plugins/datasource/mssql/img/sql_server_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.4.0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_mssql",
                signature: "internal",
                module: "public/plugins/mssql/module.js",
                baseUrl: "public/app/plugins/datasource/mssql",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/PB8EB3547D9522A75",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/mssql/module.js",
              jsonData: {
                database: "grafana",
                encrypt: "true",
                tlsSkipVerify: true,
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-mysql": {
              id: 17,
              uid: "P4FDCC188E688367F",
              type: "mysql",
              name: "gdev-mysql",
              meta: {
                id: "mysql",
                type: "datasource",
                name: "MySQL",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Data source for MySQL databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mysql/img/mysql_logo.svg",
                    large:
                      "public/app/plugins/datasource/mysql/img/mysql_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.4.0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_mysql",
                signature: "internal",
                module: "public/plugins/mysql/module.js",
                baseUrl: "public/app/plugins/datasource/mysql",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P4FDCC188E688367F",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/mysql/module.js",
              jsonData: {
                database: "grafana",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-mysql-ds-tests": {
              id: 18,
              uid: "P786EB2D376A795AE",
              type: "mysql",
              name: "gdev-mysql-ds-tests",
              meta: {
                id: "mysql",
                type: "datasource",
                name: "MySQL",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Data source for MySQL databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/mysql/img/mysql_logo.svg",
                    large:
                      "public/app/plugins/datasource/mysql/img/mysql_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.4.0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_mysql",
                signature: "internal",
                module: "public/plugins/mysql/module.js",
                baseUrl: "public/app/plugins/datasource/mysql",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P786EB2D376A795AE",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/mysql/module.js",
              jsonData: {
                database: "grafana_ds_tests",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-opentsdb": {
              id: 11,
              uid: "PCB9E7E5454C37640",
              type: "opentsdb",
              name: "gdev-opentsdb",
              meta: {
                id: "opentsdb",
                type: "datasource",
                name: "OpenTSDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                    large:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                signature: "internal",
                module: "core:plugin/opentsdb",
                baseUrl: "public/app/plugins/datasource/opentsdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/PCB9E7E5454C37640",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/opentsdb",
              jsonData: {
                tsdbResolution: 1,
                tsdbVersion: 1,
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-opentsdb-v2.3": {
              id: 12,
              uid: "P311D5F9D9B165031",
              type: "opentsdb",
              name: "gdev-opentsdb-v2.3",
              meta: {
                id: "opentsdb",
                type: "datasource",
                name: "OpenTSDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                    large:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                signature: "internal",
                module: "core:plugin/opentsdb",
                baseUrl: "public/app/plugins/datasource/opentsdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P311D5F9D9B165031",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/opentsdb",
              jsonData: {
                tsdbResolution: 1,
                tsdbVersion: 3,
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-opentsdb-v2.4": {
              id: 13,
              uid: "P9348C6244A7BD2E0",
              type: "opentsdb",
              name: "gdev-opentsdb-v2.4",
              meta: {
                id: "opentsdb",
                type: "datasource",
                name: "OpenTSDB",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                    large:
                      "public/app/plugins/datasource/opentsdb/img/opentsdb_logo.png",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tsdb",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                signature: "internal",
                module: "core:plugin/opentsdb",
                baseUrl: "public/app/plugins/datasource/opentsdb",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P9348C6244A7BD2E0",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/opentsdb",
              jsonData: {
                tsdbResolution: 1,
                tsdbVersion: 4,
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-postgres": {
              id: 22,
              uid: "PBBCEC2D313BC06C3",
              type: "grafana-postgresql-datasource",
              name: "gdev-postgres",
              meta: {
                id: "grafana-postgresql-datasource",
                type: "datasource",
                name: "PostgreSQL",
                aliasIDs: ["postgres"],
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Data source for PostgreSQL and compatible databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana-postgresql-datasource/img/postgresql_logo.svg",
                    large:
                      "public/app/plugins/datasource/grafana-postgresql-datasource/img/postgresql_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module:
                  "public/plugins/grafana-postgresql-datasource/module.js",
                baseUrl:
                  "public/app/plugins/datasource/grafana-postgresql-datasource",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/PBBCEC2D313BC06C3",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/grafana-postgresql-datasource/module.js",
              jsonData: {
                database: "grafana",
                sslmode: "disable",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-postgres-ds-tests": {
              id: 23,
              uid: "P77E1291449379AFC",
              type: "grafana-postgresql-datasource",
              name: "gdev-postgres-ds-tests",
              meta: {
                id: "grafana-postgresql-datasource",
                type: "datasource",
                name: "PostgreSQL",
                aliasIDs: ["postgres"],
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Data source for PostgreSQL and compatible databases",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana-postgresql-datasource/img/postgresql_logo.svg",
                    large:
                      "public/app/plugins/datasource/grafana-postgresql-datasource/img/postgresql_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "sql",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module:
                  "public/plugins/grafana-postgresql-datasource/module.js",
                baseUrl:
                  "public/app/plugins/datasource/grafana-postgresql-datasource",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/P77E1291449379AFC",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/grafana-postgresql-datasource/module.js",
              jsonData: {
                database: "grafanadstest",
                sslmode: "disable",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-prometheus": {
              id: 5,
              uid: "gdev-prometheus",
              type: "prometheus",
              name: "gdev-prometheus",
              meta: {
                id: "prometheus",
                type: "datasource",
                name: "Prometheus",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database & alerting",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://prometheus.io/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                    large:
                      "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Prometheus Stats",
                    path: "dashboards/prometheus_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Prometheus 2.0 Stats",
                    path: "dashboards/prometheus_2_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Grafana Stats",
                    path: "dashboards/grafana_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "tsdb",
                preload: false,
                backend: true,
                routes: [
                  {
                    path: "api/v1/query",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/query_range",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/series",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/labels",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/query_exemplars",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "GET",
                    reqRole: "Viewer",
                    reqAction: "alert.rules.external:read",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/config/v1/rules",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/config/v1/rules",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                ],
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/prometheus",
                baseUrl: "public/app/plugins/datasource/prometheus",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: true,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-prometheus",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/prometheus",
              jsonData: {
                alertmanagerUid: "gdev-alertmanager",
                directUrl: "http://localhost:9090",
                exemplarTraceIdDestinations: [
                  {
                    datasourceUid: "gdev-tempo",
                    name: "traceID",
                  },
                ],
                manageAlerts: true,
                prometheusType: "Prometheus",
                prometheusVersion: "2.40.0",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-pyroscope": {
              id: 29,
              uid: "gdev-pyroscope",
              type: "grafana-pyroscope-datasource",
              name: "gdev-pyroscope",
              meta: {
                id: "grafana-pyroscope-datasource",
                type: "datasource",
                name: "Grafana Pyroscope",
                aliasIDs: ["phlare"],
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://www.grafana.com",
                  },
                  description:
                    "Data source for Grafana Pyroscope, horizontally-scalable, highly-available, multi-tenant continuous profiling aggregation system.",
                  links: [
                    {
                      name: "GitHub Project",
                      url: "https://github.com/grafana/pyroscope",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana-pyroscope-datasource/img/grafana_pyroscope_icon.svg",
                    large:
                      "public/app/plugins/datasource/grafana-pyroscope-datasource/img/grafana_pyroscope_icon.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: [
                    "grafana",
                    "datasource",
                    "phlare",
                    "flamegraph",
                    "profiling",
                    "continuous profiling",
                    "pyroscope",
                  ],
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "profiling",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                executable: "gpx_grafana-pyroscope-datasource",
                signature: "internal",
                module: "public/plugins/grafana-pyroscope-datasource/module.js",
                baseUrl:
                  "public/app/plugins/datasource/grafana-pyroscope-datasource",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-pyroscope",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/grafana-pyroscope-datasource/module.js",
              jsonData: {},
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-slow-prometheus": {
              id: 6,
              uid: "gdev-slow-prometheus-uid",
              type: "prometheus",
              name: "gdev-slow-prometheus",
              meta: {
                id: "prometheus",
                type: "datasource",
                name: "Prometheus",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Open source time series database & alerting",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://prometheus.io/",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                    large:
                      "public/app/plugins/datasource/prometheus/img/prometheus_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: "",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Prometheus Stats",
                    path: "dashboards/prometheus_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Prometheus 2.0 Stats",
                    path: "dashboards/prometheus_2_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                  {
                    name: "Grafana Stats",
                    path: "dashboards/grafana_stats.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "tsdb",
                preload: false,
                backend: true,
                routes: [
                  {
                    path: "api/v1/query",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/query_range",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/series",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/labels",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "api/v1/query_exemplars",
                    method: "POST",
                    reqRole: "Viewer",
                    reqAction: "datasources:query",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "GET",
                    reqRole: "Viewer",
                    reqAction: "alert.rules.external:read",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/rules",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/config/v1/rules",
                    method: "DELETE",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                  {
                    path: "/config/v1/rules",
                    method: "POST",
                    reqRole: "Editor",
                    reqAction: "alert.rules.external:write",
                    url: "",
                    urlParams: null,
                    headers: null,
                    authType: "",
                    tokenAuth: null,
                    jwtTokenAuth: null,
                    body: null,
                  },
                ],
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                queryOptions: {
                  minInterval: true,
                },
                streaming: false,
                signature: "internal",
                module: "core:plugin/prometheus",
                baseUrl: "public/app/plugins/datasource/prometheus",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: true,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-slow-prometheus-uid",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "core:plugin/prometheus",
              jsonData: {
                directUrl: "http://localhost:3011",
                manageAlerts: false,
                prometheusType: "Prometheus",
                prometheusVersion: "2.40.0",
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-tempo": {
              id: 28,
              uid: "gdev-tempo",
              type: "tempo",
              name: "gdev-tempo",
              meta: {
                id: "tempo",
                type: "datasource",
                name: "Tempo",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "High volume, minimal dependency trace storage.  OSS tracing solution from Grafana Labs.",
                  links: [
                    {
                      name: "GitHub Project",
                      url: "https://github.com/grafana/tempo",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/tempo/img/tempo_logo.svg",
                    large:
                      "public/app/plugins/datasource/tempo/img/tempo_logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tracing",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: true,
                streaming: false,
                executable: "gpx_tempo",
                signature: "internal",
                module: "public/plugins/tempo/module.js",
                baseUrl: "public/app/plugins/datasource/tempo",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-tempo",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/tempo/module.js",
              jsonData: {
                tracesToLogsV2: {
                  customQuery: true,
                  datasourceUid: "gdev-loki",
                  query:
                    '{filename="/var/log/grafana/grafana.log"} |="${__span.traceId}"',
                  spanEndTimeShift: "-5m",
                  spanStartTimeShift: "5m",
                },
                tracesToProfiles: {
                  datasourceUid: "gdev-pyroscope",
                  profileTypeId: "process_cpu:cpu:nanoseconds:cpu:nanoseconds",
                },
              },
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-testdata": {
              id: 7,
              uid: "PD8C576611E62080A",
              type: "grafana-testdata-datasource",
              name: "gdev-testdata",
              meta: {
                id: "grafana-testdata-datasource",
                type: "datasource",
                name: "TestData",
                aliasIDs: ["testdata"],
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description: "Generates test data in different forms",
                  links: null,
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana-testdata-datasource/img/testdata.svg",
                    large:
                      "public/app/plugins/datasource/grafana-testdata-datasource/img/testdata.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: [
                  {
                    name: "Streaming Example",
                    path: "dashboards/streaming.json",
                    type: "dashboard",
                    component: "",
                    role: "Viewer",
                    addToNav: false,
                    defaultNav: false,
                    slug: "",
                    icon: "",
                    uid: "",
                  },
                ],
                category: "",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: true,
                metrics: true,
                alerting: true,
                explore: false,
                tables: false,
                logs: true,
                tracing: false,
                queryOptions: {
                  maxDataPoints: true,
                  minInterval: true,
                },
                streaming: false,
                executable: "gpx_testdata",
                signature: "internal",
                module: "public/plugins/grafana-testdata-datasource/module.js",
                baseUrl:
                  "public/app/plugins/datasource/grafana-testdata-datasource",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/PD8C576611E62080A",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/grafana-testdata-datasource/module.js",
              jsonData: {},
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "gdev-zipkin": {
              id: 27,
              uid: "gdev-zipkin",
              type: "zipkin",
              name: "gdev-zipkin",
              meta: {
                id: "zipkin",
                type: "datasource",
                name: "Zipkin",
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://grafana.com",
                  },
                  description:
                    "Placeholder for the distributed tracing system.",
                  links: [
                    {
                      name: "Learn more",
                      url: "https://zipkin.io",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/zipkin/img/zipkin-logo.svg",
                    large:
                      "public/app/plugins/datasource/zipkin/img/zipkin-logo.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: null,
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "tracing",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: true,
                streaming: false,
                signature: "internal",
                module: "public/plugins/zipkin/module.js",
                baseUrl: "public/app/plugins/datasource/zipkin",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/gdev-zipkin",
              isDefault: false,
              access: "proxy",
              preload: false,
              module: "public/plugins/zipkin/module.js",
              jsonData: {},
              readOnly: true,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
            "grafana-pyroscope-datasource": {
              id: 32,
              uid: "aeeck6hm29ou8b",
              type: "grafana-pyroscope-datasource",
              name: "grafana-pyroscope-datasource",
              meta: {
                id: "grafana-pyroscope-datasource",
                type: "datasource",
                name: "Grafana Pyroscope",
                aliasIDs: ["phlare"],
                info: {
                  author: {
                    name: "Grafana Labs",
                    url: "https://www.grafana.com",
                  },
                  description:
                    "Data source for Grafana Pyroscope, horizontally-scalable, highly-available, multi-tenant continuous profiling aggregation system.",
                  links: [
                    {
                      name: "GitHub Project",
                      url: "https://github.com/grafana/pyroscope",
                    },
                  ],
                  logos: {
                    small:
                      "public/app/plugins/datasource/grafana-pyroscope-datasource/img/grafana_pyroscope_icon.svg",
                    large:
                      "public/app/plugins/datasource/grafana-pyroscope-datasource/img/grafana_pyroscope_icon.svg",
                  },
                  build: {},
                  screenshots: null,
                  version: "11.6.0-pre",
                  updated: "",
                  keywords: [
                    "grafana",
                    "datasource",
                    "phlare",
                    "flamegraph",
                    "profiling",
                    "continuous profiling",
                    "pyroscope",
                  ],
                },
                dependencies: {
                  grafanaDependency: ">=10.3.0-0",
                  grafanaVersion: "*",
                  plugins: [],
                  extensions: {
                    exposedComponents: [],
                  },
                },
                includes: null,
                category: "profiling",
                preload: false,
                backend: true,
                routes: null,
                skipDataQuery: false,
                autoEnabled: false,
                annotations: false,
                metrics: true,
                alerting: false,
                explore: false,
                tables: false,
                logs: false,
                tracing: false,
                streaming: false,
                executable: "gpx_grafana-pyroscope-datasource",
                signature: "internal",
                module: "public/plugins/grafana-pyroscope-datasource/module.js",
                baseUrl:
                  "public/app/plugins/datasource/grafana-pyroscope-datasource",
                angular: {
                  detected: false,
                  hideDeprecation: false,
                },
                multiValueFilterOperators: false,
                loadingStrategy: "script",
                extensions: {
                  addedLinks: null,
                  addedComponents: null,
                  exposedComponents: null,
                  extensionPoints: null,
                  addedFunctions: null,
                },
              },
              url: "/api/datasources/proxy/uid/aeeck6hm29ou8b",
              isDefault: true,
              access: "proxy",
              preload: false,
              module: "public/plugins/grafana-pyroscope-datasource/module.js",
              jsonData: {
                oauthPassThru: false,
                serverName: "",
                tlsAuth: false,
                tlsAuthWithCACert: false,
              },
              readOnly: false,
              cachingConfig: {
                enabled: false,
                TTLMs: 0,
              },
            },
          },
          dateFormats: {
            fullDate: "YYYY-MM-DD HH:mm:ss",
            useBrowserLocale: false,
            interval: {
              millisecond: "HH:mm:ss.SSS",
              second: "HH:mm:ss",
              minute: "HH:mm",
              hour: "MM/DD HH:mm",
              day: "MM/DD",
              month: "YYYY-MM",
              year: "YYYY",
            },
            defaultTimezone: "browser",
            defaultWeekStart: "browser",
          },

          defaultDatasource: "grafana-pyroscope-datasource",
          defaultDatasourceManageAlertsUiToggle: true,
          disableLoginForm: false,
          disableSanitizeHtml: false,
          disableUserSignUp: true,
          editorsCanAdmin: false,
          enableFrontendSandboxForPlugins: [""],
          exploreDefaultTimeOffset: "1h",
          exploreEnabled: true,
          exploreHideLogsDownload: false,
          expressionsEnabled: true,
          externalUserMngAnalytics: false,
          externalUserMngAnalyticsParams: "",
          externalUserMngInfo: "",
          externalUserMngLinkName: "",
          externalUserMngLinkUrl: "",
          featureToggles: {
            accessActionSets: true,
            addFieldFromCalculationStatFunctions: true,
            alertingApiServer: true,
            alertingInsights: true,
            alertingNoDataErrorExecution: true,
            alertingNotificationsStepMode: true,
            alertingQueryAndExpressionsStepMode: true,
            alertingSimplifiedRouting: true,
            alertingUIOptimizeReducer: true,
            angularDeprecationUI: true,
            annotationPermissionUpdate: true,
            awsAsyncQueryCaching: true,
            azureMonitorEnableUserAuth: true,
            cloudWatchCrossAccountQuerying: true,
            cloudWatchNewLabelParsing: true,
            cloudWatchRoundUpEndTime: true,
            correlations: true,
            dashboardScene: true,
            dashboardSceneForViewers: true,
            dashboardSceneSolo: true,
            dashgpt: true,
            dataplaneFrontendFallback: true,
            exploreMetrics: true,
            formatString: true,
            groupToNestedTableTransformation: true,
            influxdbBackendMigration: true,
            kubernetesPlaylists: true,
            logRowsPopoverMenu: true,
            logsContextDatasourceUi: true,
            logsExploreTableVisualisation: true,
            logsInfiniteScrolling: true,
            lokiLabelNamesQueryApi: true,
            lokiQueryHints: true,
            lokiQuerySplitting: true,
            lokiStructuredMetadata: true,
            nestedFolders: true,
            newDashboardSharingComponent: true,
            newFiltersUI: true,
            newPDFRendering: true,
            onPremToCloudMigrations: true,
            panelMonitoring: true,
            pinNavItems: true,
            preinstallAutoUpdate: true,
            promQLScope: true,
            prometheusAzureOverrideAudience: true,
            publicDashboardsScene: true,
            recordedQueriesMulti: true,
            recoveryThreshold: true,
            reportingUseRawTimeRange: true,
            ssoSettingsApi: true,
            tlsMemcached: true,
            topnav: true,
            transformationsRedesign: true,
            unifiedRequestLog: true,
            useSessionStorageForRedirection: true,
            userStorageAPI: true,
          },

          panels: {
            "ae3e-plotly-panel": {
              "id": "ae3e-plotly-panel",
              "name": "Plotly panel",
              "info": {
                "author": {
                  "name": "AE3E",
                  "url": ""
                },
                "description": "Render chart from any datasource with Plotly javascript library",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/ae3e/ae3e-plotly-panel"
                  }
                ],
                "logos": {
                  "small": "public/plugins/ae3e-plotly-panel/img/plotly.svg",
                  "large": "public/plugins/ae3e-plotly-panel/img/plotly.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Editor",
                    "path": "public/plugins/ae3e-plotly-panel/img/editor.png"
                  },
                  {
                    "name": "Panel",
                    "path": "public/plugins/ae3e-plotly-panel/img/panel.png"
                  }
                ],
                "version": "0.5.0",
                "updated": "2021-08-09",
                "keywords": [
                  "Plotly"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/ae3e-plotly-panel",
              "signature": "valid",
              "module": "public/plugins/ae3e-plotly-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "alertlist": {
              "id": "alertlist",
              "name": "Alert list",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Shows list of alerts and their current status",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/alertlist/img/icn-singlestat-panel.svg",
                  "large": "public/app/plugins/panel/alertlist/img/icn-singlestat-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 15,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/alertlist",
              "signature": "internal",
              "module": "core:plugin/alertlist",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "andrewbmchugh-flow-panel": {
              "id": "andrewbmchugh-flow-panel",
              "name": "Flow",
              "info": {
                "author": {
                  "name": "Andrewbmchugh",
                  "url": ""
                },
                "description": "Svg flowchart visualization",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/andymchugh/andrewbmchugh-flow-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/andymchugh/andrewbmchugh-flow-panel/blob/main/LICENSE"
                  },
                  {
                    "name": "YAML Definitions",
                    "url": "https://github.com/andymchugh/andrewbmchugh-flow-panel/tree/main/yaml_defs"
                  },
                  {
                    "name": "Example SVGs and YAML",
                    "url": "https://github.com/andymchugh/andrewbmchugh-flow-panel/tree/main/examples"
                  },
                  {
                    "name": "Provisioned Dashboards and Data",
                    "url": "https://github.com/andymchugh/andrewbmchugh-flow-panel/tree/main/provisioning"
                  }
                ],
                "logos": {
                  "small": "public/plugins/andrewbmchugh-flow-panel/img/logo.png",
                  "large": "public/plugins/andrewbmchugh-flow-panel/img/logo.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Getting Started",
                    "path": "public/plugins/andrewbmchugh-flow-panel/img/example1.png"
                  },
                  {
                    "name": "Middleware Bus",
                    "path": "public/plugins/andrewbmchugh-flow-panel/img/example2.png"
                  },
                  {
                    "name": "Thread Highlighting",
                    "path": "public/plugins/andrewbmchugh-flow-panel/img/threadHighlighting.gif"
                  }
                ],
                "version": "1.17.3",
                "updated": "2025-01-28",
                "keywords": [
                  "panel",
                  "flow",
                  "workflow",
                  "flowchart",
                  "draw.io",
                  "diagram",
                  "network",
                  "svg"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/andrewbmchugh-flow-panel",
              "signature": "valid",
              "module": "public/plugins/andrewbmchugh-flow-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "anilhut-flowx-panel": {
              "id": "anilhut-flowx-panel",
              "name": "FlowX",
              "info": {
                "author": {
                  "name": "Anıl Hut",
                  "url": ""
                },
                "description": "Flow charting visualization",
                "links": [],
                "logos": {
                  "small": "public/plugins/anilhut-flowx-panel/img/logo.svg",
                  "large": "public/plugins/anilhut-flowx-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Screenshot 01",
                    "path": "public/plugins/anilhut-flowx-panel/img/Screenshot_01.png"
                  },
                  {
                    "name": "Screenshot 02",
                    "path": "public/plugins/anilhut-flowx-panel/img/Screenshot_02.png"
                  },
                  {
                    "name": "Screenshot 03",
                    "path": "public/plugins/anilhut-flowx-panel/img/Screenshot_03.png"
                  },
                  {
                    "name": "Screenshot 04",
                    "path": "public/plugins/anilhut-flowx-panel/img/Screenshot_04.png"
                  }
                ],
                "version": "1.0.3",
                "updated": "2024-10-09",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/anilhut-flowx-panel",
              "signature": "valid",
              "module": "public/plugins/anilhut-flowx-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "annolist": {
              "id": "annolist",
              "name": "Annotations list",
              "aliasIds": [
                "ryantxu-annolist-panel"
              ],
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "List annotations",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/annolist/img/icn-annolist-panel.svg",
                  "large": "public/app/plugins/panel/annolist/img/icn-annolist-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/annolist",
              "signature": "internal",
              "module": "core:plugin/annolist",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "anyline-rangeslider-panel": {
              "id": "anyline-rangeslider-panel",
              "name": "Range Slider Panel",
              "info": {
                "author": {
                  "name": "Anyline",
                  "url": ""
                },
                "description": "A dynamic range slider panel for Grafana that allows users to select a value range for filtering data.",
                "links": [
                  {
                    "name": "GitHub",
                    "url": "https://github.com/Anyline/anyline-rangeslider-panel"
                  }
                ],
                "logos": {
                  "small": "public/plugins/anyline-rangeslider-panel/img/logo.svg",
                  "large": "public/plugins/anyline-rangeslider-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/anyline-rangeslider-panel/img/Anyline-Range-Slider.png"
                  }
                ],
                "version": "1.2.9",
                "updated": "2024-04-17",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/anyline-rangeslider-panel",
              "signature": "valid",
              "module": "public/plugins/anyline-rangeslider-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "auxmoney-waterfall-panel": {
              "id": "auxmoney-waterfall-panel",
              "name": "Waterfall Panel",
              "info": {
                "author": {
                  "name": "auxmoney.com",
                  "url": "https://github.com/auxmoney"
                },
                "description": "A waterfall panel for a single time-series",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/auxmoney/grafana-waterfall-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/auxmoney/grafana-waterfall-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/auxmoney-waterfall-panel/img/logo.svg",
                  "large": "public/plugins/auxmoney-waterfall-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Waterfall example",
                    "path": "public/plugins/auxmoney-waterfall-panel/img/auxmoney-waterfall-panel.png"
                  }
                ],
                "version": "1.0.6",
                "updated": "2021-07-12",
                "keywords": [
                  "panel",
                  "waterfall"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/auxmoney-waterfall-panel",
              "signature": "valid",
              "module": "public/plugins/auxmoney-waterfall-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "barchart": {
              "id": "barchart",
              "name": "Bar chart",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Categorical charts with group support",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/barchart/img/barchart.svg",
                  "large": "public/app/plugins/panel/barchart/img/barchart.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 2,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/barchart",
              "signature": "internal",
              "module": "core:plugin/barchart",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "bargauge": {
              "id": "bargauge",
              "name": "Bar gauge",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Horizontal and vertical gauges",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/bargauge/img/icon_bar_gauge.svg",
                  "large": "public/app/plugins/panel/bargauge/img/icon_bar_gauge.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 5,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/bargauge",
              "signature": "internal",
              "module": "core:plugin/bargauge",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "betatech-qrcode-panel": {
              "id": "betatech-qrcode-panel",
              "name": "QR code",
              "info": {
                "author": {
                  "name": "Beta Technologies",
                  "url": ""
                },
                "description": "Render a QR code",
                "links": [
                  {
                    "name": "GitHub",
                    "url": "https://github.com/Beta-Technologies/grafana-panel-qrcode"
                  }
                ],
                "logos": {
                  "small": "public/plugins/betatech-qrcode-panel/img/logo.svg",
                  "large": "public/plugins/betatech-qrcode-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/betatech-qrcode-panel/img/dashboard.png"
                  }
                ],
                "version": "1.0.0",
                "updated": "2024-09-20",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/betatech-qrcode-panel",
              "signature": "valid",
              "module": "public/plugins/betatech-qrcode-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "briangann-gauge-panel": {
              "id": "briangann-gauge-panel",
              "name": "D3 Gauge",
              "info": {
                "author": {
                  "name": "Brian Gann (bkgann@gmail.com)",
                  "url": "https://github.com/briangann"
                },
                "description": "D3-based Gauge panel for Grafana",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/briangann/grafana-gauge-panel"
                  },
                  {
                    "name": "MIT License",
                    "url": "https://github.com/briangann/grafana-gauge-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/briangann-gauge-panel/img/Logo_D3.svg",
                  "large": "public/plugins/briangann-gauge-panel/img/Logo_D3.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Gauge with thresholds",
                    "path": "public/plugins/briangann-gauge-panel/screenshots/react-gauge-threshold-middle-upper.png"
                  },
                  {
                    "name": "Gauge with threshold on value",
                    "path": "public/plugins/briangann-gauge-panel/screenshots/react-gauge-threshold-on-value.png"
                  },
                  {
                    "name": "Gauge with threshold on face",
                    "path": "public/plugins/briangann-gauge-panel/screenshots/react-gauge-threshold-on-face.png"
                  },
                  {
                    "name": "Radial Customization",
                    "path": "public/plugins/briangann-gauge-panel/screenshots/react-radial-customization.png"
                  }
                ],
                "version": "2.0.1",
                "updated": "2023-11-14",
                "keywords": [
                  "gauge",
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/briangann-gauge-panel",
              "signature": "valid",
              "module": "public/plugins/briangann-gauge-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "candlestick": {
              "id": "candlestick",
              "name": "Candlestick",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Graphical representation of price movements of a security, derivative, or currency.",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/candlestick/img/candlestick.svg",
                  "large": "public/app/plugins/panel/candlestick/img/candlestick.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": [
                  "financial",
                  "price",
                  "currency",
                  "k-line"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/candlestick",
              "signature": "internal",
              "module": "core:plugin/candlestick",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "canvas": {
              "id": "canvas",
              "name": "Canvas",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Explicit element placement",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/canvas/img/icn-canvas.svg",
                  "large": "public/app/plugins/panel/canvas/img/icn-canvas.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/canvas",
              "signature": "internal",
              "module": "core:plugin/canvas",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "corpglory-chartwerk-panel": {
              "id": "corpglory-chartwerk-panel",
              "name": "Chartwerk",
              "info": {
                "author": {
                  "name": "CorpGlory Inc.",
                  "url": "https://corpglory.com"
                },
                "description": "Chartwerk panel with extended chart customization",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://chartwerk.io/"
                  },
                  {
                    "name": "License",
                    "url": "https://gitlab.com/chartwerk/grafana-chartwerk-panel/blob/main/LICENSE"
                  },
                  {
                    "name": "Gitlab",
                    "url": "https://gitlab.com/chartwerk/grafana-chartwerk-panel/"
                  }
                ],
                "logos": {
                  "small": "public/plugins/corpglory-chartwerk-panel/assets/logo.svg",
                  "large": "public/plugins/corpglory-chartwerk-panel/assets/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Main",
                    "path": "public/plugins/corpglory-chartwerk-panel/assets/img/gauge.png"
                  }
                ],
                "version": "0.5.1",
                "updated": "2024-04-16",
                "keywords": [
                  "gauge"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/corpglory-chartwerk-panel",
              "signature": "valid",
              "module": "public/plugins/corpglory-chartwerk-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "dalvany-image-panel": {
              "id": "dalvany-image-panel",
              "name": "Dynamic image panel",
              "info": {
                "author": {
                  "name": "Dalvany",
                  "url": "https://github.com/Dalvany/dalvany-image-panel"
                },
                "description": "Concatenate a metric to an URL in order to display an image",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/Dalvany/dalvany-image-panel"
                  },
                  {
                    "name": "MIT",
                    "url": "https://github.com/Dalvany/dalvany-image-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/dalvany-image-panel/img/logo.svg",
                  "large": "public/plugins/dalvany-image-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Multiple results",
                    "path": "public/plugins/dalvany-image-panel/img/screenshot01.png"
                  },
                  {
                    "name": "Single result with single fill enable",
                    "path": "public/plugins/dalvany-image-panel/img/screenshot02.png"
                  },
                  {
                    "name": "Single result with single fill disable",
                    "path": "public/plugins/dalvany-image-panel/img/screenshot03.png"
                  },
                  {
                    "name": "Overlay",
                    "path": "public/plugins/dalvany-image-panel/img/screenshot04.png"
                  },
                  {
                    "name": "Underline",
                    "path": "public/plugins/dalvany-image-panel/img/screenshot05.png"
                  }
                ],
                "version": "4.0.0",
                "updated": "2024-09-09",
                "keywords": [
                  "image",
                  "panel",
                  "dynamic"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/dalvany-image-panel",
              "signature": "valid",
              "module": "public/plugins/dalvany-image-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "dashlist": {
              "id": "dashlist",
              "name": "Dashboard list",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "List of dynamic links to other dashboards",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/dashlist/img/icn-dashlist-panel.svg",
                  "large": "public/app/plugins/panel/dashlist/img/icn-dashlist-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 16,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/dashlist",
              "signature": "internal",
              "module": "core:plugin/dashlist",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "equansdatahub-tree-panel": {
              "id": "equansdatahub-tree-panel",
              "name": "Interactive Tree Panel",
              "info": {
                "author": {
                  "name": "Equans NL",
                  "url": ""
                },
                "description": "View data, from a table data source, as a interactive tree like structure",
                "links": [],
                "logos": {
                  "small": "public/plugins/equansdatahub-tree-panel/img/logo.svg",
                  "large": "public/plugins/equansdatahub-tree-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Tree panel",
                    "path": "public/plugins/equansdatahub-tree-panel/img/screenshot-tree.png"
                  },
                  {
                    "name": "Tree panel item count",
                    "path": "public/plugins/equansdatahub-tree-panel/img/screenshot-tree-item-count.png"
                  },
                  {
                    "name": "Tree panel options",
                    "path": "public/plugins/equansdatahub-tree-panel/img/screenshot-tree-options.png"
                  },
                  {
                    "name": "Tree panel advanced options",
                    "path": "public/plugins/equansdatahub-tree-panel/img/screenshot-tree-advanced-options.png"
                  }
                ],
                "version": "1.5.1",
                "updated": "2025-02-21",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/equansdatahub-tree-panel",
              "signature": "valid",
              "module": "public/plugins/equansdatahub-tree-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "esnet-matrix-panel": {
              "id": "esnet-matrix-panel",
              "name": "ESNET Matrix Panel",
              "info": {
                "author": {
                  "name": "Esnet",
                  "url": ""
                },
                "description": "Matrix Panel Plugin that allows comparison of two non-timeseries categories",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/esnet/esnet-matrix-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/esnet/esnet-matrix-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/esnet-matrix-panel/img/logo.svg",
                  "large": "public/plugins/esnet-matrix-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "matrix-plugin",
                    "path": "public/plugins/esnet-matrix-panel/img/matrix-plugin.png"
                  },
                  {
                    "name": "matrix-plugin2",
                    "path": "public/plugins/esnet-matrix-panel/img/matrix-plugin2.png"
                  }
                ],
                "version": "1.0.10",
                "updated": "2024-10-11",
                "keywords": [
                  "panel",
                  "matrix",
                  "esnet"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/esnet-matrix-panel",
              "signature": "valid",
              "module": "public/plugins/esnet-matrix-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "esnet-networkmap-panel": {
              "id": "esnet-networkmap-panel",
              "name": "Network Map Panel",
              "info": {
                "author": {
                  "name": "ESnet",
                  "url": ""
                },
                "description": "Topology map of a network. Graphs network traffic between nodes",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/esnet/grafana-esnet-networkmap-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/esnet/grafana-esnet-networkmap-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/esnet-networkmap-panel/img/logo.svg",
                  "large": "public/plugins/esnet-networkmap-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "slopegraph-example",
                    "path": "public/plugins/esnet-networkmap-panel/img/networkmap.png"
                  }
                ],
                "version": "3.1.0",
                "updated": "2024-12-19",
                "keywords": [
                  "panel",
                  "template"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/esnet-networkmap-panel",
              "signature": "valid",
              "module": "public/plugins/esnet-networkmap-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "flamegraph": {
              "id": "flamegraph",
              "name": "Flame Graph",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/flamegraph/img/icn-flamegraph.svg",
                  "large": "public/app/plugins/panel/flamegraph/img/icn-flamegraph.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/flamegraph",
              "signature": "internal",
              "module": "core:plugin/flamegraph",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "gapit-htmlgraphics-panel": {
              "id": "gapit-htmlgraphics-panel",
              "name": "HTML graphics",
              "info": {
                "author": {
                  "name": "Gapit",
                  "url": "https://gapit.io/"
                },
                "description": "Grafana panel for displaying metric sensitive HTML and SVG graphics",
                "links": [
                  {
                    "name": "Website (docs)",
                    "url": "https://gapit-htmlgraphics-panel.gapit.io/"
                  },
                  {
                    "name": "Project site",
                    "url": "https://github.com/gapitio/gapit-htmlgraphics-panel"
                  },
                  {
                    "name": "MIT License",
                    "url": "https://github.com/gapitio/gapit-htmlgraphics-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/gapit-htmlgraphics-panel/img/logo.svg",
                  "large": "public/plugins/gapit-htmlgraphics-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "In action",
                    "path": "public/plugins/gapit-htmlgraphics-panel/img/screenshot-building-overview.png"
                  },
                  {
                    "name": "Edit view",
                    "path": "public/plugins/gapit-htmlgraphics-panel/img/screenshot-building-overview-edit.png"
                  },
                  {
                    "name": "Radar example",
                    "path": "public/plugins/gapit-htmlgraphics-panel/img/screenshot-react-radar-example.png"
                  },
                  {
                    "name": "Code editor",
                    "path": "public/plugins/gapit-htmlgraphics-panel/img/screenshot-code-editor.png"
                  }
                ],
                "version": "2.1.1",
                "updated": "2022-08-11",
                "keywords": [
                  "html",
                  "svg",
                  "javascript",
                  "graphics",
                  "gapit",
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/gapit-htmlgraphics-panel",
              "signature": "valid",
              "module": "public/plugins/gapit-htmlgraphics-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "gauge": {
              "id": "gauge",
              "name": "Gauge",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Standard gauge visualization",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/gauge/img/icon_gauge.svg",
                  "large": "public/app/plugins/panel/gauge/img/icon_gauge.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 4,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/gauge",
              "signature": "internal",
              "module": "core:plugin/gauge",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "geomap": {
              "id": "geomap",
              "name": "Geomap",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Geomap panel",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/geomap/img/icn-geomap.svg",
                  "large": "public/app/plugins/panel/geomap/img/icn-geomap.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/geomap",
              "signature": "internal",
              "module": "core:plugin/geomap",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "gettingstarted": {
              "id": "gettingstarted",
              "name": "Getting Started",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/gettingstarted/img/icn-dashlist-panel.svg",
                  "large": "public/app/plugins/panel/gettingstarted/img/icn-dashlist-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": true,
              "sort": 100,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/gettingstarted",
              "signature": "internal",
              "module": "core:plugin/gettingstarted",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "grafana-clock-panel": {
              "id": "grafana-clock-panel",
              "name": "Clock",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Clock panel for grafana",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/grafana/clock-panel"
                  },
                  {
                    "name": "MIT License",
                    "url": "https://github.com/grafana/clock-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/grafana-clock-panel/img/clock.svg",
                  "large": "public/plugins/grafana-clock-panel/img/clock.svg"
                },
                "build": {
                  "time": 1727356341031
                },
                "screenshots": [
                  {
                    "name": "Showcase",
                    "path": "public/plugins/grafana-clock-panel/img/screenshot-showcase.png"
                  },
                  {
                    "name": "Options",
                    "path": "public/plugins/grafana-clock-panel/img/screenshot-clock-options.png"
                  }
                ],
                "version": "2.1.8",
                "updated": "2024-09-26",
                "keywords": [
                  "clock",
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/grafana-clock-panel",
              "signature": "valid",
              "module": "public/plugins/grafana-clock-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "grafana-guidedtour-panel": {
              "id": "grafana-guidedtour-panel",
              "name": "Guided Tour",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Guided tour for Grafana dashboards",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/grafana/grafana-guidedtour-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/grafana/grafana-guidedtour-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/grafana-guidedtour-panel/img/guided-tour.png",
                  "large": "public/plugins/grafana-guidedtour-panel/img/guided-tour.png"
                },
                "build": {
                  "time": 1633609923704
                },
                "screenshots": [],
                "version": "0.2.0",
                "updated": "2021-10-07",
                "keywords": [
                  "Guided tour"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/plugins/grafana-guidedtour-panel",
              "signature": "valid",
              "module": "public/plugins/grafana-guidedtour-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "grafana-xyzchart-panel": {
              "id": "grafana-xyzchart-panel",
              "name": "XYZ Chart",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "XYZ chart",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/grafana/xyz-chart"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/grafana/xyz-chart/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/grafana-xyzchart-panel/img/icn-xychart.svg",
                  "large": "public/plugins/grafana-xyzchart-panel/img/icn-xychart.svg"
                },
                "build": {
                  "time": 1684300725907
                },
                "screenshots": [
                  {
                    "name": "XYZ Chart 1",
                    "path": "public/plugins/grafana-xyzchart-panel/img/chart-one.png"
                  },
                  {
                    "name": "XYZ Chart 2",
                    "path": "public/plugins/grafana-xyzchart-panel/img/chart-two.png"
                  },
                  {
                    "name": "Edit chart",
                    "path": "public/plugins/grafana-xyzchart-panel/img/edit-chart.png"
                  },
                  {
                    "name": "Hover over datapoints",
                    "path": "public/plugins/grafana-xyzchart-panel/img/hover-over-datapoints.png"
                  },
                  {
                    "name": "Zoom in",
                    "path": "public/plugins/grafana-xyzchart-panel/img/zoom-in.png"
                  }
                ],
                "version": "0.1.0",
                "updated": "2023-05-17",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "beta",
              "baseUrl": "public/plugins/grafana-xyzchart-panel",
              "signature": "valid",
              "module": "public/plugins/grafana-xyzchart-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "graph": {
              "id": "graph",
              "name": "Graph (old)",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "The old default graph panel",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/graph/img/icn-graph-panel.svg",
                  "large": "public/app/plugins/panel/graph/img/icn-graph-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 13,
              "skipDataQuery": false,
              "state": "deprecated",
              "baseUrl": "public/app/plugins/panel/graph",
              "signature": "internal",
              "module": "core:plugin/graph",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "heatmap": {
              "id": "heatmap",
              "name": "Heatmap",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Like a histogram over time",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/heatmap/img/icn-heatmap-panel.svg",
                  "large": "public/app/plugins/panel/heatmap/img/icn-heatmap-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 10,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/heatmap",
              "signature": "internal",
              "module": "core:plugin/heatmap",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "histogram": {
              "id": "histogram",
              "name": "Histogram",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Distribution of values presented as a bar chart.",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/histogram/img/histogram.svg",
                  "large": "public/app/plugins/panel/histogram/img/histogram.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": [
                  "distribution",
                  "bar chart",
                  "frequency",
                  "proportional"
                ]
              },
              "hideFromList": false,
              "sort": 12,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/histogram",
              "signature": "internal",
              "module": "core:plugin/histogram",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "innius-video-panel": {
              "id": "innius-video-panel",
              "name": "Video",
              "info": {
                "author": {
                  "name": "Innius",
                  "url": "https://innius.com"
                },
                "description": "Display video from a URL, YouTube ID, or an iFrame.",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/innius/grafana-video-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/innius/grafana-video-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/innius-video-panel/img/logo.svg",
                  "large": "public/plugins/innius-video-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Examples",
                    "path": "public/plugins/innius-video-panel/img/examples.png"
                  }
                ],
                "version": "1.0.7",
                "updated": "2023-04-07",
                "keywords": [
                  "video"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/plugins/innius-video-panel",
              "signature": "valid",
              "module": "public/plugins/innius-video-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "isaozler-shiftselector-panel": {
              "id": "isaozler-shiftselector-panel",
              "name": "Shift Selector",
              "info": {
                "author": {
                  "name": "Isa Ozler",
                  "url": "https://isaozler.com"
                },
                "description": "The shift selector allows you to adjust the time range of your grafana dashboard to one specific shift or a range of shifts.",
                "links": [
                  {
                    "name": "GitHub Repository",
                    "url": "https://github.com/isaozler/grafana-shift-selector"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/isaozler/grafana-shift-selector/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/isaozler-shiftselector-panel/img/logo.svg",
                  "large": "public/plugins/isaozler-shiftselector-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Shift Selector",
                    "path": "public/plugins/isaozler-shiftselector-panel/img/screenshot.png"
                  }
                ],
                "version": "0.1.6",
                "updated": "2024-06-03",
                "keywords": [
                  "grafana",
                  "shift",
                  "selector"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/isaozler-shiftselector-panel",
              "signature": "valid",
              "module": "public/plugins/isaozler-shiftselector-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "jdbranham-diagram-panel": {
              "id": "jdbranham-diagram-panel",
              "name": "Diagram",
              "info": {
                "author": {
                  "name": "Jeremy Branham",
                  "url": "https://savantly.net"
                },
                "description": "Display diagrams and charts with colored metric indicators",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/jdbranham/grafana-diagram"
                  },
                  {
                    "name": "Apache License",
                    "url": "https://github.com/jdbranham/grafana-diagram/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/jdbranham-diagram-panel/img/logo.svg",
                  "large": "public/plugins/jdbranham-diagram-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "diagram",
                    "path": "public/plugins/jdbranham-diagram-panel/img/default.png"
                  },
                  {
                    "name": "simple",
                    "path": "public/plugins/jdbranham-diagram-panel/img/simple.png"
                  },
                  {
                    "name": "field options",
                    "path": "public/plugins/jdbranham-diagram-panel/img/field_options.png"
                  },
                  {
                    "name": "field override",
                    "path": "public/plugins/jdbranham-diagram-panel/img/field_overrides.png"
                  },
                  {
                    "name": "composites",
                    "path": "public/plugins/jdbranham-diagram-panel/img/composites.png"
                  },
                  {
                    "name": "dark",
                    "path": "public/plugins/jdbranham-diagram-panel/img/theme_dark.png"
                  },
                  {
                    "name": "custom",
                    "path": "public/plugins/jdbranham-diagram-panel/img/theme_custom.png"
                  }
                ],
                "version": "1.10.4",
                "updated": "2024-04-19",
                "keywords": [
                  "diagram",
                  "chart",
                  "flow",
                  "gantt"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/jdbranham-diagram-panel",
              "signature": "valid",
              "module": "public/plugins/jdbranham-diagram-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "knightss27-weathermap-panel": {
              "id": "knightss27-weathermap-panel",
              "name": "Network Weathermap",
              "info": {
                "author": {
                  "name": "Seth Knights",
                  "url": "https://seth.cx"
                },
                "description": "A simple & sleek network weathermap.",
                "links": [
                  {
                    "name": "Github",
                    "url": "https://github.com/knightss27/grafana-network-weathermap"
                  },
                  {
                    "name": "Wiki",
                    "url": "https://grafana-weathermap.seth.cx/"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/knightss27/grafana-network-weathermap/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/knightss27-weathermap-panel/img/logo.svg",
                  "large": "public/plugins/knightss27-weathermap-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "General Example 1",
                    "path": "public/plugins/knightss27-weathermap-panel/img/general-example.png"
                  },
                  {
                    "name": "General Example 2",
                    "path": "public/plugins/knightss27-weathermap-panel/img/example_00.png"
                  },
                  {
                    "name": "General Example 3",
                    "path": "public/plugins/knightss27-weathermap-panel/img/example_01.png"
                  },
                  {
                    "name": "General Example 4",
                    "path": "public/plugins/knightss27-weathermap-panel/img/example_02.png"
                  }
                ],
                "version": "0.4.3",
                "updated": "2023-07-18",
                "keywords": [
                  "network weathermap",
                  "network",
                  "weathermap"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/knightss27-weathermap-panel",
              "signature": "valid",
              "module": "public/plugins/knightss27-weathermap-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "larona-epict-panel": {
              "id": "larona-epict-panel",
              "name": "ePict Panel",
              "info": {
                "author": {
                  "name": "larona",
                  "url": ""
                },
                "description": "Enter the URL of the image you want, and add some metrics on it.",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/LucasArona/larona-epict-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/LucasArona/larona-epict-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/larona-epict-panel/img/logo.svg",
                  "large": "public/plugins/larona-epict-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [],
                "version": "2.0.6",
                "updated": "2023-04-17",
                "keywords": [
                  "pictures",
                  "panel",
                  "superimpose metrics",
                  "metrics on image"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/larona-epict-panel",
              "signature": "valid",
              "module": "public/plugins/larona-epict-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "lework-lenav-panel": {
              "id": "lework-lenav-panel",
              "name": "Website Navigation",
              "info": {
                "author": {
                  "name": "lework",
                  "url": "https://github.com/lework/grafana-lenav-panel"
                },
                "description": "A panel to display website navigation.",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/lework/grafana-lenav-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/lework/grafana-lenav-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/lework-lenav-panel/img/logo.svg",
                  "large": "public/plugins/lework-lenav-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase Dashboard",
                    "path": "public/plugins/lework-lenav-panel/img/lenav-screenshot-1.png"
                  },
                  {
                    "name": "Showcase Setting",
                    "path": "public/plugins/lework-lenav-panel/img/lenav-screenshot-2.png"
                  }
                ],
                "version": "1.0.0",
                "updated": "2022-04-30",
                "keywords": [
                  "website navigation"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/lework-lenav-panel",
              "signature": "valid",
              "module": "public/plugins/lework-lenav-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "logs": {
              "id": "logs",
              "name": "Logs",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/logs/img/icn-logs-panel.svg",
                  "large": "public/app/plugins/panel/logs/img/icn-logs-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/logs",
              "signature": "internal",
              "module": "core:plugin/logs",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "lucasbremond-satellitevisualizer-panel": {
              "id": "lucasbremond-satellitevisualizer-panel",
              "name": "Satellite Visualizer",
              "info": {
                "author": {
                  "name": "Lucas Brémond",
                  "url": ""
                },
                "description": "3D satellite visualization panel.",
                "links": [],
                "logos": {
                  "small": "public/plugins/lucasbremond-satellitevisualizer-panel/img/logo.png",
                  "large": "public/plugins/lucasbremond-satellitevisualizer-panel/img/logo.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "screenshot",
                    "path": "public/plugins/lucasbremond-satellitevisualizer-panel/img/screenshot.png"
                  }
                ],
                "version": "1.7.0",
                "updated": "2024-08-14",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/lucasbremond-satellitevisualizer-panel",
              "signature": "valid",
              "module": "public/plugins/lucasbremond-satellitevisualizer-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "marcusolsson-calendar-panel": {
              "id": "marcusolsson-calendar-panel",
              "name": "Business Calendar",
              "info": {
                "author": {
                  "name": "Volkov Labs",
                  "url": "https://volkovlabs.io"
                },
                "description": "Display events and set time range",
                "links": [
                  {
                    "name": "Documentation",
                    "url": "https://volkovlabs.io/plugins/business-calendar/"
                  },
                  {
                    "name": "GitHub",
                    "url": "https://github.com/VolkovLabs/business-calendar"
                  }
                ],
                "logos": {
                  "small": "public/plugins/marcusolsson-calendar-panel/img/logo.svg",
                  "large": "public/plugins/marcusolsson-calendar-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/marcusolsson-calendar-panel/img/screenshot.png"
                  }
                ],
                "version": "3.9.0",
                "updated": "2025-02-20",
                "keywords": [
                  "panel",
                  "calendar"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/marcusolsson-calendar-panel",
              "signature": "valid",
              "module": "public/plugins/marcusolsson-calendar-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "marcusolsson-gantt-panel": {
              "id": "marcusolsson-gantt-panel",
              "name": "Gantt",
              "info": {
                "author": {
                  "name": "Marcus Olsson",
                  "url": ""
                },
                "description": "Tasks and processes over time",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/marcusolsson/grafana-gantt-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/marcusolsson/grafana-gantt-panel/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/marcusolsson-gantt-panel/img/logo.svg",
                  "large": "public/plugins/marcusolsson-gantt-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Gantt (Dark)",
                    "path": "public/plugins/marcusolsson-gantt-panel/img/dark.png"
                  },
                  {
                    "name": "Gantt (Light)",
                    "path": "public/plugins/marcusolsson-gantt-panel/img/light.png"
                  }
                ],
                "version": "0.8.1",
                "updated": "2022-07-04",
                "keywords": [
                  "panel",
                  "gantt"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/marcusolsson-gantt-panel",
              "signature": "valid",
              "module": "public/plugins/marcusolsson-gantt-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "mckn-funnel-panel": {
              "id": "mckn-funnel-panel",
              "name": "Funnel",
              "info": {
                "author": {
                  "name": "mckn",
                  "url": ""
                },
                "description": "Visualize how data moves through a process",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/mckn/grafana-funnel-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/mckn/grafana-funnel-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/mckn-funnel-panel/img/logo.svg",
                  "large": "public/plugins/mckn-funnel-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Overview",
                    "path": "public/plugins/mckn-funnel-panel/img/panel.png"
                  }
                ],
                "version": "1.2.0",
                "updated": "2025-01-10",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/mckn-funnel-panel",
              "signature": "valid",
              "module": "public/plugins/mckn-funnel-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "netsage-bumpchart-panel": {
              "id": "netsage-bumpchart-panel",
              "name": "Bump Chart Panel",
              "info": {
                "author": {
                  "name": "Katrina Turner",
                  "url": ""
                },
                "description": "Bump Chart Panel Plugin",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/grafana/simple-react-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/grafana/simple-react-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/netsage-bumpchart-panel/img/logo.svg",
                  "large": "public/plugins/netsage-bumpchart-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "bumpchart",
                    "path": "public/plugins/netsage-bumpchart-panel/img/Bumpchart-ex.png"
                  }
                ],
                "version": "1.1.3",
                "updated": "2024-10-11",
                "keywords": [
                  "panel",
                  "template"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/netsage-bumpchart-panel",
              "signature": "valid",
              "module": "public/plugins/netsage-bumpchart-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "netsage-slopegraph-panel": {
              "id": "netsage-slopegraph-panel",
              "name": "Slope Graph Panel",
              "info": {
                "author": {
                  "name": "Netsage",
                  "url": ""
                },
                "description": "Slope Graph Panel",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/netsage-project/netsage-slopegraph-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/netsage-project/netsage-slopegraph-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/netsage-slopegraph-panel/img/logo.svg",
                  "large": "public/plugins/netsage-slopegraph-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "slopegraph-example",
                    "path": "public/plugins/netsage-slopegraph-panel/img/slopegraph.png"
                  }
                ],
                "version": "1.1.2",
                "updated": "2024-10-11",
                "keywords": [
                  "panel",
                  "template"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/netsage-slopegraph-panel",
              "signature": "valid",
              "module": "public/plugins/netsage-slopegraph-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "news": {
              "id": "news",
              "name": "News",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "RSS feed reader",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/news/img/news.svg",
                  "large": "public/app/plugins/panel/news/img/news.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 17,
              "skipDataQuery": true,
              "state": "beta",
              "baseUrl": "public/app/plugins/panel/news",
              "signature": "internal",
              "module": "core:plugin/news",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "nline-plotlyjs-panel": {
              "id": "nline-plotlyjs-panel",
              "name": "Plotly",
              "info": {
                "author": {
                  "name": "nLine",
                  "url": ""
                },
                "description": "Render charts with Plotly.js",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/nline/nline-plotlyjs-panel"
                  }
                ],
                "logos": {
                  "small": "public/plugins/nline-plotlyjs-panel/img/plotly-small.png",
                  "large": "public/plugins/nline-plotlyjs-panel/img/plotly-large.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Editor",
                    "path": "public/plugins/nline-plotlyjs-panel/screenshots/editor.png"
                  },
                  {
                    "name": "Panel",
                    "path": "public/plugins/nline-plotlyjs-panel/screenshots/panel.png"
                  }
                ],
                "version": "1.8.1",
                "updated": "2024-09-30",
                "keywords": [
                  "Plotly"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/nline-plotlyjs-panel",
              "signature": "valid",
              "module": "public/plugins/nline-plotlyjs-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "nodeGraph": {
              "id": "nodeGraph",
              "name": "Node Graph",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/nodeGraph/img/icn-node-graph.svg",
                  "large": "public/app/plugins/panel/nodeGraph/img/icn-node-graph.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/nodeGraph",
              "signature": "internal",
              "module": "core:plugin/nodeGraph",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "novatec-sdg-panel": {
              "id": "novatec-sdg-panel",
              "name": "Service Dependency Graph",
              "info": {
                "author": {
                  "name": "Novatec Consulting GmbH",
                  "url": "https://www.novatec-gmbh.de/"
                },
                "description": "Service Dependency Graph panel for Grafana. Shows metric-based, dynamic dependency graph between services, indicates responsetime, load and error rate statistic for individual services and communication edges. Shows communication to external services, such as Web calls, database calls, message queues, LDAP calls, etc. Provides a details dialog for each selected service that shows statistics about incoming and outgoing traffic.",
                "links": [
                  {
                    "name": "Project site",
                    "url": "https://github.com/NovatecConsulting/novatec-service-dependency-graph-panel.git"
                  },
                  {
                    "name": "Apache License",
                    "url": "https://github.com/NovatecConsulting/novatec-service-dependency-graph-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/novatec-sdg-panel/img/novatec_sdg_panel_logo.svg",
                  "large": "public/plugins/novatec-sdg-panel/img/novatec_sdg_panel_logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase",
                    "path": "public/plugins/novatec-sdg-panel/img/data-example-1.png"
                  }
                ],
                "version": "4.0.3",
                "updated": "2021-08-26",
                "keywords": [
                  "grafana",
                  "plugin",
                  "service-dependency-graph",
                  "topology"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/novatec-sdg-panel",
              "signature": "valid",
              "module": "public/plugins/novatec-sdg-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "piechart": {
              "id": "piechart",
              "name": "Pie chart",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "The new core pie chart visualization",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/piechart/img/icon_piechart.svg",
                  "large": "public/app/plugins/panel/piechart/img/icon_piechart.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 8,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/piechart",
              "signature": "internal",
              "module": "core:plugin/piechart",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "redis-cli-panel": {
              "id": "redis-cli-panel",
              "name": "Redis CLI",
              "info": {
                "author": {
                  "name": "RedisGrafana",
                  "url": "https://redisgrafana.github.io"
                },
                "description": "Redis CLI panel",
                "links": null,
                "logos": {
                  "small": "public/plugins/redis-app/redis-cli-panel/img/logo.svg",
                  "large": "public/plugins/redis-app/redis-cli-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "2.2.1",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/redis-app/redis-cli-panel",
              "signature": "valid",
              "module": "public/plugins/redis-app/redis-cli-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "redis-cpu-panel": {
              "id": "redis-cpu-panel",
              "name": "Redis CPU Usage",
              "info": {
                "author": {
                  "name": "RedisGrafana",
                  "url": "https://redisgrafana.github.io"
                },
                "description": "Redis CPU panel",
                "links": null,
                "logos": {
                  "small": "public/plugins/redis-app/redis-cpu-panel/img/logo.svg",
                  "large": "public/plugins/redis-app/redis-cpu-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "2.2.1",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/redis-app/redis-cpu-panel",
              "signature": "valid",
              "module": "public/plugins/redis-app/redis-cpu-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "redis-gears-panel": {
              "id": "redis-gears-panel",
              "name": "RedisGears",
              "info": {
                "author": {
                  "name": "RedisGrafana",
                  "url": "https://redisgrafana.github.io"
                },
                "description": "RedisGears panel",
                "links": null,
                "logos": {
                  "small": "public/plugins/redis-app/redis-gears-panel/img/logo.svg",
                  "large": "public/plugins/redis-app/redis-gears-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "2.2.1",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/redis-app/redis-gears-panel",
              "signature": "valid",
              "module": "public/plugins/redis-app/redis-gears-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "redis-keys-panel": {
              "id": "redis-keys-panel",
              "name": "Redis Max Memory Keys",
              "info": {
                "author": {
                  "name": "RedisGrafana",
                  "url": "https://redisgrafana.github.io"
                },
                "description": "Redis Max Memory Keys panel",
                "links": null,
                "logos": {
                  "small": "public/plugins/redis-app/redis-keys-panel/img/logo.svg",
                  "large": "public/plugins/redis-app/redis-keys-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "2.2.1",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/redis-app/redis-keys-panel",
              "signature": "valid",
              "module": "public/plugins/redis-app/redis-keys-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "redis-latency-panel": {
              "id": "redis-latency-panel",
              "name": "Redis Latency",
              "info": {
                "author": {
                  "name": "RedisGrafana",
                  "url": "https://redisgrafana.github.io"
                },
                "description": "Redis Latency panel",
                "links": null,
                "logos": {
                  "small": "public/plugins/redis-app/redis-latency-panel/img/logo.svg",
                  "large": "public/plugins/redis-app/redis-latency-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "2.2.1",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/redis-app/redis-latency-panel",
              "signature": "valid",
              "module": "public/plugins/redis-app/redis-latency-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "sameeraswal-odometer-panel": {
              "id": "sameeraswal-odometer-panel",
              "name": "Odometer",
              "info": {
                "author": {
                  "name": "Sameer Singh Aswal",
                  "url": ""
                },
                "description": "Display moving counter for countdown countup",
                "links": [],
                "logos": {
                  "small": "public/plugins/sameeraswal-odometer-panel/img/logo.svg",
                  "large": "public/plugins/sameeraswal-odometer-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Sample counter",
                    "path": "public/plugins/sameeraswal-odometer-panel/img/screenshot-1.png"
                  },
                  {
                    "name": "Sample counter 3 digit value",
                    "path": "public/plugins/sameeraswal-odometer-panel/img/screenshot-2.png"
                  },
                  {
                    "name": "Counter in transition",
                    "path": "public/plugins/sameeraswal-odometer-panel/img/screenshot-3.png"
                  }
                ],
                "version": "1.0.0",
                "updated": "2023-10-28",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/sameeraswal-odometer-panel",
              "signature": "valid",
              "module": "public/plugins/sameeraswal-odometer-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "smile-palindromejs-panel": {
              "id": "smile-palindromejs-panel",
              "name": "Palindrome.js",
              "info": {
                "author": {
                  "name": "Smile",
                  "url": ""
                },
                "description": "Palindrome.js Grafana panel",
                "links": [
                  {
                    "name": "Palindrome.js",
                    "url": "https://github.com/Smile-SA/palindrome.js"
                  }
                ],
                "logos": {
                  "small": "public/plugins/smile-palindromejs-panel/img/favicon.png",
                  "large": "public/plugins/smile-palindromejs-panel/img/favicon.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/smile-palindromejs-panel/img/dashboard.png"
                  },
                  {
                    "name": "Panel",
                    "path": "public/plugins/smile-palindromejs-panel/img/panel.png"
                  }
                ],
                "version": "1.0.0",
                "updated": "2024-07-18",
                "keywords": [
                  "panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/smile-palindromejs-panel",
              "signature": "valid",
              "module": "public/plugins/smile-palindromejs-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "snuids-svg-panel": {
              "id": "snuids-svg-panel",
              "name": "Colored SVG Panel",
              "info": {
                "author": {
                  "name": "Arnaud Marchand",
                  "url": "https://github.com/snuids/grafana-svg-panel"
                },
                "description": "A panel that displays values as colored svg images",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/snuids/grafana-svg-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/snuids/grafana-svg-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/snuids-svg-panel/img/svg-panel.png",
                  "large": "public/plugins/snuids-svg-panel/img/svg-panel.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase Dashboard",
                    "path": "public/plugins/snuids-svg-panel/img/svg-screenshot-1.png"
                  },
                  {
                    "name": "Showcase Details",
                    "path": "public/plugins/snuids-svg-panel/img/svg-screenshot-2.png"
                  }
                ],
                "version": "1.0.0",
                "updated": "2021-02-13",
                "keywords": [
                  "svg panel"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/snuids-svg-panel",
              "signature": "valid",
              "module": "public/plugins/snuids-svg-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "snuids-trend-panel": {
              "id": "snuids-trend-panel",
              "name": "Trend Panel",
              "info": {
                "author": {
                  "name": "Snuids",
                  "url": ""
                },
                "description": "Trend Panel",
                "links": [],
                "logos": {
                  "small": "public/plugins/snuids-trend-panel/img/TrendPanel.png",
                  "large": "public/plugins/snuids-trend-panel/img/TrendPanel.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase",
                    "path": "public/plugins/snuids-trend-panel/media/Example.png"
                  },
                  {
                    "name": "Config",
                    "path": "public/plugins/snuids-trend-panel/media/Config.png"
                  },
                  {
                    "name": "Datasource",
                    "path": "public/plugins/snuids-trend-panel/media/Datasource.png"
                  }
                ],
                "version": "2.0.15",
                "updated": "2024-06-05",
                "keywords": [
                  "panel",
                  "traffic",
                  "lights",
                  "trend",
                  "svg"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/snuids-trend-panel",
              "signature": "valid",
              "module": "public/plugins/snuids-trend-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "speakyourcode-button-panel": {
              "id": "speakyourcode-button-panel",
              "name": "Button Panel",
              "info": {
                "author": {
                  "name": "Speak Your Code",
                  "url": ""
                },
                "description": "Grafana button control panel",
                "links": [
                  {
                    "name": "GitHub",
                    "url": "https://github.com/speakyourcode/grafana-button-panel"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/speakyourcode/grafana-button-panel/blob/master/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/speakyourcode-button-panel/img/logo.svg",
                  "large": "public/plugins/speakyourcode-button-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel Options",
                    "path": "public/plugins/speakyourcode-button-panel/img/panel_options.png"
                  },
                  {
                    "name": "Horizontal Orientation",
                    "path": "public/plugins/speakyourcode-button-panel/img/horizontal_orientation.png"
                  },
                  {
                    "name": "Vertical Orientation",
                    "path": "public/plugins/speakyourcode-button-panel/img/vertical_orientation.png"
                  }
                ],
                "version": "0.3.2",
                "updated": "2022-12-07",
                "keywords": [
                  "panel",
                  "button",
                  "control",
                  "input"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/speakyourcode-button-panel",
              "signature": "valid",
              "module": "public/plugins/speakyourcode-button-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "stat": {
              "id": "stat",
              "name": "Stat",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Big stat values & sparklines",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/stat/img/icn-singlestat-panel.svg",
                  "large": "public/app/plugins/panel/stat/img/icn-singlestat-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 3,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/stat",
              "signature": "internal",
              "module": "core:plugin/stat",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "state-timeline": {
              "id": "state-timeline",
              "name": "State timeline",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "State changes and durations",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/state-timeline/img/timeline.svg",
                  "large": "public/app/plugins/panel/state-timeline/img/timeline.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 9,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/state-timeline",
              "signature": "internal",
              "module": "core:plugin/state-timeline",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "status-history": {
              "id": "status-history",
              "name": "Status history",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Periodic status history",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/status-history/img/status.svg",
                  "large": "public/app/plugins/panel/status-history/img/status.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 11,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/status-history",
              "signature": "internal",
              "module": "core:plugin/status-history",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "table": {
              "id": "table",
              "name": "Table",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Supports many column styles",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/table/img/icn-table-panel.svg",
                  "large": "public/app/plugins/panel/table/img/icn-table-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 6,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/table",
              "signature": "internal",
              "module": "core:plugin/table",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "table-old": {
              "id": "table-old",
              "name": "Table (old)",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Table Panel for Grafana",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/table-old/img/icn-table-panel.svg",
                  "large": "public/app/plugins/panel/table-old/img/icn-table-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "deprecated",
              "baseUrl": "public/app/plugins/panel/table-old",
              "signature": "internal",
              "module": "core:plugin/table-old",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "text": {
              "id": "text",
              "name": "Text",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Supports markdown and html content",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/text/img/icn-text-panel.svg",
                  "large": "public/app/plugins/panel/text/img/icn-text-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 14,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/text",
              "signature": "internal",
              "module": "core:plugin/text",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "timeseries": {
              "id": "timeseries",
              "name": "Time series",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Time based line, area and bar charts",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/timeseries/img/icn-timeseries-panel.svg",
                  "large": "public/app/plugins/panel/timeseries/img/icn-timeseries-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 1,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/timeseries",
              "signature": "internal",
              "module": "core:plugin/timeseries",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "timomyl-breadcrumb-panel": {
              "id": "timomyl-breadcrumb-panel",
              "name": "Breadcrumb",
              "info": {
                "author": {
                  "name": "Timo Myllymaki",
                  "url": ""
                },
                "description": "Breadcrumb Panel for Grafana",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/timyllym/grafana-breadcrumb-panel"
                  }
                ],
                "logos": {
                  "small": "public/plugins/timomyl-breadcrumb-panel/img/breadcrumb-icon.svg",
                  "large": "public/plugins/timomyl-breadcrumb-panel/img/breadcrumb-icon.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase",
                    "path": "public/plugins/timomyl-breadcrumb-panel/img/breadcrumb-screenshot.png"
                  }
                ],
                "version": "1.2.0",
                "updated": "2022-08-15",
                "keywords": [
                  "breadcrumb"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/timomyl-breadcrumb-panel",
              "signature": "valid",
              "module": "public/plugins/timomyl-breadcrumb-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "timomyl-organisations-panel": {
              "id": "timomyl-organisations-panel",
              "name": "Organisations",
              "info": {
                "author": {
                  "name": "Timo Myllymaki",
                  "url": ""
                },
                "description": "Organisations Panel for Grafana",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://github.com/timyllym/grafana-organisations-panel"
                  }
                ],
                "logos": {
                  "small": "public/plugins/timomyl-organisations-panel/img/organisations-icon.svg",
                  "large": "public/plugins/timomyl-organisations-panel/img/organisations-icon.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Showcase",
                    "path": "public/plugins/timomyl-organisations-panel/img/organisations-screenshot.png"
                  }
                ],
                "version": "1.4.0",
                "updated": "2022-08-24",
                "keywords": [
                  "organization"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/timomyl-organisations-panel",
              "signature": "valid",
              "module": "public/plugins/timomyl-organisations-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "traces": {
              "id": "traces",
              "name": "Traces",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/traces/img/traces-panel.svg",
                  "large": "public/app/plugins/panel/traces/img/traces-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/traces",
              "signature": "internal",
              "module": "core:plugin/traces",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "trend": {
              "id": "trend",
              "name": "Trend",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Like timeseries, but when x != time",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/trend/img/trend.svg",
                  "large": "public/app/plugins/panel/trend/img/trend.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "beta",
              "baseUrl": "public/app/plugins/panel/trend",
              "signature": "internal",
              "module": "core:plugin/trend",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "vaduga-mapgl-panel": {
              "id": "vaduga-mapgl-panel",
              "name": "Mapgl",
              "info": {
                "author": {
                  "name": "Vadim Pyatakov",
                  "url": ""
                },
                "description": "Network geomap with metrics & alert states",
                "links": [
                  {
                    "name": "Website",
                    "url": "https://mapgl.org"
                  },
                  {
                    "name": "License",
                    "url": "https://github.com/vaduga/mapgl-community/blob/main/LICENSE"
                  }
                ],
                "logos": {
                  "small": "public/plugins/vaduga-mapgl-panel/img/logo.png",
                  "large": "public/plugins/vaduga-mapgl-panel/img/logo.png"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Aggregation",
                    "path": "public/plugins/vaduga-mapgl-panel/img/aggr.gif"
                  },
                  {
                    "name": "Overview",
                    "path": "public/plugins/vaduga-mapgl-panel/img/screenshot1.png"
                  },
                  {
                    "name": "Options",
                    "path": "public/plugins/vaduga-mapgl-panel/img/screenshot2.png"
                  }
                ],
                "version": "1.6.1",
                "updated": "2024-06-09",
                "keywords": [
                  "map",
                  "alerts",
                  "zabbix",
                  "clusters",
                  "geomap",
                  "geojson",
                  "network",
                  "topology",
                  "deck.gl"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/vaduga-mapgl-panel",
              "signature": "valid",
              "module": "public/plugins/vaduga-mapgl-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "volkovlabs-echarts-panel": {
              "id": "volkovlabs-echarts-panel",
              "name": "Business Charts",
              "info": {
                "author": {
                  "name": "Volkov Labs",
                  "url": "https://volkovlabs.io"
                },
                "description": "Powerful visualizations powered by Apache ECharts.",
                "links": [
                  {
                    "name": "Documentation",
                    "url": "https://volkovlabs.io/plugins/business-charts/"
                  },
                  {
                    "name": "Examples",
                    "url": "https://echarts.volkovlabs.io"
                  },
                  {
                    "name": "GitHub",
                    "url": "https://github.com/VolkovLabs/business-charts"
                  }
                ],
                "logos": {
                  "small": "public/plugins/volkovlabs-echarts-panel/img/logo.svg",
                  "large": "public/plugins/volkovlabs-echarts-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Dashboard",
                    "path": "public/plugins/volkovlabs-echarts-panel/img/dashboard.png"
                  },
                  {
                    "name": "Examples",
                    "path": "public/plugins/volkovlabs-echarts-panel/img/examples.png"
                  }
                ],
                "version": "6.6.0",
                "updated": "2025-02-20",
                "keywords": [
                  "business",
                  "echarts"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/volkovlabs-echarts-panel",
              "signature": "valid",
              "module": "public/plugins/volkovlabs-echarts-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "volkovlabs-form-panel": {
              "id": "volkovlabs-form-panel",
              "name": "Business Forms",
              "info": {
                "author": {
                  "name": "Volkov Labs",
                  "url": "https://volkovlabs.io"
                },
                "description": "Insert, update application data, and modify configuration",
                "links": [
                  {
                    "name": "Documentation",
                    "url": "https://volkovlabs.io/plugins/business-forms/"
                  },
                  {
                    "name": "GitHub",
                    "url": "https://github.com/VolkovLabs/business-forms"
                  }
                ],
                "logos": {
                  "small": "public/plugins/volkovlabs-form-panel/img/logo.svg",
                  "large": "public/plugins/volkovlabs-form-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/volkovlabs-form-panel/img/panel.png"
                  },
                  {
                    "name": "Form Elements",
                    "path": "public/plugins/volkovlabs-form-panel/img/elements.png"
                  },
                  {
                    "name": "Request",
                    "path": "public/plugins/volkovlabs-form-panel/img/request.png"
                  }
                ],
                "version": "5.0.0",
                "updated": "2024-12-24",
                "keywords": [
                  "Form",
                  "JSON",
                  "Data"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/volkovlabs-form-panel",
              "signature": "valid",
              "module": "public/plugins/volkovlabs-form-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "volkovlabs-variable-panel": {
              "id": "volkovlabs-variable-panel",
              "name": "Business Variable",
              "info": {
                "author": {
                  "name": "Volkov Labs",
                  "url": "https://volkovlabs.io"
                },
                "description": "Update single, dependent and multi-variables.",
                "links": [
                  {
                    "name": "Documentation",
                    "url": "https://volkovlabs.io/plugins/business-variable/"
                  },
                  {
                    "name": "GitHub",
                    "url": "https://github.com/volkovlabs/business-variable"
                  }
                ],
                "logos": {
                  "small": "public/plugins/volkovlabs-variable-panel/img/logo.svg",
                  "large": "public/plugins/volkovlabs-variable-panel/img/logo.svg"
                },
                "build": {},
                "screenshots": [
                  {
                    "name": "Panel",
                    "path": "public/plugins/volkovlabs-variable-panel/img/dashboard.png"
                  }
                ],
                "version": "3.7.0",
                "updated": "2025-02-13",
                "keywords": [
                  "variable"
                ]
              },
              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/plugins/volkovlabs-variable-panel",
              "signature": "valid",
              "module": "public/plugins/volkovlabs-variable-panel/module.js",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "welcome": {
              "id": "welcome",
              "name": "Welcome",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/welcome/img/icn-dashlist-panel.svg",
                  "large": "public/app/plugins/panel/welcome/img/icn-dashlist-panel.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": null
              },
              "hideFromList": true,
              "sort": 100,
              "skipDataQuery": true,
              "state": "",
              "baseUrl": "public/app/plugins/panel/welcome",
              "signature": "internal",
              "module": "core:plugin/welcome",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            },
            "xychart": {
              "id": "xychart",
              "name": "XY Chart",
              "info": {
                "author": {
                  "name": "Grafana Labs",
                  "url": "https://grafana.com"
                },
                "description": "Supports arbitrary X vs Y in a graph to visualize the relationship between two variables.",
                "links": null,
                "logos": {
                  "small": "public/app/plugins/panel/xychart/img/icn-xychart.svg",
                  "large": "public/app/plugins/panel/xychart/img/icn-xychart.svg"
                },
                "build": {},
                "screenshots": null,
                "version": "",
                "updated": "",
                "keywords": [
                  "scatter",
                  "plot"
                ]
              },
              theme: {
                "name": "Light",
                "typography": {
                  "fontFamily": {
                    "sansSerif": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "monospace": "'Roboto Mono', monospace"
                  },
                  "size": {
                    "base": "14px",
                    "xs": "10px",
                    "sm": "12px",
                    "md": "14px",
                    "lg": "18px"
                  },
                  "heading": {
                    "h1": "2rem",
                    "h2": "1.7142857142857142rem",
                    "h3": "1.5714285714285714rem",
                    "h4": "1.2857142857142858rem",
                    "h5": "1.1428571428571428rem",
                    "h6": "1rem"
                  },
                  "weight": {
                    "light": 300,
                    "regular": 400,
                    "semibold": 500,
                    "bold": 500
                  },
                  "lineHeight": {
                    "xs": 1.5,
                    "sm": 1.5,
                    "md": 1.5714285714285714,
                    "lg": 1.1666666666666667
                  },
                  "link": {
                    "decoration": "none",
                    "hoverDecoration": "none"
                  }
                },
                "breakpoints": {
                  "xs": "0px",
                  "sm": "544px",
                  "md": "769px",
                  "lg": "992px",
                  "xl": "1200px",
                  "xxl": "1440px"
                },
                "spacing": {
                  "base": 8,
                  "insetSquishMd": "4px 8px",
                  "d": "16px",
                  "xxs": "2px",
                  "xs": "4px",
                  "sm": "8px",
                  "md": "16px",
                  "lg": "24px",
                  "xl": "32px",
                  "gutter": "32px",
                  "formSpacingBase": 8,
                  "formMargin": "32px",
                  "formFieldsetMargin": "16px",
                  "formInputHeight": 32,
                  "formButtonHeight": 32,
                  "formInputPaddingHorizontal": "8px",
                  "formInputAffixPaddingHorizontal": "4px",
                  "formInputMargin": "16px",
                  "formLabelPadding": "0 0 0 2px",
                  "formLabelMargin": "0 0 4px 0",
                  "formValidationMessagePadding": "4px 8px",
                  "formValidationMessageMargin": "4px 0 0 0",
                  "inlineFormMargin": "4px"
                },
                "border": {
                  "radius": {
                    "sm": "2px",
                    "md": "4px",
                    "lg": "6px"
                  },
                  "width": {
                    "sm": "1px"
                  }
                },
                "height": {
                  "sm": 24,
                  "md": 32,
                  "lg": 48
                },
                "panelPadding": 8,
                "panelHeaderHeight": 32,
                "zIndex": {
                  "activePanel": 999,
                  "navbarFixed": 1000,
                  "sidemenu": 1020,
                  "dropdown": 1030,
                  "typeahead": 1030,
                  "tooltip": 1040,
                  "modalBackdrop": 1050,
                  "modal": 1060,
                  "portal": 1061
                },
                "type": "light",
                "isDark": false,
                "isLight": true,
                "palette": {
                  "gray98": "#f7f8fa",
                  "gray97": "#f1f5f9",
                  "gray95": "#e9edf2",
                  "gray90": "#dce1e6",
                  "gray85": "#c7d0d9",
                  "gray70": "#9fa7b3",
                  "gray60": "#7b8087",
                  "gray33": "#464c54",
                  "gray25": "#2c3235",
                  "gray15": "#202226",
                  "gray10": "#141619",
                  "gray05": "#0b0c0e",
                  "blue95": "#5794f2",
                  "blue85": "#33a2e5",
                  "blue80": "#3274d9",
                  "blue77": "#1f60c4",
                  "red88": "#e02f44",
                  "black": "#000000",
                  "white": "#ffffff",
                  "dark1": "#141414",
                  "dark2": "#161719",
                  "dark3": "#1f1f20",
                  "dark4": "#212124",
                  "dark5": "#222426",
                  "dark6": "#262628",
                  "dark7": "#292a2d",
                  "dark8": "#2f2f32",
                  "dark9": "#343436",
                  "dark10": "#424345",
                  "gray1": "#555555",
                  "gray2": "#8e8e8e",
                  "gray3": "#b3b3b3",
                  "gray4": "#d8d9da",
                  "gray5": "#ececec",
                  "gray6": "#f4f5f8",
                  "gray7": "#fbfbfb",
                  "redBase": "#e02f44",
                  "redShade": "#c4162a",
                  "greenBase": "#299c46",
                  "greenShade": "#23843b",
                  "red": "#d44a3a",
                  "yellow": "#ecbb13",
                  "purple": "#9933cc",
                  "variable": "#32d1df",
                  "orange": "#eb7b18",
                  "orangeDark": "#ff780a",
                  "brandPrimary": "#eb7b18",
                  "brandSuccess": "#1b855e",
                  "brandWarning": "#ff9900",
                  "brandDanger": "#e0226e",
                  "queryRed": "#cf0e5B",
                  "queryGreen": "#0a764e",
                  "queryPurple": "#fe85fc",
                  "queryOrange": "#eb7b18",
                  "online": "#1b855e",
                  "warn": "#1b855e",
                  "critical": "#1b855e"
                },
                "colors": {
                  "bg1": "#ffffff",
                  "bg2": "#f4f5f5",
                  "bg3": "rgba(36, 41, 46, 0.12)",
                  "dashboardBg": "#f4f5f5",
                  "bgBlue1": "#3871dc",
                  "bgBlue2": "rgb(44, 90, 176)",
                  "border1": "rgba(36, 41, 46, 0.12)",
                  "border2": "rgba(36, 41, 46, 0.3)",
                  "border3": "rgba(36, 41, 46, 0.4)",
                  "formLabel": "rgba(36, 41, 46, 1)",
                  "formDescription": "rgba(36, 41, 46, 0.75)",
                  "formInputBg": "#ffffff",
                  "formInputBgDisabled": "rgba(36, 41, 46, 0.04)",
                  "formInputBorder": "rgba(36, 41, 46, 0.3)",
                  "formInputBorderHover": "rgba(36, 41, 46, 0.4)",
                  "formInputBorderActive": "#1f62e0",
                  "formInputBorderInvalid": "#cf0e5B",
                  "formInputPlaceholderText": "rgba(36, 41, 46, 0.64)",
                  "formInputText": "rgba(36, 41, 46, 1)",
                  "formInputDisabledText": "rgba(36, 41, 46, 0.64)",
                  "formFocusOutline": "#3871dc",
                  "formValidationMessageText": "#ffffff",
                  "formValidationMessageBg": "#e0226e",
                  "textStrong": "#000000",
                  "textHeading": "rgba(36, 41, 46, 1)",
                  "text": "rgba(36, 41, 46, 1)",
                  "textSemiWeak": "rgba(36, 41, 46, 0.75)",
                  "textWeak": "rgba(36, 41, 46, 0.75)",
                  "textFaint": "rgba(36, 41, 46, 0.64)",
                  "textBlue": "#1f62e0",
                  "bodyBg": "#f4f5f5",
                  "panelBg": "#ffffff",
                  "panelBorder": "rgba(36, 41, 46, 0.12)",
                  "pageHeaderBg": "#f4f5f5",
                  "pageHeaderBorder": "#f4f5f5",
                  "dropdownBg": "#ffffff",
                  "dropdownShadow": "#000000",
                  "dropdownOptionHoverBg": "#f4f5f5",
                  "link": "rgba(36, 41, 46, 1)",
                  "linkDisabled": "rgba(36, 41, 46, 0.64)",
                  "linkHover": "#000000",
                  "linkExternal": "#1f62e0"
                },
                "shadows": {
                  "listItem": "none"
                },
                "visualization": {
                  "hues": [
                    {
                      "name": "red",
                      "shades": [
                        {
                          "color": "#FF7383",
                          "name": "super-light-red"
                        },
                        {
                          "color": "#F2495C",
                          "name": "light-red"
                        },
                        {
                          "color": "#E02F44",
                          "name": "red",
                          "primary": true
                        },
                        {
                          "color": "#C4162A",
                          "name": "semi-dark-red"
                        },
                        {
                          "color": "#AD0317",
                          "name": "dark-red"
                        }
                      ]
                    },
                    {
                      "name": "orange",
                      "shades": [
                        {
                          "color": "#FFB357",
                          "name": "super-light-orange",
                          "aliases": []
                        },
                        {
                          "color": "#FF9830",
                          "name": "light-orange",
                          "aliases": []
                        },
                        {
                          "color": "#FF780A",
                          "name": "orange",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#FA6400",
                          "name": "semi-dark-orange",
                          "aliases": []
                        },
                        {
                          "color": "#E55400",
                          "name": "dark-orange",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "yellow",
                      "shades": [
                        {
                          "color": "#FFEE52",
                          "name": "super-light-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#FADE2A",
                          "name": "light-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#F2CC0C",
                          "name": "yellow",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#E0B400",
                          "name": "semi-dark-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#CC9D00",
                          "name": "dark-yellow",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "green",
                      "shades": [
                        {
                          "color": "#96D98D",
                          "name": "super-light-green",
                          "aliases": []
                        },
                        {
                          "color": "#73BF69",
                          "name": "light-green",
                          "aliases": []
                        },
                        {
                          "color": "#56A64B",
                          "name": "green",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#37872D",
                          "name": "semi-dark-green",
                          "aliases": []
                        },
                        {
                          "color": "#19730E",
                          "name": "dark-green",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "blue",
                      "shades": [
                        {
                          "color": "#8AB8FF",
                          "name": "super-light-blue",
                          "aliases": []
                        },
                        {
                          "color": "#5794F2",
                          "name": "light-blue",
                          "aliases": []
                        },
                        {
                          "color": "#3274D9",
                          "name": "blue",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#1F60C4",
                          "name": "semi-dark-blue",
                          "aliases": []
                        },
                        {
                          "color": "#1250B0",
                          "name": "dark-blue",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "purple",
                      "shades": [
                        {
                          "color": "#CA95E5",
                          "name": "super-light-purple",
                          "aliases": []
                        },
                        {
                          "color": "#B877D9",
                          "name": "light-purple",
                          "aliases": []
                        },
                        {
                          "color": "#A352CC",
                          "name": "purple",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#8F3BB8",
                          "name": "semi-dark-purple",
                          "aliases": []
                        },
                        {
                          "color": "#7C2EA3",
                          "name": "dark-purple",
                          "aliases": []
                        }
                      ]
                    }
                  ],
                  "palette": [
                    "green",
                    "semi-dark-yellow",
                    "light-blue",
                    "semi-dark-orange",
                    "red",
                    "blue",
                    "purple",
                    "#705DA0",
                    "dark-green",
                    "yellow",
                    "#447EBC",
                    "#C15C17",
                    "#890F02",
                    "#0A437C",
                    "#6D1F62",
                    "#584477",
                    "#B7DBAB",
                    "#F4D598",
                    "#70DBED",
                    "#F9BA8F",
                    "#F29191",
                    "#82B5D8",
                    "#E5A8E2",
                    "#AEA2E0",
                    "#629E51",
                    "#E5AC0E",
                    "#64B0C8",
                    "#E0752D",
                    "#BF1B00",
                    "#0A50A1",
                    "#962D82",
                    "#614D93",
                    "#9AC48A",
                    "#F2C96D",
                    "#65C5DB",
                    "#F9934E",
                    "#EA6460",
                    "#5195CE",
                    "#D683CE",
                    "#806EB7",
                    "#3F6833",
                    "#967302",
                    "#2F575E",
                    "#99440A",
                    "#58140C",
                    "#052B51",
                    "#511749",
                    "#3F2B5B",
                    "#E0F9D7",
                    "#FCEACA",
                    "#CFFAFF",
                    "#F9E2D2",
                    "#FCE2DE",
                    "#BADFF4",
                    "#F9D9F9",
                    "#DEDAF7"
                  ]
                }
              },
              theme2: {
                "name": "Light",
                "isDark": false,
                "isLight": true,
                "colors": {
                  "mode": "light",
                  "blackBase": "36, 41, 46",
                  "primary": {
                    "main": "#3871dc",
                    "border": "#1f62e0",
                    "text": "#1f62e0",
                    "name": "primary",
                    "shade": "rgb(44, 90, 176)",
                    "transparent": "#3871dc26",
                    "contrastText": "#ffffff",
                    "borderTransparent": "#1f62e040"
                  },
                  "text": {
                    "primary": "rgba(36, 41, 46, 1)",
                    "secondary": "rgba(36, 41, 46, 0.75)",
                    "disabled": "rgba(36, 41, 46, 0.64)",
                    "link": "#1f62e0",
                    "maxContrast": "#000000"
                  },
                  "border": {
                    "weak": "rgba(36, 41, 46, 0.12)",
                    "medium": "rgba(36, 41, 46, 0.3)",
                    "strong": "rgba(36, 41, 46, 0.4)"
                  },
                  "secondary": {
                    "main": "rgba(36, 41, 46, 0.08)",
                    "shade": "rgba(36, 41, 46, 0.15)",
                    "transparent": "rgba(36, 41, 46, 0.08)",
                    "contrastText": "rgba(36, 41, 46,  1)",
                    "text": "rgba(36, 41, 46, 1)",
                    "border": "rgba(36, 41, 46, 0.12)",
                    "name": "secondary",
                    "borderTransparent": "rgba(36, 41, 46, 0.25)"
                  },
                  "info": {
                    "main": "#3871dc",
                    "text": "#1f62e0",
                    "name": "info",
                    "border": "#1f62e0",
                    "shade": "rgb(44, 90, 176)",
                    "transparent": "#3871dc26",
                    "contrastText": "#ffffff",
                    "borderTransparent": "#1f62e040"
                  },
                  "error": {
                    "main": "#e0226e",
                    "text": "#cf0e5B",
                    "border": "#cf0e5B",
                    "name": "error",
                    "shade": "rgb(179, 27, 88)",
                    "transparent": "#e0226e26",
                    "contrastText": "#ffffff",
                    "borderTransparent": "#cf0e5B40"
                  },
                  "success": {
                    "main": "#1b855e",
                    "text": "#0a764e",
                    "name": "success",
                    "border": "#0a764e",
                    "shade": "rgb(21, 106, 75)",
                    "transparent": "#1b855e26",
                    "contrastText": "#ffffff",
                    "borderTransparent": "#0a764e40"
                  },
                  "warning": {
                    "main": "#ff9900",
                    "text": "#b5510d",
                    "name": "warning",
                    "border": "#b5510d",
                    "shade": "rgb(204, 122, 0)",
                    "transparent": "#ff990026",
                    "contrastText": "#000000",
                    "borderTransparent": "#b5510d40"
                  },
                  "background": {
                    "canvas": "#f4f5f5",
                    "primary": "#ffffff",
                    "secondary": "#f4f5f5",
                    "elevated": "#ffffff"
                  },
                  "action": {
                    "hover": "rgba(36, 41, 46, 0.12)",
                    "selected": "rgba(36, 41, 46, 0.08)",
                    "selectedBorder": "#ff9900",
                    "hoverOpacity": 0.08,
                    "focus": "rgba(36, 41, 46, 0.12)",
                    "disabledBackground": "rgba(36, 41, 46, 0.04)",
                    "disabledText": "rgba(36, 41, 46, 0.64)",
                    "disabledOpacity": 0.38
                  },
                  "gradients": {
                    "brandHorizontal": "linear-gradient(90deg, #FF8833 0%, #F53E4C 100%)",
                    "brandVertical": "linear-gradient(0.01deg, #F53E4C -31.2%, #FF8833 113.07%)"
                  },
                  "contrastThreshold": 3,
                  "hoverFactor": 0.03,
                  "tonalOffset": 0.2
                },
                "breakpoints": {
                  "values": {
                    "xs": 0,
                    "sm": 544,
                    "md": 769,
                    "lg": 992,
                    "xl": 1200,
                    "xxl": 1440
                  },
                  "keys": [
                    "xs",
                    "sm",
                    "md",
                    "lg",
                    "xl",
                    "xxl"
                  ],
                  "unit": "px"
                },
                "shape": {
                  "radius": {
                    "default": "2px",
                    "pill": "9999px",
                    "circle": "100%"
                  }
                },
                "components": {
                  "height": {
                    "sm": 3,
                    "md": 4,
                    "lg": 6
                  },
                  "input": {
                    "borderColor": "rgba(36, 41, 46, 0.3)",
                    "borderHover": "rgba(36, 41, 46, 0.4)",
                    "text": "rgba(36, 41, 46, 1)",
                    "background": "#ffffff"
                  },
                  "panel": {
                    "padding": 1,
                    "headerHeight": 4,
                    "background": "#ffffff",
                    "borderColor": "rgba(36, 41, 46, 0.12)",
                    "boxShadow": "none"
                  },
                  "dropdown": {
                    "background": "#ffffff"
                  },
                  "tooltip": {
                    "background": "#ffffff",
                    "text": "rgba(36, 41, 46, 1)"
                  },
                  "dashboard": {
                    "background": "#f4f5f5",
                    "padding": 1
                  },
                  "overlay": {
                    "background": "rgba(208, 209, 211, 0.24)"
                  },
                  "sidemenu": {
                    "width": 57
                  },
                  "menuTabs": {
                    "height": 5
                  },
                  "textHighlight": {
                    "text": "#000000",
                    "background": "#ff9900"
                  },
                  "horizontalDrawer": {
                    "defaultHeight": 400
                  },
                  "table": {
                    "rowHoverBackground": "rgba(36, 41, 46, 0.12)",
                    "rowSelected": "rgba(36, 41, 46, 0.08)"
                  }
                },
                "typography": {
                  "htmlFontSize": 14,
                  "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                  "fontFamilyMonospace": "'Roboto Mono', monospace",
                  "fontSize": 14,
                  "fontWeightLight": 300,
                  "fontWeightRegular": 400,
                  "fontWeightMedium": 500,
                  "fontWeightBold": 500,
                  "size": {
                    "base": "14px",
                    "xs": "10px",
                    "sm": "12px",
                    "md": "14px",
                    "lg": "18px"
                  },
                  "h1": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "2rem",
                    "lineHeight": 1.1428571428571428,
                    "letterSpacing": "-0.00893em"
                  },
                  "h2": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "1.7142857142857142rem",
                    "lineHeight": 1.1666666666666667,
                    "letterSpacing": "0em"
                  },
                  "h3": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "1.5714285714285714rem",
                    "lineHeight": 1.0909090909090908,
                    "letterSpacing": "0em"
                  },
                  "h4": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "1.2857142857142858rem",
                    "lineHeight": 1.2222222222222223,
                    "letterSpacing": "0.01389em"
                  },
                  "h5": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "1.1428571428571428rem",
                    "lineHeight": 1.375,
                    "letterSpacing": "0em"
                  },
                  "h6": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 500,
                    "fontSize": "1rem",
                    "lineHeight": 1.5714285714285714,
                    "letterSpacing": "0.01071em"
                  },
                  "body": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "1rem",
                    "lineHeight": 1.5714285714285714,
                    "letterSpacing": "0.01071em"
                  },
                  "bodySmall": {
                    "fontFamily": "'Inter', 'Helvetica', 'Arial', sans-serif",
                    "fontWeight": 400,
                    "fontSize": "0.8571428571428571rem",
                    "lineHeight": 1.5,
                    "letterSpacing": "0.0125em"
                  },
                  "code": {
                    "fontFamily": "'Roboto Mono', monospace",
                    "fontWeight": 400,
                    "fontSize": "1rem",
                    "lineHeight": 1.1428571428571428,
                    "letterSpacing": "0.01071em"
                  }
                },
                "shadows": {
                  "z1": "0px 1px 2px rgba(24, 26, 27, 0.2)",
                  "z2": "0px 4px 8px rgba(24, 26, 27, 0.2)",
                  "z3": "0px 13px 20px 1px rgba(24, 26, 27, 0.18)"
                },
                "transitions": {
                  "duration": {
                    "shortest": 150,
                    "shorter": 200,
                    "short": 250,
                    "standard": 300,
                    "complex": 375,
                    "enteringScreen": 225,
                    "leavingScreen": 195
                  },
                  "easing": {
                    "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
                    "easeOut": "cubic-bezier(0.0, 0, 0.2, 1)",
                    "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
                    "sharp": "cubic-bezier(0.4, 0, 0.6, 1)"
                  }
                },
                "visualization": {
                  "hues": [
                    {
                      "name": "red",
                      "shades": [
                        {
                          "color": "#FF7383",
                          "name": "super-light-red"
                        },
                        {
                          "color": "#F2495C",
                          "name": "light-red"
                        },
                        {
                          "color": "#E02F44",
                          "name": "red",
                          "primary": true
                        },
                        {
                          "color": "#C4162A",
                          "name": "semi-dark-red"
                        },
                        {
                          "color": "#AD0317",
                          "name": "dark-red"
                        }
                      ]
                    },
                    {
                      "name": "orange",
                      "shades": [
                        {
                          "color": "#FFB357",
                          "name": "super-light-orange",
                          "aliases": []
                        },
                        {
                          "color": "#FF9830",
                          "name": "light-orange",
                          "aliases": []
                        },
                        {
                          "color": "#FF780A",
                          "name": "orange",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#FA6400",
                          "name": "semi-dark-orange",
                          "aliases": []
                        },
                        {
                          "color": "#E55400",
                          "name": "dark-orange",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "yellow",
                      "shades": [
                        {
                          "color": "#FFEE52",
                          "name": "super-light-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#FADE2A",
                          "name": "light-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#F2CC0C",
                          "name": "yellow",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#E0B400",
                          "name": "semi-dark-yellow",
                          "aliases": []
                        },
                        {
                          "color": "#CC9D00",
                          "name": "dark-yellow",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "green",
                      "shades": [
                        {
                          "color": "#96D98D",
                          "name": "super-light-green",
                          "aliases": []
                        },
                        {
                          "color": "#73BF69",
                          "name": "light-green",
                          "aliases": []
                        },
                        {
                          "color": "#56A64B",
                          "name": "green",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#37872D",
                          "name": "semi-dark-green",
                          "aliases": []
                        },
                        {
                          "color": "#19730E",
                          "name": "dark-green",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "blue",
                      "shades": [
                        {
                          "color": "#8AB8FF",
                          "name": "super-light-blue",
                          "aliases": []
                        },
                        {
                          "color": "#5794F2",
                          "name": "light-blue",
                          "aliases": []
                        },
                        {
                          "color": "#3274D9",
                          "name": "blue",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#1F60C4",
                          "name": "semi-dark-blue",
                          "aliases": []
                        },
                        {
                          "color": "#1250B0",
                          "name": "dark-blue",
                          "aliases": []
                        }
                      ]
                    },
                    {
                      "name": "purple",
                      "shades": [
                        {
                          "color": "#CA95E5",
                          "name": "super-light-purple",
                          "aliases": []
                        },
                        {
                          "color": "#B877D9",
                          "name": "light-purple",
                          "aliases": []
                        },
                        {
                          "color": "#A352CC",
                          "name": "purple",
                          "aliases": [],
                          "primary": true
                        },
                        {
                          "color": "#8F3BB8",
                          "name": "semi-dark-purple",
                          "aliases": []
                        },
                        {
                          "color": "#7C2EA3",
                          "name": "dark-purple",
                          "aliases": []
                        }
                      ]
                    }
                  ],
                  "palette": [
                    "green",
                    "semi-dark-yellow",
                    "light-blue",
                    "semi-dark-orange",
                    "red",
                    "blue",
                    "purple",
                    "#705DA0",
                    "dark-green",
                    "yellow",
                    "#447EBC",
                    "#C15C17",
                    "#890F02",
                    "#0A437C",
                    "#6D1F62",
                    "#584477",
                    "#B7DBAB",
                    "#F4D598",
                    "#70DBED",
                    "#F9BA8F",
                    "#F29191",
                    "#82B5D8",
                    "#E5A8E2",
                    "#AEA2E0",
                    "#629E51",
                    "#E5AC0E",
                    "#64B0C8",
                    "#E0752D",
                    "#BF1B00",
                    "#0A50A1",
                    "#962D82",
                    "#614D93",
                    "#9AC48A",
                    "#F2C96D",
                    "#65C5DB",
                    "#F9934E",
                    "#EA6460",
                    "#5195CE",
                    "#D683CE",
                    "#806EB7",
                    "#3F6833",
                    "#967302",
                    "#2F575E",
                    "#99440A",
                    "#58140C",
                    "#052B51",
                    "#511749",
                    "#3F2B5B",
                    "#E0F9D7",
                    "#FCEACA",
                    "#CFFAFF",
                    "#F9E2D2",
                    "#FCE2DE",
                    "#BADFF4",
                    "#F9D9F9",
                    "#DEDAF7"
                  ]
                },
                "zIndex": {
                  "activePanel": 999,
                  "navbarFixed": 1000,
                  "sidemenu": 1020,
                  "dropdown": 1030,
                  "typeahead": 1030,
                  "tooltip": 1040,
                  "modalBackdrop": 1050,
                  "modal": 1060,
                  "portal": 1061
                },
                "flags": {},
                "v1": {
                  "name": "Light",
                  "typography": {
                    "fontFamily": {
                      "sansSerif": "'Inter', 'Helvetica', 'Arial', sans-serif",
                      "monospace": "'Roboto Mono', monospace"
                    },
                    "size": {
                      "base": "14px",
                      "xs": "10px",
                      "sm": "12px",
                      "md": "14px",
                      "lg": "18px"
                    },
                    "heading": {
                      "h1": "2rem",
                      "h2": "1.7142857142857142rem",
                      "h3": "1.5714285714285714rem",
                      "h4": "1.2857142857142858rem",
                      "h5": "1.1428571428571428rem",
                      "h6": "1rem"
                    },
                    "weight": {
                      "light": 300,
                      "regular": 400,
                      "semibold": 500,
                      "bold": 500
                    },
                    "lineHeight": {
                      "xs": 1.5,
                      "sm": 1.5,
                      "md": 1.5714285714285714,
                      "lg": 1.1666666666666667
                    },
                    "link": {
                      "decoration": "none",
                      "hoverDecoration": "none"
                    }
                  },
                  "breakpoints": {
                    "xs": "0px",
                    "sm": "544px",
                    "md": "769px",
                    "lg": "992px",
                    "xl": "1200px",
                    "xxl": "1440px"
                  },
                  "spacing": {
                    "base": 8,
                    "insetSquishMd": "4px 8px",
                    "d": "16px",
                    "xxs": "2px",
                    "xs": "4px",
                    "sm": "8px",
                    "md": "16px",
                    "lg": "24px",
                    "xl": "32px",
                    "gutter": "32px",
                    "formSpacingBase": 8,
                    "formMargin": "32px",
                    "formFieldsetMargin": "16px",
                    "formInputHeight": 32,
                    "formButtonHeight": 32,
                    "formInputPaddingHorizontal": "8px",
                    "formInputAffixPaddingHorizontal": "4px",
                    "formInputMargin": "16px",
                    "formLabelPadding": "0 0 0 2px",
                    "formLabelMargin": "0 0 4px 0",
                    "formValidationMessagePadding": "4px 8px",
                    "formValidationMessageMargin": "4px 0 0 0",
                    "inlineFormMargin": "4px"
                  },
                  "border": {
                    "radius": {
                      "sm": "2px",
                      "md": "4px",
                      "lg": "6px"
                    },
                    "width": {
                      "sm": "1px"
                    }
                  },
                  "height": {
                    "sm": 24,
                    "md": 32,
                    "lg": 48
                  },
                  "panelPadding": 8,
                  "panelHeaderHeight": 32,
                  "zIndex": {
                    "activePanel": 999,
                    "navbarFixed": 1000,
                    "sidemenu": 1020,
                    "dropdown": 1030,
                    "typeahead": 1030,
                    "tooltip": 1040,
                    "modalBackdrop": 1050,
                    "modal": 1060,
                    "portal": 1061
                  },
                  "type": "light",
                  "isDark": false,
                  "isLight": true,
                  "palette": {
                    "gray98": "#f7f8fa",
                    "gray97": "#f1f5f9",
                    "gray95": "#e9edf2",
                    "gray90": "#dce1e6",
                    "gray85": "#c7d0d9",
                    "gray70": "#9fa7b3",
                    "gray60": "#7b8087",
                    "gray33": "#464c54",
                    "gray25": "#2c3235",
                    "gray15": "#202226",
                    "gray10": "#141619",
                    "gray05": "#0b0c0e",
                    "blue95": "#5794f2",
                    "blue85": "#33a2e5",
                    "blue80": "#3274d9",
                    "blue77": "#1f60c4",
                    "red88": "#e02f44",
                    "black": "#000000",
                    "white": "#ffffff",
                    "dark1": "#141414",
                    "dark2": "#161719",
                    "dark3": "#1f1f20",
                    "dark4": "#212124",
                    "dark5": "#222426",
                    "dark6": "#262628",
                    "dark7": "#292a2d",
                    "dark8": "#2f2f32",
                    "dark9": "#343436",
                    "dark10": "#424345",
                    "gray1": "#555555",
                    "gray2": "#8e8e8e",
                    "gray3": "#b3b3b3",
                    "gray4": "#d8d9da",
                    "gray5": "#ececec",
                    "gray6": "#f4f5f8",
                    "gray7": "#fbfbfb",
                    "redBase": "#e02f44",
                    "redShade": "#c4162a",
                    "greenBase": "#299c46",
                    "greenShade": "#23843b",
                    "red": "#d44a3a",
                    "yellow": "#ecbb13",
                    "purple": "#9933cc",
                    "variable": "#32d1df",
                    "orange": "#eb7b18",
                    "orangeDark": "#ff780a",
                    "brandPrimary": "#eb7b18",
                    "brandSuccess": "#1b855e",
                    "brandWarning": "#ff9900",
                    "brandDanger": "#e0226e",
                    "queryRed": "#cf0e5B",
                    "queryGreen": "#0a764e",
                    "queryPurple": "#fe85fc",
                    "queryOrange": "#eb7b18",
                    "online": "#1b855e",
                    "warn": "#1b855e",
                    "critical": "#1b855e"
                  },
                  "colors": {
                    "bg1": "#ffffff",
                    "bg2": "#f4f5f5",
                    "bg3": "rgba(36, 41, 46, 0.12)",
                    "dashboardBg": "#f4f5f5",
                    "bgBlue1": "#3871dc",
                    "bgBlue2": "rgb(44, 90, 176)",
                    "border1": "rgba(36, 41, 46, 0.12)",
                    "border2": "rgba(36, 41, 46, 0.3)",
                    "border3": "rgba(36, 41, 46, 0.4)",
                    "formLabel": "rgba(36, 41, 46, 1)",
                    "formDescription": "rgba(36, 41, 46, 0.75)",
                    "formInputBg": "#ffffff",
                    "formInputBgDisabled": "rgba(36, 41, 46, 0.04)",
                    "formInputBorder": "rgba(36, 41, 46, 0.3)",
                    "formInputBorderHover": "rgba(36, 41, 46, 0.4)",
                    "formInputBorderActive": "#1f62e0",
                    "formInputBorderInvalid": "#cf0e5B",
                    "formInputPlaceholderText": "rgba(36, 41, 46, 0.64)",
                    "formInputText": "rgba(36, 41, 46, 1)",
                    "formInputDisabledText": "rgba(36, 41, 46, 0.64)",
                    "formFocusOutline": "#3871dc",
                    "formValidationMessageText": "#ffffff",
                    "formValidationMessageBg": "#e0226e",
                    "textStrong": "#000000",
                    "textHeading": "rgba(36, 41, 46, 1)",
                    "text": "rgba(36, 41, 46, 1)",
                    "textSemiWeak": "rgba(36, 41, 46, 0.75)",
                    "textWeak": "rgba(36, 41, 46, 0.75)",
                    "textFaint": "rgba(36, 41, 46, 0.64)",
                    "textBlue": "#1f62e0",
                    "bodyBg": "#f4f5f5",
                    "panelBg": "#ffffff",
                    "panelBorder": "rgba(36, 41, 46, 0.12)",
                    "pageHeaderBg": "#f4f5f5",
                    "pageHeaderBorder": "#f4f5f5",
                    "dropdownBg": "#ffffff",
                    "dropdownShadow": "#000000",
                    "dropdownOptionHoverBg": "#f4f5f5",
                    "link": "rgba(36, 41, 46, 1)",
                    "linkDisabled": "rgba(36, 41, 46, 0.64)",
                    "linkHover": "#000000",
                    "linkExternal": "#1f62e0"
                  },
                  "shadows": {
                    "listItem": "none"
                  },
                  "visualization": {
                    "hues": [
                      {
                        "name": "red",
                        "shades": [
                          {
                            "color": "#FF7383",
                            "name": "super-light-red"
                          },
                          {
                            "color": "#F2495C",
                            "name": "light-red"
                          },
                          {
                            "color": "#E02F44",
                            "name": "red",
                            "primary": true
                          },
                          {
                            "color": "#C4162A",
                            "name": "semi-dark-red"
                          },
                          {
                            "color": "#AD0317",
                            "name": "dark-red"
                          }
                        ]
                      },
                      {
                        "name": "orange",
                        "shades": [
                          {
                            "color": "#FFB357",
                            "name": "super-light-orange",
                            "aliases": []
                          },
                          {
                            "color": "#FF9830",
                            "name": "light-orange",
                            "aliases": []
                          },
                          {
                            "color": "#FF780A",
                            "name": "orange",
                            "aliases": [],
                            "primary": true
                          },
                          {
                            "color": "#FA6400",
                            "name": "semi-dark-orange",
                            "aliases": []
                          },
                          {
                            "color": "#E55400",
                            "name": "dark-orange",
                            "aliases": []
                          }
                        ]
                      },
                      {
                        "name": "yellow",
                        "shades": [
                          {
                            "color": "#FFEE52",
                            "name": "super-light-yellow",
                            "aliases": []
                          },
                          {
                            "color": "#FADE2A",
                            "name": "light-yellow",
                            "aliases": []
                          },
                          {
                            "color": "#F2CC0C",
                            "name": "yellow",
                            "aliases": [],
                            "primary": true
                          },
                          {
                            "color": "#E0B400",
                            "name": "semi-dark-yellow",
                            "aliases": []
                          },
                          {
                            "color": "#CC9D00",
                            "name": "dark-yellow",
                            "aliases": []
                          }
                        ]
                      },
                      {
                        "name": "green",
                        "shades": [
                          {
                            "color": "#96D98D",
                            "name": "super-light-green",
                            "aliases": []
                          },
                          {
                            "color": "#73BF69",
                            "name": "light-green",
                            "aliases": []
                          },
                          {
                            "color": "#56A64B",
                            "name": "green",
                            "aliases": [],
                            "primary": true
                          },
                          {
                            "color": "#37872D",
                            "name": "semi-dark-green",
                            "aliases": []
                          },
                          {
                            "color": "#19730E",
                            "name": "dark-green",
                            "aliases": []
                          }
                        ]
                      },
                      {
                        "name": "blue",
                        "shades": [
                          {
                            "color": "#8AB8FF",
                            "name": "super-light-blue",
                            "aliases": []
                          },
                          {
                            "color": "#5794F2",
                            "name": "light-blue",
                            "aliases": []
                          },
                          {
                            "color": "#3274D9",
                            "name": "blue",
                            "aliases": [],
                            "primary": true
                          },
                          {
                            "color": "#1F60C4",
                            "name": "semi-dark-blue",
                            "aliases": []
                          },
                          {
                            "color": "#1250B0",
                            "name": "dark-blue",
                            "aliases": []
                          }
                        ]
                      },
                      {
                        "name": "purple",
                        "shades": [
                          {
                            "color": "#CA95E5",
                            "name": "super-light-purple",
                            "aliases": []
                          },
                          {
                            "color": "#B877D9",
                            "name": "light-purple",
                            "aliases": []
                          },
                          {
                            "color": "#A352CC",
                            "name": "purple",
                            "aliases": [],
                            "primary": true
                          },
                          {
                            "color": "#8F3BB8",
                            "name": "semi-dark-purple",
                            "aliases": []
                          },
                          {
                            "color": "#7C2EA3",
                            "name": "dark-purple",
                            "aliases": []
                          }
                        ]
                      }
                    ],
                    "palette": [
                      "green",
                      "semi-dark-yellow",
                      "light-blue",
                      "semi-dark-orange",
                      "red",
                      "blue",
                      "purple",
                      "#705DA0",
                      "dark-green",
                      "yellow",
                      "#447EBC",
                      "#C15C17",
                      "#890F02",
                      "#0A437C",
                      "#6D1F62",
                      "#584477",
                      "#B7DBAB",
                      "#F4D598",
                      "#70DBED",
                      "#F9BA8F",
                      "#F29191",
                      "#82B5D8",
                      "#E5A8E2",
                      "#AEA2E0",
                      "#629E51",
                      "#E5AC0E",
                      "#64B0C8",
                      "#E0752D",
                      "#BF1B00",
                      "#0A50A1",
                      "#962D82",
                      "#614D93",
                      "#9AC48A",
                      "#F2C96D",
                      "#65C5DB",
                      "#F9934E",
                      "#EA6460",
                      "#5195CE",
                      "#D683CE",
                      "#806EB7",
                      "#3F6833",
                      "#967302",
                      "#2F575E",
                      "#99440A",
                      "#58140C",
                      "#052B51",
                      "#511749",
                      "#3F2B5B",
                      "#E0F9D7",
                      "#FCEACA",
                      "#CFFAFF",
                      "#F9E2D2",
                      "#FCE2DE",
                      "#BADFF4",
                      "#F9D9F9",
                      "#DEDAF7"
                    ]
                  }
                }
              },

              "hideFromList": false,
              "sort": 100,
              "skipDataQuery": false,
              "state": "",
              "baseUrl": "public/app/plugins/panel/xychart",
              "signature": "internal",
              "module": "core:plugin/xychart",
              "angular": {
                "detected": false,
                "hideDeprecation": false
              },
              "loadingStrategy": "script"
            }
          },


          feedbackLinksEnabled: true,
          geomapDisableCustomBaseLayer: false,
          googleAnalytics4Id: "",
          googleAnalyticsId: "",
          grafanaJavascriptAgent: {
            enabled: false,
            customEndpoint: "/log-grafana-javascript-agent",
            allInstrumentationEnabeld: false,
            errorInstrumentalizationEnabled: true,
            consoleInstrumentalizationEnabled: false,
          },
          helpEnabled: true,
          http2Enabled: false,
          jwtHeaderName: "",
          jwtUrlLogin: false,
          ldapEnabled: false,
        },
      },
    },
  },
};
