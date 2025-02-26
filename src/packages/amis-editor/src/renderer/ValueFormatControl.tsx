/**
 * Value format entry control
 * - Boolean
 * - number
 * - text
 */

import React from 'react';
import {FormItem} from '@/packages/amis/src';
import type {FormControlProps} from '@/packages/amis/src';

export interface valueFormatControlProps extends FormControlProps {
  supportNumberType: boolean; // Whether to support number type, supported by default
  supportBoolType: boolean; // Whether to support Boolean type, supported by default

  placeholder?: string; // placeholder
}

export type valueType = 'text' | 'boolean' | 'number';

/**
 * Get the type of the current option value
 */
const getOptionValueType = (
  value: any,
  supportTypes: valueFormatControlProps
): valueType => {
  if (typeof value === 'boolean' && supportTypes.supportBoolType !== false) {
    return 'boolean';
  }
  if (typeof value === 'number' && supportTypes.supportNumberType !== false) {
    return 'number';
  }
  return 'text';
};

/**
 * Convert the current option value to the selected type
 */
const normalizeOptionValue = (value: any, valueType: valueType): any => {
  if (valueType === 'number') {
    const convertTo = Number(value);
    if (isNaN(convertTo)) {
      return 0;
    }
    return convertTo;
  }
  if (valueType === 'boolean') {
    return !value || value === 'false' ? false : true;
  }
  return String(value);
};

const ValueFormatControl: React.FC<valueFormatControlProps> = props => {
  const {render, value, onChange, placeholder} = props;

  return render('body', {
    type: 'form',
    wrapWithPanel: false,
    data: {vType: getOptionValueType(value, props), vValue: value},
    onChange: (data: {vType: valueType; vValue: string}) =>
      onChange(normalizeOptionValue(data.vValue, data.vType)),
    body: [
      {
        type: 'input-group',
        name: 'input-group',
        label: false,
        mode: 'horizontal',
        body: [
          {
            type: 'select',
            name: 'vType',
            options: [
              {
                label: 'text',
                value: 'text'
              },
              {
                label: 'number',
                value: 'number',
                hidden: props.supportNumberType === false
              },
              {
                label: 'Boolean',
                value: 'boolean',
                hidden: props.supportBoolType === false
              }
            ].filter(item => item.hidden !== true),
            checkAll: false,
            // pipeIn: (v: valueType) => (v ? v : getOptionValueType(v, props)),
            onChange: (value: any, oldValue: any, model: any, form: any) => {
              const {vValue} = form?.data || {};
              form.setValues({vValue: normalizeOptionValue(vValue, value)});
            }
          },
          {
            type: 'input-text',
            placeholder,
            name: 'vValue',
            value,
            visibleOn: "this.vType !== 'boolean'"
          },
          {
            type: 'input-text',
            placeholder,
            name: 'vValue',
            value,
            visibleOn: "this.vType === 'boolean'",
            options: [
              {label: 'true', value: true},
              {label: 'false', value: false}
            ]
          }
        ]
      }
    ]
  });
};

export default FormItem({
  type: 'ae-valueFormat'
})(ValueFormatControl);
