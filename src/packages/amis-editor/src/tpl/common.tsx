import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  isObject,
  tipedLabel,
  EditorManager
} from '@/packages/amis-editor-core/src';
import {render, type SchemaObject} from '@/packages/amis/src';
import flatten from 'lodash/flatten';
import {InputComponentName} from '../component/InputComponentName';
import {FormulaDateType} from '../renderer/FormulaControl';
// @ts-ignore
import type {VariableItem} from '@/packages/amis-ui/src/components/formula/CodeEditor';
import reduce from 'lodash/reduce';
import map from 'lodash/map';
import omit from 'lodash/omit';
import keys from 'lodash/keys';
import type {Schema} from '@/packages/amis/src';

import type {DSField} from '../builder';

/**
 * @deprecated compatible with the switch of the current component
 */
setSchemaTpl('switch', {
  type: 'switch',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

/**
 * Dividing line
 */
setSchemaTpl('divider', {
  type: 'divider',
  className: 'mx-0'
});

/**
 * Controls with units
 */
setSchemaTpl(
  'withUnit',
  (config: {name: string; label: string; control: any; unit: string}) => {
    return {
      type: 'input-group',
      name: config.name,
      label: config.label,
      body: [
        config.control,
        {
          type: 'tpl',
          addOnclassName: 'border-0 bg-none',
          tpl: config.unit
        }
      ]
    };
  }
);

/**
 * Form item field name
 */
setSchemaTpl('formItemName', {
  label: 'field name',
  name: 'name',
  type: 'ae-DataBindingControl',
  onBindingChange(field: DSField, onBulkChange: (value: any) => void) {
    onBulkChange(field.resolveEditSchema?.() || {label: field.label});
  }
  // validations: {
  //     matchRegexp: /^[a-z\$][a-z0-0\-_]*$/i
  // },
  // validationErrors: {
  // "matchRegexp": "Please enter a valid variable name"
  // },
  // validateOnChange: false
});

setSchemaTpl(
  'formItemExtraName',
  getSchemaTpl('formItemName', {
    required: false,
    label: tipedLabel(
      'Ending field name',
      'The ending field name is configured, and the component stores the start and end as two fields'
    ),
    name: 'extraName'
  })
);

setSchemaTpl(
  'formItemMode',
  (config: {
    // Is it an independent form? There is no content that can be integrated.
    isForm: boolean;
    /** Default layout */
    defaultValue?: 'inline' | 'horizontal' | 'normal' | '';
  }) => ({
    label: 'Layout',
    name: 'mode',
    type: 'select',
    pipeIn: defaultValue(config?.defaultValue ?? ''),
    options: [
      {
        label: 'Inline',
        value: 'inline'
      },
      {
        label: 'horizontal',
        value: 'horizontal'
      },
      {
        label: 'vertical',
        value: 'normal'
      },
      !config?.isForm && {
        label: 'Inheritance',
        value: ''
      },
      config?.isForm && {
        label: 'grid',
        value: 'flex'
      }
    ].filter(i => i),
    pipeOut: (v: string) => (v ? v : undefined)
  })
);
setSchemaTpl('formulaControl', (schema: object = {}) => {
  return {
    type: 'ae-formulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('expressionFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-expressionFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('conditionFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-conditionFormulaControl',
    ...schema
  };
});

setSchemaTpl('textareaFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-textareaFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('tplFormulaControl', (schema: object = {}) => {
  return {
    type: 'ae-tplFormulaControl',
    variableMode: 'tree',
    ...schema
  };
});

setSchemaTpl('DataPickerControl', (schema: object = {}) => {
  return {
    type: 'ae-DataPickerControl',
    ...schema
  };
});

setSchemaTpl('formItemInline', {
  type: 'switch',
  label: 'Form item inline',
  name: 'inline',
  visibleOn: 'this.mode != "inline"',
  inputClassName: 'is-inline',
  pipeIn: defaultValue(false)
  // onChange: (value:any, origin:any, item:any, form:any) => form.getValueByName('size') === "full" && form.setValueByName('')
});

setSchemaTpl('formItemSize', {
  name: 'size',
  label: 'Control width',
  type: 'select',
  pipeIn: defaultValue('full'),
  // mode: 'inline',
  // className: 'w-full',
  options: [
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
      label: 'Default (full)',
      value: 'full'
    }
  ]
});

setSchemaTpl('minLength', {
  name: 'minLength',
  type: 'input-number',
  label: 'Limit minimum quantity'
});

setSchemaTpl('maxLength', {
  name: 'maxLength',
  type: 'input-number',
  label: 'Limit the maximum number'
});

/**
 * Form item name label
 */
setSchemaTpl('label', {
  label: 'Title',
  name: 'label',
  type: 'input-text',
  pipeIn(v: any) {
    return v === false ? '' : v;
  }
});

/** File upload button name btnLabel */
setSchemaTpl('btnLabel', {
  type: 'input-text',
  name: 'btnLabel',
  label: 'Button name',
  value: 'File upload'
});

setSchemaTpl('labelHide', () =>
  getSchemaTpl('switch', {
    name: 'label',
    label: tipedLabel(
      'Hide title',
      'After hiding, the title width is 0 in horizontal layout'
    ),
    pipeIn: (value: any) => value === false,
    pipeOut: (value: any) => (value === true ? false : ''),
    visibleOn:
      'this.__props__ && this.__props__.formMode === "horizontal" || this.mode === "horizontal"'
  })
);

setSchemaTpl('theme:labelHide', () =>
  getSchemaTpl('switch', {
    name: '__label',
    label: 'Hide title',
    value: '${label === false}',
    onChange: (value: any, origin: any, item: any, form: any) => {
      if (value) {
        form.setValueByName(
          '$$tempLabel',
          form.getValueByName('label') || item.label
        );
        form.setValueByName('label', false);
      } else {
        form.setValueByName(
          'label',
          form.getValueByName('$$tempLabel') || item['$$tempLabel'] || ''
        );
      }
    }
  })
);

setSchemaTpl('placeholder', {
  label: 'Placeholder prompt',
  name: 'placeholder',
  type: 'input-text',
  placeholder: 'Empty content prompt placeholder'
});

setSchemaTpl('startPlaceholder', {
  type: 'input-text',
  name: 'startPlaceholder',
  label: 'Previous placeholder',
  pipeIn: defaultValue('start time')
});

setSchemaTpl('endPlaceholder', {
  type: 'input-text',
  name: 'endPlaceholder',
  label: 'Placeholder hint',
  pipeIn: defaultValue('end time')
});

setSchemaTpl(
  'tabs',
  (
    config: Array<{
      title: string;
      className?: string;
      body: Array<SchemaObject>;
    }>
  ) => {
    return {
      type: 'tabs',
      tabsMode: 'line', // tiled
      className: 'editor-prop-config-tabs',
      linksClassName: 'editor-prop-config-tabs-links aa',
      contentClassName:
        'no-border editor-prop-config-tabs-cont hoverShowScrollBar',
      tabs: config
        .filter(item => item)
        .map(item => {
          const newSchema = {
            ...item,
            body: Array.isArray(item.body) ? flatten(item.body) : [item.body]
          };
          // The new version of the configuration panel has gaps in the subcomponents, for compatibility
          if (newSchema.body[0]?.type === 'collapse-group') {
            newSchema.className = (newSchema.className || '') + ' p-none';
          }
          return newSchema;
        })
    };
  }
);

setSchemaTpl(
  'collapse',
  (
    config: Array<{
      title: string;
      body: Array<any>;
    }>
  ) => {
    return {
      type: 'wrapper',
      className: 'editor-prop-config-collapse',
      body: config
        .filter(item => item)
        .map(item => ({
          type: 'collapse',
          headingClassName: 'editor-prop-config-head',
          bodyClassName: 'editor-prop-config-body',
          ...item,
          body: flatten(item.body)
        }))
    };
  }
);

setSchemaTpl(
  'fieldSet',
  (config: {
    title: string;
    body: Array<any>;
    collapsed?: boolean;
    collapsable?: boolean;
  }) => {
    return {
      collapsable: true,
      collapsed: false,
      ...config,
      type: 'fieldset',
      title: config.title,
      body: flatten(config.body.filter((item: any) => item))
    };
  }
);

setSchemaTpl(
  'collapseGroup',
  (
    config: Array<{
      title: string;
      key: string;
      visibleOn: string;
      body: Array<any>;
      collapsed?: boolean;
    }>
  ) => {
    const collapseGroupBody = config
      .filter(
        item => item && Array.isArray(item?.body) && item?.body.length > 0
      )
      .map(item => ({
        type: 'collapse',
        headingClassName: 'ae-formItemControl-header ae-Collapse-header',
        bodyClassName: 'ae-formItemControl-body',
        ...item,
        collapsed: item.collapsed ?? false,
        key: item.title,
        body: flatten(item.body)
      }));
    return {
      type: 'collapse-group',
      activeKey: collapseGroupBody
        .filter(item => item && !item.collapsed)
        .map(panel => panel.title),
      expandIconPosition: 'right',
      expandIcon: {
        type: 'icon',
        icon: 'chevron-right'
      },
      className: 'ae-formItemControl ae-styleControl',
      body: collapseGroupBody
    };
  }
);

setSchemaTpl('clearable', {
  type: 'switch',
  label: 'clearable',
  name: 'clearable',
  inputClassName: 'is-inline'
});

setSchemaTpl('hint', {
  label: 'Input box prompt',
  type: 'input-text',
  name: 'hint',
  description:
    'Displayed when the input box gets the focus, used to prompt the user to enter content.'
});

setSchemaTpl('icon', {
  label: 'icon',
  type: 'icon-picker',
  name: 'icon',
  placeholder: 'Click to select icon',
  clearable: true,
  description: ''
});

setSchemaTpl(
  'valueFormula',
  (config?: {
    mode?: string; // Customize the default display value, vertical display: vertical, left and right display: horizontal
    label?: string; // form item label
    name?: string; // form item name
    header?: string; // Expression pop-up title
    placeholder?: string; // Expression custom rendering placeholder
    rendererSchema?: any;
    rendererWrapper?: boolean; // Does the custom renderer need a light border wrapping
    needDeleteProps?: string[]; // Other properties that need to be removed. By default, deleteProps contains some common properties.
    useSelectMode?: boolean; // Whether to use Select selection mode, you need to ensure that rendererSchema.options is not undefined
    valueType?: string; // Used to set the expected value type
    visibleOn?: string; // Expression used to control display
    DateTimeType?: FormulaDateType; // Date components must support expressions & relative values
    variables?: Array<VariableItem> | Function; // Custom variable collection
    requiredDataPropsVariables?: boolean; // Whether to combine variables from the amis data domain, default is false
    variableMode?: 'tabs' | 'tree'; // variable display mode
    className?: string; // Outer class name
    [key: string]: any; // Other properties, such as form items pipeIn\Out, etc.
  }) => {
    const {
      rendererSchema,
      useSelectMode,
      mode,
      visibleOn,
      label,
      name,
      rendererWrapper,
      needDeleteProps,
      valueType,
      header,
      placeholder,
      DateTimeType,
      variables,
      requiredDataPropsVariables,
      variableMode,
      ...rest
    } = config || {};
    let curRendererSchema = rendererSchema;

    if (useSelectMode && curRendererSchema) {
      if (typeof curRendererSchema === 'function') {
        curRendererSchema = (schema: Schema) => ({
          ...rendererSchema(schema),
          type: 'select'
        });
      } else if (curRendererSchema.options) {
        curRendererSchema = {
          ...curRendererSchema,
          type: 'select'
        };
      }
    }

    return {
      type: 'group',
      //Default left and right display
      // Display up and down to avoid squeezing of custom renderers
      mode: mode === 'vertical' ? 'vertical' : 'horizontal',
      visibleOn,
      className: config?.className,
      body: [
        getSchemaTpl('formulaControl', {
          label: label ?? 'Default value',
          name: name || 'value',
          rendererWrapper,
          needDeleteProps,
          valueType,
          header,
          placeholder,
          rendererSchema: curRendererSchema,
          variables,
          requiredDataPropsVariables,
          variableMode,
          DateTimeType: DateTimeType ?? FormulaDateType.NotDate,
          ...rest
        })
      ]
    };
  }
);

setSchemaTpl('inputType', {
  label: 'input type',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: 'text',
      value: 'input-text'
    },
    {
      label: 'Password',
      value: 'input-password'
    },
    {
      label: 'Email',
      value: 'input-email'
    },
    {
      label: 'URL',
      value: 'input-url'
    }
  ]
});

