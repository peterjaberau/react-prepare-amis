/**
 * @file some processing methods
 */
import React from 'react';
import {
  BaseEventContext,
  defaultValue,
  EditorManager,
  getSchemaTpl,
  JSONGetById,
  JSONGetPathById,
  persistGet,
  persistSet,
  RendererPluginAction,
  RendererPluginEvent
} from '@/packages/amis-editor-core/src';
import {DataSchema, Schema, Option, getRendererByName} from '@/packages/amis-core/src';
import {Button, toast, TooltipWrapper} from '@/packages/amis-ui/src';
import {i18n as _i18n} from 'i18n-runtime';
import {ActionConfig} from './types';
import CmptActionSelect from './comp-action-select';
import {ActionData} from '.';
import {
  getContextSchemasHoc,
  getComponentsHoc,
  actionConfigInitFormatterHoc,
  actionConfigSubmitFormatterHoc
} from './eventControlConfigHelper';
import {ACTION_TYPE_TREE} from './actionsPanelManager';
import {SELECT_PROPS_CONTAINER, SHOW_SELECT_PROP} from './constants';

export const getArgsWrapper = (
  items: any,
  multiple: boolean = false,
  patch = {}
) => ({
  type: 'combo',
  name: 'args',
  // label: 'Action parameters',
  multiple,
  strictMode: false,
  ...patch,
  items: Array.isArray(items) ? items : [items]
});

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

// Rendering component selection configuration items
export const renderCmptSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean
) => [
  {
    type: 'tree-select',
    name: 'componentId',
    label: componentLabel || 'Select component',
    showIcon: false,
    searchable: true,
    required,
    selfDisabledAffectChildren: false,
    size: 'lg',
    source: '${__cmptTreeSource}',
    mode: 'horizontal',
    autoFill: {
      __isScopeContainer: '${isScopeContainer}',
      ...(hideAutoFill
        ? {}
        : {
            __rendererLabel: '${label}',
            __rendererName: '${type}',
            __nodeId: '${id}',
            __nodeSchema: '${schema}'
          })
    },
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  }
];

// Rendering component feature action configuration items
export const renderCmptActionSelect = (
  componentLabel: string,
  required: boolean,
  onChange?: (value: string, oldVal: any, data: any, form: any) => void,
  hideAutoFill?: boolean,
  manager?: EditorManager
) => {
  return [
    ...renderCmptSelect(
      componentLabel || 'Select component',
      true,
      async (value: string, oldVal: any, data: any, form: any) => {
        // Get the component context
        if (form.data.__nodeId) {
          if (form.data.actionType === 'setValue') {
            // todo: This will flash for a moment, you need to check the problem from amis
            form.setValueByName('args.value', []);
            form.setValueByName('args.__comboType', undefined);
            form.setValueByName('args.__valueInput', undefined);
            form.setValueByName('args.__containerType', undefined);

            if (SELECT_PROPS_CONTAINER.includes(form.data.__rendererName)) {
              const contextSchema: any = await form.data.getContextSchemas?.(
                form.data.__nodeId,
                true
              );

              const dataSchema = new DataSchema(contextSchema || []);
              const variables = dataSchema?.getDataPropsAsOptions() || [];
              form.setValueByName(
                '__setValueDs',
                variables.filter(item => item.value !== '$$id')
              );
            } else {
              form.setValueByName('__setValueDs', []);
            }
          }
        }
        form.setValueByName('groupType', '');
        onChange?.(value, oldVal, data, form);
      },
      hideAutoFill
    ),
    {
      type: 'input-text',
      name: '__cmptId',
      mode: 'horizontal',
      size: 'lg',
      required: true,
      label: 'component id',
      visibleOn:
        'this.componentId === "customCmptId" && this.actionType === "component"',
      onChange: async (value: string, oldVal: any, data: any, form: any) => {
        let schema = JSONGetById(manager!.store.schema, value, 'id');
        if (schema) {
          form.setValues({
            __rendererName: schema.type
          });
        } else {
          form.setValues({
            __rendererName: ''
          });
        }
      }
    },
    {
      asFormItem: true,
      label: 'Component action',
      name: 'groupType',
      mode: 'horizontal',
      required: true,
      visibleOn: 'this.actionType === "component"',
      component: CmptActionSelect,
      description: '${__cmptActionDesc}'
    }
  ];
};

export const renderCmptIdInput = (
  onChange?: (value: string, oldVal: any, data: any, form: any) => void
) => {
  return {
    type: 'input-text',
    name: '__cmptId',
    mode: 'horizontal',
    size: 'lg',
    required: true,
    label: 'component id',
    visibleOn: 'this.componentId === "customCmptId"',
    onChange: async (value: string, oldVal: any, data: any, form: any) => {
      onChange?.(value, oldVal, data, form);
    }
  };
};

