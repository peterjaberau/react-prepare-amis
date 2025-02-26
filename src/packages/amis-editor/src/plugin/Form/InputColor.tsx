import {registerEditorPlugin} from '@/packages/amis-editor-core/src';
import {defaultValue, getSchemaTpl, tipedLabel} from '@/packages/amis-editor-core/src';
import {ValidatorTag} from '../../validator';
import {BasePlugin, BaseEventContext} from '@/packages/amis-editor-core/src';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import tinyColor from 'tinycolor2';

function convertColor(value: string[], format: string): string[];
function convertColor(value: string, format: string): string;
function convertColor(value: any, format: string): any {
  format = format.toLocaleLowerCase();

  function convert(v: string) {
    const color = tinyColor(v);
    if (!color.isValid()) {
      return '';
    }
    if (format !== 'rgba') {
      color.setAlpha(1);
    }
    switch (format) {
      case 'hex':
        return color.toHexString();
      case 'hsl':
        return color.toHslString();
      case 'rgb':
        return color.toRgbString();
      case 'rgba':
        const {r, g, b, a} = color.toRgb();
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      default:
        return color.toString();
    }
  }

  return Array.isArray(value) ? value.map(convert) : convert(value);
}

const presetColors = [
  '#ffffff',
  '#000000',
  '#d0021b',
  '#f5a623',
  '#f8e71c',
  '#7ED321',
  '#4A90E2',
  '#9013fe'
];

const colorFormat = ['hex', 'hexa', 'rgb', 'rgba', 'hsl'];
const presetColorsByFormat = colorFormat.reduce<{
  [propsName: string]: string[];
}>((res, fmt) => {
  res[fmt] = convertColor(presetColors, fmt);
  return res;
}, {});
export class ColorControlPlugin extends BasePlugin {
  static id = 'ColorControlPlugin';
  static scene = ['layout'];
  // Associated renderer name
  rendererName = 'input-color';
  $schema = '/schemas/ColorControlSchema.json';

  // Component name
  name = 'Color box';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-color-plugin';
  description =
    'Support <code>hex, hexa, hls, rgb, rgba</code> formats, the default is <code>hex</code> format';
  searchKeywords = 'color selector';
  docLink = '/amis/zh-CN/components/form/input-color';
  tags = ['form item'];
  scaffold = {
    type: 'input-color',
    label: 'color',
    name: 'color'
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
  panelTitle = 'Color Box';
  notRenderFormZone = true;
  panelJustify = true;
  getConditionalColorPanel(format: string) {
    const visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
    return {
      label: 'Default value',
      name: 'value',
      type: 'input-color',
      format,
      clearable: true,
      visibleOn: `this.format==="${format}"${visibleOnNoFormat}`,
      presetColors: presetColorsByFormat[format]
    };
  }
  getConditionalColorComb(format: string) {
    const visibleOnNoFormat = format === 'hex' ? ' || !this.format' : '';
    return getSchemaTpl('combo-container', {
      type: 'combo',
      mode: 'normal',
      name: 'presetColors',
      items: [
        {
          type: 'input-color',
          format,
          name: 'color',
          clearable: false,
          presetColors: presetColorsByFormat[format]
        }
      ],
      draggable: false,
      multiple: true,
      visibleOn: `this.presetColors !== undefined && (this.format === "${format}"${visibleOnNoFormat})`,
      onChange: (colors: any, oldValue: any, model: any, form: any) => {
        if (Array.isArray(colors) && colors.length === 0) {
          form.setValueByName('allowCustomColor', true);
        }
      },
      pipeIn: (value: any) =>
        value.map((color = '', index: number) => ({
          key: `${color}-${index}`,
          color: convertColor(color, format)
        })),
      pipeOut: (value: any[]) => value.map(({color = ''}) => color)
    });
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    const formatOptions = colorFormat.map(value => ({
      label: value.toUpperCase(),
      value
    }));

    return getSchemaTpl('tabs', [
      {
        title: 'Attributes',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: 'Basic',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('formItemName', {
                  required: true
                }),
                getSchemaTpl('label'),
                {
                  type: 'select',
                  label: 'value format',
                  name: 'format',
                  value: 'hex',
                  options: formatOptions,
                  onChange: (
                    format: any,
                    oldFormat: any,
                    model: any,
                    form: any
                  ) => {
                    const {value, presetColors} = form.data;
                    if (value) {
                      form.setValueByName('value', convertColor(value, format));
                    }
                    if (Array.isArray(presetColors)) {
                      form.setValueByName(
                        'presetColors',
                        convertColor(presetColors, format)
                      );
                    }
                  }
                },
                // todo: To be optimized
                [
                  ...formatOptions.map(({value}) =>
                    this.getConditionalColorPanel(value)
                  )
                ],
                // {
                // label: 'Default value',
                //   name: 'value',
                //   type: 'input-color',
                //   format: '${format}'
                // },
                getSchemaTpl('clearable'),
                getSchemaTpl('labelRemark'),
                getSchemaTpl('remark'),
                getSchemaTpl('placeholder'),
                getSchemaTpl('description'),
                getSchemaTpl('autoFillApi')
              ]
            },
            {
              title: 'Color Picker',
              body: [
                getSchemaTpl('switch', {
                  label: tipedLabel(
                    'Hide color palette',
                    'When on, manual color input is prohibited and you can only select from the alternative colors'
                  ),
                  name: 'allowCustomColor',
                  disabledOn:
                    'Array.isArray(presetColors) && presetColors.length === 0',
                  pipeIn: (value: any) =>
                    typeof value === 'undefined' ? false : !value,
                  pipeOut: (value: boolean) => !value
                }),
                getSchemaTpl('switch', {
                  label: tipedLabel(
                    'Alternative color',
                    'Alternative color at the bottom of the color picker'
                  ),
                  name: 'presetColors',
                  onText: 'Custom',
                  offText: 'Default',
                  pipeIn: (value: any) =>
                    typeof value === 'undefined' ? false : true,
                  pipeOut: (
                    value: any,
                    originValue: any,
                    {format = 'hex'}: any
                  ) => {
                    return !value ? undefined : presetColorsByFormat[format];
                  },
                  onChange: (
                    colors: any,
                    oldValue: any,
                    model: any,
                    form: any
                  ) => {
                    if (Array.isArray(colors) && colors.length === 0) {
                      form.setValueByName('allowCustomColor', true);
                    }
                  }
                }),
                ...formatOptions.map(({value}) =>
                  this.getConditionalColorComb(value)
                )
              ]
            },
            getSchemaTpl('status', {
              isFormItem: true
            }),
            getSchemaTpl('validation', {
              tag: ValidatorTag.MultiSelect
            })
          ],
          {...context?.schema, configTitle: 'props'}
        )
      },
      {
        title: 'Appearance',
        body: getSchemaTpl(
          'collapseGroup',
          [
            getSchemaTpl('style:formItem', {renderer}),
            getSchemaTpl('style:classNames', {
              schema: [
                getSchemaTpl('className', {
                  label: 'Description',
                  name: 'descriptionClassName',
                  visibleOn: 'this.description'
                })
              ]
            })
          ],
          {...context?.schema, configTitle: 'style'}
        )
      }
      // {
      // title: 'Event',
      //   className: 'p-none',
      //   body: [
      //     getSchemaTpl('eventControl', {
      // name: 'onEvent',
      //       ...getEventControlConfig(this.manager, context)
      //     })
      //   ]
      // }
    ]);
  };
}

registerEditorPlugin(ColorControlPlugin);
