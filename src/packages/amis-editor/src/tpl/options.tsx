import React from 'react';
import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  getI18nEnabled,
  tipedLabel,
  JSONPipeOut
} from '@/packages/amis-editor-core/src';
import {findObjectsWithKey} from '@/packages/amis-core/src';
import {Button, Icon} from '@/packages/amis-ui/src';
import type {SchemaObject} from '@/packages/amis/src';
import assign from 'lodash/assign';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

import type {RendererProps} from '@/packages/amis/src';
import type {EditorManager} from '@/packages/amis-editor-core/src';

setSchemaTpl('options', () => {
  const i18nEnabled = getI18nEnabled();
  return {
    label: 'Options',
    name: 'options',
    type: 'combo',
    multiple: true,
    draggable: true,
    addButtonText: 'Add new option',
    scaffold: {
      label: '',
      value: ''
    },
    items: [
      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'label',
        placeholder: 'name',
        required: true
      },
      {
        type: 'select',
        name: 'value',
        pipeIn: (value: any) => {
          if (typeof value === 'string') {
            return 'text';
          }
          if (typeof value === 'boolean') {
            return 'boolean';
          }
          if (typeof value === 'number') {
            return 'number';
          }
          return 'text';
        },
        pipeOut: (value: any, oldValue: any) => {
          if (value === 'text') {
            return String(oldValue);
          }
          if (value === 'number') {
            const convertTo = Number(oldValue);
            if (isNaN(convertTo)) {
              return 0;
            }
            return convertTo;
          }
          if (value === 'boolean') {
            return Boolean(oldValue);
          }
          return '';
        },
        options: [
          {label: 'text', value: 'text'},
          {label: 'number', value: 'number'},
          {label: 'Boolean', value: 'boolean'}
        ]
      },
      {
        type: 'input-number',
        name: 'value',
        placeholder: 'value',
        visibleOn: 'typeof this.value === "number"',
        unique: true
      },
      {
        type: 'switch',
        name: 'value',
        placeholder: 'value',
        visibleOn: 'typeof this.value === "boolean"',
        unique: true
      },
      {
        type: 'input-text',
        name: 'value',
        placeholder: 'value',
        visibleOn:
          'typeof this.value === "undefined" || typeof this.value === "string"',
        unique: true
      }
    ]
  };
});

setSchemaTpl('tree', {
  label: 'Options',
  name: 'options',
  type: 'combo',
  multiple: true,
  draggable: true,
  addButtonText: 'Add new option',
  description:
    'Static data does not support multiple levels yet, please switch to code mode, or use the source interface to obtain it. ',
  scaffold: {
    label: '',
    value: ''
  },
  items: [
    getSchemaTpl('optionsLabel'),
    {
      type: 'input-text',
      name: 'value',
      placeholder: 'value',
      unique: true
    }
  ]
});

setSchemaTpl('multiple', (schema: any = {}) => {
  return {
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'multiple',
    label: 'Multiple selections possible',
    value: false,
    hiddenOnDefault: true,
    clearChildValuesOnOff: false,
    formType: 'extend',
    ...(schema.patch || {}),
    form: {
      body: schema.replace
        ? schema.body
        : [
            getSchemaTpl('joinValues'),
            getSchemaTpl('delimiter'),
            getSchemaTpl('extractValue'),
            ...(schema?.body || [])
          ]
    }
  };
});

setSchemaTpl('strictMode', {
  type: 'switch',
  label: 'strict mode',
  name: 'strictMode',
  value: false,
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline ',
  labelRemark: {
    trigger: ['hover', 'focus'],
    setting: true,
    title: '',
    content:
      'Enabling strict mode will use strict equality comparisons for values'
  }
});

setSchemaTpl('checkAllLabel', {
  type: 'input-text',
  name: 'checkAllLabel',
  label: 'option text',
  value: 'Select All',
  mode: 'row'
});

setSchemaTpl('checkAll', () => {
  return [
    getSchemaTpl('switch', {
      label: 'All selectable',
      name: 'checkAll',
      value: false,
      visibleOn: 'this.multiple'
    }),
    {
      type: 'container',
      className: 'ae-ExtendMore mb-2',
      visibleOn: 'this.checkAll && this.multiple',
      body: [
        getSchemaTpl('switch', {
          label: 'Default all selected',
          name: 'defaultCheckAll',
          value: false
        }),
        getSchemaTpl('checkAllLabel')
      ]
    }
  ];
});

