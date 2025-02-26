import {
  defaultValue,
  getSchemaTpl,
  valuePipeOut,
  RendererPluginAction,
  RendererPluginEvent,
  registerEditorPlugin,
  tipedLabel,
  BasePlugin,
  BaseEventContext
} from 'amis-editor-core';
import {ValidatorTag} from '../../validator';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';

export class FileControlPlugin extends BasePlugin {
  static id = 'FileControlPlugin';
  // Associated renderer name
  rendererName = 'input-file';
  $schema = '/schemas/FileControlSchema.json';

  // Component name
  name = 'File upload';
  isBaseComponent = true;
  icon = 'fa fa-upload';
  pluginIcon = 'input-file-plugin';
  description =
    'You can upload multiple files, and you can configure whether to upload automatically or upload large files in pieces';
  docLink = '/amis/zh-CN/components/form/input-file';
  tags = ['form item'];
  scaffold = {
    type: 'input-file',
    label: 'File upload',
    autoUpload: true,
    proxy: true,
    uploadType: 'fileReceptor',
    name: 'file'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
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
              getSchemaTpl('btnLabel'),
              getSchemaTpl('multiple', {
                replace: true,
                body: [
                  {
                    name: 'maxLength',
                    label: 'maximum number',
                    type: 'input-number'
                  }
                ]
              }),
              getSchemaTpl('switch', {
                name: 'joinValues',
                label: 'File upload path splicing',
                pipeIn: defaultValue(true)
              }),
              {
                type: 'input-text',
                name: 'delimiter',
                label: 'Splicing symbol',
                visibleOn: 'this.joinValues !== false',
                pipeIn: defaultValue(',')
              },
              {
                type: 'input-group',
                name: 'maxSize',
                label: 'maximum volume',
                body: [
                  {
                    type: 'input-number',
                    name: 'maxSize'
                  },
                  {
                    type: 'tpl',
                    addOnclassName: 'border-0 bg-none',
                    tpl: 'B'
                  }
                ]
              },
              getSchemaTpl('uploadType', {
                options: [
                  {
                    label: 'Submit with form',
                    value: 'asForm'
                  },
                  {
                    label: 'File receiver',
                    value: 'fileReceptor'
                  },
                  {
                    label: 'Object storage',
                    value: 'bos'
                  }
                ],
                pipeIn: (value: any, form: any) => value || 'fileReceptor',
                pipeOut: (value: any, form: any) => value || 'fileReceptor',
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  if (value === 'asForm') {
                    // As form data, automatic upload is enabled
                    form.setValueByName('autoUpload', true);
                    const formType =
                      form.getValueByName('formType') || 'asBlob';
                    form.setValueByName(formType, true);
                  } else {
                    form.setValueByName('asBase64', false);
                    form.setValueByName('asBlob', false);
                  }
                }
              }),

              {
                name: 'formType',
                type: 'select',
                tiled: true,
                visibleOn: 'this.uploadType === "asForm"',
                value: 'asBlob',
                label: tipedLabel(
                  'Data format',
                  '${formType ? asBase64 ? "Can be used for small files. By default, the file download address is submitted to the Form. After setting, the base64 format string of the file content is submitted to the Form." : "The File control does not take over the file upload, which is directly completed by the form\'s save interface. Choose between the Base64 option and the Base64 option." : ""}'
                ),
                options: [
                  {
                    label: 'Base64',
                    value: 'asBase64'
                  },

                  {
                    label: 'Binary',
                    value: 'asBlob'
                  }
                ],
                onChange: (
                  value: any,
                  oldValue: boolean,
                  model: any,
                  form: any
                ) => {
                  form.setValueByName('asBase64', 'asBase64' === value);
                  form.setValueByName('asBlob', 'asBlob' === value);
                }
              },

              getSchemaTpl('bos', {
                visibleOn: 'this.uploadType === "bos"'
              }),

              getSchemaTpl('proxy', {
                value: true,
                visibleOn: 'this.uploadType !== "asForm" || !this.uploadType'
              }),

