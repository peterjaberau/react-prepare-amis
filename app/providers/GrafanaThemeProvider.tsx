import * as React from 'react';
import { createTheme, ThemeContext } from "@data/index";
import { globalStore } from "~/store-provider";
import { useSelector } from "@xstate/store/react";


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const mode = useSelector(globalStore, (state) => state.context.grafanaTheme.colors.mode);


  const lightTheme = createTheme({ colors: { mode: mode } });
  return (
    <ThemeContext.Provider value={lightTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const provideTheme = <P extends {}>(component: React.ComponentType<P>) => {
  return function ThemeProviderWrapper(props: P) {
    return <ThemeProvider>{React.createElement(component, { ...props })}</ThemeProvider>;
  };
};
