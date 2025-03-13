import { DataSourcePlugin } from '@data/index';
import { PrometheusDatasource, PromQueryEditorByApp, PromCheatSheet } from '@prometheus/index';

import { ConfigEditor } from './configuration/ConfigEditorPackage';

export const plugin = new DataSourcePlugin(PrometheusDatasource)
  .setQueryEditor(PromQueryEditorByApp)
  .setConfigEditor(ConfigEditor)
  .setQueryEditorHelp(PromCheatSheet);
