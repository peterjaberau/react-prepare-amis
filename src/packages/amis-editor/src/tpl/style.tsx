import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  tipedLabel
} from '@/packages/amis-editor-core/src';
import {createAnimationStyle, formateId, type SchemaCollection} from '@/packages/amis/src';
import kebabCase from 'lodash/kebabCase';
import {styleManager} from '@/packages/amis-core/src';

const animationOptions = {
  enter: [
    {
      label: 'Fade in',
      children: [
        {
          label: 'Fade in',
          value: 'fadeIn'
        },
        {
          value: 'fadeInDown',
          label: 'Fade in from top'
        },
        {
          value: 'fadeInDownBig',
          label: 'Fade in from top (enhanced effect)'
        },
        {
          value: 'fadeInLeft',
          label: 'Fade in from left'
        },
        {
          value: 'fadeInLeftBig',
          label: 'Fade in from the left (enhanced effect)'
        },
        {
          value: 'fadeInRight',
          label: 'Fade in from the right'
        },
        {
          value: 'fadeInRightBig',
          label: 'Fade in from the right (enhanced effect)'
        },
        {
          value: 'fadeInUp',
          label: 'Fade in from bottom'
        },
        {
          value: 'fadeInUpBig',
          label: 'Fade in from bottom (enhanced effect)'
        }
      ]
    },
    {
      label: 'Rebound',
      children: [
        {
          value: 'backInDown',
          label: 'Enter from the top rebound'
        },
        {
          value: 'backInLeft',
          label: 'Enter from the left rebound'
        },
        {
          value: 'backInRight',
          label: 'Enter from right rebound'
        },
        {
          value: 'backInUp',
          label: 'Enter from bottom rebound'
        }
      ]
    },
    {
      label: 'rotation',
      children: [
        {
          value: 'rotateIn',
          label: 'Rotate to enter'
        },
        {
          value: 'rotateInDownLeft',
          label: 'Rotate to enter from the upper left corner'
        },
        {
          value: 'rotateInDownRight',
          label: 'Rotate to enter from the upper right corner'
        },
        {
          value: 'rotateInUpLeft',
          label: 'Rotate to enter from the lower left corner'
        },
        {
          value: 'rotateInUpRight',
          label: 'Rotate to enter from the lower right corner'
        }
      ]
    },
    {
      label: 'Slide',
      children: [
        {
          value: 'slideInUp',
          label: 'Slide in from below'
        },
        {
          value: 'slideInDown',
          label: 'Slide in from top'
        },
        {
          value: 'slideInLeft',
          label: 'Slide in from the left'
        },
        {
          value: 'slideInRight',
          label: 'Slide in from the right'
        }
      ]
    },
    {
      label: 'Turn page',
      children: [
        {
          value: 'flip',
          label: 'Turn the page'
        },
        {
          value: 'flipInY',
          label: 'Horizontal page flip'
        },
        {
          value: 'flipInX',
          label: 'Vertical page flip'
        }
      ]
    },
    {
      label: 'bounce',
      children: [
        {
          value: 'bounceIn',
          label: 'Bounce into'
        },
        {
          value: 'bounceInDown',
          label: 'Bounce in from above'
        },
        {
          value: 'bounceInLeft',
          label: 'Bounce in from the left'
        },
        {
          value: 'bounceInRight',
          label: 'Bounce in from the right'
        },
        {
          value: 'bounceInUp',
          label: 'Bounce in from the bottom'
        }
      ]
    },
    {
      label: 'zoom',
      children: [
        {
          value: 'zoomIn',
          label: 'Zoom in'
        },
        {
          value: 'zoomInDown',
          label: 'Zoom in from top'
        },
        {
          value: 'zoomInLeft',
          label: 'Zoom in from the left'
        },
        {
          value: 'zoomInRight',
          label: 'Zoom in from the right'
        },
        {
          value: 'zoomInUp',
          label: 'Zoom in from bottom'
        }
      ]
    },
    {
      label: 'Other',
      children: [
        {
          value: 'lightSpeedInLeft',
          label: 'Enter from the left at the speed of light'
        },
        {
          value: 'lightSpeedInRight',
          label: 'Enter from the right at the speed of light'
        },
        {
          value: 'rollIn',
          label: 'Scroll to enter'
        }
      ]
    }
  ],
  attention: [
    {
      label: 'bounce',
      value: 'bounce'
    },
    {
      label: 'Flashing',
      value: 'flash'
    },
    {
      value: 'headShake',
      label: 'Shake your head'
    },
    {
      value: 'heartBeat',
      label: 'heartbeat'
    },
    {
      value: 'jello',
      label: 'jelly'
    },
    {
      label: 'jump',
      value: 'pulse'
    },
    {
      label: 'sway',
      value: 'swing'
    },
    {
      label: 'vibration',
      value: 'tada'
    },
    {
      label: 'shake',
      value: 'wobble'
    },
    {
      label: 'shake',
      value: 'shake'
    },
    {
      value: 'shakeX',
      label: 'Horizontal jitter'
    },
    {
      value: 'shakeY',
      label: 'Vertical jitter'
    },
    {
      value: 'rubberBand',
      label: 'rubber band'
    }
  ],
  hover: [
    {
      label: 'Magnification effect',
      value: 'hoverZoomIn'
    },
    {
      label: 'Zoom out effect',
      value: 'hoverZoomOut'
    },
    {
      label: 'Shadow Enhancement',
      value: 'hoverShadow'
    },
    {
      label: 'luminous border',
      value: 'hoverBorder'
    },
    {
      label: 'Content rises',
      value: 'hoverUp'
    },
    {
      label: 'Content decline',
      value: 'hoverDown'
    },
    {
      label: 'Content flip',
      value: 'hoverFlip'
    }
  ],
  exit: [
    {
      label: 'Fade out',
      children: [
        {
          label: 'Fade out',
          value: 'fadeOut'
        },
        {
          value: 'fadeOutDown',
          label: 'Fade down'
        },
        {
          value: 'fadeOutDownBig',
          label: 'Fade out downwards (enhance the effect)'
        },
        {
          value: 'fadeOutLeft',
          label: 'Fade out to the left'
        },
        {
          value: 'fadeOutLeftBig',
          label: 'Fade out to the left (enhance the effect)'
        },
        {
          value: 'fadeOutRight',
          label: 'Fade to the right'
        },
        {
          value: 'fadeOutRightBig',
          label: 'Fade to the right (enhance the effect)'
        },
        {
          value: 'fadeOutUp',
          label: 'Fade out upwards'
        },
        {
          value: 'fadeOutUpBig',
          label: 'Fade out upwards (enhance the effect)'
        }
      ]
    },
    {
      label: 'Rebound',
      children: [
        {
          value: 'backOutDown',
          label: 'Bounce downward to exit'
        },
        {
          value: 'backOutLeft',
          label: 'Rebound to the left to exit'
        },
        {
          value: 'backOutRight',
          label: 'Rebound to the right to exit'
        },
        {
          value: 'backOutUp',
          label: 'Bounce upwards to exit'
        }
      ]
    },
    {
      label: 'rotation',
      children: [
        {
          value: 'rotateOut',
          label: 'Rotate to exit'
        },
        {
          value: 'rotateOutDownLeft',
          label: 'Upper left corner rotate to exit'
        },
        {
          value: 'rotateOutDownRight',
          label: 'Upper right corner rotate to exit'
        },
        {
          value: 'rotateOutUpLeft',
          label: 'Rotate to exit from lower left corner'
        },
        {
          value: 'rotateOutUpRight',
          label: 'Rotate to exit from the lower right corner'
        }
      ]
    },
    {
      label: 'Slide',
      children: [
        {
          value: 'slideOutUp',
          label: 'Slide up'
        },
        {
          value: 'slideOutDown',
          label: 'Slide down'
        },
        {
          value: 'slideOutLeft',
          label: 'Slide left'
        },
        {
          value: 'slideOutRight',
          label: 'Slide right'
        }
      ]
    },
    {
      label: 'Turn page',
      children: [
        {
          value: 'flipOutY',
          label: 'Horizontal page flip'
        },
        {
          value: 'flipOutX',
          label: 'Vertical page flip'
        }
      ]
    },
    {
      label: 'bounce',
      children: [
        {
          value: 'bounceOut',
          label: 'Bounce exit'
        },
        {
          value: 'bounceOutDown',
          label: 'Bounce down to exit'
        },
        {
          value: 'bounceOutLeft',
          label: 'Bounce left to exit'
        },
        {
          value: 'bounceOutRight',
          label: 'Bounce right to exit'
        },
        {
          value: 'bounceOutUp',
          label: 'Bounce upward to exit'
        }
      ]
    },
    {
      label: 'zoom',
      children: [
        {
          value: 'zoomOut',
          label: 'Zoom exit'
        },
        {
          value: 'zoomOutDown',
          label: 'Zoom up to exit'
        },
        {
          value: 'zoomOutLeft',
          label: 'Zoom left to exit'
        },
        {
          value: 'zoomOutRight',
          label: 'Zoom right to exit'
        },
        {
          value: 'zoomOutUp',
          label: 'Zoom down to exit'
        }
      ]
    },
    {
      label: 'Other',
      children: [
        {
          value: 'lightSpeedOutLeft',
          label: 'Exit left at the speed of light'
        },
        {
          value: 'lightSpeedOutRight',
          label: 'Exit right at the speed of light'
        },
        {
          value: 'rollOut',
          label: 'Scroll to exit'
        }
      ]
    }
  ]
};

