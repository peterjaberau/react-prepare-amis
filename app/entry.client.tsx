import { I18nextProvider, i18next } from "~/shared/i18n/client";
import { startTransition, useState } from "react";

import { HydratedRouter } from "react-router/dom";
import { SettingContext } from "~/context";
import StoreProvider from "./store-provider";
import { hydrateRoot } from "react-dom/client";

const AppClient = () => {
  const [theme, setTheme] = useState({
    colorPrimary: "#00b96b",
  });
  const [lang, setLang] = useState("en-US");
  return (
    <StoreProvider>
      <SettingContext.Provider value={{ theme, setTheme, lang, setLang }}>
        <I18nextProvider i18n={i18next}>
          <HydratedRouter />
        </I18nextProvider>
      </SettingContext.Provider>
    </StoreProvider>
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