setSchemaTpl('selectDateType', {
  label: 'Date type',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: 'Date',
      value: 'input-date'
    },
    {
      label: 'Date time',
      value: 'input-datetime'
    },
    {
      label: 'time',
      value: 'input-time'
    },
    {
      label: 'month',
      value: 'input-month'
    },
    {
      label: 'quarter',
      value: 'input-quarter'
    },
    {
      label: 'Year',
      value: 'input-year'
    }
  ]
});

setSchemaTpl('selectDateRangeType', {
  label: 'Date type',
  name: 'type',
  type: 'select',
  creatable: false,
  options: [
    {
      label: 'Date',
      value: 'input-date-range'
    },
    {
      label: 'Date time',
      value: 'input-datetime-range'
    },
    {
      label: 'time',
      value: 'input-time-range'
    },
    {
      label: 'month',
      value: 'input-month-range'
    },
    {
      label: 'quarter',
      value: 'input-quarter-range'
    },
    {
      label: 'Year',
      value: 'input-year-range'
    }
  ]
});

setSchemaTpl(
  'optionsMenuTpl',
  (config: {manager: EditorManager; [key: string]: any}) => {
    const {manager, ...rest} = config;
    // Set the variable collection in options
    function getOptionVars(that: any) {
      let schema = manager.store.valueWithoutHiddenProps;
      let children = [];
      if (schema.labelField) {
        children.push({
          label: 'Display fields',
          value: schema.labelField,
          tag: typeof schema.labelField
        });
      }
      if (schema.valueField) {
        children.push({
          label: 'value field',
          value: schema.valueField,
          tag: typeof schema.valueField
        });
      }
      if (schema.options) {
        let optionItem = reduce(
          schema.options,
          function (result, item) {
            return {...result, ...item};
          },
          {}
        );
        delete optionItem?.$$id;

        optionItem = omit(
          optionItem,
          map(children, item => item?.label)
        );

        let otherItem = map(keys(optionItem), item => ({
          label:
            item === 'label'
              ? 'option text'
              : item === 'value'
              ? 'option value'
              : item,
          value: item,
          tag: typeof optionItem[item]
        }));

        children.push(...otherItem);
      }
      let variablesArr = [
        {
          label: 'option field',
          children
        }
      ];
      return variablesArr;
    }

    return getSchemaTpl('textareaFormulaControl', {
      mode: 'normal',
      label: tipedLabel(
        'Option Template',
        'Customize option rendering template, support JSX, data domain variables'
      ),
      name: 'menuTpl',
      variables: getOptionVars,
      requiredDataPropsVariables: true,
      ...rest
    });
  }
);

