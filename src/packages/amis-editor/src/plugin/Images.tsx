import {getI18nEnabled, registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {BaseEventContext, BasePlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl, tipedLabel} from '@/packages/amis-editor-core/src';
import {mockValue} from '@/packages/amis-editor-core/src';

export class ImagesPlugin extends BasePlugin {
  static id = 'ImagesPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'images';
  $schema = '/schemas/ImagesSchema.json';

  // Component name
  name = 'Picture Collection';
  isBaseComponent = true;
  description = 'Show multiple pictures';
  docLink = '/friends/zh-CN/components/images';
  tags = ['show'];
  icon = 'fa fa-clone';
  pluginIcon = 'images-plugin';
  scaffold = {
    type: 'images',
    imageGallaryClassName: 'app-popover :AMISCSSWrapper',
    displayMode: 'thumb' // default thumbnail mode
  };
  previewSchema = {
    ...this.scaffold,
    listClassName: 'nowrap',
    thumbMode: 'cover',
    value: [
      {
        title: 'Picture 1',
        image: mockValue({type: 'image'}),
        src: mockValue({type: 'image'})
      },
      {
        title: 'Picture 2',
        image: mockValue({type: 'image'}),
        src: mockValue({type: 'image'})
      }
    ]
  };

  panelTitle = 'Picture Collection';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'Basic',
            body: (isUnderField
              ? []
              : [
                  {
                    type: 'formula',
                    name: '__mode',
                    autoSet: false,
                    formula:
                      '!this.name && !this.source && Array.isArray(this.options) ? 2 : 1'
                  },
                  {
                    label: 'data source',
                    name: '__mode',
                    type: 'button-group-select',
                    size: 'sm',
                    options: [
                      {
                        label: 'Related fields',
                        value: 1
                      },
                      {
                        label: 'Static settings',
                        value: 2
                      }
                    ],
                    onChange: (
                      value: any,
                      oldValue: any,
                      model: any,
                      form: any
                    ) => {
                      if (value !== oldValue && value == 1) {
                        form.deleteValueByName('options');
                      }
                    }
                  },
                  getSchemaTpl('sourceBindControl', {
                    label: tipedLabel(
                      'Linked Data',
                      'For example: \\${listVar}, used to associate existing data in the scope'
                    ),
                    visibleOn: 'this.__mode == 1'
                  }),
                  {
                    type: 'combo',
                    name: 'options',
                    visibleOn: 'this.__mode == 2',
                    minLength: 1,
                    label: 'Picture set data',
                    multiple: true,
                    multiLine: true,
                    addable: true,
                    removable: true,
                    value: [{}],
                    items: [
                      getSchemaTpl('imageUrl', {
                        name: 'image',
                        label: 'thumbnail'
                      }),
                      getSchemaTpl('imageUrl', {
                        name: 'src',
                        label: 'Original image'
                      }),
                      {
                        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                        label: 'Picture title',
                        name: 'title'
                      },
                      {
                        type: i18nEnabled ? 'textarea-i18n' : 'textarea',
                        label: 'Picture description',
                        name: 'caption'
                      }
                    ]
                  },
                  {
                    type: 'select',
                    name: 'displayMode',
                    label: 'Picture set mode',
                    value: 'thumb',
                    options: [
                      {
                        label: 'Thumbnail mode',
                        value: 'thumb'
                      },
                      {
                        label: 'Large picture mode',
                        value: 'full'
                      }
                    ]
                  },
                  getSchemaTpl('switch', {
                    name: 'enlargeAble',
                    label: 'Image zoom function'
                  })
                ]
            ).concat([
              getSchemaTpl('imageUrl', {
                name: 'defaultImage',
                label: tipedLabel(
                  'Placeholder',
                  'Image displayed when there is no data'
                )
              })
            ])
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
              // Deprecated
              // getSchemaTpl('switch', {
              //   name: 'showDimensions',
              // label: 'Show image size'
              // }),

              {
                name: 'thumbMode',
                type: 'select',
                label: 'Thumbnail display mode',
                mode: 'horizontal',
                labelAlign: 'left',
                horizontal: {
                  left: 5,
                  right: 7
                },
                pipeIn: defaultValue('contain'),
                options: [
                  {
                    label: 'Full width',
                    value: 'w-full'
                  },

                  {
                    label: 'Height full',
                    value: 'h-full'
                  },

                  {
                    label: 'include',
                    value: 'contain'
                  },

                  {
                    label: 'filled',
                    value: 'cover'
                  }
                ],
                visibleOn: 'this.displayMode === "thumb"'
              },

              {
                name: 'thumbRatio',
                type: 'button-group-select',
                label: 'thumbnail ratio',
                size: 'sm',
                pipeIn: defaultValue('1:1'),
                options: [
                  {
                    label: '1:1',
                    value: '1:1'
                  },

                  {
                    label: '4:3',
                    value: '4:3'
                  },

                  {
                    label: '16:9',
                    value: '16:9'
                  }
                ],
                visibleOn: 'this.displayMode === "thumb"'
              }
            ]
          },
          getSchemaTpl('theme:base', {
            classname: 'imagesControlClassName',
            title: 'Picture Collection'
          }),
          {
            title: 'Other',
            body: [
              {
                name: 'themeCss.galleryControlClassName.--image-images-prev-icon',
                label: 'left switch icon',
                type: 'icon-select',
                returnSvg: true
              },
              {
                name: 'themeCss.galleryControlClassName.--image-images-next-icon',
                label: 'right switch icon',
                type: 'icon-select',
                returnSvg: true
              },
              getSchemaTpl('theme:select', {
                label: 'Switch icon size',
                name: 'themeCss.galleryControlClassName.--image-images-item-size'
              })
            ]
          },
          getSchemaTpl('theme:cssCode')
        ])
      }
    ]);
  };
}

registerEditorPlugin(ImagesPlugin);
