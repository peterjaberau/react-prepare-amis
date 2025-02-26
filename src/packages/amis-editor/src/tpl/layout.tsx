import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  tipedLabel
} from 'amis-editor-core';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import compact from 'lodash/compact';

/**
 * Layout related configuration items
 * Note: Currently, a total of 22 layout-related configuration items have been added, as follows:
 * 1. Added "positioning mode" configuration item to layout container, with options: default, relative, absolute, fixed. Absolute and fixed can realize special layout (fixed: top and bottom elements, not scrolling with the specified page content);
 * 1. Relative, absolute and fixed layouts all provide "inset configuration items" (top, right, bottom, left);
 * 2. Added "Flexible Mode" (fixed width, flexible width), "Display Mode" (default, flexible layout), and "Default Width" configuration items for column-level containers (direct subcontainers in layout containers, such as wrapper, container, and nested layout containers);
 * 3. After turning on the elastic mode, add the "Proportion Setting" configuration item;
 * 4. After the display mode is set to flexible layout (flex layout), new configuration items are added: "Arrangement direction", "Horizontal alignment", "Vertical alignment", and "Automatic line wrap";
 * 5. Relative, absolute and fixed layouts all provide "level" configuration items (z-index);
 * Note: Currently, the above configuration items are mainly added for layout container (flex), container (container) and wrapper (wrapper). (Layout container is an upgraded version of the previous Flex layout component)
 *
 * 2. Layout container (flex) and container (container) can realize scrolling display, center display and other layouts through the following new configuration items;
 * 1. Added "fixed height" option. If it is set to fixed height, add "height" configuration item and "y-axis scrolling" mode configuration;
 * 2. Added "Fixed Width". If it is set to fixed width, add "Width" configuration item and "x-axis scrolling" mode configuration;
 * 3. Non-fixed width, added "maximum width" and "minimum width" configuration items;
 * 4. Non-fixed height, added "maximum height" and "minimum height" configuration items;
 * 5. When a fixed width or maximum width is set, a new "center display" configuration item is added;
 */

// Default supported units
const LayoutUnitOptions = ['px', '%', 'em', 'vh', 'vw'];

