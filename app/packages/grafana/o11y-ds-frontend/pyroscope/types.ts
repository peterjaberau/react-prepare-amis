import { DataSourceJsonData } from '@data/index';

import { GrafanaPyroscope, PyroscopeQueryType } from './dataquery.gen';

export interface ProfileTypeMessage {
  id: string;
  label: string;
}

export interface PyroscopeDataSourceOptions extends DataSourceJsonData {
  minStep?: string;
}

export interface Query extends GrafanaPyroscope {
  queryType: PyroscopeQueryType;
}
