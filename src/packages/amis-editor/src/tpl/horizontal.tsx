import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import isObject from 'lodash/isObject';
import {tipedLabel} from 'amis-editor-core';

setSchemaTpl('horizontal-align', {
  type: 'button-group-select',
  label: 'Location',
  options: [
    {
      label: 'left',
      value: 'left',
      icon: 'fa fa-align-left'
    },
    {
      label: 'right',
      value: 'right',
      icon: 'fa fa-align-right'
    }
  ]
});

setSchemaTpl('leftFixed', {
  name: 'horizontal.leftFixed',
  type: 'button-group-select',
  visibleOn: 'this.horizontal && this.horizontal.leftFixed',
  label: 'width',
  size: 'xs',
  options: [
    {
      label: 'small',
      value: 'sm'
    },

    {
      label: 'Medium',
      value: 'normal'
    },

    {
      label: 'big',
      value: 'lg'
    }
  ]
});

setSchemaTpl('leftRate', {
  name: 'horizontal',
  type: 'input-range',
  visibleOn: 'this.horizontal && !this.horizontal.leftFixed',
  min: 1,
  max: 11,
  step: 1,
  label: tipedLabel(
    'Proportion',
    '12 equal parts, title width accounts for n/12'
  ),
  pipeIn(v: any) {
    return v.left || 3;
  },
  pipeOut(v: any) {
    return {left: v, right: 12 - v};
  }
});

setSchemaTpl('labelAlign', {
  name: 'labelAlign',
  type: 'button-group-select',
  visibleOn: 'this.horizontal && this.horizontal.leftFixed',
  label: 'Arrangement',
  size: 'xs',
  options: [
    {
      label: 'Left Align',
      value: 'left'
    },
    {
      label: 'right aligned',
      value: 'right'
    }
  ]
});

setSchemaTpl(
  'horizontal',
  (config: {visibleOn: string; [propName: string]: any}) => {
    return [
      {
        type: 'select',
        label: 'label width',
        name: 'horizontal',
        options: [
          {label: 'Inherit', value: 'formHorizontal'},
          {label: '固宽', value: 'leftFixed'},
          {label: 'Ratio', value: 'leftRate'}
        ],
        pipeIn(v: any) {
          if (!v) {
            return 'formHorizontal';
          }
          if (v.leftFixed) {
            return 'leftFixed';
          }
          return 'leftRate';
        },
        pipeOut(v: any) {
          const defaultData = {
            formHorizontal: undefined,
            leftFixed: {leftFixed: 'normal'},
            leftRate: {left: 3, right: 9}
          };

          // @ts-ignore
          return defaultData[v];
        },
        visibleOn: 'this.mode == "horizontal" && this.label !== false',
        ...(isObject(config) ? config : {})
      },
      getSchemaTpl('layout:wrapper-contanier', {
        visibleOn:
          'this.mode == "horizontal" && this.horizontal && this.label !== false',
        body: [
          getSchemaTpl('leftFixed'),
          getSchemaTpl('leftRate'),
          getSchemaTpl('labelAlign')
        ]
      })
    ];
  }
);

setSchemaTpl('subFormItemMode', {
  label: 'Subform display mode',
  name: 'subFormMode',
  type: 'button-group-select',
  size: 'sm',
  option: 'Inherit',
  // mode: 'inline',
  // className: 'w-full',
  pipeIn: defaultValue(''),
  options: [
    {
      label: 'Inheritance',
      value: ''
    },

    {
      label: 'Normal',
      value: 'normal'
    },

    {
      label: 'Inline',
      value: 'inline'
    },

    {
      label: 'horizontal',
      value: 'horizontal'
    }
  ]
});

setSchemaTpl('subFormHorizontalMode', {
  type: 'switch',
  label: 'Subform horizontal ratio settings',
  name: 'subFormHorizontal',
  onText: 'Inherit',
  offText: 'Custom',
  inputClassName: 'text-sm',
  visibleOn: 'this.subFormMode == "horizontal"',
  pipeIn: (value: any) => !value,
  pipeOut: (value: any, originValue: any, data: any) =>
    value
      ? null
      : data.formHorizontal || {
          leftFixed: 'normal'
        }
});

setSchemaTpl('subFormItemMode', {
  label: 'Subform display mode',
  name: 'subFormMode',
  type: 'button-group-select',
  size: 'sm',
  option: 'Inherit',
  // mode: 'inline',
  // className: 'w-full',
  pipeIn: defaultValue(''),
  options: [
    {
      label: 'Inheritance',
      value: ''
    },

    {
      label: 'Normal',
      value: 'normal'
    },

    {
      label: 'Inline',
      value: 'inline'
    },

    {
      label: 'horizontal',
      value: 'horizontal'
    }
  ]
});

setSchemaTpl('subFormHorizontalMode', {
  type: 'switch',
  label: 'Subform horizontal ratio settings',
  name: 'subFormHorizontal',
  onText: 'Inherit',
  offText: 'Custom',
  inputClassName: 'text-sm',
  visibleOn: 'this.subFormMode == "horizontal"',
  pipeIn: (value: any) => !value,
  pipeOut: (value: any, originValue: any, data: any) =>
    value
      ? null
      : data.formHorizontal || {
          leftFixed: 'normal'
        }
});

setSchemaTpl('subFormHorizontal', {
  type: 'combo',
  syncDefaultValue: false,
  visibleOn: 'this.subFormMode == "horizontal" && this.subFormHorizontal',
  name: 'subFormHorizontal',
  multiLine: true,
  pipeIn: (value: any) => {
    return {
      leftRate:
        value && typeof value.left === 'number'
          ? value.left
          : value && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(value.left)
          ? parseInt(RegExp.$1, 10)
          : 2,
      leftFixed: (value && value.leftFixed) || ''
    };
  },
  pipeOut: (value: any) => {
    let left = Math.min(11, Math.max(1, value.leftRate || 2));

    return {
      leftFixed: value.leftFixed || '',
      left: left,
      right: 12 - left
    };
  },
  inputClassName: 'no-padder',
  items: [
    {
      name: 'leftFixed',
      type: 'button-group-select',
      label: 'Left width',
      size: 'xs',
      options: [
        {
          label: 'ratio',
          value: ''
        },

        {
          label: 'Small width',
          value: 'sm',
          visibleOn: 'this.leftFixed'
        },

        {
          label: 'Fixed width',
          value: 'normal'
        },

        {
          label: 'Large width',
          value: 'lg',
          visibleOn: 'this.leftFixed'
        }
      ]
    },
    {
      name: 'leftRate',
      type: 'input-range',
      visibleOn: '!this.leftFixed',
      min: 1,
      max: 11,
      step: 1,
      label: 'Left and right distribution adjustment (n/12)',
      labelRemark: {
        trigger: 'click',
        className: 'm-l-xs',
        rootClose: true,
        content:
          'There are 12 equal parts in total. Here you can set the left width to account for n/12. ',
        placement: 'left'
      }
    }
  ]
});