setSchemaTpl('style:formItem', ({renderer, schema}: any) => {
  return {
    title: 'Form Item',
    key: 'formItem',
    body: [
      getSchemaTpl('formItemMode'),
      getSchemaTpl('labelHide'),
      getSchemaTpl('horizontal'),
      renderer?.sizeMutable !== false ? getSchemaTpl('formItemSize') : null
      // getSchemaTpl('formItemInline')
    ].concat(schema)
  };
});

setSchemaTpl('theme:formItem', ({schema, hidSize}: any = {hidSize: false}) => {
  return {
    title: 'Form Item',
    key: 'formItem',
    body: [
      getSchemaTpl('theme:labelHide'),
      !hidSize && {
        type: 'col-size',
        name: '__size',
        label: 'width'
      }
    ]
      .filter(Boolean)
      .concat(schema)
  };
});

setSchemaTpl(
  'style:classNames',
  (config: {
    schema: SchemaCollection;
    isFormItem: boolean;
    unsupportStatic?: boolean;
    collapsed?: boolean;
  }) => {
    const {
      isFormItem = true,
      unsupportStatic = false,
      schema = [],
      collapsed = true
    } = config || {};

    return {
      title: 'CSS class name',
      collapsed,
      body: (isFormItem
        ? [
            getSchemaTpl('className', {
              label: 'Form item'
            }),
            getSchemaTpl('className', {
              label: 'Title',
              name: 'labelClassName'
            }),
            getSchemaTpl('className', {
              label: 'Controls',
              name: 'inputClassName'
            }),
            ...(unsupportStatic
              ? []
              : [
                  getSchemaTpl('className', {
                    label: 'Static display',
                    name: 'staticClassName'
                  })
                ])
          ]
        : [
            getSchemaTpl('className', {
              label: 'Outer layer'
            })
          ]
      ).concat(schema)
    };
  }
);

