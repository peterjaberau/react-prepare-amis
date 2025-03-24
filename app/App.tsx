import { ThemeProvider as GrafanaThemeProvider } from "~/providers/GrafanaThemeProvider";
import { globalStore } from "~/store-provider";
import { useSelector } from "@xstate/store/react";

import { EuiProvider, EuiThemeProvider } from "@elastic/eui";
import Router from "~/router";
import cache from "~/cache/iconCache";
import { useEffect } from "react";

const App: React.FC = () => {
  const theme = useSelector(globalStore, (state) => state.context.theme);
  const language = useSelector(
    globalStore,
    (state) => state.context.config.language,
  );

  useEffect(() => {
    globalStore.trigger.setTheme({
      colorPrimary: "#00b96b",
    })
  }, []);



  return (
    <>
      {/*<I18nextProvider i18n={i18next}>*/}
        <EuiProvider cache={cache}>
          <GrafanaThemeProvider>
          <EuiThemeProvider>
            <Router />
          </EuiThemeProvider>
          </GrafanaThemeProvider>
        </EuiProvider>
      {/*</I18nextProvider>*/}
    </>
  );
};

export default App;
