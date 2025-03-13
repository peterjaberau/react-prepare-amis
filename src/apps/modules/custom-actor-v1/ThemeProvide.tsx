import { useEffect, useState } from 'react';
import * as React from 'react';
import { createTheme, ThemeContext } from "@data/index";


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const lightTheme = createTheme({ colors: { mode: 'light' } });
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
