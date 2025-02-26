import {JSONValueMap, findTree, resolveVariableAndFilter} from 'amis';
import {EditorManager, guid} from 'amis-editor-core';
import isString from 'lodash/isString';

/**
 * Layout configuration item, required for numerical setting
 */
export const isAuto = (value: any) => {
  if (value && isString(value) && /^((a)|(au)|(aut)|(auto))$/.test(value)) {
    return true;
  }
  return false;
};

/**
 * Used for list class MiscComponents to get edited value in filterProps
 */
export const resolveArrayDatasource = (
  {
    data,
    value,
    source
  }: {
    value?: any;
    data: any;
    source: string;
  },
  defaultSource: string = '$items'
) =>
  Array.isArray(value)
    ? value
    : // resolveVariable does not support the ${items} format, resulting in no data in the preview state
      resolveVariableAndFilter(
        typeof source === 'string' ? source : defaultSource,
        data,
        '| raw'
      );

export const schemaToArray = (value: any) => {
  return value && Array.isArray(value) ? value : [value];
};

export const schemaArrayFormat = (value: any) => {
  return value && Array.isArray(value) && value.length === 1 ? value[0] : value;
};

/**
 * Resolve option value type
 * @param options
 * @returns
 */
export const resolveOptionType = (schema: any = {}) => {
  const {options, valueField} = schema;
  if (!options) {
    return 'string';
  }

  // By default, options in options are of the same type
  let option = options[0];

  if (typeof option === 'object') {
    option = findTree(
      options,
      item => item[valueField || 'value'] !== undefined
    );
  }

  const value = option?.[valueField || 'value'] ?? option;

  return value !== undefined ? typeof value : 'string';
};

/**
 * Build selector event parameters
 * @param manager
 * @returns
 */
export const resolveOptionEventDataSchame = (
  manager: EditorManager,
  multiple?: boolean
) => {
  const schemas = manager.dataSchema.current.schemas;
  const node = manager.store.getNodeById(manager.store.activeId);
  const dataSchema = schemas.find(item => item.properties?.[node!.schema.name]);

  const itemSchema = {
    [node!.schema?.labelField || 'label']: {type: 'string', title: 'text'},
    [node!.schema?.valueField || 'value']: {
      type: resolveOptionType(node!.schema?.options),
      title: 'value'
    }
  };
  const isMultiple = multiple ?? node!.schema?.multiple;
  return {
    value: {
      type: 'string',
      ...((dataSchema?.properties?.[node!.schema.name] as any) ?? {}),
      title: 'Selected value'
    },
    selectedItems: isMultiple
      ? {
          type: 'array',
          title: 'Selected items',
          items: {
            type: 'object',
            title: 'Members',
            properties: itemSchema
          }
        }
      : {
          type: 'object',
          title: 'Selected items',
          properties: itemSchema
        },
    items: {
      type: 'array',
      title: 'Option list',
      items: {
        type: 'object',
        title: 'Members',
        properties: itemSchema
      }
    },
    itemSchema
  };
};

/**
 * Build input list event parameters
 * @param manager
 * @param multiple
 * @returns
 */
export const resolveInputTableEventDataSchame = (
  manager: EditorManager,
  multiple?: boolean
) => {
  const schemas = manager.dataSchema.current.schemas;
  const node = manager.store.getNodeById(manager.store.activeId);
  const dataSchema = schemas.find(item => item.properties?.[node!.schema.name]);
  const valDataSchema = dataSchema?.properties?.[node!.schema.name] as any;
  const isMultiple = multiple ?? node!.schema?.multiple;

  return {
    value: valDataSchema ?? {},
    item: isMultiple ? valDataSchema.items : valDataSchema ?? {}
  };
};