setSchemaTpl('joinValues', (schemaPatches: Record<string, any> = {}) =>
  getSchemaTpl('switch', {
    label: tipedLabel(
      'Splice value',
      'After turning it on, the values ​​of the selected options will be concatenated with a connector as the value of the current form item'
    ),
    name: 'joinValues',
    visibleOn: 'this.multiple',
    value: true,
    ...schemaPatches
  })
);

setSchemaTpl('delimiter', {
  type: 'input-text',
  name: 'delimiter',
  label: tipedLabel(
    'Splice symbol',
    'The connection symbol that splices multiple values ​​into a string'
  ),
  visibleOn: 'this.multiple && this.joinValues',
  pipeIn: defaultValue(',')
});

setSchemaTpl('extractValue', {
  type: 'switch',
  label: tipedLabel(
    'Extract values ​​only',
    'When turned on, the value of the selected item is encapsulated as an array, and when turned off, the entire option data is encapsulated as an array.'
  ),
  name: 'extractValue',
  inputClassName: 'is-inline',
  visibleOn: 'this.multiple && this.joinValues === false',
  pipeIn: defaultValue(false)
});

setSchemaTpl('creatable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel(
      'Can be created',
      'Configure event actions to insert or intercept default interactions'
    ),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'creatable',
    ...schema
  };
});

setSchemaTpl('addApi', () => {
  return getSchemaTpl('apiControl', {
    label: 'New interface',
    name: 'addApi',
    mode: 'row',
    visibleOn: 'this.creatable'
  });
});

setSchemaTpl('createBtnLabel', {
  label: 'Add button name',
  name: 'createBtnLabel',
  type: 'input-text',
  placeholder: 'Add new options'
});

setSchemaTpl('editable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel(
      'Editable',
      'Configure event actions to insert or intercept default interactions'
    ),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'editable',
    ...schema
  };
});

setSchemaTpl('editApi', () =>
  getSchemaTpl('apiControl', {
    label: 'Edit interface',
    name: 'editApi',
    mode: 'row',
    visibleOn: 'this.editable'
  })
);

setSchemaTpl('editInitApi', () =>
  getSchemaTpl('apiControl', {
    label: 'Edit initialization interface',
    name: 'editInitApi',
    mode: 'row',
    visibleOn: 'this.editable'
  })
);

setSchemaTpl('removable', (schema: Partial<SchemaObject> = {}) => {
  return {
    label: tipedLabel(
      'can be deleted',
      'Configure event actions to insert or intercept default interactions'
    ),
    type: 'ae-switch-more',
    mode: 'normal',
    name: 'removable',
    ...schema
  };
});

setSchemaTpl('deleteApi', () =>
  getSchemaTpl('apiControl', {
    label: 'Delete interface',
    name: 'deleteApi',
    mode: 'row',
    visibleOn: 'this.removable'
  })
);

setSchemaTpl('ref', () => {
  // {
  //   type: 'input-text',
  //   name: '$ref',
  // label: 'Select definition',
  // labelRemark: 'Enter the definition already set in the page'
  // }
  return null;
});

