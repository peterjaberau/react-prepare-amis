/**
 * @file constants.ts
 * @desc CRUD configuration related constants
 */

import {DSFeatureEnum} from '../../builder/constants';

export const ToolsConfig = {
  groupName: 'tools',
  options: [
    {
      label: 'Add new record',
      value: 'Insert',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 10
    },
    {
      label: 'Batch Edit',
      value: 'BulkEdit',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 20
    },
    {
      label: 'Batch delete',
      value: 'BulkDelete',
      align: 'left',
      icon: 'fa fa-layer-group',
      order: 30
    }
  ]
};

export const FiltersConfig = {
  groupName: 'filters',
  options: [
    {
      label: 'Fuzzy Query',
      value: 'FuzzyQuery',
      icon: 'fa fa-search',
      order: 10
    },
    {
      label: 'Simple Query',
      value: 'SimpleQuery',
      icon: 'fa fa-search',
      order: 20
    },
    {
      label: 'Advanced Query',
      value: 'AdvancedQuery',
      icon: 'fa fa-search',
      order: 30
    }
  ]
};

export const OperatorsConfig = {
  groupName: 'operators',
  options: [
    {label: 'View details', value: 'View', icon: 'fa fa-database', order: 10},
    {label: 'Edit record', value: 'Edit', icon: 'fa fa-database', order: 20},
    {label: 'Delete record', value: 'Delete', icon: 'fa fa-database', order: 30}
  ]
};

/** The default maximum number of rows for table data display*/
export const DefaultMaxDisplayRows = 5;
