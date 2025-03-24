import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useParams,
} from "react-router";
import { ClientOnly } from "~/components/common/client-only";
import { useChangeLanguage } from "remix-i18next/react";
import { EuiProvider, EuiThemeProvider } from "@elastic/eui";
import { ThemeProvider as GrafanaThemeProvider } from "~/providers/GrafanaThemeProvider";

export function RootRoute() {
  const params = useParams();
  const _data = useLoaderData();
  const { lang } = _data;

  useChangeLanguage(lang!);

  return (
    <html lang={params.lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <Meta />
        <Links />
      </head>
      <body>
        <ClientOnly fallback={<></>}>
          {() => (
            <>
              <EuiProvider>
                <EuiThemeProvider>
                  <GrafanaThemeProvider>
                  <Outlet />
                  </GrafanaThemeProvider>
                </EuiThemeProvider>
              </EuiProvider>
            </>
          )}
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
