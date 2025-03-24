import { index, layout, prefix, route } from "@react-router/dev/routes";

const file_path = (...args: string[]) =>
  "app/public/modules/" + args.join("/") + "/index.tsx";

export const publicRoutes = [
  route("/", "app/public/modules/home/route.ts"),
  layout("app/public/layout/index.tsx", [
    ...prefix(":lang?/", [
      index(file_path("index")),

      ...prefix("demo-list", [
        index(file_path("demo-list")),
        route(":id", file_path("demo-detail")),
      ]),

      route("demo", file_path("demo")),
    ]),

  ]),
  // any
  route("*", file_path("any")),



  // old
  // index("routes/index.tsx"),

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


]),
];