// Positioning mode
setSchemaTpl(
  'layout:position',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string; // Expression used to control display
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          'Positioning mode',
          'Specify the positioning type of the current container element'
        ),
      name: config?.name || 'style.position',
      value: config?.value || 'static',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value === 'static') {
          form.deleteValueByName('style.inset');
          form.deleteValueByName('style.zIndex');
          form.deleteValueByName('originPosition');
        } else if (value === 'fixed' || value === 'absolute') {
          form.setValueByName('style.zIndex', 1); // Avoid being blocked by other content elements on the page (causing it to be unselectable)
          form.setValueByName('style.inset', 'auto 50px 50px auto');
          // By default, the lower right corner is used for relative positioning
          form.setValueByName('originPosition', 'right-bottom');
        } else if (value === 'relative') {
          form.setValueByName('style.zIndex', 1);
          form.setValueByName('style.inset', 'auto');
          form.deleteValueByName('originPosition');
        }
        if (value !== 'sticky') {
          // Non-scrolling adsorption positioning
          form.deleteValueByName('stickyStatus');
        }
      },
      options: [
        {
          label: 'Default (static)',
          value: 'static'
        },
        {
          label: 'Relative to original position',
          value: 'relative'
        },
        {
          label: 'Floating in the window (fixed)',
          value: 'fixed'
        },
        {
          label: 'absolute positioning',
          value: 'absolute'
        }
      ]
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// inset configuration:
setSchemaTpl(
  'layout:inset',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
  }) => {
    const configSchema = {
      type: 'inset-box-model',
      label:
        config?.label ||
        tipedLabel(
          'Layout location',
          'Specify the positioning position of the current container element, used to configure top, right, bottom, and left.'
        ),
      name: config?.name || 'style.inset',
      value: config?.value || 'auto',
      visibleOn:
        config?.visibleOn ??
        'this.style && this.style.position && this.style.position !== "static"',
      pipeIn: (value: any) => {
        let curValue = value || 'auto';
        if (isNumber(curValue)) {
          curValue = curValue.toString();
        }
        if (!isString(curValue)) {
          curValue = '0';
        }
        const inset = curValue.split(' ');
        return {
          insetTop: inset[0] || 'auto',
          insetRight: inset[1] || 'auto',
          insetBottom: inset[2] || inset[0] || 'auto',
          insetLeft: inset[3] || inset[1] || 'auto'
        };
      },
      pipeOut: (value: any) => {
        return `${value.insetTop ?? 'auto'} ${value.insetRight ?? 'auto'} ${
          value.insetBottom ?? 'auto'
        } ${value.insetLeft ?? 'auto'}`;
      }
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// z-index configuration:
setSchemaTpl(
  'layout:z-index',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          'Show level',
          'Specify the stacking order of elements, higher-level elements will always be on top of lower-level elements.'
        ),
      name: config?.name || 'style.zIndex',
      value: config?.value,
      visibleOn:
        config?.visibleOn ??
        'this.style && this.style.position && this.style.position !== "static"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// Display type
setSchemaTpl(
  'layout:display',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    isFlexItem?: boolean;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    flexHide?: boolean;
  }) => {
    const configOptions = compact([
      !config?.flexHide && {
        label: 'Flexible layout (flex)',
        icon: 'flex-display',
        value: 'flex'
      },
      {
        label: 'block',
        icon: 'block-display',
        value: 'block'
      },
      {
        label: 'inline-block',
        icon: 'inline-block-display',
        value: 'inline-block'
      },
      {
        label: 'inline',
        icon: 'inline-display',
        value: 'inline'
      }
    ]);
    const configSchema = {
      type: 'icon-button-group',
      label:
        config?.label ||
        tipedLabel(
          'Display type',
          'The default is block level, which can be set to flexible layout mode (flex layout container)'
        ),
      name: config?.name || 'style.display',
      value: config?.value || 'block',
      visibleOn: config?.visibleOn,
      options: configOptions,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value !== 'flex' && value !== 'inline-flex') {
          form.deleteValueByName('style.flexDirection');
          form.deleteValueByName('style.justifyContent');
          form.deleteValueByName('style.alignItems');
          form.deleteValueByName('style.flexWrap');
        }
      }
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// Main axis arrangement direction
setSchemaTpl(
  'layout:justifyContent',
  (config?: {
    mode?: string; // Customize the display default value, vertical display: vertical, left and right display: horizontal
    label?: string; // form item label
    name?: string; // form item name
    value?: string;
    options?: any;
    visibleOn?: string; // Expression used to control display
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const defaultOptions = [
      {
        label: 'Starting end alignment',
        value: 'flex-start'
      },
      {
        label: 'center alignment',
        value: 'center'
      },
      {
        label: 'end alignment',
        value: 'flex-end'
      },
      {
        label: 'Evenly distributed (leave blank at the beginning and end)',
        value: 'space-around'
      },
      {
        label: 'Evenly distributed (aligned head and tail)',
        value: 'space-between'
      },
      {
        label: 'Evenly distributed (elements are equally spaced)',
        value: 'space-evenly'
      },
      {
        label: 'Evenly distributed (automatic stretching)',
        value: 'stretch'
      }
    ];

    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          `horizontal alignment`,
          'Set the alignment of sub-elements on the main axis'
        ),
      name: config?.name || 'style.justifyContent',
      value: config?.value || 'flex-start',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: config?.options || defaultOptions
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// Cross axis arrangement direction
setSchemaTpl(
  'layout:alignItems',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    options?: any;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const defaultOptions = [
      {
        label: 'Starting end alignment',
        value: 'flex-start'
      },
      {
        label: 'center alignment',
        value: 'center'
      },
      {
        label: 'end alignment',
        value: 'flex-end'
      },
      {
        label: 'Baseline alignment',
        value: 'baseline'
      },
      {
        label: 'Automatic stretching',
        value: 'stretch'
      }
    ];

    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          `vertical alignment`,
          'Set the alignment of child elements on the cross axis'
        ),
      name: config?.name || 'style.alignItems',
      value: config?.value || 'stretch', // If the item has no height set or is set to auto, it will occupy the entire height of the container.
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: config?.options || defaultOptions
    };

    if (config?.mode === 'vertical') {
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      return configSchema;
    }
  }
);

// Arrangement direction
setSchemaTpl(
  'layout:flexDirection',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          'Arrangement direction',
          'If the arrangement direction is set to horizontal, the sub-items are placed from left to right; if the arrangement direction is set to vertical, the sub-items are placed from top to bottom'
        ),
      name: config?.name || 'style.flexDirection',
      value: config?.value || 'row',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'horizontal',
          value: 'row'
        },
        {
          label: 'Horizontal (starting point on the right)',
          value: 'row-reverse'
        },
        {
          label: 'vertical',
          value: 'column'
        },
        {
          label: 'Vertical (starting at the bottom edge)',
          value: 'column-reverse'
        }
      ]
    };

    if (config?.mode === 'vertical') {
      // Display up and down to avoid squeezing of custom renderers
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      //Default left and right display
      return configSchema;
    }
  }
);

