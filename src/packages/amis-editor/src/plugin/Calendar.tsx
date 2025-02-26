import {
  registerEditorPlugin,
  RendererPluginEvent,
  BaseEventContext,
  BasePlugin,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../renderer/event-control';
import {FormulaDateType} from '../renderer/FormulaControl';

export class CalendarPlugin extends BasePlugin {
  static id = 'CalendarPlugin';
  // Associated renderer name
  rendererName = 'calendar';
  $schema = '/schemas/Calendar.json';

  // Component name
  name = 'Calendar Schedule';
  isBaseComponent = true;
  icon = 'fa fa-calendar';
  pluginIcon = 'inputDatetime';

  panelTitle = 'Calendar Schedule';

  description = 'Show calendar and schedule.';
  docLink = '/amis/zh-CN/components/calendar';
  tags = ['show'];

  scaffold = {
    type: 'calendar'
  };
  previewSchema = {
    ...this.scaffold
  };

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description: 'Trigger when the time value changes',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'click',
      eventLabel: 'click',
      description: 'Triggered when clicked',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseenter',
      eventLabel: 'Mouse Move',
      description: 'Triggered when the mouse moves in',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'mouseleave',
      eventLabel: 'Mouse out',
      description: 'Triggered when the mouse moves out',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                value: {
                  type: 'string',
                  title: 'Current date'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'clear',
      actionLabel: 'Clear',
      description: 'Clear',
      ...getActionCommonProps('clear')
    },
    {
      actionType: 'reset',
      actionLabel: 'Reset',
      description: 'Reset the value to the initial value',
      ...getActionCommonProps('reset')
    },
    {
      actionType: 'setValue',
      actionLabel: 'Assignment',
      description: 'Trigger component data update',
      ...getActionCommonProps('setValue')
    }
  ];

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: 'Attributes',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('valueFormula', {
                  rendererSchema: {
                    type: 'input-date'
                  },
                  placeholder: 'Please select a static value',
                  header: 'expression or relative value',
                  DateTimeType: FormulaDateType.IsDate,
                  label: 'Default value'
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },

        {
          title: 'Appearance',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
          ])
        },
        {
          title: 'Event',
          className: 'p-none',
          body: [
            getSchemaTpl('eventControl', {
              name: 'onEvent',
              ...getEventControlConfig(this.manager, context)
            })
          ]
        }
      ])
    ];
  };
}

registerEditorPlugin(CalendarPlugin);
