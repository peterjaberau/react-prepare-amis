import { DataSourceJsonData } from '@data/index';

import { GrafanaPyroscopeDataQuery, PyroscopeQueryType } from './dataquery';

export interface Query extends GrafanaPyroscopeDataQuery {
  queryType: PyroscopeQueryType;
}

export interface ProfileTypeMessage {
  id: string;
  label: string;
}

/**
 * These are options configured for each DataSource instance.
 */
export interface PyroscopeDataSourceOptions extends DataSourceJsonData {
  minStep?: string;
}

export type ProfileTypeQuery = {
  type: 'profileType';
  refId: string;
};

export type LabelQuery = {
  type: 'label';
  profileTypeId?: string;
  refId: string;
};

export type LabelValueQuery = {
  type: 'labelValue';
  profileTypeId?: string;
  labelName?: string;
  refId: string;
};

export type VariableQuery = ProfileTypeQuery | LabelQuery | LabelValueQuery;