// How to wrap lines
setSchemaTpl(
  'layout:flex-wrap',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label: config?.label || 'How to wrap',
      name: config?.name || 'style.flexWrap',
      value: config?.value || 'nowrap',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'No line break (default)',
          value: 'nowrap'
        },
        {
          label: 'Automatic line wrap',
          value: 'wrap'
        },
        {
          label: 'Automatic line wrap (reversed)',
          value: 'wrap-reverse'
        }
      ]
    };
  }
);

// Elastic mode
setSchemaTpl(
  'layout:flex',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    isFlexColumnItem?: boolean;
    onText?: string;
    offText?: string;
  }) => {
    return {
      type: 'button-group-select',
      size: 'xs',
      name: config?.name || 'style.flex',
      options: [
        {
          label: 'Elasticity',
          value: '1 1 auto'
        },
        {
          label: 'Fixed',
          value: '0 0 150px'
        },
        {
          label: 'Adapt',
          value: '0 0 auto'
        }
      ],
      label: config?.label || 'Flexible settings',
      value: config?.value || '0 0 auto',
      inputClassName: 'inline-flex justify-between',
      visibleOn: config?.visibleOn,
      onChange: (value: any, oldValue: boolean, model: any, form: any) => {
        if (value === '1 1 auto') {
          // Elasticity
          if (config?.isFlexColumnItem) {
            // form.setValueByName('style.overflowY', 'auto');
            form.deleteValueByName('style.height');
          } else {
            // form.setValueByName('style.overflowX', 'auto');
            form.deleteValueByName('style.width');
          }
        } else if (value === '0 0 150px') {
          // fixed
          form.deleteValueByName('style.flexGrow');
          form.setValueByName('style.flexBasis', '150px');

          if (config?.isFlexColumnItem) {
            form.deleteValueByName('style.height');
          } else {
            form.deleteValueByName('style.width');
          }
        } else if (value === '0 0 auto') {
          // Adaptation
          form.deleteValueByName('style.flexGrow');
          form.deleteValueByName('style.flexBasis');
          form.deleteValueByName('style.overflowX');
          form.deleteValueByName('style.overflowY');
          form.deleteValueByName('style.overflow');

          if (config?.isFlexColumnItem) {
            form.deleteValueByName('style.height');
          } else {
            form.deleteValueByName('style.width');
          }
        }
      }
    };
  }
);

// flex-basis settings
setSchemaTpl(
  'layout:flex-basis',
  (config?: {
    label?: string;
    tooltip?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: tipedLabel(
        config?.label || 'Default width',
        config?.tooltip || 'The default main size before allocating extra space'
      ),
      name: config?.name || 'style.flexBasis',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn,
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// flex-grow elastic ratio
setSchemaTpl(
  'layout:flex-grow',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-range',
      max: 12,
      step: 1,
      label:
        config?.label ||
        tipedLabel(
          'Elasticity ratio',
          'Define the magnification ratio of the item. If it is set to 0, it will not be enlarged even if there is remaining space in the parent container.'
        ),
      name: config?.name || 'style.flexGrow',
      value: config?.value || 1,
      visibleOn:
        config?.visibleOn || 'this.style && this.style.flex !== "0 0 auto"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut
    };
  }
);

// Whether the width is fixed: isFixedWidth Configuration:
setSchemaTpl(
  'layout:isFixedWidth',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    onChange?: (value: boolean) => void;
  }) => {
    return {
      type: 'button-group-select',
      label: config?.label || 'Width setting',
      size: 'xs',
      name: config?.name || 'isFixedWidth',
      options: [
        {
          label: 'Fixed',
          value: true
        },
        {
          label: 'Adapt',
          value: false
        }
      ],
      value: config?.value ?? false,
      visibleOn: config?.visibleOn,
      inputClassName: 'inline-flex justify-between',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
        if (value) {
          // When the width is fixed, remove the maximum width and minimum width
          form.deleteValueByName('style.maxWidth');
          form.deleteValueByName('style.minWidth');
        } else {
          // When the width is not fixed, remove the width value
          form.deleteValueByName('style.width');
        }
        if (config?.onChange) {
          config.onChange(value);
        }
      }
    };
  }
);

