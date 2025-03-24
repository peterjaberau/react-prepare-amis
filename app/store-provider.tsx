import { createStore } from "@xstate/store";
import { defaultConfig, defaultTheme } from "./store-mock";

export const globalStore = createStore({
  context: {
    config: {
      language: defaultConfig.language,
    },
    theme: defaultTheme.theme,
    grafanaTheme: {
      colors: {
        mode: "light",
      }
    }
  },
  on: {
    setLanguage: (context: any, event: any) => {
      context.config.language = event.language;
    },
    setTheme: (context: any, event: any) => {
      context.theme = event;
    },

    setGrafanaThemeMode: (context: any, event: any) => {
      context.grafanaTheme.colors.mode = event;
    }


  },
});
