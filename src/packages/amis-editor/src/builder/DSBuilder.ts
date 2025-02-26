/**
 * @file DSBuilder.ts
 * @desc Data source configuration builder
 */

import {EditorManager} from 'amis-editor-core';
import {getFeatValueByKey, getFeatLabelByKey} from './utils';

import type {EditorNodeType} from 'amis-editor-core';
import type {
  DSFeatureType,
  GenericSchema,
  CRUDScaffoldConfig,
  FormScaffoldConfig
} from './type';

export interface DSBuilderBaseOptions {
  /** Renderer type */
  renderer: string;
  /** Form application scenario*/
  feat?: DSFeatureType;
  /**CRUD application scenario*/
  feats?: DSFeatureType[];
  /** Schema of the current component */
  schema?: GenericSchema;
  /**Data source field name*/
  sourceKey?: string;
  /** Is it in scaffolding environment? */
  inScaffold?: boolean;
  /** If it is a list container, the corresponding node will be returned*/
  scopeNode?: EditorNodeType;
  /** Data source control configuration items*/
  sourceSettings?: Record<string, any>;
  /** Field control configuration items*/
  fieldSettings?: Record<string, any>;
  [propName: string]: any;
}

export interface DSBuilderInterface<
  T extends DSBuilderBaseOptions = DSBuilderBaseOptions
> {
  /** Chinese name of the data source, mainly used for front-end display*/
  readonly name: string;

  /** Constructor sorting weight, the smaller the number, the higher the ranking, negative numbers are supported*/
  readonly order: number;

  /** Functional scenarios supported by the data source*/
  readonly features: DSFeatureType[];

  /** Is it default? */
  isDefault?: boolean;

  /** Get the key of the data source */
  key: string;

  /** Is it disabled? */
  disabledOn?: () => boolean;

  /** Get the value of the functional scenario */
  getFeatValueByKey(feat: DSFeatureType): string;

  /** Get the label of the functional scene */
  getFeatLabelByKey(feat: DSFeatureType): string;

  /** Filter by functional scenario*/
  filterByFeat(feat: any): boolean;

  /** According to the schema, determine whether it matches the current data source*/
  match(schema?: any, key?: string): boolean;

  /** Fields used in the current context */
  getContextFields(options: T): Promise<any>;

  /** Fields available in the current context */
  getAvailableContextFields(
    options: Omit<T, 'renderer'>,
    target: EditorNodeType
  ): Promise<any>;

  /** Get CRUD list fields */
  getCRUDListFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** Get CRUD simple query fields */
  getCRUDSimpleQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** Build a simple query form item */
  buildSimpleQueryCollectionSchema?: (
    options: T
  ) => Promise<GenericSchema[] | undefined>;

  /** Get CRUD advanced query fields*/
  getCRUDAdvancedQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /** Build advanced queries */
  buildAdvancedQuerySchema?: (options: T) => Promise<GenericSchema | undefined>;

  /** Get CRUD fuzzy query fields*/
  getCRUDFuzzyQueryFields?: <F extends Record<string, any>>(
    options: T
  ) => Promise<F[]>;

  /**Build fuzzy query*/
  buildFuzzyQuerySchema?: (options: T) => Promise<GenericSchema | undefined>;

  /** Construct a visual configuration form for the data source*/
  makeSourceSettingForm(options: T): any[];

  /** Construct a visual configuration form for the data source field*/
  makeFieldsSettingForm(options: T): any[];

  /**Create new data*/
  buildInsertSchema(options: T, componentId?: string): Promise<any>;

  /** Edit data */
  buildEditSchema(options: T, componentId?: string): Promise<any>;

  /** Batch edit data */
  buildBulkEditSchema(options: T, componentId?: string): Promise<any>;

  /** View detailed data */
  buildViewSchema(options: T, componentId?: string): Promise<any>;

  /** Delete data */
  buildCRUDDeleteSchema(options: T, componentId?: string): Promise<any>;

  /** Batch delete data */
  buildCRUDBulkDeleteSchema(options: T, componentId?: string): Promise<any>;

  /** Build the top toolbar for CRUD */
  buildCRUDHeaderToolbar?: (
    options: T,
    componentId?: string
  ) => Promise<GenericSchema>;

  /** Table header query*/
  buildCRUDFilterSchema(options: T, componentId?: string): Promise<any>;

  /** Single column of table*/
  buildCRUDColumn?: (
    field: Record<string, any>,
    options: T,
    componentId?: string
  ) => Promise<any>;

  /** Table operation column */
  buildCRUDOpColumn?: (options: T, componentId?: string) => Promise<any>;

  /** Table columns */
  buildCRUDColumnsSchema(options: T, componentId?: string): Promise<any>;

  /**Table construction*/
  buildCRUDSchema(options: T): Promise<any>;

  /** Form construction */
  buildFormSchema(options: T): Promise<any>;

  /** Restore CRUD scaffolding configuration based on schema*/
  guessCRUDScaffoldConfig<T extends CRUDScaffoldConfig<any, any>>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }): Promise<T> | T;

  /** Restore Form scaffolding configuration based on schema*/
  guessFormScaffoldConfig<T extends FormScaffoldConfig<any, any>>(options: {
    schema: GenericSchema;
    [propName: string]: any;
  }): Promise<T> | T;

  /** Rebuild API configuration */
  buildApiSchema(options: T): Promise<any>;
}