export const getActionCommonProps = (actionType: string, info?: any) => {
  if (!actionType) {
    console.warn('Please pass in actionType');
  }
  return COMMON_ACTION_SCHEMA_MAP[actionType];
};

export const buildLinkActionDesc = (manager: EditorManager, info: any) => {
  const desc = info?.rendererLabel || info.componentId || '-';

  return (
    <span className="desc-tag variable-left variable-right">
      <TooltipWrapper
        rootClose
        placement="top"
        tooltip={`${desc}, click to anchor to this component`}
        tooltipClassName="ae-event-item-header-tip"
      >
        <a
          href="#"
          className="component-action-tag"
          onClick={(e: React.UIEvent<any>) => {
            e.preventDefault();
            e.stopPropagation();

            const schema = JSONGetById(
              manager.store.schema,
              info.componentId,
              'id'
            );

            if (!schema) {
              toast.info('Tips: The component was not found');
              return;
            }

            const path = JSONGetPathById(manager.store.schema, schema.$$id);

            if (path?.includes('dialog') || path?.includes('drawer')) {
              toast.info(
                'This component is in the pop-up window and cannot be directly anchored to it'
              );
              return;
            }

            manager.store.setActiveId(schema.$$id);
          }}
        >
          {desc}
        </a>
      </TooltipWrapper>
    </span>
  );
};

//Action configuration item schema map
export const COMMON_ACTION_SCHEMA_MAP: {
  [propName: string]: RendererPluginAction;
} = {
  setValue: {
    innerArgs: ['value'],
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          set up
          {buildLinkActionDesc(props.manager, info)}
          Data
        </div>
      );
    },
    schema: getArgsWrapper({
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
          onChange: (value: string, oldVal: any, data: any, form: any) => {
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
          onChange: (value: string, oldVal: any, data: any, form: any) => {
            form.setValueByName('index', undefined);
            form.setValueByName('value', []);
            form.setValueByName('__valueInput', undefined);
          }
        },
        {
          type: 'input-number',
          required: true,
          name: 'index',
          mode: 'horizontal',
          label: 'Enter serial number',
          size: 'lg',
          placeholder: 'Please enter the serial number to be updated',
          visibleOn: `(this.__rendererName === 'input-table' || this.__rendererName === 'combo')
      && this.__comboType === 'appoint'`
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
          required: true,
          horizontal: {
            leftFixed: true
          }
        })
      ]
    })
  },
  reload: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          refresh
          {buildLinkActionDesc(props.manager, info)}
          Components
        </div>
      );
    }
  },
  clear: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          Clear
          {buildLinkActionDesc(props.manager, info)}
          Data
        </div>
      );
    }
  },
  reset: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          Reset
          {buildLinkActionDesc(props.manager, info)}
          Data
        </div>
      );
    }
  },
  submit: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          submit
          {buildLinkActionDesc(props.manager, info)}
          {info?.__rendererName === 'wizard' ? 'All data' : 'Data'}
        </div>
      );
    }
  },
  collapse: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          收起{buildLinkActionDesc(props.manager, info)}
        </div>
      );
    }
  },
  selectAll: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          Select all options in {buildLinkActionDesc(props.manager, info)}
        </div>
      );
    }
  },
  focus: {
    descDetail: (info: any, context: any, props: any) => {
      return (
        <div className="action-desc">
          Get {buildLinkActionDesc(props.manager, info)} focus
        </div>
      );
    }
  }
};

// Get the event Label text
export const getEventLabel = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.eventLabel;

// Get the event description
export const getEventDesc = (events: RendererPluginEvent[], name: string) =>
  events.find(item => item.eventName === name)?.description;

export const getEventStrongDesc = (
  events: RendererPluginEvent[],
  name: string
) => events.find(item => item.eventName === name)?.strongDesc;

