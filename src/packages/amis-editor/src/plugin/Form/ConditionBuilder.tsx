import {getI18nEnabled, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  PluginInterface,
  RendererEventContext,
  ScaffoldForm,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
// @ts-ignore
import defaultConfig, {
  OperationMap
} from 'amis-ui/lib/components/condition-builder/config';
import {generateId} from '../../util';

export class ConditionBilderPlugin extends BasePlugin {
  static id = 'ConditionBilderPlugin';
  // Associated renderer name
  rendererName = 'condition-builder';
  $schema = '/schemas/ConditionBuilderControlSchema.json';

  // Component name
  name = 'Conditional component';
  isBaseComponent = true;
  icon = 'fa fa-group';
  pluginIcon = 'condition-builder-plugin';
  description =
    'Used to set complex combination conditions, support adding conditions, adding groups, setting combination methods, drag and drop sorting and other functions. ';
  docLink = '/amis/zh-CN/components/form/condition-builder';
  tags = ['form item'];

  scaffold = {
    type: 'condition-builder',
    label: 'Conditional component',
    name: 'conditions',
    description:
      'Suitable for users to spell out the query conditions themselves, and then the backend generates query where based on the data',
    fields: [
      {
        label: 'text',
        type: 'text',
        id: generateId(),
        name: 'text'
      },
      {
        label: 'number',
        type: 'number',
        id: generateId(),
        name: 'number'
      },
      {
        label: 'Boolean',
        type: 'boolean',
        id: generateId(),
        name: 'boolean'
      },
      {
        label: 'options',
        type: 'select',
        id: generateId(),
        name: 'select',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          },
          {
            label: 'D',
            value: 'd'
          },
          {
            label: 'E',
            value: 'e'
          }
        ]
      },
      {
        label: 'Date',
        type: 'date',
        id: generateId(),
        name: 'date'
      },
      {
        label: 'time',
        type: 'time',
        id: generateId(),
        name: 'time'
      },
      {
        label: 'Date time',
        type: 'datetime',
        id: generateId(),
        name: 'datetime'
      }
    ]
  };

  get scaffoldForm(): ScaffoldForm {
    const i18nEnabled = getI18nEnabled();
    return {
      title: 'Quick Start - Condition Combination',
      body: [
        {
          type: 'combo',
          name: 'fields',
          multiple: true,
          draggable: true,
          multiLine: true,
          items: [
            {
              type: 'group',
              body: [
                {
                  type: 'select',
                  name: 'type',
                  placeholder: 'Condition type',
                  options: [
                    {
                      label: 'text',
                      value: 'text'
                    },
                    {
                      label: 'number',
                      value: 'number'
                    },
                    {
                      label: 'Boolean',
                      value: 'boolean'
                    },
                    {
                      label: 'Date',
                      value: 'date'
                    },
                    {
                      label: 'Date time',
                      value: 'datetime'
                    },
                    {
                      label: 'time',
                      value: 'time'
                    },
                    {
                      label: 'options',
                      value: 'select'
                    }
                  ]
                },
                {
                  type: 'input-text',
                  name: 'name',
                  placeholder: 'field name'
                },
                {
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                  placeholder: 'field name',
                  name: 'label'
                }
              ]
            },

            {
              type: 'group',
              visibleOn: 'this.type === "number"',
              body: [
                {
                  type: 'input-number',
                  name: 'minimum',
                  placeholder: 'Minimum value'
                },
                {
                  type: 'input-number',
                  name: 'maximum',
                  placeholder: 'maximum value'
                },
                {
                  type: 'input-number',
                  name: 'step',
                  min: 0,
                  placeholder: 'Step length'
                }
              ]
            },

            {
              type: 'group',
              visibleOn: '!!~["date", "datetime", "time"].indexOf(this.type)',
              body: [
                {
                  type: 'input-text',
                  name: 'format',
                  placeholder: 'value format'
                },
                {
                  type: 'input-text',
                  name: 'inputFormat',
                  placeholder: 'Date display format'
                },
                {
                  type: 'input-text',
                  name: 'timeFormat',
                  placeholder: 'Time display format',
                  visibleOn: 'this.type === "datetime"'
                }
              ]
            },

            {
              type: 'group',
              visibleOn: 'this.type === "select"',
              body: [
                {
                  type: 'input-text',
                  name: 'source',
                  placeholder:
                    'Field options are pulled remotely, supporting interfaces or data mapping'
                }
              ]
            },

            {
              type: 'group',
              body: [
                {
                  type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                  placeholder: 'Placeholder',
                  name: 'placeholder'
                },

                {
                  name: 'operators',
                  placeholder: 'operator',
                  asFormItem: true,
                  children: ({data, render, onChange}: any) =>
                    render(
                      'operations',
                      {
                        type: 'select',
                        name: 'operators',
                        multiple: true,
                        value:
                          data.value ||
                          defaultConfig.types[data.type]?.operators ||
                          [],
                        joinValues: false,
                        extractValue: true,
                        options: defaultConfig.types[data.type]?.operators.map(
                          (item: any): any => {
                            if (
                              isObject(item) &&
                              (item as any).label &&
                              (item as any).value
                            ) {
                              return (
                                {
                                  label: (item as any).label,
                                  value: (item as any).value
                                } || []
                              );
                            } else if (isString(item)) {
                              return (
                                {
                                  label: OperationMap[item],
                                  value: item
                                } || []
                              );
                            } else {
                              return [];
                            }
                          }
                        )
                      },
                      {
                        onChange: (value: any) => onChange(value)
                      }
                    )
                }
              ]
            }
          ]
        }
      ],
      canRebuild: true
    };
  }

  previewSchema: any = {
    type: 'form',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [this.scaffold]
  };

  panelTitle = 'Conditional Components';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('layout:originPosition', {value: 'left-top'}),
      getSchemaTpl('source')
    ];
  };

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface = this;
    // return super.buildSubRenderers.apply(this, arguments);
    if (plugin.name && plugin.description) {
      return {
        name: plugin.name,
        icon: plugin.icon,
        pluginIcon: plugin.pluginIcon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        scaffoldForm: this.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName
      };
    }
  }
}

registerEditorPlugin(ConditionBilderPlugin);