export abstract class DSBuilder<T extends DSBuilderBaseOptions>
  implements DSBuilderInterface<T>
{
  static key: string;
  readonly name: string;
  readonly order: number;
  /** Is it default? */
  readonly isDefault?: boolean;

  features: DSFeatureType[];

  constructor(readonly manager: EditorManager) {}

  /** Get the key of the data source */
  get key() {
    return (this.constructor as typeof DSBuilder<T>).key;
  }

  /** Get the value of the functional scenario */
  getFeatValueByKey(feat: DSFeatureType) {
    return getFeatValueByKey(feat);
  }

  /** Get the label of the functional scene */
  getFeatLabelByKey(feat: DSFeatureType) {
    return getFeatLabelByKey(feat);
  }

  filterByFeat(feat: any) {
    return feat && this.features.includes(feat);
  }

  abstract match(schema?: any, key?: string): boolean;

  abstract getContextFields(options: T): Promise<any>;

  abstract getAvailableContextFields(
    options: Omit<T, 'renderer'>,
    target: EditorNodeType
  ): Promise<any>;

  abstract makeSourceSettingForm(options: T): any[];

  abstract makeFieldsSettingForm(options: T): any[];

  /**Create new data*/
  abstract buildInsertSchema(options: T): Promise<any>;

  /** View detailed data */
  abstract buildViewSchema(options: T): Promise<any>;

  /** Edit data */
  abstract buildEditSchema(options: T): Promise<any>;

  /** Batch edit data */
  abstract buildBulkEditSchema(options: T): Promise<any>;

  /** Delete data */
  abstract buildCRUDDeleteSchema(options: T): Promise<any>;

  /** Batch delete data */
  abstract buildCRUDBulkDeleteSchema(options: T): Promise<any>;

  /** Table header query*/
  abstract buildCRUDFilterSchema(options: T): Promise<any>;

  /** Table columns */
  abstract buildCRUDColumnsSchema(options: T): Promise<any>;

  /** sheet*/
  abstract buildCRUDSchema(options: T): Promise<any>;

  /** Form */
  abstract buildFormSchema(options: T): Promise<any>;

  /** Restore CRUD scaffolding configuration based on schema*/
  abstract guessCRUDScaffoldConfig<
    T extends CRUDScaffoldConfig<any, any>
  >(options: {schema: GenericSchema; [propName: string]: any}): Promise<T> | T;

  /** Restore Form scaffolding configuration based on schema*/
  abstract guessFormScaffoldConfig<
    T extends FormScaffoldConfig<any, any>
  >(options: {schema: GenericSchema; [propName: string]: any}): Promise<T> | T;

  abstract buildApiSchema(options: T): Promise<any>;
}

export interface DSBuilderClass {
  new (manager: EditorManager): DSBuilderInterface;
  /** Data source type, in English, can overwrite the same name*/
  key: string;
}

export const builderFactory = new Map<string, DSBuilderClass>();

/** Register data source constructor */
export const registerDSBuilder = (klass: DSBuilderClass) => {
  if (builderFactory.has(klass.key)) {
    console.warn(
      `[amis-editor][DSBuilder] duplicate DSBuilder「${klass.key}」`
    );
  }

  /** Overwrite duplicate names*/
  builderFactory.set(klass.key, klass);
};
