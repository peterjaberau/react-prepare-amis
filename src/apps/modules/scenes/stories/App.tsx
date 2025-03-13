import React, { useContext } from 'react';
import { AppPlugin, AppRootProps } from "@data/index";
import { SceneAppDemo } from './SceneAppDemo';
import { AppConfig } from './AppConfig';


export const PluginPropsContext = React.createContext<AppRootProps | null>(null);

export const usePluginProps = () => {
  const pluginProps = useContext(PluginPropsContext);
  return pluginProps;
};

export const usePluginMeta = () => {
  const pluginProps = usePluginProps();

  return pluginProps?.meta;
};



export const App = () => {
  const pluginProps = usePluginProps();

  console.log('pluginProps', pluginProps);

  return (
    <PluginPropsContext.Provider value={pluginProps}>
      <SceneAppDemo />
    </PluginPropsContext.Provider>
  );
}