export const OPTION_EDIT_EVENTS = [
  {
    eventName: 'addConfirm',
    eventLabel: 'Confirm to add',
    description: 'Triggered when adding submission',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);

      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                item: {
                  type: 'object',
                  title: 'Added option',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  },
  {
    eventName: 'editConfirm',
    eventLabel: 'Confirm edit',
    description: 'Triggered when editing is submitted',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);

      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                item: {
                  type: 'object',
                  title: 'Edit options',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  },
  {
    eventName: 'deleteConfirm',
    eventLabel: 'Confirm deletion',
    description: 'Triggered when a commit is deleted',
    dataSchema: (manager: EditorManager) => {
      const {value, items, itemSchema} = resolveOptionEventDataSchame(manager);
      return [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                item: {
                  type: 'object',
                  title: 'Delete option',
                  properties: itemSchema
                },
                value,
                items
              }
            }
          }
        }
      ];
    }
  }
];
export const OPTION_EDIT_EVENTS_OLD = (schema: any) => {
  let events = [];
  if (schema?.onEvent?.add) {
    events.push({
      eventName: 'add',
      eventLabel: 'Confirm addition (not recommended)',
      description: 'Triggered when adding submission',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                value: {
                  type: 'object',
                  title: 'Newly added node information'
                },
                items: {
                  type: 'array',
                  title: 'Option collection'
                }
              }
            }
          }
        }
      ]
    });
  }

  if (schema?.onEvent?.edit) {
    events.push({
      eventName: 'edit',
      eventLabel: 'Confirm edit (not recommended)',
      description: 'Triggered when editing submission',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                value: {
                  type: 'object',
                  title: 'Edited node information'
                },
                items: {
                  type: 'array',
                  title: 'Option collection'
                }
              }
            }
          }
        }
      ]
    });
  }

  if (schema?.onEvent?.delete) {
    events.push({
      eventName: 'delete',
      eventLabel: 'Confirm deletion (not recommended)',
      description: 'Triggered when deletion is submitted',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                value: {
                  type: 'object',
                  title: 'Deleted node information'
                },
                items: {
                  type: 'array',
                  title: 'Option collection'
                }
              }
            }
          }
        }
      ]
    });
  }

  return events;
};

export const TREE_BASE_EVENTS = (schema: any) => {
  let events = [
    {
      eventName: 'change',
      eventLabel: 'Value change',
      description: 'Triggered when the selected value changes',
      dataSchema: (manager: EditorManager) => {
        const {value, items, itemSchema} =
          resolveOptionEventDataSchame(manager);
        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Content',
                properties: {
                  value,
                  item: {
                    type: 'object',
                    title: 'Selected item',
                    properties: itemSchema
                  },
                  items,
                  selectedItems: {
                    type: 'array',
                    title: 'Selected item collection',
                    items: {
                      type: 'object'
                    }
                  }
                }
              }
            }
          }
        ];
      }
    },
    {
      eventName: 'itemClick',
      eventLabel: 'Node click',
      description: 'Click node to trigger',
      dataSchema: (manager: EditorManager) => {
        const {itemSchema} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Content',
                properties: {
                  item: {
                    type: 'object',
                    title: 'Clicked option',
                    properties: itemSchema
                  }
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS,
    {
      eventName: 'deferLoadFinished',
      eventLabel: 'Lazy loading completed',
      description:
        'Triggered when lazy loading interface remote request succeeds',
      dataSchema: (manager: EditorManager) => {
        const {value, items} = resolveOptionEventDataSchame(manager);

        return [
          {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                title: 'Content',
                properties: {
                  result: {
                    type: 'object',
                    title:
                      'deferApi lazy loading remote request returns the result after success'
                  },
                  value,
                  items
                }
              }
            }
          }
        ];
      }
    },
    ...OPTION_EDIT_EVENTS_OLD(schema)
  ];

  if (schema?.onEvent?.loadFinished) {
    events.push({
      eventName: 'loadFinished',
      eventLabel: 'Lazy loading completed (not recommended)',
      description:
        'Triggered when lazy loading interface remote request succeeds',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Content',
              properties: {
                value: {
                  type: 'object',
                  title:
                    'deferApi lazy loads the data returned after the remote request is successful'
                }
              } as any
            }
          }
        }
      ]
    });
  }

  return events;
};

/**
 * Escape the formula in the Components configuration, which is usually used to directly display the formula in the text Components editor
 *
 * @param conf Componentsschema configuration
 * @param keys escaped field key list
 * @returns escaped configuration
 */
export function escapeFormula(conf: any, keys: string[] = ['tpl']) {
  return JSONValueMap(conf, (value: any, key: string | number) => {
    if (keys.includes(String(key)) && /(^|[^\\])\$\{.+\}/.test(value)) {
      return value.replace(/\${/g, ' \\${');
    }
    return value;
  });
}

/**
 * Determine whether the given schema is model Components
 *
 * @param schema schema object
 * @returns If the given schema is model Components, return true, otherwise return false
 */
export function _isModelComp(schema: Record<string, any>): boolean {
  if (!schema) {
    return false;
  }

  if (
    schema.hasOwnProperty('$$m') &&
    (schema.$$m?.type === 'list' || schema.$$m?.type === 'form')
  ) {
    return true;
  }

  const extraEvaluation = ['source', 'api', 'initApi'].some(key => {
    if (schema?.[key] && typeof schema[key] === 'string') {
      return schema?.[key].startsWith('model://');
    }

    if (schema?.[key]?.url && typeof schema[key].url === 'string') {
      return (
        schema[key].url.startsWith('model://') &&
        !schema[key].hasOwnProperty('strategy')
      );
    }

    return false;
  });

  return extraEvaluation;
}

export const getOwnValue = (obj: any, key: string) => {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
};

export function generateId() {
  return `u:${guid()}`;
}