//Width setting
setSchemaTpl(
  'layout:width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || 'width',
      name: config?.name || 'style.width',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && this.isFixedWidth`
        : 'this.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

//Width setting (not associated with fixed width configuration item)
setSchemaTpl(
  'layout:width:v2',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || 'width',
      name: config?.name || 'style.width',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn || true,
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// Maximum width setting
setSchemaTpl(
  'layout:max-width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          'Maximum width',
          'The maximum width is the maximum horizontal display area of ​​the current element'
        ),
      name: config?.name || 'style.maxWidth',
      value: config?.value,
      min: '${style.minWidth | toInt}',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && !this.isFixedWidth`
        : '!this.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// Minimum width setting
setSchemaTpl(
  'layout:min-width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          'Minimum width',
          'The minimum width is the smallest horizontal display area of ​​the current element'
        ),
      name: config?.name || 'style.minWidth',
      value: config?.value,
      max: '${style.maxWidth | toInt}',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && !this.isFixedWidth`
        : '!this.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// x-axis (horizontal axis) scroll mode
setSchemaTpl(
  'layout:overflow-x',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          'Horizontal content exceeds',
          'Used to set the horizontal scrolling mode'
        ),
      name: config?.name || 'style.overflowX',
      value: config?.value || 'visible',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'Out of display',
          value: 'visible'
        },
        {
          label: 'out of hiding',
          value: 'hidden'
        },
        {
          label: 'Horizontal scroll',
          value: 'scroll'
        },
        {
          label: 'Automatic adaptation',
          value: 'auto'
        }
      ]
    };
  }
);

// Is the height fixed: isFixedHeight Configuration:
setSchemaTpl(
  'layout:isFixedHeight',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    onChange?: (value: boolean) => void;
  }) => {
    return {
      type: 'button-group-select',
      label: config?.label || 'Height settings',
      size: 'xs',
      name: config?.name || 'isFixedHeight',
      options: [
        {
          label: 'Fixed',
          value: true
        },
        {
          label: 'Adapt',
          value: false
        }
      ],
      value: config?.value ?? false,
      visibleOn: config?.visibleOn,
      inputClassName: 'inline-flex justify-between',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
        if (value) {
          // When the height is fixed, remove the maximum height and minimum height
          form.deleteValueByName('style.maxHeight');
          form.deleteValueByName('style.minHeight');
        } else {
          // When the height is not fixed, remove the height value
          form.deleteValueByName('style.height');
        }
        if (config?.onChange) {
          config.onChange(value);
        }
      }
    };
  }
);

// Height setting
setSchemaTpl(
  'layout:height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || 'Height',
      name: config?.name || 'style.height',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && this.isFixedHeight`
        : 'this.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// Maximum height setting
setSchemaTpl(
  'layout:max-height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          'Maximum height',
          'The maximum height is the maximum display height of the current element'
        ),
      name: config?.name || 'style.maxHeight',
      value: config?.value,
      min: '${style.minHeight | toInt}',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && !this.isFixedHeight`
        : '!this.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// Minimum height setting
setSchemaTpl(
  'layout:min-height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          'Minimum height',
          'Minimum height is the smallest vertical display area of ​​the current element'
        ),
      name: config?.name || 'style.minHeight',
      value: config?.value,
      max: '${style.maxHeight | toInt}',
      visibleOn: config?.visibleOn
        ? `(${config?.visibleOn}) && !this.isFixedHeight`
        : '!this.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// y-axis (cross-axis) scrolling mode
setSchemaTpl(
  'layout:overflow-y',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          'Vertical content exceeds',
          'Used to set the vertical scrolling mode'
        ),
      name: config?.name || 'style.overflowY',
      value: config?.value || 'visible',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'Out of display',
          value: 'visible'
        },
        {
          label: 'out of hiding',
          value: 'hidden'
        },
        {
          label: 'Vertical scroll',
          value: 'scroll'
        },
        {
          label: 'Automatic adaptation',
          value: 'auto'
        }
      ]
    };
  }
);

// Alignment
setSchemaTpl(
  'layout:margin-center',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'button-group-select',
      size: 'xs',
      label:
        config?.label ||
        tipedLabel(
          'Alignment',
          'Set the alignment by margin value, where margin: 0 auto is used to set center alignment'
        ),
      name: config?.name || 'style.margin',
      value: config?.value,
      inputClassName: 'inline-flex justify-between',
      visibleOn:
        config?.visibleOn ??
        'this.isFixedWidth || this.style && this.style.maxWidth',
      options: [
        {
          label: 'Left',
          value: 'auto auto auto 0px'
        },
        {
          label: 'Center',
          value: '0px auto'
        },
        {
          label: 'Keep right',
          value: 'auto 0px auto auto'
        }
      ],
      pipeIn: config?.pipeIn
        ? config?.pipeIn
        : (value: any, data: any) => {
            let themeCssValue =
              data.data?.themeCss?.baseControlClassName?.[
                'padding-and-margin:default'
              ]?.margin;
            return value || themeCssValue;
          },
      pipeOut: config?.pipeOut,
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (
          form?.data?.style?.position === 'fixed' ||
          form?.data?.style?.position === 'absolute'
        ) {
          // Adsorption container
          if (value === '0px auto') {
            // Center
            if (form.data?.sorptionPosition === 'top') {
              // Ceiling
              form.setValueByName('style.inset', '0px auto auto 50%');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // Suction bottom
              form.setValueByName('style.inset', 'auto auto 0px 50%');
            } else {
              form.setValueByName('style.inset', 'auto auto auto 50%');
            }
            form.setValueByName('style.transform', 'translateX(-50%)');
          } else if (value === 'auto 0px auto auto') {
            // Keep Right
            if (form.data?.sorptionPosition === 'top') {
              // Ceiling
              form.setValueByName('style.inset', '0px 0px auto auto');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // Suction bottom
              form.setValueByName('style.inset', 'auto 0px 0px auto');
            } else {
              form.setValueByName('style.inset', 'auto 0px auto auto');
            }
            form.deleteValueByName('style.transform');
          } else {
            //Left
            if (form.data?.sorptionPosition === 'top') {
              // Ceiling
              form.setValueByName('style.inset', '0px auto auto 0px');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // Suction bottom
              form.setValueByName('style.inset', 'auto auto 0px 0px');
            } else {
              form.setValueByName('style.inset', 'auto auto auto 0px');
            }
            form.deleteValueByName('style.transform');
          }
        } else {
          //Left
          form.deleteValueByName('style.transform');
        }
      }
    };
  }
);

//「Reference position」can be set to upper left corner, upper right corner, lower right corner, lower left corner. The default is "lower right corner".
setSchemaTpl(
  'layout:originPosition',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string | boolean;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          'Reference position',
          'Can be set to upper left corner, upper right corner, lower right corner, lower left corner, default is lower right corner'
        ),
      name: config?.name || 'originPosition',
      value: config?.value || 'right-bottom',
      visibleOn:
        config?.visibleOn ??
        'this.style && this.style.position && (this.style.position === "fixed" || this.style.position === "absolute")',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'upper left corner',
          value: 'left-top'
        },
        {
          label: 'upper right corner',
          value: 'right-top'
        },
        {
          label: 'lower right corner (default)',
          value: 'right-bottom'
        },
        {
          label: 'lower left corner',
          value: 'left-bottom'
        }
      ],
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value === 'right-bottom') {
          // Bottom right corner
          form.setValueByName('style.inset', 'auto 50px 50px auto');
        } else if (value === 'left-top') {
          // Upper left corner
          form.setValueByName('style.inset', '50px auto auto 50px');
        } else if (value === 'right-top') {
          // Upper right corner
          form.setValueByName('style.inset', '50px 50px auto auto');
        } else if (value === 'left-bottom') {
          // Bottom left corner
          form.setValueByName('style.inset', 'auto auto 50px 50px');
        }
      }
    };

    if (config?.mode === 'vertical') {
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      return configSchema;
    }
  }
);

// Adsorption position configuration items
setSchemaTpl('layout:sorption', {
  type: 'button-group-select',
  label: 'Adsorption position',
  size: 'xs',
  name: 'sorptionPosition',
  options: [
    {
      label: 'ceiling',
      value: 'top'
    },
    {
      label: 'Suction bottom',
      value: 'bottom'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    if (value === 'top') {
      form.setValueByName('style.inset', '0 auto auto 0');
    } else if (value === 'bottom') {
      form.setValueByName('style.inset', 'auto auto 0 0');
    }
  }
});

//Scroll adsorption configuration items
setSchemaTpl('layout:sticky', {
  type: 'switch',
  label: tipedLabel(
    'Scrolling adsorption',
    'After turning on scroll adsorption, the adsorption mode will be automatically turned on when scrolling to the upper and lower edges of the parent container.'
  ),
  name: 'stickyStatus',
  inputClassName: 'inline-flex justify-between',
  onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
    if (value) {
      const inset = form.getValueByName('style.inset');
      if (!inset || inset === 'auto') {
        form.setValueByName('stickyPosition', 'auto');
        form.setValueByName('style.inset', '0px auto 0px auto');
      }
      form.setValueByName('style.position', 'sticky');
      form.setValueByName('style.zIndex', 10);
    } else {
      form.setValueByName('style.position', 'static');
      form.deleteValueByName('style.inset');
      form.deleteValueByName('style.zIndex');
    }
  }
});

//Scrolling adsorption position configuration item
setSchemaTpl('layout:stickyPosition', {
  type: 'button-group-select',
  size: 'xs',
  label: tipedLabel(
    'Adsorption position',
    'Used to set the position when scrolling adsorption'
  ),
  name: 'stickyPosition',
  visibleOn: 'this.stickyStatus',
  options: [
    {
      label: 'ceiling',
      value: 'top'
    },
    {
      label: 'Suction bottom',
      value: 'bottom'
    },
    {
      label: 'Automatic',
      value: 'auto'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    if (value === 'top') {
      form.setValueByName('style.inset', '0px auto auto auto');
    } else if (value === 'bottom') {
      form.setValueByName('style.inset', 'auto auto 0px auto');
    } else if (value === 'auto') {
      form.setValueByName('style.inset', '0px auto 0px auto');
    }
  }
});

//Default padding configuration item
setSchemaTpl(
  'layout:padding',
  (config?: {
    label?: string;
    name?: string;
    mode?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      label: config?.label || 'Default inner spacing',
      type: 'button-group-select',
      name: config?.name || 'size',
      size: 'xs',
      mode: config?.mode || 'horizontal', // horizontal、vertical
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn || defaultValue(''),
      pipeOut: config?.pipeOut,
      options: [
        {
          label: 'Default',
          value: ''
        },
        {
          label: 'extremely small',
          value: 'xs'
        },
        {
          label: 'small',
          value: 'sm'
        },
        {
          label: 'Medium',
          value: 'md'
        },
        {
          label: 'big',
          value: 'lg'
        },
        {
          label: 'None',
          value: 'none'
        }
      ]
    };
  }
);

//Internal horizontal alignment
setSchemaTpl(
  'layout:textAlign',
  (config?: {
    label?: string;
    name?: string;
    mode?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      label: config?.label || 'Alignment',
      type: 'button-group-select',
      name: config?.name || 'textAlign',
      // size: 'xs',
      mode: config?.mode || 'horizontal', // horizontal、vertical
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn || defaultValue(''),
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '',
          value: 'left',
          icon: 'fa fa-align-left'
        },
        {
          label: '',
          value: 'center',
          icon: 'fa fa-align-center'
        },
        {
          label: '',
          value: 'right',
          icon: 'fa fa-align-right'
        },
        {
          label: '',
          value: 'justify',
          icon: 'fa fa-align-justify'
        }
      ]
    };
  }
);

setSchemaTpl(
  'layout:flex-layout',
  (config?: {
    name?: string;
    label?: string;
    visibleOn?: string;
    strictMode?: boolean;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'flex-layout',
      mode: 'default',
      name: config?.name || 'layout',
      label: config?.label ?? false,
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      strictMode: config?.strictMode
    };
  }
);
// flex related configuration items (integrated version)
setSchemaTpl(
  'layout:flex-setting',
  (config?: {
    name?: string;
    label?: string;
    visibleOn?: string;
    direction?: string;
    justify?: string;
    alignItems?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'flex-layout-setting',
      name: config?.name || 'style',
      mode: 'vertical', // horizontal、vertical
      label: config?.label ?? false,
      visibleOn: config?.visibleOn,
      direction: config?.direction,
      justify: config?.justify,
      alignItems: config?.alignItems,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut
    };
  }
);

// Sub-configuration item wrapping container
setSchemaTpl(
  'layout:wrapper-contanier',
  (config: {visibleOn?: string; className?: string; body: Array<any>}) => {
    return {
      type: 'container',
      className: `config-wrapper-contanier ${config.className || ''}`,
      body: config.body,
      visibleOn: config?.visibleOn
    };
  }
);
