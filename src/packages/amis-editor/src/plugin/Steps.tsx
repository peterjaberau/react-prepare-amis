/**
 * @file Steps Steps bar
 */
import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';

export class StepsPlugin extends BasePlugin {
  static id = 'StepsPlugin';
  // Associated renderer name
  rendererName = 'steps';
  $schema = '/schemas/StepsSchema.json';

  // Component name
  name = 'Step Bar';
  isBaseComponent = true;
  icon = 'fa fa-forward';
  pluginIcon = 'steps-plugin';
  description = 'Steps Step Bar';
  docLink = '/amis/zh-CN/components/steps';
  tags = ['show'];
  scaffold = {
    type: 'steps',
    value: 1,
    steps: [
      {
        title: 'First Step',
        subTitle: 'Subtitle',
        description: 'Description'
      },
      {
        Title: 'Step 2'
      },
      {
        Title: 'Step 3'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Steps';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('combo-container', {
                name: 'steps',
                label: 'Step list',
                type: 'combo',
                scaffold: {
                  type: 'wrapper',
                  body: 'sub-node content'
                },
                minLength: 2,
                multiple: true,
                draggable: true,
                items: [
                  getSchemaTpl('title', {
                    label: false,
                    placeholder: 'Title'
                  }),
                  getSchemaTpl('stepSubTitle'),
                  getSchemaTpl('stepDescription')
                ]
              }),
              {
                name: 'value',
                type: 'input-text',
                label: 'Current step',
                description: 'Start with zero'
              },
              {
                name: 'status',
                type: 'select',
                label: 'Current status',
                creatable: true,
                value: 'finish',
                options: [
                  {
                    label: 'In progress',
                    value: 'process'
                  },
                  {
                    label: 'wait',
                    value: 'wait'
                  },
                  {
                    label: 'Completed',
                    value: 'finish'
                  },
                  {
                    label: 'Error',
                    value: 'error'
                  }
                ]
              },
              getSchemaTpl('apiControl', {
                name: 'source',
                label: 'Get step interface'
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
            title: 'Basic',
            body: [
              {
                name: 'mode',
                type: 'select',
                label: 'mode',
                value: 'horizontal',
                options: [
                  {
                    label: 'horizontal',
                    value: 'horizontal'
                  },
                  {
                    label: 'vertical',
                    value: 'vertical'
                  },
                  {
                    label: 'Simple',
                    value: 'simple'
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'iconPosition',
                label: 'icon text vertical display',
                value: false
              })
            ]
          },
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      }
    ])
  ];
}

registerEditorPlugin(StepsPlugin);