setSchemaTpl('selectFirst', {
  type: 'switch',
  label: 'Select the first item by default',
  name: 'selectFirst',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

setSchemaTpl('hideNodePathLabel', {
  type: 'switch',
  label: tipedLabel(
    'Hide path',
    'Hide the text information of the ancestor node of the selected node'
  ),
  name: 'hideNodePathLabel',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline'
});

setSchemaTpl('navControl', {
  label: 'data',
  mode: 'normal',
  name: 'source',
  type: 'ae-navSourceControl',
  closeDefaultCheck: true // Close the default value setting
});

setSchemaTpl('optionControl', {
  label: 'data',
  mode: 'normal',
  name: 'options',
  type: 'ae-optionControl'
});

/**
 * New option control: without the function of setting default value
 * Note: The default value of the form item component supports formulas.
 */
setSchemaTpl('optionControlV2', {
  label: 'data',
  mode: 'normal',
  name: 'options',
  type: 'ae-optionControl',
  closeDefaultCheck: false // Close the default value setting
});

/**
 * mapping component mapping source
 */
setSchemaTpl('mapSourceControl', {
  type: 'ae-mapSourceControl',
  label: 'Mapping table',
  mode: 'normal',
  name: 'source'
});

/**
 * Timeline component options control
 */
setSchemaTpl('timelineItemControl', {
  label: 'data',
  model: 'normal',
  type: 'ae-timelineItemControl'
});

setSchemaTpl('treeOptionControl', {
  label: 'data',
  mode: 'normal',
  name: 'options',
  type: 'ae-treeOptionControl'
});

setSchemaTpl('dataMap', {
  type: 'container',
  body: [
    getSchemaTpl('switch', {
      label: tipedLabel(
        'Data Mapping',
        '<div> When data mapping is enabled, the data in the pop-up box will only contain the set part, please bind the data. For example: {"a": "\\${a}", "b": 2}. </div>' +
          '<div>When the value is __undefined, it means deleting the corresponding field. You can combine {"&": "\\$$"} to achieve a blacklist effect. </div>'
      ),
      name: 'dataMapSwitch',
      pipeIn: defaultValue(false),
      onChange: (value: any, oldValue: any, model: any, form: any) => {
        if (value) {
          form.setValues({
            data: {},
            dataMap: {},
            withDefaultData: false
          });
        } else {
          form.deleteValueByName('dataMap');
          form.deleteValueByName('data');
        }
      }
    }),
    getSchemaTpl('combo-container', {
      type: 'container',
      className: 'ae-Combo-items',
      visibleOn: 'this.dataMapSwitch',
      body: [
        getSchemaTpl('switch', {
          label: tipedLabel(
            'Original data flattened',
            'When turned on, all raw data will be flattened and set to data, and customized based on this'
          ),
          name: 'withDefaultData',
          className: 'mb-0',
          pipeIn: defaultValue(false),
          onChange: (value: boolean, origin: boolean, item: any, form: any) => {
            const data = form.data?.data || {};
            form.setValues({
              data: value
                ? {
                    ...data,
                    '&': '$$'
                  }
                : data && data['&'] === '$$'
                ? omit(data, '&')
                : data
            });
          }
        }),
        {
          type: 'input-kv',
          syncDefaultValue: false,
          name: 'dataMap',
          className: 'block -mt-5',
          deleteBtn: {
            icon: 'fa fa-trash'
          },
          updatePristineAfterStoreDataReInit: true,
          itemsWrapperClassName: 'ae-Combo-items',
          pipeIn: (e: any, form: any) => {
            const data = cloneDeep(form.data?.data);
            return data && data['&'] === '$$' ? omit(data, '&') : data;
          },
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            const newData = form.data.withDefaultData
              ? assign({'&': '$$'}, value)
              : cloneDeep(value);
            form.setValues({
              data: newData
            });
            return value;
          }
        }
      ]
    })
  ]
});

export interface OptionControlParams {
  manager: EditorManager;
  /** switch-more controller configuration */
  controlSchema?: Record<string, any>;
  /** Configuration collection in subform */
  collections?: Record<string, any>[];
  /** Whether to replace other properties except addControls*/
  replace?: boolean;
}

/**
 * Added a single option control to the option class component
 */
setSchemaTpl('optionAddControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('creatable', {
    formType: 'extend',
    autoFocus: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace
          ? customFormItems
          : [...customFormItems, getSchemaTpl('createBtnLabel')]),
        getSchemaTpl('addApi'),
        /** Used to clear related configurations after turning off the switch*/
        {
          type: 'hidden',
          name: 'addDialog'
        },
        {
          name: 'addControls',
          asFormItem: true,
          label: false,
          children: (props: RendererProps) => {
            const {value, data: ctx, onBulkChange} = props || {};
            const {addApi, createBtnLabel, addDialog, optionLabel} = ctx || {};
            /** Add a new form pop-up window*/
            const scaffold = {
              type: 'dialog',
              title: createBtnLabel || `Add ${optionLabel || 'option'}`,
              ...addDialog,
              body: {
                /** Identifier, used by SubEditor to find the corresponding Schema after confirmation */
                'amis-select-addControls': true,
                'type': 'form',
                'api': addApi,
                /** This is for compatibility with the old version, for example, components of type: text will be rendered as input-text */
                'controls': [
                  ...(value
                    ? Array.isArray(value)
                      ? value
                      : [value]
                    : [
                        /** FIXME: This is the default scaffold when no configuration is done */
                        {
                          type: 'input-text',
                          name: 'label',
                          label: false,
                          required: true,
                          placeholder: 'Please enter a name'
                        }
                      ])
                ]
              }
            };

            return (
              <div className="flex">
                <Button
                  className="w-full flex flex-col items-center"
                  level="enhance"
                  size="sm"
                  onClick={() => {
                    manager.openSubEditor({
                      title: 'Configure new form',
                      value: scaffold,
                      onChange: (value, diff: any) => {
                        const pureSchema = JSONPipeOut(
                          value,
                          (key, propValue) =>
                            key.substring(0, 2) === '__' || key === 'id'
                        );
                        const addDialog = omit(pureSchema, [
                          'type',
                          'body',
                          'id'
                        ]);
                        const targetForm = findObjectsWithKey(
                          pureSchema,
                          'amis-select-addControls'
                        );
                        const addApi = targetForm?.[0]?.api;
                        const addControls =
                          targetForm?.[0]?.controls ?? targetForm?.[0]?.body;

                        onBulkChange({addApi, addDialog, addControls});
                      }
                    });
                  }}
                >
                  {value
                    ? 'Add a new form configured'
                    : 'Add a new form configured'}
                </Button>
                {value && (
                  <Button
                    iconOnly
                    className="ml-3"
                    size="sm"
                    onClick={() => onBulkChange({addControls: undefined})}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                )}
              </div>
            );
          }
        }
        // {
        // label: 'Button location',
        //   name: 'valueType',
        //   type: 'button-group-select',
        //   size: 'sm',
        //   tiled: true,
        //   value: 'asUpload',
        //   mode: 'row',
        //   options: [
        //     {
        // label: 'Top',
        //       value: ''
        //     },
        //     {
        // label: 'Bottom',
        //       value: ''
        //     },
        //   ],
        // }
      ]
    }
  });
});