/**
 * Data source binding
 */
setSchemaTpl('sourceBindControl', (schema: object = {}) => ({
  type: 'ae-formulaControl',
  name: 'source',
  label: 'data',
  variableMode: 'tree',
  inputMode: 'input-group',
  placeholder: 'Please enter an expression',
  requiredDataPropsVariables: true,
  ...schema
}));

setSchemaTpl('menuTpl', () => {
  return getSchemaTpl('textareaFormulaControl', {
    mode: 'normal',
    label: tipedLabel(
      'Template',
      'Customize option rendering template, support JSX, data domain variables'
    ),
    name: 'menuTpl'
  });
});

setSchemaTpl('expression', {
  type: 'input-text',
  description: 'Support JS expressions, such as: `this.xxx == 1`'
});

setSchemaTpl('size', {
  label: 'Control size',
  type: 'button-group-select',
  name: 'size',
  clearable: true,
  options: [
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
    }
  ]
});

setSchemaTpl('name', {
  label: tipedLabel(
    'name',
    'Only required when linkage is needed, other components can be linked with the current component through this name'
  ),
  name: 'name',
  type: 'input-text',
  placeholder: 'Please enter letters or numbers'
});

setSchemaTpl('reload', {
  name: 'reload',
  asFormItem: true,
  // type: 'input-text',
  component: InputComponentName,
  label: tipedLabel(
    'Refresh target component',
    'You can specify the target component to refresh after the operation is completed. Please fill in the <code>name</code> attribute of the target component. Please separate multiple components with <code>,</code>. If the target component is a form item, please fill in the form name first, and then use <code>.</code> to connect the form item name, such as: <code>xxForm.xxControl</code>. In addition, if the refresh target object is set to <code>window</code>, the entire page will be refreshed. '
  ),
  placeholder: 'Please enter the component name',
  mode: 'horizontal',
  horizontal: {
    left: 4,
    justify: true
  }
});

