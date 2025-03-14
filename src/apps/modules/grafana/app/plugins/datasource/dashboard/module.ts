import { DataSourcePlugin } from '@data/index';

import { DashboardQueryEditor } from './DashboardQueryEditor';
import { DashboardDatasource } from './datasource';

export const plugin = new DataSourcePlugin(DashboardDatasource).setQueryEditor(DashboardQueryEditor);