              getSchemaTpl('switch', {
                name: 'autoUpload',
                label: 'Automatically upload',
                value: true,
                visibleOn: 'this.uploadType !== "asForm"'
              }),

              getSchemaTpl('switch', {
                name: 'useChunk',
                label: 'Open chunking',
                value: false,
                pipeIn: (value: any, form: any) => !!value, // 兼容auto
                visibleOn: 'this.uploadType !== "asForm"'
              }),

              {
                type: 'container',
                className: 'ae-ExtendMore mb-3',
                visibleOn:
                  'this.uploadType !== "asForm" && this.useChunk === true',
                body: [
                  {
                    type: 'input-group',
                    name: 'chunkSize',
                    label: 'Block size',
                    body: [
                      {
                        type: 'input-number',
                        name: 'chunkSize'
                      },
                      {
                        type: 'tpl',
                        addOnclassName: 'border-0 bg-none',
                        tpl: 'B'
                      }
                    ]
                  },
                  {
                    type: 'Container',
                    visibleOn:
                      'this.uploadType == "fileReceptor" && this.useChunk != false',
                    body: [
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'startChunkApi',
                        label: tipedLabel(
                          'Block preparation interface',
                          'Used for preparatory work before uploading, a file will only be called once. If an error occurs, subsequent uploading of the blocks will be interrupted.'
                        ),
                        value: '/api/upload/startChunk'
                      }),
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'chunkApi',
                        label: tipedLabel(
                          'Block upload interface',
                          'Used to receive each chunk upload. Large files will be split into multiple chunks according to chunkSize, and this interface will be called for each chunk upload.'
                        ),
                        value: '/api/upload/chunk'
                      }),
                      getSchemaTpl('apiControl', {
                        mode: 'row',
                        name: 'finishChunkApi',
                        label: tipedLabel(
                          'Upload completion interface',
                          'After all the blocks are uploaded, merge the `eTag` information collected from the uploaded files and request the backend to complete the file upload again.'
                        ),
                        value: '/api/upload/finishChunk'
                      })
                    ]
                  }
                ]
              },

              getSchemaTpl('apiControl', {
                name: 'receiver',
                label: tipedLabel(
                  'File Receiver',
                  'If not filled in by default, it will be uploaded to BOS. You can set it to your own BOS address in the system configuration.'
                ),
                className: 'inputFile-apiControl',
                renderLabel: true,
                value: '/api/upload/file',
                __isUpload: true,
                visibleOn:
                  'this.uploadType === "fileReceptor" && !this.useChunk'
              }),
              {
                type: 'input-text',
                value: '',
                name: 'accept',
                label: tipedLabel(
                  'File type',
                  'Please fill in the file suffix, multiple types are separated by <code>,</code>'
                )
              },
              getSchemaTpl('fileUrl', {
                name: 'templateUrl',
                label: tipedLabel(
                  'Template link',
                  'Applicable to scenarios with upload format requirements such as Excel upload, providing users with a template download entrance'
                )
              }),
              getSchemaTpl('switch', {
                name: 'drag',
                label: 'Drag and drop to upload',
                value: false
              }),
              getSchemaTpl('remark'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('description'),
              getSchemaTpl('autoFillApi', {
                visibleOn:
                  '!this.autoFill || this.autoFill.scene && this.autoFill.action'
              }),
              getSchemaTpl('autoFill', {
                visibleOn:
                  '!this.autoFill || !this.autoFill.scene && !this.autoFill.action'
              })
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
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer: context.info.renderer}),
          getSchemaTpl('style:classNames', {
            unsupportStatic: true,
            schema: [
              getSchemaTpl('className', {
                name: 'descriptionClassName',
                label: 'Description'
              }),
              getSchemaTpl('className', {
                name: 'btnClassName',
                label: 'Select button'
              }),
              getSchemaTpl('className', {
                name: 'btnUploadClassName',
                label: 'Upload button'
              })
            ]
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
    ]);
  };
}

registerEditorPlugin(FileControlPlugin);
