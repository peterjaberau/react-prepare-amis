import React from 'react';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import {registerEditorPlugin, getSchemaTpl, diff} from '@/packages/amis-editor-core/src';
import {BasePlugin, BaseEventContext} from '@/packages/amis-editor-core/src';
import {schemaArrayFormat, schemaToArray} from '../util';

export class TimelinePlugin extends BasePlugin {
  static id = 'TimelinePlugin';
  rendererName = 'timeline';
  $schema = '/schemas/TimelineSchema.json';
  label: 'Timeline';
  type: 'timeline';
  name = 'Timeline';
  isBaseComponent = true;
  icon = 'fa fa-bars';
  description = 'Used to display the timeline';
  docLink = '/amis/zh-CN/components/timeline';
  tags = ['show'];
  scaffold = {
    type: 'timeline',
    label: 'Timeline',
    name: 'timeline',
    items: [
      {time: '2012-12-21', title: 'Node sample data'},
      {time: '2012-12-24', title: 'Node sample data'},
      {time: '2012-12-27', title: 'Node sample data'}
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Timeline';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) =>
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: 'sort',
                name: 'reverse',
                value: false,
                type: 'button-group-select',
                inline: false,
                size: 'sm',
                options: [
                  {label: 'Positive order', value: false},
                  {label: 'Reverse', value: true}
                ]
              },
              {
                label: 'Time axis direction',
                name: 'direction',
                value: 'vertical',
                type: 'button-group-select',
                size: 'sm',
                inline: true,
                options: [
                  {label: 'vertical', value: 'vertical'},
                  {label: 'Horizontal', value: 'horizontal'}
                ]
              },
              {
                label: tipedLabel(
                  'text position',
                  'text relative timeline position'
                ),
                name: 'mode',
                value: 'right',
                type: 'button-group-select',
                visibleOn: 'this.direction === "vertical"',
                size: 'sm',
                options: [
                  {label: 'left', value: 'right'},
                  {label: 'right', value: 'left'},
                  {label: 'Alternate sides', value: 'alternate'}
                ]
              }
            ]
          },
          {
            title: 'Data',
            body: [
              getSchemaTpl('timelineItemControl', {
                name: 'items',
                mode: 'normal'
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: 'Custom title template',
                bulk: false,
                name: 'itemTitleSchema',
                formType: 'extend',
                defaultData: {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '${label}',
                      editorSetting: {
                        mock: {
                          tpl: 'Node title'
                        }
                      },
                      wrapperComponent: ''
                    }
                  ]
                },
                form: {
                  body: [
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      block: true,
                      onClick: this.editDetail.bind(this, context),
                      label: 'Configure display template'
                    }
                  ]
                },
                pipeIn: (value: any) => {
                  if (typeof value === 'undefined') {
                    return false;
                  }
                  return typeof value !== 'string';
                },
                pipeOut: (value: any) => {
                  if (value === true) {
                    return {
                      type: 'tpl',
                      tpl: this.scaffold.label
                    };
                  }
                  return value ? value : undefined;
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'timeClassName',
                label: 'Time zone'
              }),

              getSchemaTpl('className', {
                name: 'titleClassName',
                label: 'Title area'
              }),

              getSchemaTpl('className', {
                name: 'detailClassName',
                label: 'Details area'
              })
            ]
          })
        ])
      }
    ]);

  editDetail(context: BaseEventContext) {
    const {id, schema} = context;
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = {
      type: 'tpl',
      tpl: this.scaffold.label
    };
    node &&
      value &&
      this.manager.openSubEditor({
        title: 'Configure title display template',
        value: schemaToArray(value.itemTitleSchema ?? defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, itemTitleSchema: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(TimelinePlugin);
