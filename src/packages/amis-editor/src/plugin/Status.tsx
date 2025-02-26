import React from 'react';
import {render} from 'amis';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {Icon, TooltipWrapper} from 'amis-ui';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {getI18nEnabled} from 'amis-editor-core';

export class StatusPlugin extends BasePlugin {
  static id = 'StatusPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'status';
  $schema = '/schemas/StatusSchema.json';

  // Component name
  name = 'Status Display';
  isBaseComponent = true;
  description =
    'Use icons to display the status with related fields, such as 1 for √ and 0 for x. This can be customized';
  docLink = '/amis/zh-CN/components/status';
  tags = ['show'];
  icon = 'fa fa-check-square-o';
  pluginIcon = 'status-plugin';
  scaffold = {
    type: 'status',
    value: 1
  };
  previewSchema = {
    ...this.scaffold
  };

  defaultSource = [
    {
      label: '-',
      value: '0',
      icon: 'fail',
      status: 0
    },
    {
      label: '-',
      value: '1',
      icon: 'success',
      status: 1
    },
    {
      label: 'Success',
      value: 'success',
      icon: 'success',
      status: 'success'
    },
    {
      label: 'Running',
      value: 'pending',
      icon: 'rolling',
      status: 'pending'
    },
    {
      label: 'In queue',
      value: 'queue',
      icon: 'warning',
      status: 'queue'
    },
    {
      label: 'Scheduling',
      value: 'schedule',
      icon: 'schedule',
      status: 'schedule'
    },
    {
      label: 'failed',
      value: 'fail',
      icon: 'fail',
      status: 'fail'
    }
  ];

  panelTitle = 'Status';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('combo-container', {
                  type: 'combo',
                  name: '__source',
                  inputClassName: 'ae-Status-control',
                  labelClassName: 'ae-Status-label',
                  label: [
                    'Icon Configuration',
                    {
                      children: (
                        <TooltipWrapper
                          tooltipClassName="ae-Status-default-icon-tooltip"
                          trigger="hover"
                          rootClose={true}
                          placement="bottom"
                          tooltip={{
                            children: () =>
                              render({
                                type: 'container',
                                body: [
                                  {
                                    type: 'tpl',
                                    tpl: 'The following states are supported by default and can be used without configuration. Custom states will be merged with the default states.',
                                    wrapperComponent: 'p',
                                    className: 'ae-Status-default-icon-tip'
                                  },
                                  {
                                    type: 'table',
                                    data: {
                                      items: this.defaultSource
                                    },
                                    columns: [
                                      {
                                        name: 'icon',
                                        label: 'Default icon value'
                                      },
                                      {
                                        name: 'label',
                                        label: 'Default label'
                                      },
                                      {
                                        name: 'value',
                                        label: 'Default value'
                                      },
                                      {
                                        name: 'status',
                                        label: 'status',
                                        type: 'mapping',
                                        map: {
                                          '*': {
                                            type: 'status'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              })
                          }}
                        >
                          <div className="ae-Status-label-tip-icon">
                            <Icon icon="editor-help" className="icon" />
                          </div>
                        </TooltipWrapper>
                      )
                    }
                  ],
                  mode: 'normal',
                  multiple: true,
                  items: [
                    getSchemaTpl('icon', {
                      label: '',
                      placeholder: 'icon',
                      onChange(
                        value: any,
                        oldValue: boolean,
                        model: any,
                        form: any
                      ) {
                        // Automatically fill label when selecting icon
                        if (value && value.name) {
                          form.setValues({
                            label: value.name
                          });
                        }
                      }
                    }),
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'label',
                      placeholder: 'label'
                    },
                    {
                      type: 'input-text',
                      name: 'value',
                      placeholder: 'value',
                      unique: true,
                      required: true,
                      validationErrors: {
                        isRequired: 'Required'
                      }
                    },
                    getSchemaTpl('theme:colorPicker', {
                      label: '',
                      name: 'color'
                    })
                  ],
                  pipeIn: (value: any, {data}: any) => {
                    // First entry, convert the schema to combo data
                    if (value === undefined) {
                      let {map, labelMap, source} = data;
                      let res = cloneDeep(source) || {};
                      // Compatible with old versions
                      map &&
                        Object.entries(map).forEach(([value, icon]) => {
                          if (
                            value === '' ||
                            value == null ||
                            value === '$$id'
                          ) {
                            return;
                          }
                          if (!res[value]) {
                            res[value] = {icon};
                          } else {
                            res[value] = {...res[value], icon};
                          }
                        });
                      labelMap &&
                        Object.entries(labelMap).forEach(([value, label]) => {
                          if (value === '' || value == null) {
                            return;
                          }
                          if (!res[value]) {
                            res[value] = {label};
                          } else {
                            res[value] = {...res[value], label};
                          }
                        });

                      Object.keys(res).forEach((key, index) => {
                        const item = res[key];
                        if (!('key' in item)) {
                          item.key = key;
                        }
                        if (!('value' in item)) {
                          item.value = key;
                        }
                      });

                      return Object.values(res);
                    } else {
                      // You can use value directly later
                      return value;
                    }
                  },
                  onChange(
                    value: any,
                    oldValue: boolean,
                    model: any,
                    form: any
                  ) {
                    const res: any = {};
                    value.forEach((item: any) => {
                      if (item.value !== '' && item.value != null) {
                        res[item.value] = pick(item, [
                          'label',
                          'color',
                          'icon'
                        ]);
                      }
                    });
                    form.setValues({
                      map: undefined,
                      labelMap: undefined,
                      source: Object.keys(res).length > 0 ? res : undefined
                    });
                  }
                }),
                getSchemaTpl('valueFormula', {
                  pipeOut: (value: any) => {
                    return value == null || value === '' ? undefined : value;
                  }
                }),
                getSchemaTpl('placeholder', {
                  label: 'Placeholder',
                  pipeIn: defaultValue('-')
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },
        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'CSS class name',
              body: [
                getSchemaTpl('className', {
                  label: 'Outer layer'
                })
              ]
            }
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(StatusPlugin);
