/**
 * @file constants.ts
 * @desc builder related constants
 */

import {FormOperatorValue, FormOperator} from './type';

/**
 * The operation required for the data source is currently because the schema comes from the backend
 */
export enum DSBehavior {
  /** Create operation */
  create = 'create',
  /** Query operation */
  view = 'view',
  /** Update operation */
  update = 'update',
  table = 'table',
  filter = 'filter'
}

/** Data granularity*/
export enum DSGrain {
  /**Entity*/
  entity = 'entity',
  /** Multiple data*/
  list = 'list',
  /** Single data*/
  piece = 'piece'
}

/** Functional scenarios used by data sources*/
export const DSFeature = {
  List: {
    value: 'list',
    label: 'list'
  },
  Insert: {
    value: 'insert',
    label: 'New'
  },
  View: {
    value: 'view',
    label: 'Details'
  },
  Edit: {
    value: 'edit',
    label: 'Edit'
  },
  Delete: {
    value: 'delete',
    label: 'Delete'
  },
  BulkEdit: {
    value: 'bulkEdit',
    label: 'Batch edit'
  },
  BulkDelete: {
    value: 'bulkDelete',
    label: 'Batch delete'
  },
  Import: {
    value: 'import',
    label: 'Import'
  },
  Export: {
    value: 'export',
    label: 'Export'
  },
  SimpleQuery: {
    value: 'simpleQuery',
    label: 'Simple query'
  },
  FuzzyQuery: {
    value: 'fuzzyQuery',
    label: 'Fuzzy query'
  },
  AdvancedQuery: {
    value: 'advancedQuery',
    label: 'Advanced Query'
  }
};

export enum DSFeatureEnum {
  List = 'List',
  Insert = 'Insert',
  View = 'View',
  Edit = 'Edit',
  Delete = 'Delete',
  BulkEdit = 'BulkEdit',
  BulkDelete = 'BulkDelete',
  Import = 'Import',
  Export = 'Export',
  SimpleQuery = 'SimpleQuery',
  FuzzyQuery = 'FuzzyQuery',
  AdvancedQuery = 'AdvancedQuery'
}

export const DSFeatureList = Object.keys(
  DSFeature
) as (keyof typeof DSFeature)[];

export const FormOperatorMap: Record<FormOperatorValue, FormOperator> = {
  cancel: {
    label: 'Cancel',
    value: 'cancel',
    order: 0,
    schema: {
      level: 'default'
    }
  },
  reset: {
    label: 'Reset',
    value: 'reset',
    order: 1,
    schema: {
      level: 'default'
    }
  },
  submit: {
    label: 'Submit',
    value: 'submit',
    order: 2,
    schema: {
      level: 'primary'
    }
  }
};

export const ModelDSBuilderKey = 'model-entity';

export const ApiDSBuilderKey = 'api';

export const ApiCenterDSBuilderKey = 'apicenter';