export const getOldActionSchema = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  const isInDialog = /(?:\/|^)dialog\/.+$/.test(context.path);
  return {
    type: 'tooltip-wrapper',
    className: 'old-action-tooltip-warpper',
    content:
      'Warm Tips: After adding the event action below, the event action below will be executed before the old version action. It is recommended to migrate to the event action mechanism to help you achieve more flexible interaction design',
    inline: true,
    tooltipTheme: 'dark',
    placement: 'bottom',
    body: [
      {
        type: 'button',
        label: 'Configure actions (old version)',
        className: 'block old-action-btn',
        actionType: 'dialog',
        dialog: {
          type: 'dialog',
          title: 'Action',
          body: {
            type: 'form',
            body: [
              {
                label: 'Button behavior',
                type: 'select',
                name: 'actionType',
                pipeIn: defaultValue(''),
                options: [
                  {
                    label: 'Default',
                    value: ''
                  },
                  {
                    label: 'Ball box',
                    value: 'dialog'
                  },

                  {
                    label: 'Drawer',
                    value: 'drawer'
                  },

                  {
                    label: 'Send request',
                    value: 'ajax'
                  },

                  {
                    label: 'Download file',
                    value: 'download'
                  },

                  {
                    label: 'Page jump (single page mode)',
                    value: 'link'
                  },

                  {
                    label: 'Page jump',
                    value: 'url'
                  },

                  {
                    label: 'Refresh target',
                    value: 'reload'
                  },

                  {
                    label: 'Copy content',
                    value: 'copy'
                  },

                  {
                    label: 'Submit',
                    value: 'submit'
                  },

                  {
                    label: 'Reset',
                    value: 'reset'
                  },

                  {
                    label: 'Reset and submit',
                    value: 'reset-and-submit'
                  },

                  {
                    label: 'Confirm',
                    value: 'confirm'
                  },

                  {
                    label: 'Cancel',
                    value: 'cancel'
                  },

                  {
                    label: 'jump to next',
                    value: 'next'
                  },

                  {
                    label: 'jump to previous item',
                    value: 'prev'
                  }
                ]
              },

              {
                type: 'input-text',
                name: 'content',
                visibleOn: 'this.actionType == "copy"',
                label: 'Copy content template'
              },

              {
                type: 'select',
                name: 'copyFormat',
                options: [
                  {
                    label: 'Plain text',
                    value: 'text/plain'
                  },
                  {
                    label: 'Rich text',
                    value: 'text/html'
                  }
                ],
                visibleOn: 'this.actionType == "copy"',
                label: 'Copy format'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'this.actionType == "reload"',
                label: 'Specify refresh target',
                required: true
              },

              {
                name: 'dialog',
                pipeIn: defaultValue({
                  title: 'Ball box title',
                  body: 'Yes, you just clicked',
                  showCloseButton: true,
                  showErrorMsg: true,
                  showLoading: true
                }),
                asFormItem: true,
                visibleOn: '${actionType === "dialog"}',
                children: ({value, onChange, data}: any) => (
                  <Button
                    size="sm"
                    level="danger"
                    className="m-b"
                    onClick={() =>
                      manager.openSubEditor({
                        title: 'Configure the content of the pop-up box',
                        value: {type: 'dialog', ...value},
                        onChange: value => onChange(value)
                      })
                    }
                    block
                  >
                    Configure the content of the pop-up window
                  </Button>
                )
              },

              {
                name: 'drawer',
                pipeIn: defaultValue({
                  title: 'Drawer title',
                  body: 'Yes, you just clicked'
                }),
                asFormItem: true,
                visibleOn: '${actionType == "drawer"}',
                children: ({value, onChange, data}: any) => (
                  <Button
                    size="sm"
                    level="danger"
                    className="m-b"
                    onClick={() =>
                      manager.openSubEditor({
                        title: 'Configure the content of the pop-up box',
                        value: {type: 'drawer', ...value},
                        onChange: value => onChange(value)
                      })
                    }
                    block
                  >
                    Configure the pop-up content
                  </Button>
                )
              },

              getSchemaTpl('getOldActionSchema', {
                label: 'Target API',
                visibleOn: 'this.actionType == "ajax"'
              }),

              {
                name: 'feedback',
                pipeIn: defaultValue({
                  title: 'Ball box title',
                  body: 'content'
                }),
                asFormItem: true,
                visibleOn: '${actionType == "ajax"}',
                children: ({onChange, value, data}: any) => (
                  <div className="m-b">
                    <Button
                      size="sm"
                      level={value ? 'danger' : 'info'}
                      onClick={() =>
                        manager.openSubEditor({
                          title: 'Configure feedback pop-up details',
                          value: {type: 'dialog', ...value},
                          onChange: value => onChange(value)
                        })
                      }
                    >
                      Configure the feedback pop-up content
                    </Button>

                    {value ? (
                      <Button
                        size="sm"
                        level="link"
                        className="m-l"
                        onClick={() => onChange('')}
                      >
                        Clear settings
                      </Button>
                    ) : null}
                  </div>
                )
              },

              {
                name: 'feedback.visibleOn',
                label: 'Whether to pop up expression',
                type: 'input-text',
                visibleOn: 'this.feedback',
                autoComplete: false,
                description:
                  'Please use JS expressions such as: `this.xxx == 1`'
              },

              {
                name: 'feedback.skipRestOnCancel',
                label:
                  'Does canceling the pop-up window interrupt subsequent operations?',
                type: 'switch',
                mode: 'inline',
                className: 'block',
                visibleOn: 'this.feedback'
              },

              {
                name: 'feedback.skipRestOnConfirm',
                label:
                  'Popup box confirms whether to interrupt subsequent operations',
                type: 'switch',
                mode: 'inline',
                className: 'block',
                visibleOn: 'this.feedback'
              },

              {
                type: 'input-text',
                label: 'Destination address',
                name: 'link',
                visibleOn: 'this.actionType == "link"'
              },

              {
                type: 'input-text',
                label: 'Destination address',
                name: 'url',
                visibleOn: 'this.actionType == "url"',
                placeholder: 'http://'
              },

              {
                type: 'switch',
                name: 'blank',
                visibleOn: 'this.actionType == "url"',
                mode: 'inline',
                className: 'w-full',
                label: 'Open in a new window',
                pipeIn: defaultValue(true)
              },

              isInDialog
                ? {
                    visibleOn:
                      'this.actionType == "submit" || this.type == "submit"',
                    name: 'close',
                    type: 'switch',
                    mode: 'inline',
                    className: 'w-full',
                    pipeIn: defaultValue(true),
                    label: 'Whether to close the current pop-up window'
                  }
                : {},

              {
                name: 'confirmText',
                type: 'textarea',
                label: 'Confirm the copy',
                description:
                  'After clicking, this content will pop up, and the corresponding operation will be performed after the user confirms.'
              },

              {
                type: 'input-text',
                name: 'reload',
                label: 'Refresh target component',
                visibleOn:
                  'this.actionType != "link" && this.actionType != "url"',
                description:
                  'After the current action is completed, the specified target component is refreshed. Supports passing data such as: <code>xxx?a=\\${a}&b=\\${b}</code>, multiple targets should be separated by English commas.'
              },

              {
                type: 'input-text',
                name: 'target',
                visibleOn: 'this.actionType != "reload"',
                label: 'Specify response component',
                description:
                  'Specify the action executor, which defaults to the functional component where the current component is located. If specified, it will be transferred to the target component for processing.'
              },

              {
                type: 'js-editor',
                allowFullscreen: true,
                name: 'onClick',
                label: 'Custom click event',
                description: 'Will pass two parameters event and props'
              },

              {
                type: 'input-text',
                name: 'hotKey',
                label: 'Keyboard shortcuts'
              }
            ]
          },
          onConfirm: (values: any[]) => {
            manager.panelChangeValue(values[0]);
          }
        }
      }
    ]
  };
};

