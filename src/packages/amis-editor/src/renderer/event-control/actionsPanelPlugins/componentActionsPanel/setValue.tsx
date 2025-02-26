import React from 'react';
import {
  getSchemaTpl,
  defaultValue,
  JSONGetById,
  EditorManager
} from '@/packages/amis-editor-core/src';
import {getRendererByName} from '@/packages/amis-core/src';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptActionSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc, getArgsWrapper} from '../../helper';
import {getRootManager} from '../../eventControlConfigHelper';

// Pull down to display the range of assignable attributes
export const SELECT_PROPS_CONTAINER = ['form'];

//Whether to pull down to display assignable attributes
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(this.__rendererName)`;

// Used in variable assignment page variables and memory variable tree selectors to support displaying variable types
const getCustomNodeTreeSelectSchema = (opts: Object) => ({
  type: 'tree-select',
  name: 'path',
  label: 'Memory variable',
  multiple: false,
  mode: 'horizontal',
  required: true,
  placeholder: 'Please select a variable',
  showIcon: false,
  size: 'lg',
  hideRoot: false,
  rootLabel: 'Memory variable',
  options: [],
  menuTpl: {
    type: 'flex',
    className: 'p-1',
    items: [
      {
        type: 'container',
        body: [
          {
            type: 'tpl',
            tpl: '${label}',
            inline: true,
            wrapperComponent: ''
          }
        ],
        style: {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'static',
          overflowY: 'auto',
          flex: '0 0 auto'
        },
        wrapperBody: false,
        isFixedHeight: true
      },
      {
        type: 'container',
        body: [
          {
            type: 'tpl',
            tpl: '${type}',
            inline: true,
            wrapperComponent: '',
            style: {
              background: '#f5f5f5',
              paddingLeft: '8px',
              paddingRight: '8px',
              borderRadius: '4px'
            }
          }
        ],
        size: 'xs',
        style: {
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          position: 'static',
          overflowY: 'auto',
          flex: '0 0 auto'
        },
        wrapperBody: false,
        isFixedHeight: true,
        isFixedWidth: false
      }
    ],
    style: {
      position: 'relative',
      inset: 'auto',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '24px',
      overflowY: 'hidden'
    },
    isFixedHeight: true,
    isFixedWidth: false
  },
  ...opts
});

registerActionPanel('setValue', {
  label: 'Variable assignment',
  tag: 'component',
  description: 'Update the data value of the target component or variable',
  innerArgs: [
    'path',
    'value',
    'index',
    '__valueInput',
    '__comboType',
    '__containerType'
  ],
  descDetail: (info: any, context: any, props: any) => {
    const variableManager = props.manager?.variableManager;

    return (
      <div className="action-desc">
        {/* As long as the path field exists, it is considered to be an application variable assignment, regardless of whether it has a value*/}
        {typeof info?.args?.path === 'string' && !info?.componentId ? (
          <>
            Setting variables
            <span className="variable-left variable-right">
              {variableManager?.getNameByPath(info.args.path)}
            </span>
            Data
          </>
        ) : (
          <>
            Setting up the components
            {buildLinkActionDesc(props.manager, info)}
            Data
          </>
        )}
      </div>
    );
  },
  supportComponents: 'byComponent',
  schema: (manager: EditorManager) => {
    // TODO: pass context
    const variableManager = manager?.variableManager;
    /** List of variables */
    const variableOptions = variableManager?.getVariableOptions() || [];
    const pageVariableOptions =
      variableManager?.getPageVariablesOptions() || [];
    const globalVariableOptions =
      variableManager?.getGlobalVariablesOptions() || [];
    return [
      {
        children: ({render, data}: any) => {
          const path = data?.args?.path || '';
          return render('setValueType', {
            name: '__actionSubType',
            type: 'radios',
            label: 'Action type',
            mode: 'horizontal',
            options: [
              {label: 'Component variable', value: 'cmpt'},
              {label: 'Global variable', value: 'global'},
              {label: 'Page parameters', value: 'page'},
              {label: 'Memory variable', value: 'app'}
            ],
            value: /^global/.test(path) // Only need to update value during initialization
              ? 'global'
              : /^appVariables/.test(path) // Only need to update value during initialization
              ? 'app'
              : /^(__page|__query)/.test(path)
              ? 'page'
              : 'cmpt',
            onChange: (value: string, oldVal: any, data: any, form: any) => {
              form.setValueByName('__valueInput', undefined);
              form.setValueByName('args.value', undefined);
              form.deleteValueByName('args.path');
            }
          });
        }
      },
      // Component variables
      {
        type: 'container',
        visibleOn: '__actionSubType === "cmpt"',
        body: [
          {
            type: 'wrapper',
            visibleOn: 'this.componentId === "customCmptId"',
            className: 'p-none mb-6',
            body: [
              ...renderCmptActionSelect(
                'Target component',
                true,
                (value: string, oldVal: any, data: any, form: any) => {
                  form.setValueByName('args.__containerType', 'all');
                  form.setValueByName('args.__comboType', 'all');
                },
                true
              )
            ]
          },
          {
            type: 'wrapper',
            visibleOn: 'this.componentId !== "customCmptId"',
            className: 'p-none mb-6',
            body: [
              ...renderCmptActionSelect(
                'Target component',
                true,
                (value: string, oldVal: any, data: any, form: any) => {
                  form.setValueByName('args.__containerType', 'all');
                  form.setValueByName('args.__comboType', 'all');
                }
              )
            ]
          },
          renderCmptIdInput(
            (value: string, oldVal: any, data: any, form: any) => {
              // Find the root and query again
              const root = getRootManager(manager);

              // Find the component and set the relevant properties
              let schema = JSONGetById(root.store.schema, value, 'id');
              if (schema) {
                const render = getRendererByName(schema.type);
                let __isScopeContainer = !!render?.storeType;
                let __rendererName = schema.type;
                form.setValues({
                  __isScopeContainer,
                  __rendererName
                });
              } else {
                form.setValues({
                  __isScopeContainer: false,
                  __rendererName: ''
                });
              }
            }
          ),
          getArgsWrapper({
            type: 'wrapper',
            body: [
              {
                type: 'radios',
                name: '__containerType',
                mode: 'horizontal',
                label: 'Data settings',
                pipeIn: defaultValue('all'),
                visibleOn: 'this.__isScopeContainer',
                options: [
                  {
                    label: 'Direct assignment',
                    value: 'all'
                  },
                  {
                    label: 'Member assignment',
                    value: 'appoint'
                  }
                ],
                onChange: (
                  value: string,
                  oldVal: any,
                  data: any,
                  form: any
                ) => {
                  form.setValueByName('value', []);
                  form.setValueByName('__valueInput', undefined);
                }
              },
              {
                type: 'radios',
                name: '__comboType',
                inputClassName: 'event-action-radio',
                mode: 'horizontal',
                label: 'Data settings',
                pipeIn: defaultValue('all'),
                visibleOn: `this.__rendererName === 'combo' || this.__rendererName === 'input-table'`,
                options: [
                  {
                    label: 'Full amount',
                    value: 'all'
                  },
                  {
                    label: 'Specify serial number',
                    value: 'appoint'
                  }
                ],
                onChange: (
                  value: string,
                  oldVal: any,
                  data: any,
                  form: any
                ) => {
                  form.setValueByName('index', undefined);
                  form.setValueByName('value', []);
                  form.setValueByName('__valueInput', undefined);
                }
              },
              getSchemaTpl('formulaControl', {
                name: 'index',
                label: 'Enter serial number',
                required: true,
                rendererSchema: {
                  type: 'input-number'
                },
                valueType: 'number',
                variables: '${variables}',
                size: 'lg',
                mode: 'horizontal',
                placeholder: 'Please enter the serial number to be updated',
                visibleOn: `(this.__rendererName === 'input-table' || this.__rendererName === 'combo')
              && this.__comboType === 'appoint'`
              }),
              {
                type: 'combo',
                name: 'value',
                label: '',
                multiple: true,
                removable: true,
                required: true,
                addable: true,
                strictMode: false,
                canAccessSuperData: true,
                size: 'lg',
                mode: 'horizontal',
                formClassName: 'event-action-combo',
                itemClassName: 'event-action-combo-item',
                items: [
                  {
                    name: 'key',
                    type: 'input-text',
                    placeholder: 'variable name',
                    source: '${__setValueDs}',
                    labelField: 'label',
                    valueField: 'value',
                    required: true
                  },
                  getSchemaTpl('formulaControl', {
                    name: 'val',
                    variables: '${variables}',
                    placeholder: 'field value',
                    columnClassName: 'flex-1'
                  })
                ],
                visibleOn: `this.__isScopeContainer && this.__containerType === 'appoint' || this.__comboType === 'appoint'`
              },
              {
                type: 'combo',
                name: 'value',
                label: '',
                multiple: true,
                removable: true,
                required: true,
                addable: true,
                strictMode: false,
                canAccessSuperData: true,
                mode: 'horizontal',
                size: 'lg',
                items: [
                  {
                    type: 'combo',
                    name: 'item',
                    label: false,
                    renderLabel: false,
                    multiple: true,
                    removable: true,
                    required: true,
                    addable: true,
                    strictMode: false,
                    canAccessSuperData: true,
                    className: 'm-l',
                    size: 'lg',
                    mode: 'horizontal',
                    formClassName: 'event-action-combo',
                    itemClassName: 'event-action-combo-item',
                    items: [
                      {
                        name: 'key',
                        type: 'input-text',
                        source: '${__setValueDs}',
                        labelField: 'label',
                        valueField: 'value',
                        required: true,
                        visibleOn: `this.__rendererName`
                      },
                      getSchemaTpl('formulaControl', {
                        name: 'val',
                        variables: '${variables}',
                        columnClassName: 'flex-1'
                      })
                    ]
                  }
                ],
                visibleOn: `(this.__rendererName === 'combo' || this.__rendererName === 'input-table')
              && this.__comboType === 'all'`
              },
              getSchemaTpl('formulaControl', {
                name: '__valueInput',
                label: '',
                variables: '${variables}',
                size: 'lg',
                mode: 'horizontal',
                visibleOn: `(this.__isScopeContainer || ${SHOW_SELECT_PROP}) && this.__containerType === 'all'`,
                required: true
              }),
              getSchemaTpl('formulaControl', {
                name: '__valueInput',
                label: 'Data settings',
                variables: '${variables}',
                size: 'lg',
                mode: 'horizontal',
                visibleOn: `this.__rendererName && !this.__isScopeContainer && this.__rendererName !== 'combo' && this.__rendererName !== 'input-table'`,
                required: true
              })
            ]
          })
        ]
      },
      // Page parameters
      {
        type: 'container',
        visibleOn: '__actionSubType === "page"',
        body: [
          getArgsWrapper([
            {
              type: 'wrapper',
              body: [
                getCustomNodeTreeSelectSchema({
                  label: 'Page parameters',
                  rootLabel: 'Page parameters',
                  options: pageVariableOptions,
                  horizontal: {
                    leftFixed: true
                  }
                }),
                getSchemaTpl('formulaControl', {
                  name: 'value',
                  label: 'Data settings',
                  variables: '${variables}',
                  size: 'lg',
                  mode: 'horizontal',
                  required: true,
                  placeholder: 'Please enter the variable value',
                  horizontal: {
                    leftFixed: true
                  }
                })
              ]
            }
          ])
        ]
      },
      // Memory variables
      {
        type: 'container',
        visibleOn: '__actionSubType === "app"',
        body: [
          getArgsWrapper([
            {
              type: 'wrapper',
              body: [
                getCustomNodeTreeSelectSchema({
                  options: variableOptions,
                  horizontal: {
                    leftFixed: true
                  }
                }),
                getSchemaTpl('formulaControl', {
                  name: 'value',
                  label: 'Data settings',
                  variables: '${variables}',
                  size: 'lg',
                  mode: 'horizontal',
                  required: true,
                  placeholder: 'Please enter the variable value',
                  horizontal: {
                    leftFixed: true
                  }
                })
              ]
            }
          ])
        ]
      },
      // Global variables
      {
        type: 'container',
        visibleOn: '__actionSubType === "global"',
        body: [
          getArgsWrapper([
            {
              type: 'wrapper',
              body: [
                getCustomNodeTreeSelectSchema({
                  options: globalVariableOptions,
                  rootLabel: 'Global variables',
                  label: 'Global variables',
                  horizontal: {
                    leftFixed: true
                  }
                }),
                getSchemaTpl('formulaControl', {
                  name: 'value',
                  label: 'Data settings',
                  variables: '${variables}',
                  size: 'lg',
                  mode: 'horizontal',
                  required: true,
                  placeholder: 'Please enter the variable value',
                  horizontal: {
                    leftFixed: true
                  }
                })
              ]
            }
          ])
        ]
      }
    ];
  }
});
