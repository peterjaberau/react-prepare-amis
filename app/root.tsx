import type { LinksFunction } from "react-router";
import { RootRoute } from "~/app/modules/root/route";
import global from "@/styles/global.css?url";
import npStyle from "nprogress/nprogress.css?url";
import tailwind from "@/styles/tailwind.css?url";
export { loader } from "~/app/modules/root/loader";
export { ErrorBoundary } from "~/app/modules/root/error-boundary";


export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: global },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: npStyle },
];

export default function Root() {
  return <RootRoute />;
}
