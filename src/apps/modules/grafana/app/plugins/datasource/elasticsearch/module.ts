import { DashboardLoadedEvent, DataSourcePlugin } from '@data/index';
import { getAppEvents } from '@runtime/index';

import { QueryEditor } from './components/QueryEditor';
import { ConfigEditor } from './configuration/ConfigEditor';
import { ElasticDatasource } from './datasource';
import { onDashboardLoadedHandler } from './tracking';
import { ElasticsearchQuery } from './types';

export const plugin = new DataSourcePlugin(ElasticDatasource).setQueryEditor(QueryEditor).setConfigEditor(ConfigEditor);

// Subscribe to on dashboard loaded event so that we can track plugin adoption
getAppEvents().subscribe<DashboardLoadedEvent<ElasticsearchQuery>>(DashboardLoadedEvent, onDashboardLoadedHandler);
