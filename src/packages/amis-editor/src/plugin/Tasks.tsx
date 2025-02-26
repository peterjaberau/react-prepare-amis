import {
  BaseEventContext,
  getI18nEnabled,
  registerEditorPlugin
} from '@/packages/amis-editor-core/src';
import {BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

export class TasksPlugin extends BasePlugin {
  static id = 'TasksPlugin';
  // Associated renderer name
  rendererName = 'tasks';
  $schema = '/schemas/TasksSchema.json';

  // Component name
  name = 'Asynchronous Task';
  isBaseComponent = true;
  description = 'Used for asynchronous task presentation or operation.';
  searchKeywords = 'Task operation collection';
  docLink = '/amis/zh-CN/components/tasks';
  tags = ['function'];
  icon = '';
  pluginIcon = 'tasks-plugin';
  scaffold = {
    type: 'tasks',
    name: 'tasks',
    items: [
      {
        label: 'hive task',
        key: 'hive',
        status: 4,
        remark:
          'View details <a target="_blank" href="http://www.baidu.com">log</a>.'
      },
      {
        label: 'small flow',
        key: 'partial',
        status: 4
      },
      {
        label: 'Full amount',
        key: 'full',
        status: 4
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Asynchronous Tasks';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            name: 'items',
            label: 'Initial task information',
            type: 'combo',
            multiple: true,
            multiLine: true,
            items: [
              getSchemaTpl('label', {
                label: 'Task name'
              }),
              {
                name: 'key',
                type: 'input-text',
                label: 'Task ID'
              },
              {
                name: 'status',
                type: 'input-number',
                label: 'Task status'
              },
              getSchemaTpl('taskRemark')
            ],
            addButtonText: 'Add new task information',
            scaffold: {
              label: 'name',
              key: 'key',
              status: 0,
              remark: 'Explanation'
            },
            description:
              'Can be left unset if the detection interface returns this information.'
          },

          getSchemaTpl('apiControl', {
            name: 'checkApi',
            label: 'Status detection interface'
          }),

          {
            name: 'interval',
            type: 'input-number',
            min: 3000,
            step: 500,
            visibleOn: 'this.checkApi',
            pipeIn: defaultValue(3000),
            label: 'Timed detection interval'
          },

          getSchemaTpl('apiControl', {
            name: 'submitApi',
            label: 'Submit interface'
          }),

          getSchemaTpl('apiControl', {
            name: 'reSubmitApi',
            label: 'Retry interface'
          }),

          getSchemaTpl('loadingConfig', {}, {context}),

          {
            type: 'divider'
          },

          getSchemaTpl('taskNameLabel'),

          getSchemaTpl('operationLabel'),

          getSchemaTpl('statusLabel'),

          getSchemaTpl('remarkLabel'),

          {
            name: 'btnText',
            label: 'Button name',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            pipeIn: defaultValue('online')
          },

          {
            name: 'retryBtnText',
            label: 'Retry button name',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            pipeIn: defaultValue('retry')
          },

          {
            name: 'statusTextMap',
            pipeIn: defaultValue([
              'Not started',
              'Ready',
              'in progress',
              'Error',
              'Completed',
              'Error'
            ]),
            type: 'input-array',
            label: 'Status label text configuration',
            multiple: true,
            addable: false,
            removable: false,
            items: getSchemaTpl('inputArrayItem')
          },

          {
            name: 'initialStatusCode',
            label: 'initial status code',
            pipeIn: defaultValue(0),
            type: 'input-number'
          },

          {
            name: 'readyStatusCode',
            label: 'Ready status code',
            pipeIn: defaultValue(1),
            type: 'input-number'
          },

          {
            name: 'loadingStatusCode',
            label: 'In progress status code',
            pipeIn: defaultValue(2),
            type: 'input-number'
          },

          {
            name: 'errorStatusCode',
            label: 'Error status code',
            pipeIn: defaultValue(3),
            type: 'input-number'
          },

          {
            name: 'finishStatusCode',
            label: 'Completion status code',
            pipeIn: defaultValue(4),
            type: 'input-number'
          },

          {
            name: 'canRetryStatusCode',
            label: 'Error but retryable status code',
            pipeIn: defaultValue(5),
            type: 'input-number'
          }
        ]
      },
      {
        title: 'Appearance',
        body: [
          getSchemaTpl('className', {
            pipeIn: defaultValue('b-a bg-white table-responsive')
          }),

          getSchemaTpl('className', {
            name: 'tableClassName',
            label: 'Table CSS class name',
            pipeIn: defaultValue('table table-striped m-b-none')
          }),

          getSchemaTpl('className', {
            name: 'btnClassName',
            label: 'Button CSS class name',
            pipeIn: defaultValue('btn-sm btn-default')
          }),

          getSchemaTpl('className', {
            name: 'retryBtnClassName',
            label: 'Retry button CSS class name',
            pipeIn: defaultValue('btn-sm btn-danger')
          }),

          {
            name: 'statusLabelMap',
            pipeIn: defaultValue([
              'label-warning',
              'label-info',
              'label-info',
              'label-danger',
              'label-success',
              'label-danger'
            ]),
            type: 'input-array',
            label: 'Status label CSS class name configuration',
            multiple: true,
            addable: false,
            removable: false,
            items: {
              type: 'input-text',
              placeholder: 'CSS class name'
            }
          }
        ]
      },
      {
        title: 'Visible and Invisible',
        body: [getSchemaTpl('visible')]
      }
    ]);
  };
}

registerEditorPlugin(TasksPlugin);
