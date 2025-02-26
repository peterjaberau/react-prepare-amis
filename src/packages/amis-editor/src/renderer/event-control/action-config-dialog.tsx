/**
 * Action configuration panel
 */

import {
  PluginActions,
  RendererPluginAction,
  tipedLabel,
  getSchemaTpl,
  defaultValue,
  persistGet
} from '@/packages/amis-editor-core/src';
import React from 'react';
import {ActionConfig, ComponentInfo} from './types';
import ActionConfigPanel from './action-config-panel';
import {BASE_ACTION_PROPS} from './comp-action-select';
import {findActionNode} from './eventControlConfigHelper';
import {PlainObject, SchemaNode, Option} from '@/packages/amis-core/src';
import {i18n as _i18n} from 'i18n-runtime';
import './actionsPanelPlugins';

interface ActionDialogProp {
  show: boolean;
  type: string;
  data: any;
  closeOnEsc?: boolean;
  pluginActions: PluginActions; // component action list
  actionTree: RendererPluginAction[]; // Action tree
  commonActions?: {[propName: string]: RendererPluginAction}; // Common action Map
  onSubmit: (type: string, config: any) => void;
  onClose: () => void;
  getComponents: (action: RendererPluginAction) => ComponentInfo[]; // Current page component tree
  actionConfigInitFormatter?: (actionConfig: ActionConfig) => ActionConfig; // Formatting when action configuration is initialized
  actionConfigSubmitFormatter?: (
    actionConfig: ActionConfig,
    type?: string
  ) => ActionConfig; // Formatting when action configuration is submitted
  render: (
    region: string,
    node: SchemaNode,
    props?: PlainObject
  ) => JSX.Element;

  subscribeSchemaSubmit: (
    fn: (schema: any, value: any, id: string, diff?: any) => any,
    once?: boolean
  ) => () => void;
  subscribeActionSubmit: (fn: (value: any) => any) => () => void;
}

export default class ActionDialog extends React.Component<ActionDialogProp> {
  /**
   * Get the component tree search list
   * @param tree
   * @param keywords
   * @returns
   */
  getTreeSearchList(tree: RendererPluginAction[], keywords: string): any {
    if (!keywords) {
      return tree;
    }
    let result: any[] = [];
    const getSearchList = (
      result: any[],
      array: RendererPluginAction[],
      keywords: string
    ) => {
      array.forEach(node => {
        if (node.children) {
          getSearchList(result, node.children, keywords);
        } else if (node.actionLabel!.includes(keywords)) {
          result.push({...node});
        }
      });
    };
    getSearchList(result, tree, keywords);
    return result;
  }

  /**
   * Get the component tree configuration schema
   * @param isSearch whether it is a search
   * @param actionTree original data source
   * @param getComponents
   * @returns
   */
  getInputTreeSchema(
    isSearch: boolean,
    actionTree: RendererPluginAction[],
    getComponents: (action: RendererPluginAction) => ComponentInfo[]
  ) {
    const inputTreeSchema = {
      type: 'input-tree',
      name: 'actionType',
      visibleOn: isSearch ? '__keywords' : '!__keywords',
      disabled: false,
      onlyLeaf: true,
      showIcon: false,
      className: 'action-tree',
      mode: 'normal',
      labelField: 'actionLabel',
      valueField: 'actionType',
      inputClassName: 'no-border action-tree-control',
      placeholder: 'No matching data',
      onChange: (value: string, oldVal: any, data: any, form: any) => {
        // Because we don't know what fields the action has, we only keep the basic configuration here
        let removeKeys: {
          [key: string]: any;
        } = {};
        let groupType = '';
        let __statusType = '';
        Object.keys(form.data).forEach((key: string) => {
          if (!BASE_ACTION_PROPS.includes(key)) {
            removeKeys[key] = undefined;
          }
        });

        if (
          value === 'openDialog' &&
          !['dialog', 'drawer'].includes(groupType)
        ) {
          groupType = 'dialog';
        }

        if (
          value === 'closeDialog' &&
          !['closeDialog', 'closeDrawer'].includes(groupType)
        ) {
          groupType = 'closeDialog';
        }
        if (
          value === 'visibility' &&
          !['show', 'hidden', 'visibility'].includes(groupType)
        ) {
          groupType = 'static';
          // Multiple actions share fields that require default values. Otherwise, setting them to undefined will result in visually checking the field, but the value is actually empty.
          __statusType = 'show';
        }

        if (
          value === 'usability' &&
          !['enabled', 'disabled', 'usability'].includes(groupType)
        ) {
          groupType = 'static';
          __statusType = 'enabled';
        }

        const actionNode = findActionNode(actionTree, value);
        form.setValues({
          ...removeKeys,
          __keywords: form.data.__keywords,
          __resultActionTree: form.data.__resultActionTree,
          componentId: form.data.componentId ? '' : undefined,
          ...(form.data.args ? {args: {}} : {}), // Clear args when switching actions
          groupType,
          __statusType,
          __actionDesc: actionNode?.description,
          __actionSchema: actionNode?.schema,
          __subActions: actionNode?.actions,
          __cmptTreeSource: actionNode?.supportComponents
            ? getComponents?.(actionNode) ?? []
            : [],
          ignoreError: false
        });
      }
    };
    if (isSearch) {
      return {
        ...inputTreeSchema,
        source: '${__resultActionTree}',
        highlightTxt: '${__keywords}'
      };
    } else {
      return {
        ...inputTreeSchema,
        options: actionTree
      };
    }
  }

