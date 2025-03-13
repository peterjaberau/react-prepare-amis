import { useContext } from "react";

import { PluginPropsContext } from "./context";
export const usePluginProps = () => {
  const pluginProps = useContext(PluginPropsContext);
  return pluginProps;
};
