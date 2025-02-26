import {
  getSchemaTpl,
  valuePipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  BasePlugin,
  BaseEventContext,
  registerEditorPlugin,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';

const addBtnCssClassName = 'themeCss.addBtnControlClassName';
const IconCssClassName = 'themeCss.iconControlClassName';
const editorPath = '--inputImage-base';
const inputStateFunc = (visibleOn: string, state: string) => {
  return [
    getSchemaTpl('theme:border', {
      name: `${addBtnCssClassName}.border:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: 'character',
      name: `${addBtnCssClassName}.color:${state}`,
      labelMode: 'input',
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-color`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: 'background',
      name: `${addBtnCssClassName}.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-bg-color`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: 'icon',
      name: `${addBtnCssClassName}.icon-color:${state}`,
      labelMode: 'input',
      visibleOn: visibleOn,
      editorValueToken: `${editorPath}-${state}-icon-color`
    })
  ];
};

export class ImageControlPlugin extends BasePlugin {
  static id = 'ImageControlPlugin';
  // Associated renderer name
  rendererName = 'input-image';
  $schema = '/schemas/ImageControlSchema.json';

  // Component name
  name = 'Image upload';
  isBaseComponent = true;
  description =
    'You can crop pictures, limit the width, height and size of pictures, and support automatic uploading and uploading multiple pictures';
  docLink = '/amis/zh-CN/components/form/input-image';
  tags = ['form item'];
  icon = 'fa fa-crop';
  pluginIcon = 'input-image-plugin';
  scaffold = {
    type: 'input-image',
    label: 'Image upload',
    name: 'image',
    autoUpload: true,
    proxy: true,
    uploadType: 'fileReceptor',
    imageClassName: 'r w-full'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };
  notRenderFormZone = true;

  // Event definition
  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: 'value change',
      description:
        'Triggered when the uploaded file value changes (also triggered when upload fails)',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                file: {
                  type: 'object',
                  title: 'Uploaded files'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'remove',
      eventLabel: 'Remove file',
      description: 'Triggered when a file is removed',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Removed files'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'success',
      eventLabel: 'Upload successful',
      description: 'Triggered when the file is uploaded successfully',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Uploaded files'
                },
                result: {
                  type: 'object',
                  title:
                    'Response data returned after a successful remote upload request'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'fail',
      eventLabel: 'Upload failed',
      description: 'Triggered when uploading a file fails',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: 'Data',
              properties: {
                item: {
                  type: 'object',
                  title: 'Uploaded files'
                },
                error: {
                  type: 'object',
                  title:
                    'Error message returned after remote upload request fails'
                }
              }
            }
          }
        }
      ]
    }
  ];

  //Action definition
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: 'Clear data',
      description: 'Clear selected files',
      ...getActionCommonProps('clear')
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
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),

              {
                type: 'input-text',
                name: 'value',
                label: 'Default value',
                visibleOn: 'typeof this.value !== "undefined"'
              },

              {
                type: 'input-text',
                value: '.jpeg, .jpg, .png, .gif',
                name: 'accept',
                label: tipedLabel(
                  'Image type',
                  'Please fill in the image suffix or <code>MimeType</code>, separate multiple types with <code>,</code>'
                )
              },

              {
                type: 'input-text',
                name: 'frameImage',
                label: 'Placeholder image address'
              },

              getSchemaTpl('uploadType', {
                visibleOn: 'this.submitType === "asUpload" || !this.submitType',
                pipeIn: (value: any, form: any) => value || 'fileReceptor',
                pipeOut: (value: any, form: any) => value || 'fileReceptor'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                name: 'receiver',
                label: tipedLabel(
                  'File Receiver',
                  'File receiving interface, if not filled in by default, it will be uploaded to hiphoto'
                ),
                visibleOn: 'this.uploadType === "fileReceptor"',
                value: '/api/upload',
                __isUpload: true
              }),

              getSchemaTpl('bos', {
                visibleOn: 'this.uploadType === "bos"'
              }),

              getSchemaTpl('proxy', {
                value: true
              }),
              // getSchemaTpl('autoFill'),

              getSchemaTpl('multiple', {
                patch: {
                  value: false,
                  visibleOn: '!this.crop',
                  label: tipedLabel(
                    'Multiple selections are allowed',
                    'After turning it on, the cropping function cannot be turned on at the same time'
                  )
                },
                body: [
                  {
                    name: 'maxLength',
                    label: 'maximum number',
                    type: 'input-number'
                  }
                ]
              }),

              getSchemaTpl('switch', {
                name: 'hideUploadButton',
                label: 'Hide upload button',
                value: false
              }),

              getSchemaTpl('switch', {
                name: 'autoUpload',
                label: 'Automatically upload',
                value: false
              }),

              // getSchemaTpl('switch', {
              //   name: 'compress',
              //   value: true,
              //   label: tipedLabel(
              // 'Turn on compression',
              // 'Implemented by hiphoto, custom interface will be invalid'
              //   )
              // }),
              // {
              //   type: 'container',
              //   className: 'ae-ExtendMore mb-3',
              //   visibleOn: 'this.compress',
              //   name: 'compressOptions',
              //   body: [
              //     {
              //       type: 'input-number',
              // label: 'maximum width',
              //       name: 'compressOptions.maxWidth'
              //     },

              //     {
              //       type: 'input-number',
              // label: 'maximum height',
              //       name: 'compressOptions.maxHeight'
              //     }
              //   ]
              // },

              // getSchemaTpl('switch', {
              //   name: 'showCompressOptions',
              // label: 'Show compression options'
              // }),

              getSchemaTpl('switch', {
                name: 'crop',
                visibleOn: '!this.multiple',
                label: tipedLabel(
                  'Turn on cropping',
                  'After turning it on, you cannot turn on multiple selection mode at the same time'
                ),
                pipeIn: (value: any) => !!value
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.crop',
                body: [
                  {
                    name: 'crop.aspectRatio',
                    type: 'input-text',
                    label: 'cropping ratio',
                    pipeOut: valuePipeOut
                  },

                  getSchemaTpl('switch', {
                    name: 'crop.rotatable',
                    label: 'Can be rotated when cropping',
                    pipeOut: valuePipeOut
                  }),

                  getSchemaTpl('switch', {
                    name: 'crop.scalable',
                    label: 'Scalable when cropping',
                    pipeOut: valuePipeOut
                  }),

                  {
                    name: 'crop.viewMode',
                    type: 'select',
                    label: 'Crop area',
                    value: 1,
                    options: [
                      {label: 'Unlimited', value: 0},
                      {label: 'Drawing area', value: 1}
                    ],
                    pipeOut: valuePipeOut
                  },
                  {
                    name: 'cropQuality',
                    type: 'input-number',
                    label: tipedLabel(
                      'Compression quality',
                      'After cropping, it will be regenerated and the volume may become larger. You need to set the compression quality to reduce the volume. The smaller the value, the higher the compression rate.'
                    ),
                    step: 0.1,
                    min: 0.1,
                    max: 1,
                    value: 0.7
                  }
                ]
              },

              getSchemaTpl('switch', {
                name: 'limit',
                label: 'Image restrictions',
                pipeIn: (value: any) => !!value,
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (!value) {
                    form.setValues({
                      maxSize: undefined
                    });
                  }
                }
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn: 'this.limit',
                body: [
                  {
                    name: 'maxSize',
                    type: 'input-number',
                    suffix: 'B',
                    label: tipedLabel(
                      'Maximum volume',
                      'Upload is not allowed if the size exceeds the limit, in bytes'
                    )
                  },
                  {
                    type: 'input-number',
                    name: 'limit.width',
                    label: tipedLabel(
                      'width',
                      'Validation priority is higher than max width and max width'
                    )
                  },

                  {
                    type: 'input-number',
                    name: 'limit.height',
                    label: tipedLabel(
                      'high',
                      'Check priority is higher than max height and max height'
                    )
                  },

                  {
                    type: 'input-number',
                    name: 'limit.maxWidth',
                    label: 'Maximum width'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.maxHeight',
                    label: 'Maximum height'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.minWidth',
                    label: 'Minimum width'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.minHeight',
                    label: 'Minimum height'
                  },

                  {
                    type: 'input-number',
                    name: 'limit.aspectRatio',
                    label: 'Aspect ratio'
                  },

                  {
                    type: 'input-text',
                    name: 'limit.aspectRatioLabel',
                    label: tipedLabel(
                      'Aspect ratio description',
                      'When the aspect ratio does not meet the conditions, this description will be displayed as a prompt message'
                    )
                  }
                ]
              }
            ]
          },
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          }),
          getSchemaTpl('validation', {tag: ValidatorTag.File})
        ])
      },
      {
        title: 'Appearance',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
            {
              title: 'Basic style',
              body: [
                {
                  type: 'select',
                  name: '__editorState',
                  label: 'status',
                  selectFirst: true,
                  options: [
                    {
                      label: 'General',
                      value: 'default'
                    },
                    {
                      label: 'Suspension',
                      value: 'hover'
                    },
                    {
                      label: 'click',
                      value: 'active'
                    }
                  ]
                },
                ...inputStateFunc(
                  "${__editorState == 'default' || !__editorState}",
                  'default'
                ),
                ...inputStateFunc("${__editorState == 'hover'}", 'hover'),
                ...inputStateFunc("${__editorState == 'active'}", 'active'),
                getSchemaTpl('theme:radius', {
                  name: `${addBtnCssClassName}.border-radius`,
                  label: 'Rounded corners',
                  editorValueToken: `${editorPath}-default`
                }),
                {
                  name: `${addBtnCssClassName}.--inputImage-base-default-icon`,
                  label: 'Select icon',
                  type: 'icon-select',
                  returnSvg: true
                },
                getSchemaTpl('theme:select', {
                  name: `${IconCssClassName}.iconSize`,
                  label: 'icon size',
                  editorValueToken: `${editorPath}-default-icon-size`
                }),
                getSchemaTpl('theme:select', {
                  name: `${IconCssClassName}.margin-bottom`,
                  label: 'icon bottom margin',
                  editorValueToken: `${editorPath}-default-icon-margin`
                })
              ]
            },
            getSchemaTpl('theme:cssCode', {
              themeClass: [
                {
                  name: 'Image upload button',
                  value: 'addOn',
                  className: 'addBtnControlClassName',
                  state: ['default', 'hover', 'active']
                },
                {
                  name: 'Upload Icon',
                  value: 'icon',
                  className: 'iconControlClassName'
                }
              ],
              isFormItem: true
            })
          ],
          {...context?.schema, configTitle: 'style'}
        )
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
    ]);
  };
}

registerEditorPlugin(ImageControlPlugin);
