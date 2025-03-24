import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { renderToReadableStream, renderToString } from "react-dom/server";
import { isbot } from "isbot";
import "dotenv/config";
import { createRemixI18n } from "./shared/i18n/server";


export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  /****************************** I18N *****************************************/
  const { I18nextProvider, i18nInstance } = await createRemixI18n(request, routerContext);

  const bodyRenderer = await renderToReadableStream(
    <I18nextProvider i18n={i18nInstance as any}>
      <ServerRouter context={routerContext} url={request.url} />
    </I18nextProvider>,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );




  /*
  *****************************Bot Detection ****************************************
  */
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await bodyRenderer.allReady;
  }

  /*
  *****************************Response ****************************************
*/

  shellRendered = true;


  responseHeaders.set("Content-Type", "text/html");

  return new Response(bodyRenderer, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
