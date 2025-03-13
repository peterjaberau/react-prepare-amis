

import * as common from '@schema';

export const pluginVersion = "%VERSION%";

export type ParcaQueryType = ('metrics' | 'profile' | 'both');

export const defaultParcaQueryType: ParcaQueryType = 'both';

export interface ParcaDataQuery extends common.DataQuery {
  /**
   * Specifies the query label selectors.
   */
  labelSelector: string;
  /**
   * Specifies the type of profile to query.
   */
  profileTypeId: string;
}

export const defaultParcaDataQuery: Partial<ParcaDataQuery> = {
  labelSelector: '{}',
};
