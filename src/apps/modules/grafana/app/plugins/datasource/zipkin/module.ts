import { DataSourcePlugin } from '@data/index';

import { ConfigEditor } from './ConfigEditor';
import { ZipkinQueryField } from './QueryField';
import { ZipkinDatasource } from './datasource';

export const plugin = new DataSourcePlugin(ZipkinDatasource)
  .setQueryEditor(ZipkinQueryField)
  .setConfigEditor(ConfigEditor);
