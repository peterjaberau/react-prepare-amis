import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BasePlugin} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {JSONPipeOut} from '@/packages/amis-editor-core/src';
import {mockValue} from '@/packages/amis-editor-core/src';

export class VideoPlugin extends BasePlugin {
  static id = 'VideoPlugin';
  // Associated renderer name
  rendererName = 'video';
  $schema = '/schemas/VideoSchema.json';

  // Component name
  name = 'Video';
  isBaseComponent = true;
  description =
    'Video control, can be used to play various video files, including flv and hls formats. ';
  docLink = '/amis/zh-CN/components/video';
  tags = ['function'];
  icon = 'fa fa-video-camera';
  pluginIcon = 'video-plugin';
  scaffold = {
    type: 'video',
    autoPlay: false,
    src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    poster: mockValue({type: 'image'})
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'Video';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: 'General',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            name: 'src',
            type: 'input-text',
            label: 'Video address',
            description:
              'You can write static values ​​or use variables, for example: <code>\\${videoSrc}</code>'
          },

          {
            name: 'poster',
            type: 'input-text',
            label: 'Video cover image address',
            description:
              'You can write static values ​​or use variables, for example: <code>\\${videoPoster}</code>'
          },

          getSchemaTpl('switch', {
            name: 'autoPlay',
            label: 'Autoplay'
          }),

          getSchemaTpl('switch', {
            name: 'muted',
            label: 'Mute'
          }),

          getSchemaTpl('switch', {
            name: 'isLive',
            label: 'Live stream',
            labelRemark: {
              className: 'm-l-xs',
              trigger: 'click',
              rootClose: true,
              placement: 'left',
              content:
                'If it is a live stream, please check it, otherwise it may not play properly.'
            }
          })
        ]
      },
      {
        title: 'Appearance',
        body: [
          {
            name: 'aspectRatio',
            label: 'Video ratio',
            type: 'button-group-select',
            size: 'sm',
            mode: 'inline',
            className: 'block',
            value: 'auto',
            options: [
              {
                label: 'Automatic',
                value: 'auto'
              },

              {
                label: '4:3',
                value: '4:3'
              },

              {
                label: '16:9',
                value: '16:9'
              }
            ]
          },

          getSchemaTpl('switch', {
            name: 'splitPoster',
            label: 'Display cover separately'
          }),

          getSchemaTpl('className')
        ]
      },
      {
        title: 'Show and hide',
        body: [getSchemaTpl('visible')]
      },
      {
        title: 'Other',
        body: [
          getSchemaTpl('ref'),
          {
            type: 'input-text',
            name: 'rates',
            label: 'Video rate',
            multiple: true,
            joinValues: false,
            extractValue: true,
            options: [0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
              item => ({
                label: item,
                value: item
              })
            )
          },

          {
            name: 'frames',
            type: 'input-text',
            label: 'Video frame information',
            description:
              'For example, if you fill in: <code>\\${videoFrames}</code>, the variable videoFrames will be searched in the current scope. If it is an object, a list of video screenshots will be generated. Click it to jump to the corresponding frame.'
          }
        ]
      }
    ])
  ];

  filterProps(props: any) {
    props.frames = JSONPipeOut(props.frames);

    return props;
  }
}

registerEditorPlugin(VideoPlugin);