setSchemaTpl('className', (schema: any) => {
  return {
    type: 'ae-classname',
    name: 'className',
    ...(schema || {}),
    label: tipedLabel(
      schema?.label || 'CSS class name',
      'What are the auxiliary CSS class names? Please go to <a href="https://baidu.github.io/amis/docs/concepts/style" target="_blank">Style Description</a>, in addition you can add custom class names, and then add custom styles in the system configuration.'
    )
  };
});

setSchemaTpl('onlyClassNameTab', (label = 'Outer') => {
  return {
    title: 'Appearance',
    body: getSchemaTpl('collapseGroup', [
      {
        title: 'CSS class name',
        body: [getSchemaTpl('className', {label})]
      }
    ])
  };
});

/**
 * Combo component style packaging adjustment
 */
setSchemaTpl('combo-container', (config: SchemaObject) => {
  if (isObject(config)) {
    let itemsWrapperClassName;
    let itemClassName;
    if (['input-kv', 'combo'].includes((config as any).type)) {
      itemsWrapperClassName =
        'ae-Combo-items ' + ((config as any).itemsWrapperClassName ?? '');
      itemClassName = 'ae-Combo-item ' + ((config as any).itemClassName ?? '');
    }
    return {
      ...(config as any),
      ...(itemsWrapperClassName ? {itemsWrapperClassName} : {}),
      ...(itemClassName ? {itemClassName} : {})
    };
  }
  return config;
});

/**
 * Page component static data
 */
setSchemaTpl(
  'pageData',
  getSchemaTpl('combo-container', {
    type: 'input-kv',
    mode: 'normal',
    name: 'data',
    label: 'Component static data'
  })
);

/**
 * Status of all components
 */
setSchemaTpl(
  'status',
  (config: {
    isFormItem?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    unsupportStatic?: boolean;
  }) => {
    return {
      title: 'Status',
      body: [
        getSchemaTpl('visible'),
        getSchemaTpl('hidden'),
        config?.isFormItem ? getSchemaTpl('clearValueOnHidden') : null,
        !config?.unsupportStatic && config?.isFormItem
          ? getSchemaTpl('static')
          : null,
        config?.readonly ? getSchemaTpl('readonly') : null,
        config?.disabled || config?.isFormItem ? getSchemaTpl('disabled') : null
      ].filter(Boolean)
    };
  }
);

setSchemaTpl('autoFill', {
  type: 'input-kv',
  name: 'autoFill',
  label: tipedLabel(
    'AutoFill',
    'Automatically fill the value of a field of the currently selected option into a form item in the form, supporting data mapping'
  )
});

setSchemaTpl('autoFillApi', {
  type: 'input-kv',
  name: 'autoFill',
  label: tipedLabel('Data entry', 'Auto-fill or reference entry')
});

setSchemaTpl('required', {
  type: 'switch',
  name: 'required',
  label: 'Is it required',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline '
});

/**
 * Form item description
 */
setSchemaTpl('description', {
  name: 'description',
  type: 'textarea',
  label: tipedLabel(
    'Description',
    'Light text description below the form item control'
  ),
  maxRows: 2,
  pipeIn: (value: any, data: any) => value || data.desc || ''
});

setSchemaTpl('disabled', {
  type: 'ae-StatusControl',
  label: 'disable',
  mode: 'normal',
  name: 'disabled',
  expressionName: 'disabledOn'
});

setSchemaTpl('readonly', {
  type: 'ae-StatusControl',
  label: 'read-only',
  mode: 'normal',
  name: 'readOnly',
  expressionName: 'readOnlyOn'
});

setSchemaTpl('visible', {
  type: 'ae-StatusControl',
  defaultTrue: true,
  label: 'Visible',
  mode: 'normal',
  name: 'visible',
  expressionName: 'visibleOn'
});

setSchemaTpl('static', {
  type: 'ae-StatusControl',
  label: 'Static display',
  mode: 'normal',
  name: 'static',
  expressionName: 'staticOn'
});

setSchemaTpl('hidden', {
  type: 'ae-StatusControl',
  label: 'Hide',
  mode: 'normal',
  name: 'hidden',
  expressionName: 'hiddenOn'
});

setSchemaTpl('maximum', {
  type: 'input-number',
  label: 'Maximum value'
});

setSchemaTpl('minimum', {
  type: 'input-number',
  label: 'Minimum value'
});

