/**
 * @file type.ts
 * @desc builder related statement
 */

import {DSFeature} from './constants';
import type {BaseApiObject} from '@/packages/amis-core/src';

export interface DSField {
  value: string;
  label: string;
  [propKey: string]: any;
}

/** Data source field collection*/
export interface DSFieldGroup {
  value: string;
  label: string;
  children: DSField[];
  [propKey: string]: any;
}

export type DSFeatureType = keyof typeof DSFeature;

export type GenericSchema = Record<string, any>;

export type DSRendererType = 'form' | 'crud' | 'service';

export interface ScaffoldField {
  /** Title */
  label: string;
  /** Field name */
  name: string;
  /** Display control type */
  displayType: string;
  /** Input control type */
  inputType: string;
  typeKey?: string;
  /** Is it enabled? */
  checked?: boolean;
}

/** Form operation */
export type ApiConfig = string | BaseApiObject;

/** Form operation */
export type FormOperatorValue = 'cancel' | 'reset' | 'submit';

/** Form action button */
export interface FormOperator {
  label: string;
  value: FormOperatorValue;
  order: number;
  schema: Record<string, any>;
}

export interface ScaffoldConfigBase {
  /** Data source type*/
  dsType: string;
  /** The original schema of the user when rebuilding */
  __pristineSchema?: Record<string, any>;
  [propName: string]: any;
}

export interface FormScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> extends ScaffoldConfigBase {
  /** Form function scenario*/
  feat?: DSFeatureType;
  /** Form initialization interface*/
  initApi?: API;
  insertApi?: API;
  editApi?: API;
  bulkEditApi?: API;
  insertFields?: Fields[];
  editFields?: Fields[];
  bulkEditFields?: Fields[];
  operators?: FormOperator[];
}

export interface CRUDScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> extends ScaffoldConfigBase {
  /** Toolbar */
  tools?: Extract<DSFeatureType, 'Insert' | 'BulkDelete' | 'BulkEdit'>[];
  /**Data operation*/
  operators?: Extract<DSFeatureType, 'View' | 'Edit' | 'Delete'>[];
  /** Conditional query*/
  filters?: Extract<
    DSFeatureType,
    'FuzzyQuery' | 'SimpleQuery' | 'AdvancedQuery'
  >[];
  /** Table list interface*/
  listApi?: API;
  viewApi?: API;
  editApi?: API;
  /** Initialization interface for editing form */
  initApi?: API;
  bulkEditApi?: API;
  deleteApi?: API;
  bulkDeleteApi?: API;
  insertApi?: API;
  listFields?: Fields[];
  insertFields?: Fields[];
  viewFields?: Fields[];
  editFields?: Fields[];
  bulkEditFields?: Fields[];
  fuzzyQueryFields?: Fields[];
  simpleQueryFields?: Fields[];
  advancedQueryFields?: Fields[];
  importFields?: Fields[];
  exportFields?: Fields[];
  /** Primary key for table scaffolding*/
  primaryField?: string;
}

export type ScaffoldConfig<
  Fields extends Record<string, any> = ScaffoldField,
  API extends any = ApiConfig
> = FormScaffoldConfig<Fields, API> | CRUDScaffoldConfig<Fields, API>;