  // Get the common action list schema
  getCommonUseActionSchema() {
    const commonUseActions = persistGet('common-use-actions', []).slice(0, 5);
    return commonUseActions.map((action: Option) => {
      return {
        type: 'tag',
        label: _i18n(action.label as string),
        displayMode: 'rounded',
        color: 'active',
        style: {
          borderColor: '#2468f2',
          cursor: 'pointer',
          maxWidth: '16%'
        },
        onEvent: {
          click: {
            actions: [
              {
                actionType: 'setValue',
                componentName: 'actionType',
                args: {
                  value: action.value
                }
              },
              {
                actionType: 'custom',
                script:
                  "document.querySelector('.action-tree li .is-checked')?.scrollIntoView()"
              }
            ]
          }
        }
      };
    });
  }

  render() {
    const {
      data,
      subscribeSchemaSubmit,
      subscribeActionSubmit,
      show,
      type,
      actionTree,
      pluginActions,
      getComponents,
      commonActions,
      onClose,
      render,
      closeOnEsc
    } = this.props;
    const commonUseActionSchema = this.getCommonUseActionSchema();

    return render(
      'inner',
      {
        type: 'dialog',
        title: 'Action Configuration',
        headerClassName: 'font-bold',
        className: 'ae-action-config-dialog',
        bodyClassName: 'action-config-dialog-body',
        closeOnEsc: closeOnEsc,
        closeOnOutside: false,
        show,
        showCloseButton: true,
        size: 'md',
        body: [
          {
            type: 'form',
            title: '',
            mode: 'normal',
            wrapperComponent: 'div',
            submitText: 'Save',
            autoFocus: true,
            data: {
              __keywords: '',
              __resultActionTree: []
            },
            preventEnterSubmit: true,
            // debug: true,
            onSubmit: this.props.onSubmit?.bind(this, type),
            body: [
              {
                type: 'flex',
                className: 'common-actions',
                justify: 'flex-start',
                visibleOn: `${commonUseActionSchema.length}`,
                items: [
                  {
                    type: 'tpl',
                    tpl: 'Common actions:',
                    className: 'common-actions-label'
                  },
                  ...commonUseActionSchema
                ]
              },
              {
                type: 'grid',
                className: 'h-full',
                columns: [
                  {
                    body: [
                      {
                        type: 'tpl',
                        tpl: 'Execute action',
                        className: 'action-panel-title',
                        inline: false
                      },
                      {
                        type: 'input-text',
                        name: '__keywords',
                        className: 'action-tree-search',
                        inputClassName: 'action-tree-search-input',
                        placeholder: 'Please search for execution actions',
                        clearable: true,
                        onChange: (
                          value: string,
                          oldVal: any,
                          data: any,
                          form: any
                        ) => {
                          if (value) {
                            const list = this.getTreeSearchList(
                              actionTree,
                              value
                            );
                            form.setValueByName('__resultActionTree', list);
                          } else {
                            form.setValueByName(
                              '__resultActionTree',
                              actionTree
                            );
                          }
                        }
                      },
                      // actionTree contains attributes of function and class types. If it is directly passed into the form data for parsing, an error will be reported.
                      // Therefore, two trees are used to use static and dynamic option groups respectively
                      this.getInputTreeSchema(false, actionTree, getComponents),
                      this.getInputTreeSchema(true, actionTree, getComponents)
                    ],
                    md: 3,
                    columnClassName: 'left-panel'
                  },
                  {
                    body: [
                      {
                        type: 'container',
                        className: 'right-panel-container',
                        body: [
                          {
                            type: 'container',
                            className: 'action-panel-title',
                            body: [
                              {
                                type: 'tpl',
                                tpl: 'Action description',
                                visibleOn: 'this.actionType'
                              },
                              {
                                type: 'tooltip-wrapper',
                                content: '${__actionDesc}',
                                visibleOn: 'this.actionType',
                                body: {
                                  type: 'icon',
                                  icon: 'far fa-question-circle',
                                  vendor: '',
                                  className: 'ml-0.5'
                                },
                                className: 'inline-block ml-0.5 mb-1'
                              }
                            ]
                          },
                          {
                            name: 'description',
                            type: 'textarea',
                            label: 'Action description',
                            mode: 'horizontal',
                            visibleOn: 'this.actionType'
                          },
                          {
                            type: 'tpl',
                            tpl: 'Basic settings',
                            className: 'action-panel-title',
                            visibleOn: 'this.actionType',
                            inline: false
                          },
                          {
                            asFormItem: true,
                            component: ActionConfigPanel,
                            pluginActions,
                            commonActions
                          },
                          {
                            type: 'tpl',
                            tpl: 'Advanced settings',
                            inline: false,
                            className: 'action-panel-title',
                            visibleOn: 'this.actionType'
                          },
                          {
                            type: 'button-group-select',
                            name: 'ignoreError',
                            visibleOn: 'this.actionType',
                            label: tipedLabel(
                              'Error Ignored',
                              'When an error occurs in an action, should we ignore the error and continue to execute'
                            ),
                            mode: 'horizontal',
                            pipeIn: (value: any, data: any) =>
                              value === true
                                ? '1'
                                : value === false
                                ? '2'
                                : '3',
                            pipeOut: (value: any) =>
                              value === '1'
                                ? true
                                : value === '2'
                                ? false
                                : undefined,
                            options: [
                              {
                                label: 'Ignore',
                                value: '1'
                              },
                              {
                                label: 'Do not ignore',
                                value: '2'
                              },
                              {
                                label: 'Default',
                                value: '3'
                              }
                            ],
                            description:
                              '<%= this.ignoreError === false ? "Both component failure and action execution failure will be interrupted" : typeof this.ignoreError === "undefined" ? "Component tolerance cannot be found, action execution will be interrupted only if it fails" : ""%>'
                          },
                          getSchemaTpl('expressionFormulaControl', {
                            name: 'stopPropagation',
                            label: tipedLabel(
                              'Blocking conditions',
                              'When the conditions are met, the execution of subsequent actions of the current event will be blocked'
                            ),
                            evalMode: true,
                            variables: '${variables}',
                            mode: 'horizontal',
                            size: 'lg',
                            visibleOn: 'this.actionType'
                          }),
                          getSchemaTpl('expressionFormulaControl', {
                            name: 'expression',
                            label: 'Execution conditions',
                            evalMode: true,
                            variables: '${variables}',
                            mode: 'horizontal',
                            size: 'lg',
                            placeholder: 'Execute this action by default',
                            visibleOn: 'this.actionType'
                          })
                        ]
                      }
                    ],
                    columnClassName: 'right-panel'
                  }
                ]
              }
            ],
            style: {
              borderStyle: 'solid'
            },
            className: 'action-config-panel :AMISCSSWrapper'
          }
        ],
        onClose
      },
      {
        data, // This is necessary, otherwise the variable will be treated as a data mapping

        subscribeActionSubmit,
        subscribeSchemaSubmit
      }
    );
    //   : null;
  }
}
