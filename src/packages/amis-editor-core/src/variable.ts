/**
 * @file variable management
 * @desc is mainly used to manage variables injected outside the editor and for variable binding
 */

import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import reverse from 'lodash/reverse';
import pick from 'lodash/pick';
import {
  JSONSchema,
  DataSchema,
  mapTree,
  findTree,
  eachTree,
  DATASCHEMA_TYPE_MAP
} from '@/packages/amis-core/src';
import type {Option} from '@/packages/amis-core/src';

export interface VariableGroup {
  /** Variable namespace */
  name: string;
  /** Title display name */
  title: string;
  /* Parent node scope id */
  parentId: string;
  /** order*/
  order: number;
  /** Structure definition, the root node must be an object */
  schema: JSONSchema;
}

export interface VariableOptions {
  /** Triggered before the variable Schema is added to the Scope*/
  beforeScopeInsert?: (
    context: VariableManager,
    schema: JSONSchema
  ) => JSONSchema;
  /** Event: Triggered after the variable Schema is added to the Scope*/
  afterScopeInsert?: (context: VariableManager) => void;
  /** Triggered when obtaining the context data structure, you can customize the returned data structure*/
  onContextSchemaChange?: (
    context: VariableManager,
    schema: JSONSchema[]
  ) => JSONSchema[];
  /** Triggered when getting context data Options, you can customize the returned data structure*/
  onContextOptionChange?: (
    context: VariableManager,
    option: Option[],
    type: 'normal' | 'formula'
  ) => Option[];
}

export class VariableManager {
  /* List of variables */
  readonly variables: VariableGroup[];
  /* Context structure */
  readonly dataSchema: DataSchema;
  /* Variable management configuration */
  readonly options: VariableOptions;

  constructor(
    dataSchema: DataSchema | undefined,
    variables: VariableGroup[] | undefined,
    options: VariableOptions | undefined
  ) {
    this.variables = Array.isArray(variables)
      ? sortBy(cloneDeep(variables), [item => item.order ?? 1])
      : [];
    this.dataSchema =
      dataSchema instanceof DataSchema ? dataSchema : new DataSchema([]);
    this.options = pick(options, [
      'beforeScopeInsert',
      'afterScopeInsert',
      'onContextSchemaChange',
      'onContextOptionChange'
    ]);

    this.init();
  }

  /**
   * Initialize variables, the expected structure is similar to:
   * ——System variables (root)
   * └── Organization variables
   * └── Application variables
   * └── Page variables
   *       └── ...
   */
  init() {
    const variables = this.variables;
    const dataSchema = this.dataSchema;
    const {beforeScopeInsert, afterScopeInsert} = this.options ?? {};

    variables.forEach(item => {
      const {parentId, name: scopeName, title: tagName} = item;
      let schema = item.schema;

      if (!dataSchema.hasScope(parentId)) {
        return;
      }

      dataSchema.switchTo(parentId);

      if (dataSchema.hasScope(scopeName)) {
        dataSchema.removeScope(scopeName);
      }

      if (beforeScopeInsert && typeof beforeScopeInsert === 'function') {
        schema = beforeScopeInsert(this, schema);
      }

      /** Initialize variable Scope */
      dataSchema.addScope(
        {
          type: 'object',
          $id: scopeName,
          properties: {
            [scopeName]: {
              ...schema,
              title: tagName
            }
          }
        },
        scopeName
      );
      dataSchema.switchTo(scopeName);

      if (afterScopeInsert && typeof afterScopeInsert === 'function') {
        afterScopeInsert(this);
      }
    });

    dataSchema.switchToRoot();
  }

  /**
   * Get the context data structure of the external variable
   */
  getVariableContextSchema() {
    let variableSchemas: JSONSchema[] = [];
    const {onContextSchemaChange} = this.options ?? {};

    if (this.variables && this.variables?.length > 0) {
      variableSchemas = this.variables
        .map(item => {
          if (this.dataSchema.hasScope(item.name)) {
            const varScope = this.dataSchema.getScope(item.name);

            /** The scope of a variable has only one root node*/
            return varScope.schemas.length > 0 ? varScope.schemas[0] : null;
          }
          return null;
        })
        .filter((item): item is JSONSchema => item !== null);
    }

    if (onContextSchemaChange && typeof onContextSchemaChange === 'function') {
      variableSchemas = onContextSchemaChange(this, variableSchemas);
    }

    return variableSchemas;
  }

  /**
   * Get the Option structure of the variable in the formula editor
   */
  getVariableFormulaOptions(reverseOrder: boolean = false) {
    const {onContextOptionChange} = this.options ?? {};
    let options: Option[] = [];

    if (this.variables && this.variables?.length > 0) {
      this.variables.forEach(item => {
        if (this.dataSchema.hasScope(item.name)) {
          const varScope = this.dataSchema.getScope(item.name);
          const children = mapTree(varScope.getDataPropsAsOptions(), item => ({
            ...item,
            /** Tag will be assigned description by default, so it needs to be replaced here*/
            tag: DATASCHEMA_TYPE_MAP[item.type] ?? item.type
          }));

          if (varScope.tag) {
            options.push({label: varScope.tag, children});
          } else {
            options.push(...children);
          }
        }
      });
    }

    if (onContextOptionChange && typeof onContextOptionChange === 'function') {
      options = onContextOptionChange(this, options, 'formula');
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
    });

    return reverseOrder ? options : reverse(options);
  }

  /**
   * Get the general tree structure
   */
  getVariableOptions() {
    const {onContextOptionChange} = this.options ?? {};
    let options: Option[] =
      this.getVariableFormulaOptions(false)?.[0]?.children ?? [];

    options = mapTree(
      options,
      (item: Option, key: number, level: number, paths: Option[]) => {
        return {
          ...item,
          valueExpression:
            typeof item.value === 'string' && !item.value.startsWith('${')
              ? `\${${item.value}}`
              : item.value
        };
      }
    );

    if (onContextOptionChange && typeof onContextOptionChange === 'function') {
      options = onContextOptionChange(this, options, 'normal');
    }

    return options;
  }

  /**
   * Get the page variable tree structure
   * @returns
   */
  getPageVariablesOptions() {
    let options: Option[] = [];

    const rootScope = this.dataSchema?.root;
    if (rootScope) {
      options = rootScope
        .getDataPropsAsOptions()
        .filter((item: any) => ['__query', '__page'].includes(item.value));
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
    });
    return options;
  }

  /**
   * Get the variable name based on the variable path
   */
  getNameByPath(path: string, valueField = 'value', labelField = 'label') {
    if (!path || typeof path !== 'string') {
      return '';
    }

    const options = [
      ...this.getVariableOptions(),
      ...this.getPageVariablesOptions()
    ];
    const node = findTree(
      options,
      item => item[valueField ?? 'value'] === path
    );

    return node
      ? node[labelField ?? 'label'] ?? node[valueField ?? 'value'] ?? ''
      : '';
  }

  /**
   * Get the global variable tree structure
   * @returns
   */
  getGlobalVariablesOptions() {
    let options: Option[] = [];

    const rootScope = this.dataSchema?.root;
    if (rootScope) {
      options = rootScope
        .getDataPropsAsOptions()
        .filter((item: any) => ['global'].includes(item.value));
    }
    eachTree(options, item => {
      if (item.type === 'array') {
        delete item.children;
      }
    });
    return options;
  }
}