/**
 * Get the required property configuration of the event action panel
 */
export const getEventControlConfig = (
  manager: EditorManager,
  context: BaseEventContext
) => {
  // General action configuration
  const commonActions =
    manager?.config.actionOptions?.customActionGetter?.(manager);
  //Action tree
  const actionTree = manager?.config.actionOptions?.actionTreeGetter
    ? manager?.config.actionOptions?.actionTreeGetter(ACTION_TYPE_TREE(manager))
    : ACTION_TYPE_TREE(manager);
  const allComponents = manager?.store?.getComponentTreeSource();
  return {
    showOldEntry:
      !!(
        context.schema.actionType &&
        !['dialog', 'drawer'].includes(context.schema.type)
      ) || ['submit', 'reset'].includes(context.schema.type),
    actions: manager?.pluginActions,
    events: manager?.pluginEvents,
    actionTree,
    commonActions,
    owner: '',
    addBroadcast: manager?.addBroadcast.bind(manager),
    removeBroadcast: manager?.removeBroadcast.bind(manager),
    allComponents: allComponents,
    getContextSchemas: getContextSchemasHoc(manager, context),
    getComponents: getComponentsHoc(manager),
    actionConfigInitFormatter: actionConfigInitFormatterHoc(
      manager,
      actionTree,
      commonActions,
      allComponents
    ),
    actionConfigSubmitFormatter: actionConfigSubmitFormatterHoc(actionTree)
  };
};

/**
 * Common actions for updating localStorage
 */
export const updateCommonUseActions = (action: Option) => {
  const commonUseActions = persistGet('common-use-actions', []);
  const index = commonUseActions.findIndex(
    (item: Option) => item.value === action.value
  );
  if (index >= 0) {
    commonUseActions[index].use += 1;
  } else {
    commonUseActions.unshift(action);
  }
  commonUseActions.sort(
    (before: Option, next: Option) => next.use - before.use
  );
  persistSet('common-use-actions', commonUseActions);
};

export const getActionsByRendererName = (
  pluginActions: any,
  rendererName: string
): RendererPluginAction[] => {
  let actions = (pluginActions[rendererName] || []).slice();
  // Form item type component, add validation action
  if (getRendererByName(rendererName)?.isFormItem) {
    actions.push({
      actionLabel: 'Check',
      description: 'Check a single form item',
      actionType: 'validateFormItem'
    });
  }

  return actions;
};
