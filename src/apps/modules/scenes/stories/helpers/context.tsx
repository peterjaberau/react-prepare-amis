import React from "react";


import { AppRootProps } from "@data/types/app.ts";
export const PluginPropsContext = React.createContext<AppRootProps | null>(null);
