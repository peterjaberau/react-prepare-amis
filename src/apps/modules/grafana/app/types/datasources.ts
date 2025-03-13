import { DataSourcePluginMeta, DataSourceSettings, LayoutMode } from '@data/index';
import { TestingStatus } from '@runtime/index';
import { GenericDataSourcePlugin } from 'app/features/datasources/types';

export interface DataSourcesState {
  dataSources: DataSourceSettings[];
  searchQuery: string;
  dataSourceTypeSearchQuery: string;
  layoutMode: LayoutMode;
  dataSourcesCount: number;
  dataSource: DataSourceSettings;
  dataSourceMeta: DataSourcePluginMeta;
  isLoadingDataSources: boolean;
  isLoadingDataSourcePlugins: boolean;
  plugins: DataSourcePluginMeta[];
  categories: DataSourcePluginCategory[];
  isSortAscending: boolean;
}

export interface DataSourceSettingsState {
  plugin?: GenericDataSourcePlugin | null;
  testingStatus?: TestingStatus;
  loadError?: string | null;
  loading: boolean;
}

export interface DataSourcePluginCategory {
  id: string;
  title: string;
  plugins: DataSourcePluginMeta[];
}