/**
 * Option class component edits single option control
 */
setSchemaTpl('optionEditControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('editable', {
    formType: 'extend',
    autoFocus: false,
    hiddenOnDefault: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace ? customFormItems : [...customFormItems]),
        getSchemaTpl('editInitApi'),
        getSchemaTpl('editApi'),
        /** Used to clear related configurations after turning off the switch*/
        {
          type: 'hidden',
          name: 'editDialog'
        },
        {
          name: 'editControls',
          asFormItem: true,
          label: false,
          children: (props: RendererProps) => {
            const {value, data: ctx, onBulkChange} = props || {};
            const {editApi, editInitApi, editDialog, optionLabel} = ctx || {};
            /** Add a new form pop-up window*/
            const scaffold = {
              type: 'dialog',
              title: 'Edit options',
              ...editDialog,
              body: {
                /** Identifier, used by SubEditor to find the corresponding Schema after confirmation */
                'amis-select-editControls': true,
                'type': 'form',
                'api': editApi,
                'initApi': editInitApi,
                /** This is for compatibility with the old version, for example, components of type: text will be rendered as input-text */
                'controls': [
                  ...(value
                    ? Array.isArray(value)
                      ? value
                      : [value]
                    : [
                        /** FIXME: This is the default scaffold when no configuration is done */
                        {
                          type: 'input-text',
                          name: 'label',
                          label: false,
                          required: true,
                          placeholder: 'Please enter a name'
                        }
                      ])
                ]
              }
            };

            return (
              <div className="flex">
                <Button
                  className="w-full flex flex-col items-center"
                  level="enhance"
                  size="sm"
                  onClick={() => {
                    manager.openSubEditor({
                      title: 'Configure Edit Form',
                      value: scaffold,
                      onChange: (value, diff: any) => {
                        const pureSchema = JSONPipeOut(
                          value,
                          (key, propValue) =>
                            key.substring(0, 2) === '__' || key === 'id'
                        );
                        const editDialog = omit(pureSchema, [
                          'type',
                          'body',
                          'id'
                        ]);
                        const targetForm = findObjectsWithKey(
                          pureSchema,
                          'amis-select-editControls'
                        );
                        const editApi = targetForm?.[0]?.api;
                        const editInitApi = targetForm?.[0]?.initApi;
                        const editControls =
                          targetForm?.[0]?.controls ?? targetForm?.[0]?.body;

                        onBulkChange({
                          editApi,
                          editInitApi,
                          editDialog,
                          editControls
                        });
                      }
                    });
                  }}
                >
                  {value ? 'Edit form configured' : 'Configure edit form'}
                </Button>
                {value && (
                  <Button
                    iconOnly
                    className="ml-3"
                    size="sm"
                    onClick={() => onBulkChange({editControls: undefined})}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                )}
              </div>
            );
          }
        }
      ]
    }
  });
});

/**
 * Option class component deletes the single option control
 */
setSchemaTpl('optionDeleteControl', (params: OptionControlParams) => {
  const {manager, controlSchema = {}, collections = [], replace} = params || {};
  const customFormItems = Array.isArray(collections)
    ? collections
    : [collections];

  return getSchemaTpl('removable', {
    formType: 'extend',
    autoFocus: false,
    hiddenOnDefault: false,
    ...controlSchema,
    form: {
      body: [
        ...(replace ? customFormItems : [...customFormItems]),
        getSchemaTpl('deleteApi')
      ]
    }
  });
});
