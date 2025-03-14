import { DataSourceInstanceSettings, DataSourcePluginMeta } from '@data/index';

export function getDataSourceInstanceSetting(name: string, meta: DataSourcePluginMeta): DataSourceInstanceSettings {
  return {
    id: 1,
    uid: name,
    type: '',
    name,
    meta,
    access: 'proxy',
    jsonData: {},
    readOnly: false,
  };
}
