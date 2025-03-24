import { I18nextProvider, i18next } from "~/shared/i18n/client";

import { HydratedRouter } from "react-router/dom";
import { globalStore } from "~/store-provider";
import { hydrateRoot } from "react-dom/client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { useSelector } from "@xstate/store/react";

const AppClient = () => {
  const theme = useSelector(globalStore, (state) => state.context.theme);
  const language = useSelector(
    globalStore,
    (state) => state.context.config.language,
  );

  useEffect(() => {
    globalStore.trigger.setTheme({
      colorPrimary: "#00b96b",
    });

    globalStore.trigger.setLanguage({
      language: "en-US",
    });
  }, []);

  return (

        <I18nextProvider i18n={i18next}>
          <HydratedRouter />
        </I18nextProvider>

  );
};

async function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      // @ts-ignore
      <AppClient />,
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
