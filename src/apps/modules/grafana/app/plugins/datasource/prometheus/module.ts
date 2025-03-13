import { DataSourcePlugin } from '@data/index';
import { PrometheusDatasource, PromQueryEditorByApp, PromCheatSheet } from '@grafana/prometheus';

import { ConfigEditor } from './configuration/ConfigEditorPackage';

export const plugin = new DataSourcePlugin(PrometheusDatasource)
  .setQueryEditor(PromQueryEditorByApp)
  .setConfigEditor(ConfigEditor)
  .setQueryEditorHelp(PromCheatSheet);