setSchemaTpl('switchDefaultValue', {
  type: 'switch',
  label: 'Default value settings',
  name: 'value',
  pipeIn: (value: any) => typeof value !== 'undefined',
  pipeOut: (value: any, origin: any, data: any) => (value ? '' : undefined),
  labelRemark: {
    trigger: ['hover', 'focus'],
    setting: true,
    title: '',
    content: 'Get by name if not set'
  }
});

setSchemaTpl('numberSwitchDefaultValue', {
  type: 'switch',
  label: tipedLabel(
    'Default value setting',
    'Get according to name when not set'
  ),
  name: 'value',
  pipeIn: (value: any) => typeof value !== 'undefined',
  pipeOut: (value: any, origin: any, data: any) => (value ? '' : undefined)
});

setSchemaTpl('kilobitSeparator', {
  type: 'switch',
  label: 'Thousands',
  name: 'kilobitSeparator',
  inputClassName: 'is-inline'
});

setSchemaTpl('imageUrl', {
  type: 'input-text',
  label: 'Picture'
});

setSchemaTpl('backgroundImageUrl', {
  type: 'input-text',
  label: 'Image path'
});

setSchemaTpl('audioUrl', {
  type: 'input-text',
  label: 'Audio address',
  name: 'src',
  description:
    'Supports obtaining variables such as: <code>\\${audioSrc}</code>'
});

setSchemaTpl('fileUrl', {
  type: 'input-text',
  label: 'File'
});

setSchemaTpl('markdownBody', {
  name: 'value',
  type: 'editor',
  language: 'markdown',
  size: 'xxl',
  label: 'Markdown content',
  options: {
    lineNumbers: 'off'
  }
});

setSchemaTpl('richText', {
  label: 'Rich text',
  type: 'input-rich-text',
  buttons: [
    'paragraphFormat',
    'quote',
    'textColor',
    'backgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    '|',
    'formatOL',
    'format',
    'align',
    '|',
    'insertLink',
    'insertImage',
    'insertTable',
    '|',
    'undo',
    'redo',
    'fullscreen'
  ],
  name: 'html',
  description:
    'Supports using <code>\\${xxx}</code> to get variables, or using lodash.template syntax to write template logic. <a target="_blank" href="/amis/zh-CN/docs/concepts/template">Details</a>',
  size: 'lg'
});

setSchemaTpl('showCounter', {
  type: 'switch',
  label: 'Counter',
  name: 'showCounter',
  inputClassName: 'is-inline'
});

setSchemaTpl('borderMode', {
  name: 'borderMode',
  label: 'border',
  type: 'button-group-select',
  inputClassName: 'is-inline',
  horizontal: {
    left: 2,
    justify: true
  },
  options: [
    {label: 'full border', value: 'full'},
    {label: 'half border', value: 'half'},
    {label: 'no border', value: 'none'}
  ],
  pipeIn: defaultValue('full')
});

setSchemaTpl('searchable', (schema: object = {}) =>
  getSchemaTpl('switch', {
    label: 'Retrievable',
    name: 'searchable',
    ...schema
  })
);

setSchemaTpl('sortable', (schema: object = {}) =>
  getSchemaTpl('switch', {
    label: 'Sortable',
    name: 'sortable',
    ...schema
  })
);

setSchemaTpl('onlyLeaf', {
  type: 'switch',
  label: tipedLabel(
    'Must select the last level',
    'Must select the last level, cannot select the middle level'
  ),
  horizontal: {
    left: 5,
    justify: true
  },
  name: 'onlyLeaf',
  value: false,
  inputClassName: 'is-inline'
});

setSchemaTpl('clearValueOnHidden', () =>
  getSchemaTpl('switch', {
    type: 'switch',
    horizontal: {left: 8, justify: true},
    label: tipedLabel(
      'Delete fields when hidden',
      'When the current form item is hidden, the value of the form item will be deleted in the form submission data'
    ),
    name: 'clearValueOnHidden'
  })
);

setSchemaTpl('utc', {
  type: 'switch',
  label: tipedLabel(
    'UTC conversion',
    'After turning it on, submitted and displayed data will be converted to UTC; it is recommended to turn it on for applications with cross-regional users'
  ),
  name: 'utc',
  inputClassName: 'is-inline'
});

setSchemaTpl('embed', {
  type: 'switch',
  label: 'Embedded mode',
  name: 'embed'
});

setSchemaTpl('buttonLevel', {
  label: 'Button style',
  type: 'select',
  name: 'level',
  menuTpl: {
    type: 'container',
    bodyClassName: 'ae-ButtonLevel-MenuTpl',
    body: {
      type: 'button',
      label: '${label}',

      size: 'sm',
      level: '${value}'
    }
  },
  options: [
    {
      label: 'Default',
      value: 'default',
      level: 'default'
    },
    {
      label: 'Link',
      value: 'link',
      level: 'link'
    },
    {
      label: 'main color',
      value: 'primary',
      level: 'primary'
    },

    {
      label: 'light color',
      value: 'light',
      level: 'light'
    },
    {
      label: 'dark',
      value: 'dark',
      level: 'dark'
    },

    {
      label: 'prompt',
      value: 'info',
      level: 'info'
    },
    {
      label: 'Success',
      value: 'success',
      level: 'success'
    },
    {
      label: 'Warning',
      value: 'warning',
      level: 'warning'
    },
    {
      label: 'Serious',
      value: 'danger',
      level: 'danger'
    },
    {
      label: 'Secondary',
      value: 'secondary',
      level: 'secondary'
    },
    {
      label: 'Strengthen',
      value: 'enhance',
      level: 'enhance'
    }
  ],
  pipeIn: defaultValue('default')
});

