import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl} from '@/packages/amis-editor-core/src';

export class AudioPlugin extends BasePlugin {
  static id = 'AudioPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'audio';
  $schema = '/schemas/AudioSchema.json';

  // Component name
  name = 'Audio';
  isBaseComponent = true;
  description = 'Audio control, can be used to play various audio files. ';
  docLink = '/amis/zh-CN/components/audio';
  tags = ['function'];
  icon = 'fa fa-music';
  pluginIcon = 'audio-plugin';
  scaffold = {
    type: 'audio',
    autoPlay: false,
    src: ''
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Audio';
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: 'General',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            isUnderField
              ? {
                  type: 'tpl',
                  inline: false,
                  className: 'text-info text-sm',
                  tpl: '<p>Currently the field content node is configured. Select the upper level for more configurations. </p>'
                }
              : null,
            getSchemaTpl('audioUrl', {
              name: 'src',
              type: 'input-text',
              label: 'Audio address',
              description:
                'Supports obtaining variables such as: <code>\\${audioSrc}</code>'
            }),
            {
              type: 'select',
              name: 'rates',
              label: 'Audio speed',
              description: 'The acceleration range is between 0.1 and 16',
              multiple: true,
              pipeIn: (value: any) =>
                Array.isArray(value) ? value.join(',') : [],
              pipeOut: (value: any) => {
                if (value && value.length) {
                  let rates = value.split(',');
                  rates = rates
                    .filter(
                      (x: string | number) =>
                        Number(x) && Number(x) > 0 && Number(x) <= 16
                    )
                    .map((x: string | number) => Number(Number(x).toFixed(1)));
                  return Array.from(new Set(rates));
                } else {
                  return [];
                }
              },
              options: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
            },
            {
              name: 'controls',
              type: 'select',
              label: 'Internal controls',
              multiple: true,
              extractValue: true,
              joinValues: false,
              options: [
                {
                  label: 'double speed',
                  value: 'rates'
                },
                {
                  label: 'Play',
                  value: 'play'
                },
                {
                  label: 'time',
                  value: 'time'
                },
                {
                  label: 'Progress',
                  value: 'process'
                },
                {
                  label: 'Volume',
                  value: 'volume'
                }
              ],
              pipeIn: defaultValue([
                'rates',
                'play',
                'time',
                'process',
                'volume'
              ]),
              labelRemark: {
                trigger: 'click',
                className: 'm-l-xs',
                rootClose: true,
                content:
                  'After selecting the speed, you also need to configure the speed in the general selection bar',
                placement: 'left'
              }
            },

            getSchemaTpl('switch', {
              name: 'autoPlay',
              label: 'Autoplay'
            }),

            getSchemaTpl('switch', {
              name: 'loop',
              label: 'Loop playback'
            })
          ]
        },
        {
          title: 'Appearance',
          body: [
            getSchemaTpl('className'),

            getSchemaTpl('switch', {
              name: 'inline',
              label: 'Inline mode',
              pipeIn: defaultValue(true)
            })
          ]
        },
        {
          title: 'Visible and Invisible',
          body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
        }
      ])
    ];
  };
}

registerEditorPlugin(AudioPlugin);