setSchemaTpl('style:others', (schemas: any[] = []) => ({
  title: 'Other items',
  body: [...schemas]
}));

/**
 * General CSS Style controls
 * @param {string | Array<string>} exclude configuration keys that need to be hidden
 * @param {string | Array<string>} include The configuration key included. When it exists, it has a higher priority than exclude
 */
setSchemaTpl(
  'style:common',
  (exclude: string[] | string, include: string[] | string) => {
    // keys are uniformly converted to Kebab case, eg: boxShadow => bos-shadow
    exclude = (
      exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : []
    ).map((key: string) => kebabCase(key));

    include = (
      include ? (Array.isArray(include) ? include : [include]) : []
    ).map((key: string) => kebabCase(key));

    return [
      {
        header: 'Layout',
        key: 'layout',
        body: [
          {
            type: 'style-display',
            label: false,
            name: 'style'
          }
        ].filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
      },
      {
        header: 'character',
        key: 'font',
        body: [
          {
            type: 'style-font',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: 'Inside and outside margins',
        key: 'box-model',
        body: [
          {
            type: 'style-box-model',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: 'background',
        key: 'background',
        body: [
          {
            type: 'style-background',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: 'border',
        key: 'border',
        body: [
          {
            type: 'style-border',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: 'Shadow',
        key: 'box-shadow',
        body: [
          {
            type: 'style-box-shadow',
            label: false,
            name: 'style.boxShadow'
          }
        ]
      },
      {
        header: 'Other',
        key: 'other',
        body: [
          {
            label: 'Transparency',
            name: 'style.opacity',
            min: 0,
            max: 1,
            step: 0.05,
            type: 'input-range',
            pipeIn: defaultValue(1),
            marks: {
              '0%': '0',
              '50%': '0.5',
              '100%': '1'
            }
          },
          {
            label: 'Cursor type',
            name: 'style.cursor',
            type: 'select',
            mode: 'row',
            menuTpl: {
              type: 'html',
              // @ts-ignore
              html: "<span style='cursor:${value};'>${label}</span><code class='ae-Code'>${value}</code>",
              className: 'ae-selection-code'
            },
            pipIn: defaultValue('default'),
            options: [
              {label: 'Default', value: 'default'},
              {label: 'Automatic', value: 'auto'},
              {label: 'No pointer', value: 'none'},
              {label: 'Suspension', value: 'pointer'},
              {label: 'Help', value: 'help'},
              {label: 'text', value: 'text'},
              {label: 'cell', value: 'cell'},
              {label: 'crosshair', value: 'crosshair'},
              {label: 'Moveable', value: 'move'},
              {label: 'disabled', value: 'not-allowed'},
              {label: 'Grabable', value: 'grab'},
              {label: 'Zoom in', value: 'zoom-in'},
              {label: 'zoom out', value: 'zoom-out'}
            ]
          }
        ]
      }
    ].filter(item =>
      include.length ? ~include.indexOf(item.key) : !~exclude.indexOf(item.key)
    );
  }
);

/**
 * Width and height configuration controls
 * @param {object | undefined} options witdthSchema (width control configuration) heightSchema (height control configuration)
 */
setSchemaTpl('style:widthHeight', (option: any = {}) => {
  const {widthSchema = {}, heightSchema = {}} = option;
  return {
    type: 'container',
    body: [
      {
        type: 'input-number',
        name: 'width',
        label: 'width',
        unitOptions: ['px', '%', 'rem', 'em', 'vw'],
        ...widthSchema
      },
      {
        type: 'input-number',
        name: 'height',
        label: 'Height',
        unitOptions: ['px', '%', 'rem', 'em', 'vh'],
        ...heightSchema
      }
    ]
  };
});

/**
 * Style-related property panels, which are separated because they are expected to be more numerous
 */
export const styleTpl = {
  name: 'style',
  type: 'combo',
  label: '',
  noBorder: true,
  multiLine: true,
  items: [
    {
      type: 'fieldSet',
      title: 'Character',
      body: [
        {
          type: 'group',
          body: [
            {
              label: 'text size',
              type: 'input-text',
              name: 'fontSize'
            },
            {
              label: 'Text thickness',
              name: 'fontWeight',
              type: 'select',
              options: ['normal', 'bold', 'lighter', 'bolder']
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: 'text color',
              type: 'input-color',
              name: 'color'
            },
            {
              label: 'Alignment',
              name: 'textAlign',
              type: 'select',
              options: [
                'left',
                'right',
                'center',
                'justify',
                'justify-all',
                'start',
                'end',
                'match-parent'
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: 'Background',
      body: [
        {
          label: 'color',
          name: 'backgroundColor',
          type: 'input-color'
        },
        getSchemaTpl('imageUrl', {
          name: 'backgroundImage'
        })
      ]
    },
    {
      type: 'fieldSet',
      title: 'Margin',
      body: [
        {
          type: 'group',
          label: 'Margin',
          body: [
            {
              label: 'up',
              name: 'marginTop',
              type: 'input-text'
            },
            {
              label: 'Right',
              name: 'marginRight',
              type: 'input-text'
            },
            {
              label: 'Next',
              name: 'marginBottom',
              type: 'input-text'
            },
            {
              label: 'Left',
              name: 'marginLeft',
              type: 'input-text'
            }
          ]
        },
        {
          type: 'group',
          label: 'Padding',
          body: [
            {
              label: 'up',
              name: 'paddingTop',
              type: 'input-text'
            },
            {
              label: 'Right',
              name: 'paddingRight',
              type: 'input-text'
            },
            {
              label: 'Next',
              name: 'paddingBottom',
              type: 'input-text'
            },
            {
              label: 'Left',
              name: 'paddingLeft',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: 'Border',
      body: [
        {
          type: 'group',
          body: [
            {
              label: 'Style',
              name: 'borderStyle',
              type: 'select',
              options: ['none', 'solid', 'dotted', 'dashed']
            },
            {
              label: 'color',
              name: 'borderColor',
              type: 'input-color'
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: 'width',
              name: 'borderWidth',
              type: 'input-text'
            },
            {
              label: 'Rounded corner width',
              name: 'borderRadius',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: 'Special Effects',
      body: [
        {
          label: 'Transparency',
          name: 'opacity',
          min: 0,
          max: 1,
          step: 0.05,
          type: 'input-range',
          pipeIn: defaultValue(1)
        },
        {
          label: 'Shadow',
          name: 'boxShadow',
          type: 'input-text'
        }
      ]
    }
  ]
};

/**
 * New theme
 */

//css class name
setSchemaTpl('theme:cssCode', () => {
  return {
    title: 'Custom style',
    body: [
      {
        type: 'theme-cssCode',
        label: false
      }
    ]
  };
});

// single css class name
setSchemaTpl(
  'theme:singleCssCode',
  (options: {
    selectors: {
      label: string;
      selector: string;
      isRoot?: boolean;
    }[];
  }) => {
    const {selectors} = options;
    return {
      title: 'Custom style',
      name: 'wrapperCustomStyle',
      body: selectors?.map(
        (item: {label: string; selector: string; isRoot?: boolean}) => {
          const {isRoot, selector} = item;
          const _selector = isRoot ? 'root' : selector;
          const name = `wrapperCustomStyle[${_selector}]`;
          return {
            mode: 'default',
            name,
            type: 'ae-single-theme-cssCode',
            label: false,
            selector: item
          };
        }
      )
    };
  }
);

// form label
setSchemaTpl('theme:form-label', () => {
  return {
    title: 'Title style',
    visibleOn: 'this.label !== false',
    body: [
      {
        type: 'label-align',
        name: 'labelAlign',
        label: 'Location'
      },
      getSchemaTpl('theme:select', {
        label: 'width',
        name: 'labelWidth',
        hiddenOn: 'this.labelAlign == "top"'
      }),

      getSchemaTpl('theme:font', {
        label: 'character',
        name: 'themeCss.labelClassName.font:default',
        hasSenior: false,
        editorValueToken: '--Form-item'
      }),
      getSchemaTpl('theme:paddingAndMargin', {
        name: 'themeCss.labelClassName.padding-and-margin:default'
      })
    ]
  };
});

// form description
setSchemaTpl('theme:form-description', () => {
  return {
    title: 'Description style',
    visibleOn: 'this.description',
    body: [
      getSchemaTpl('theme:font', {
        label: 'character',
        name: 'themeCss.descriptionClassName.font:default',
        editorValueToken: '--Form-description'
      }),
      {
        label: 'Top spacing',
        type: 'amis-theme-select',
        name: 'themeCss.descriptionClassName.margin-top:default',
        options: '${sizesOptions}',
        editorValueToken: '--Form-description-gap'
      }
    ]
  };
});

// Value input box with prompt
setSchemaTpl('theme:select', (option: any = {}) => {
  return {
    mode: 'horizontal',
    labelAlign: 'left',
    type: 'amis-theme-select',
    label: 'size',
    name: `themeCss.className.select:default`,
    options: '${sizesOptions}',
    ...option
  };
});

// Text editor
setSchemaTpl('theme:font', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-font-editor',
    label: 'character',
    name: `themeCss.className.font:default`,
    needColorCustom: true,
    ...option
  };
});

// Color selector
setSchemaTpl('theme:colorPicker', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-color-picker',
    label: 'color',
    name: `themeCss.className.color:default`,
    needCustom: true,
    ...option
  };
});

// Border selector
setSchemaTpl('theme:border', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-border',
    label: 'border',
    name: `themeCss.className.border:default`,
    needColorCustom: true,
    ...option
  };
});

// Margin selector
setSchemaTpl('theme:paddingAndMargin', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-padding-and-margin',
    label: 'margin',
    name: `themeCss.className.padding-and-margin:default`,
    ...option
  };
});

// Rounded corner selector
setSchemaTpl('theme:radius', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-radius',
    label: 'Rounded corners',
    name: `themeCss.className.radius:default`,
    ...option
  };
});

// Shadow selector
setSchemaTpl('theme:shadow', (option: any = {}) => {
  return {
    type: 'amis-theme-shadow-editor',
    label: false,
    name: `themeCss.className.boxShadow:default`,
    hasSenior: true,
    ...option
  };
});

// Size selector
setSchemaTpl('theme:size', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-size-editor',
    label: false,
    name: `themeCss.className.size:default`,
    options: '${sizesOptions}',
    hideMinWidth: true,
    ...option
  };
});

setSchemaTpl(
  'theme:base',
  (option: {
    collapsed?: boolean;
    extra?: any[];
    classname?: string;
    title?: string;
    hiddenOn?: string;
    visibleOn?: string;
    hidePaddingAndMargin?: boolean;
    hideBorder?: boolean;
    hideRadius?: boolean;
    hideBackground?: boolean;
    hideShadow?: boolean;
    hideMargin?: boolean;
    hidePadding?: boolean;
    needState?: boolean;
    editorValueToken?: string;
    state?: string[];
  }) => {
    const {
      collapsed = false,
      extra = [],
      classname = 'baseControlClassName',
      title = 'Basic style',
      hiddenOn,
      visibleOn,
      hidePaddingAndMargin,
      hideBorder,
      hideRadius,
      hideBackground,
      hideShadow,
      hideMargin,
      hidePadding,
      needState = true,
      editorValueToken,
      state = ['default', 'hover', 'active']
    } = option;

    const classId = classname.replace(/\-/g, '_');

    const styleStateFunc = (visibleOn: string, state: string) => {
      return [
        !hideBorder &&
          getSchemaTpl('theme:border', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.border${needState ? ':' + state : ''}`,
            state,
            editorValueToken
          }),
        !hideRadius &&
          getSchemaTpl('theme:radius', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.radius${needState ? ':' + state : ''}`,
            state,
            editorValueToken
          }),
        !hidePaddingAndMargin &&
          getSchemaTpl('theme:paddingAndMargin', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.padding-and-margin${
              needState ? ':' + state : ''
            }`,
            hideMargin,
            hidePadding,
            state,
            editorValueToken
          }),
        !hideBackground &&
          getSchemaTpl('theme:colorPicker', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.background${
              needState ? ':' + state : ''
            }`,
            label: 'background',
            needCustom: true,
            needGradient: true,
            needImage: true,
            labelMode: 'input',
            state,
            editorValueToken: editorValueToken
              ? `${editorValueToken}-\${__editorState${classId} || 'default'}-bg-color`
              : undefined
          }),
        !hideShadow &&
          getSchemaTpl('theme:shadow', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.boxShadow${
              needState ? ':' + state : ''
            }`,
            state,
            editorValueToken
          })
      ]
        .filter(item => item)
        .concat(
          extra.map(item => {
            return {
              ...item,
              visibleOn: visibleOn,
              name: `${item.name}${needState ? ':' + state : ''}`,
              state
            };
          })
        );
    };

    const styles = [
      needState && {
        type: 'select',
        mode: 'horizontal',
        labelAlign: 'left',
        labelWidth: 80,
        name: `__editorState${classId}`,
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
          },
          {
            label: 'Selected',
            value: 'focused'
          },
          {
            label: 'disable',
            value: 'disabled'
          }
        ].filter(item => state.includes(item.value))
      },
      ...styleStateFunc(
        `\${__editorState${classId} == 'default' || !__editorState${classId}}`,
        'default'
      ),
      ...styleStateFunc(`\${__editorState${classId} == 'hover'}`, 'hover'),
      ...styleStateFunc(`\${__editorState${classId} == 'active'}`, 'active'),
      ...styleStateFunc(`\${__editorState${classId} == 'focused'}`, 'focused'),
      ...styleStateFunc(`\${__editorState${classId} == 'disabled'}`, 'disabled')
    ].filter(Boolean);

    return {
      title,
      collapsed,
      body: styles,
      hiddenOn,
      visibleOn
    };
  }
);

setSchemaTpl(
  'theme:common',
  (option: {
    exclude: string[] | string;
    collapsed?: boolean;
    extra?: any[];
    baseExtra?: any[];
    layoutExtra?: any[];
    classname?: string;
    baseTitle?: string;
    hidePaddingAndMargin?: boolean;
    hideAnimation?: boolean;
    needState?: boolean;
  }) => {
    let {
      exclude,
      collapsed,
      extra = [],
      baseExtra,
      layoutExtra,
      classname,
      baseTitle,
      hidePaddingAndMargin,
      hideAnimation,
      needState = true
    } = option || {};

    const curCollapsed = collapsed ?? false; // All expanded by default
    // keys are uniformly converted to Kebab case, eg: boxShadow => bos-shadow
    exclude = (
      exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : []
    ).map((key: string) => kebabCase(key));

    return [
      {
        header: 'Layout',
        key: 'layout',
        collapsed: curCollapsed,
        body: [
          {
            type: 'style-display',
            label: false,
            name: 'style'
          }
        ]
          .filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
          .concat(layoutExtra || [])
      },
      getSchemaTpl('theme:base', {
        collapsed: curCollapsed,
        extra: baseExtra,
        classname,
        title: baseTitle,
        needState,
        hidePaddingAndMargin
      }),
      ...extra,
      {
        title: 'Custom style',
        key: 'theme-css-code',
        collapsed: curCollapsed,
        body: [
          {
            type: 'theme-cssCode',
            label: false
          }
        ]
      },
      !hideAnimation && getSchemaTpl('animation')
    ].filter(item => !~exclude.indexOf(item.key || ''));
  }
);

setSchemaTpl(
  'theme:icon',
  (option: {classname?: string; visibleOn?: string; title?: string}) => {
    const {
      classname = 'iconControlClassName',
      visibleOn,
      title = 'Icon style'
    } = option;
    return {
      title,
      visibleOn,
      body: [
        getSchemaTpl('theme:select', {
          label: 'icon size',
          name: `themeCss.${classname}.iconSize`
        }),
        getSchemaTpl('theme:colorPicker', {
          name: `themeCss.${classname}.color`,
          label: 'icon color',
          needCustom: true,
          needGradient: true,
          labelMode: 'input'
        }),
        getSchemaTpl('theme:paddingAndMargin', {
          label: 'icon margin',
          name: `themeCss.${classname}.padding-and-margin`
        })
      ]
    };
  }
);

setSchemaTpl('animation', () => {
  let timeoutId: any = null;

  function playAnimation(animations: any, id: string, type: string) {
    let doc = document;
    const isMobile = (window as any).editorStore.isMobile;
    if (isMobile) {
      doc = (document.getElementsByClassName('ae-PreviewIFrame')[0] as any)
        .contentDocument;
    }
    const highlightDom = document.getElementById('aePreviewHighlightBox');
    if (highlightDom) {
      highlightDom.style.opacity = '0';
      highlightDom.classList.add('ae-Preview-widgets--no-transition');
    }
    const el = doc.querySelector(`[name="${id}"]`);
    id = formateId(id);
    const className = `${animations[type].type}-${id}-${type}`;
    if (type === 'hover') {
      el?.classList.add(`amis-${animations[type].type}-show`);
    }
    el?.classList.add(className);
    createAnimationStyle(id, animations);

    if (isMobile) {
      let style = doc.getElementById('amis-styles');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'friends-styles';
        doc.head.appendChild(style);
      }
      style.innerHTML = styleManager.styleText;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      el?.classList.remove(className);
      if (type === 'hover') {
        el?.classList.remove(`amis-${animations[type].type}-show`);
      }

      if (highlightDom) {
        const editorId = el?.getAttribute('data-editor-id');
        const node = (window as any).editorStore.getNodeById(editorId);
        // Recalculate the position of the element highlight box
        node.calculateHighlightBox();
        highlightDom.style.opacity = '1';
        setTimeout(() => {
          highlightDom.classList.remove('ae-Preview-widgets--no-transition');
        }, 150);
      }
    }, ((animations[type].duration || 1) + (animations[type].delay || 0)) * 1000 + 200);
  }
  const animation = (
    type: 'enter' | 'attention' | 'hover' | 'exit',
    label: string,
    schema: any = []
  ) => [
    {
      type: 'switch',
      name: `animations.${type}`,
      pipeIn: (value: boolean) => !!value,
      pipeOut: (value: boolean) => {
        if (value) {
          return {};
        }
        return undefined;
      },
      onChange: (value: any, a: any, b: any, {data}: any) => {
        if (value) {
          const {id} = data;
          let animationType = 'fadeIn';
          if ('children' in animationOptions[type][0]) {
            // @ts-ignore
            animationType = animationOptions[type][0].children[0].value;
          } else {
            // @ts-ignore
            animationType = animationOptions[type][0].value;
          }
          playAnimation(
            {
              [type]: {
                delay: 0,
                duration: 1,
                type: animationType
              }
            },
            id,
            type
          );
        }
      },
      label
    },
    {
      type: 'container',
      className: 'm-b ae-ExtendMore',
      visibleOn: `\${animations && animations.${type}}`,
      body: [
        {
          type: 'select',
          name: `animations.${type}.type`,
          selectMode: 'group',
          options: animationOptions[type],
          label: 'type',
          selectFirst: true,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    type: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        {
          type: 'input-number',
          name: `animations.${type}.duration`,
          label: 'Continuous',
          value: 1,
          suffix: 'seconds',
          min: 0,
          precision: 3,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    duration: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        {
          label: 'delay',
          type: 'input-number',
          name: `animations.${type}.delay`,
          value: 0,
          suffix: 'seconds',
          precision: 3,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    delay: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        ...schema
      ]
    },
    {
      type: 'button',
      visibleOn: `\${animations && animations.${type}}`,
      className: 'm-b',
      block: true,
      level: 'enhance',
      size: 'sm',
      label: 'Play',
      onClick: (e: any, {data}: any) => {
        const {animations, id} = data;
        playAnimation(animations, id, type);
      }
    }
  ];

  return {
    title: 'Animation',
    body: [
      ...animation('enter', 'Enter animation', [
        {
          label: tipedLabel(
            'Trigger when visible',
            'The component enters the visible area to trigger the entry animation'
          ),
          type: 'switch',
          name: 'animations.enter.inView',
          value: true,
          onChange: (value: any, oldValue: any, obj: any, props: any) => {
            if (value === false) {
              props.setValueByName('animations.enter.repeat', false);
            }
          }
        },
        {
          label: tipedLabel(
            'Repeat',
            'Repeat the animation when the component enters the visible area again'
          ),
          type: 'switch',
          name: 'animations.enter.repeat',
          visibleOn: 'animations.enter.inView',
          value: false
        }
      ]),
      ...animation('attention', 'Emphasis animation', [
        {
          label: 'repeat',
          type: 'select',
          name: 'animations.attention.repeat',
          value: 'infinite',
          options: [
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
              label: i,
              value: i
            })),
            {label: 'infinite', value: 'infinite'}
          ]
        }
      ]),
      ...animation('hover', 'Suspension animation'),
      ...animation('exit', 'Exit animation', [
        {
          label: tipedLabel(
            'Trigger when invisible',
            'Component exits the visible area triggers entry animation'
          ),
          type: 'switch',
          name: 'animations.exit.outView',
          value: true
        }
      ])
    ]
  };
});