setSchemaTpl('uploadType', {
  label: 'Upload method',
  name: 'uploadType',
  type: 'select',
  value: 'fileReceptor',
  options: [
    {
      label: 'File receiver',
      value: 'fileReceptor'
    },

    {
      label: 'Object storage',
      value: 'bos'
    }
  ]
});

setSchemaTpl('bos', {
  label: 'Storage Warehouse',
  type: 'select',
  name: 'bos',
  value: 'default',
  options: [
    {
      label: 'Platform default',
      value: 'default'
    }
  ]
});

setSchemaTpl('badge', {
  label: 'corner mark',
  name: 'badge',
  type: 'ae-badge'
});

setSchemaTpl('nav-badge', {
  label: 'corner mark',
  name: 'badge',
  type: 'ae-nav-badge'
});

setSchemaTpl('nav-default-active', {
  type: 'ae-nav-default-active'
});

/**
 * Date range shortcut key component
 */
setSchemaTpl('dateShortCutControl', (schema: object = {}) => {
  return {
    type: 'ae-DateShortCutControl',
    name: 'shortcuts',
    ...schema
  };
});
setSchemaTpl('eventControl', (schema: object = {}) => {
  return {
    type: 'ae-eventControl',
    mode: 'normal',
    ...schema
  };
});

setSchemaTpl('data', {
  type: 'input-kv',
  name: 'data',
  label: 'Component static data'
});

setSchemaTpl('app-page', {
  type: 'nested-select',
  label: 'Select page',
  name: 'link',
  mode: 'horizontal',
  size: 'lg',
  required: true,
  options: []
});

setSchemaTpl('app-page-args', {
  type: 'combo',
  name: 'params',
  label: 'Page parameters',
  multiple: true,
  removable: true,
  addable: true,
  strictMode: false,
  canAccessSuperData: true,
  size: 'lg',
  mode: 'horizontal',
  items: [
    {
      name: 'key',
      type: 'input-text',
      placeholder: 'parameter name',
      source: '${__pageInputSchema}',
      labelField: 'label',
      valueField: 'value',
      required: true
    },
    getSchemaTpl('formulaControl', {
      name: 'val',
      variables: '${variables}',
      placeholder: 'parameter value'
    })
  ]
});

setSchemaTpl(
  'iconLink',
  (schema: {
    name: 'icon' | 'rightIcon';
    visibleOn: boolean;
    label?: string;
  }) => {
    const {name, visibleOn, label} = schema;
    return getSchemaTpl('icon', {
      name: name,
      visibleOn,
      label: label ?? 'icon',
      placeholder: 'Click to select icon',
      clearable: true,
      description: ''
    });
  }
);

setSchemaTpl('virtualThreshold', {
  name: 'virtualThreshold',
  type: 'input-number',
  min: 1,
  step: 1,
  precision: 0,
  label: tipedLabel(
    'Virtual list threshold',
    'When the number of options exceeds the threshold, a virtual list will be enabled to optimize performance'
  ),
  pipeOut: (value: any) => value || undefined
});

setSchemaTpl('virtualItemHeight', {
  name: 'itemHeight',
  type: 'input-number',
  min: 1,
  step: 1,
  precision: 0,
  label: tipedLabel(
    'option height',
    'the height of each option when the virtual list is turned on'
  ),
  pipeOut: (value: any) => value || undefined
});

setSchemaTpl('pageTitle', {
  label: 'Page title',
  name: 'title',
  type: 'input-text'
});

setSchemaTpl('pageSubTitle', {
  label: 'Subtitle',
  name: 'subTitle',
  type: 'textarea'
});

setSchemaTpl('textareaDefaultValue', (options: any) => {
  return getSchemaTpl('textareaFormulaControl', {
    label: 'Default value',
    name: 'value',
    mode: 'normal',
    ...options
  });
});

setSchemaTpl('prefix', {
  type: 'input-text',
  name: 'prefix',
  label: tipedLabel(
    'prefix',
    'displayed before input content, not included in data value'
  )
});

setSchemaTpl('suffix', {
  type: 'input-text',
  name: 'suffix',
  label: tipedLabel(
    'suffix',
    'Displayed after input, not included in data value'
  )
});

setSchemaTpl('unit', {
  type: 'input-text',
  name: 'unit',
  label: 'Unit',
  value: ''
});

setSchemaTpl('optionsTip', {
  type: 'input-text',
  name: 'optionsTip',
  label: 'option prompt',
  value: 'Recent tags you used'
});

setSchemaTpl('tableCellRemark', {
  name: 'remark',
  label: 'prompt',
  type: 'input-text',
  description:
    'Show a hint icon, and the content will be displayed when the mouse is placed on it.'
});

setSchemaTpl('tableCellPlaceholder', {
  name: 'placeholder',
  type: 'input-text',
  label: 'Placeholder',
  value: '-',
  description: 'When there is no value, use this to display instead'
});

setSchemaTpl('title', {
  type: 'input-text',
  name: 'title',
  label: 'Title'
});

setSchemaTpl('caption', {
  type: 'input-text',
  name: 'caption',
  label: 'Title'
});

setSchemaTpl('imageCaption', {
  type: 'input-text',
  name: 'imageCaption',
  label: 'Image description'
});

setSchemaTpl('inputBody', {
  type: 'input-text',
  name: 'body',
  label: tipedLabel(
    'content',
    'If not filled in, the target address value will be used automatically'
  )
});

setSchemaTpl('stepSubTitle', {
  type: 'input-text',
  name: 'subTitle',
  label: false,
  placeholder: 'Subtitle'
});

setSchemaTpl('stepDescription', {
  type: 'input-text',
  name: 'description',
  label: false,
  placeholder: 'Description'
});

setSchemaTpl('taskNameLabel', {
  type: 'input-text',
  name: 'taskNameLabel',
  pipeIn: defaultValue('task name'),
  label: 'Task name column title'
});

setSchemaTpl('operationLabel', {
  type: 'input-text',
  name: 'operationLabel',
  pipeIn: defaultValue('operation'),
  label: 'Action bar title'
});

setSchemaTpl('statusLabel', {
  type: 'input-text',
  name: 'statusLabel',
  pipeIn: defaultValue('status'),
  label: 'Status bar title'
});

setSchemaTpl('remarkLabel', {
  type: 'input-text',
  name: 'remarkLabel',
  pipeIn: defaultValue('Notes'),
  label: 'Notes column title'
});

setSchemaTpl('inputArrayItem', {
  type: 'input-text',
  placeholder: 'name'
});

setSchemaTpl('actionPrevLabel', {
  type: 'input-text',
  name: 'actionPrevLabel',
  label: 'Previous button name',
  pipeIn: defaultValue('previous step')
});

setSchemaTpl('actionNextLabel', {
  type: 'input-text',
  name: 'actionNextLabel',
  label: 'Next button name',
  pipeIn: defaultValue('next step')
});

setSchemaTpl('actionNextSaveLabel', {
  type: 'input-text',
  name: 'actionNextSaveLabel',
  label: 'Save and next button name',
  pipeIn: defaultValue('Save and next step')
});

setSchemaTpl('actionFinishLabel', {
  type: 'input-text',
  name: 'actionFinishLabel',
  label: 'Complete button name',
  pipeIn: defaultValue('complete')
});

setSchemaTpl('imgCaption', {
  type: 'textarea',
  name: 'caption',
  label: 'Image description'
});

setSchemaTpl('taskRemark', {
  type: 'textarea',
  name: 'remark',
  label: 'Task Description'
});

setSchemaTpl('tooltip', {
  type: 'textarea',
  name: 'tooltip',
  label: 'Prompt content'
});

setSchemaTpl('anchorTitle', {
  type: 'input-text',
  name: 'title',
  required: true,
  placeholder: 'Please enter the anchor title'
});

setSchemaTpl('avatarText', {
  label: 'character',
  name: 'text',
  type: 'input-text',
  pipeOut: (value: any) => (value === '' ? undefined : value),
  visibleOn: 'this.showtype === "text"'
});

setSchemaTpl('cardTitle', {
  name: 'header.title',
  type: 'input-text',
  label: 'Title',
  description: 'Support template syntax such as: <code>\\${xxx}</code>'
});

setSchemaTpl('cardSubTitle', {
  name: 'header.subTitle',
  type: 'input-text',
  label: 'Subtitle',
  description: 'Support template syntax such as: <code>\\${xxx}</code>'
});

setSchemaTpl('cardsPlaceholder', {
  name: 'placeholder',
  value: 'No data yet',
  type: 'input-text',
  label: 'No data prompt'
});

setSchemaTpl('cardDesc', {
  name: 'header.desc',
  type: 'textarea',
  label: 'Description',
  description: 'Support template syntax such as: <code>\\${xxx}</code>'
});

setSchemaTpl('imageTitle', {
  type: 'input-text',
  label: 'Picture title',
  name: 'title',
  visibleOn: 'this.type == "image"'
});

setSchemaTpl('imageDesc', {
  type: 'textarea',
  label: 'Picture description',
  name: 'description',
  visibleOn: 'this.type == "image"'
});

setSchemaTpl('fetchSuccess', {
  label: 'Get successful prompt',
  type: 'input-text',
  name: 'fetchSuccess'
});

setSchemaTpl('fetchFailed', {
  label: 'Get failed prompt',
  type: 'input-text',
  name: 'fetchFailed'
});

setSchemaTpl('saveOrderSuccess', {
  label: 'Save sequence successfully',
  type: 'input-text',
  name: 'saveOrderSuccess'
});

setSchemaTpl('saveOrderFailed', {
  label: 'Prompt for failure to save sequence',
  type: 'input-text',
  name: 'saveOrderFailed'
});

setSchemaTpl('quickSaveSuccess', {
  label: 'Quick save success prompt',
  type: 'input-text',
  name: 'quickSaveSuccess'
});

setSchemaTpl('quickSaveFailed', {
  label: 'Quick save failure prompt',
  type: 'input-text',
  name: 'quickSaveFailed'
});

setSchemaTpl('saveSuccess', {
  label: 'Save successfully prompt',
  name: 'saveSuccess',
  type: 'input-text'
});

setSchemaTpl('saveFailed', {
  label: 'Save failed prompt',
  name: 'saveFailed',
  type: 'input-text'
});

setSchemaTpl('validateFailed', {
  label: 'Verification failure prompt',
  name: 'validateFailed',
  type: 'input-text'
});

setSchemaTpl('tablePlaceholder', {
  name: 'placeholder',
  pipeIn: defaultValue('No data yet'),
  type: 'input-text',
  label: 'No data prompt'
});

setSchemaTpl('collapseOpenHeader', {
  name: 'collapseHeader',
  label: tipedLabel('Expanded title', 'Title when the folder is expanded'),
  type: 'input-text'
});

setSchemaTpl('matrixColumnLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: 'Column description'
});

setSchemaTpl('matrixRowLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: 'Line description'
});

setSchemaTpl('matrixRowTitle', {
  name: 'rowLabel',
  label: 'row title text',
  type: 'input-text'
});

setSchemaTpl('submitText', {
  name: 'submitText',
  label: 'Submit button name',
  type: 'input-text'
});

setSchemaTpl('tpl:btnLabel', {
  type: 'tpl',
  tpl: '<span class="label label-success">${label}</span>',
  columnClassName: 'p-t-xs'
});

setSchemaTpl('switchOption', {
  type: 'input-text',
  name: 'option',
  label: 'Description'
});

setSchemaTpl('addOnLabel', {
  name: 'label',
  label: 'character',
  type: 'input-text'
});

setSchemaTpl('onText', {
  name: 'onText',
  type: 'input-text',
  label: 'When turned on'
});

setSchemaTpl('offText', {
  name: 'offText',
  type: 'input-text',
  label: 'Closed'
});

setSchemaTpl('propertyTitle', {
  label: 'Title',
  type: 'input-text',
  name: 'title'
});

setSchemaTpl('propertyLabel', {
  type: 'input-text',
  mode: 'inline',
  size: 'sm',
  label: 'attribute name',
  name: 'label'
});

setSchemaTpl('propertyContent', {
  type: 'input-text',
  mode: 'inline',
  size: 'sm',
  label: 'attribute value',
  name: 'content'
});

setSchemaTpl('draggableTip', {
  type: 'input-text',
  name: 'draggableTip',
  label: tipedLabel('tip text', 'tip text for drag and drop sorting')
});

setSchemaTpl('deleteConfirmText', {
  label: tipedLabel(
    'Confirmation text',
    'Delete confirmation text, when the configuration deletes the interface, it takes effect'
  ),
  name: 'deleteConfirmText',
  type: 'input-text',
  pipeIn: defaultValue('Are you sure you want to delete?')
});

setSchemaTpl('optionsLabel', {
  type: 'input-text',
  name: 'label',
  placeholder: 'name',
  required: true
});

setSchemaTpl('anchorNavTitle', {
  name: 'title',
  label: 'Title',
  type: 'input-text',
  required: true
});

/** For CRUD2 use */
setSchemaTpl('primaryField', {
  type: 'input-text',
  name: 'primaryField',
  label: tipedLabel(
    'Primary key',
    'The unique identifier of each row record, usually used in scenarios such as row selection and batch operations.'
  ),
  pipeIn: (value: any, formStore: any) => {
    const rowSelection = formStore?.data?.rowSelection;

    if (value == null || typeof value !== 'string') {
      return rowSelection &&
        rowSelection?.keyField &&
        typeof rowSelection.keyField === 'string'
        ? rowSelection?.keyField
        : 'id';
    }

    return value;
  }
});

/**
 * Whether it is a lazy loading node field
 */
setSchemaTpl('deferField', {
  label: tipedLabel(
    'Lazy loading fields',
    'Whether it is the field name of the lazy loading node, the default is defer, you can use this configuration item to customize the field name'
  ),
  name: 'deferField',
  type: 'input-text',
  placeholder: 'Customize the fields to enable lazy loading'
});

setSchemaTpl(
  'signBtn',
  (options: {label: string; name: string; icon: string}) => {
    return {
      type: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      items: [
        {
          style: {
            color: '#5c5f66'
          },
          type: 'tpl',
          tpl: options.label
        },
        {
          type: 'action',
          label: 'Settings',
          level: 'link',
          actionType: 'dialog',
          dialog: {
            title: 'Settings',
            body: {
              type: 'form',
              body: [
                {
                  name: options.name,
                  label: 'Button text',
                  type: 'input-text'
                },
                getSchemaTpl('icon', {
                  name: options.icon,
                  label: 'icon'
                })
              ]
            },
            actions: [
              {
                type: 'submit',
                label: 'Confirm',
                mergeData: true,
                level: 'primary'
              }
            ]
          }
        }
      ]
    };
  }
);

setSchemaTpl('closable', {
  type: 'ae-StatusControl',
  label: tipedLabel('Can close tab', 'Higher priority within tab'),
  mode: 'normal',
  name: 'closable',
  expressionName: 'closableOn'
});

setSchemaTpl('inputForbid', {
  type: 'switch',
  label: 'No input allowed',
  name: 'inputForbid',
  inputClassName: 'is-inline'
});

setSchemaTpl('button-manager', () => {
  return getSchemaTpl('combo-container', {
    type: 'combo',
    label: 'Button Management',
    name: 'actions',
    mode: 'normal',
    multiple: true,
    addable: true,
    draggable: true,
    editable: false,
    items: [
      {
        component: (props: any) => {
          return render({
            ...props.data,
            onEvent: {},
            actionType: '',
            onClick: (e: any, props: any) => {
              const editorStore = (window as any).editorStore;
              const subEditorStore = editorStore.getSubEditorRef()?.store;
              (subEditorStore || editorStore).setActiveIdByComponentId(
                props.id
              );
            }
          });
        }
      }
    ],
    addButtonText: 'Add a new button',
    scaffold: {
      type: 'button',
      label: 'button'
    }
  });
});
