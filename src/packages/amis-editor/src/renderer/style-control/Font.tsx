/**
 * @file Font
 * @description Text style related controls
 */

import React from 'react';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {fontFamilyList} from './font-family';
import {string2CSSUnit, isObject} from '@/packages/amis-editor-core/src';
import {FormItem} from '@/packages/amis-ui/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import type {PlainObject} from './types';

export interface FontProps extends FormControlProps {
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}

const Font: React.FC<FontProps> = props => {
  const {value, onChange, render} = props;
  const validProps = [
    'color',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'textAlign',
    'letterSpacing',
    'lineHeight'
  ];
  const fontContext = isObject(value)
    ? {
        ...pick(value, validProps),
        /** TextDecoration is handled specially because multiple values ​​can be selected at the same time */
        underline: !!~(value?.textDecoration ?? '').indexOf('underline')
          ? 'underline'
          : undefined,
        lineThrough: !!~(value?.textDecoration ?? '').indexOf('line-through')
          ? 'line-through'
          : undefined
      }
    : {};

  const handleSubmit = (formValue: any, action: any) => {
    onChange?.({
      ...value,
      ...mapValues(
        {
          ...pick(formValue, validProps),
          textDecoration: [formValue.underline, formValue.lineThrough]
            .filter(Boolean)
            .join(' '),
          letterSpacing: string2CSSUnit(formValue.letterSpacing),
          lineHeight: string2CSSUnit(formValue.lineHeight)
        },
        props => props || undefined
      ),
      // Fonts require special processing, and can be set to an empty string
      fontFamily: formValue.fontFamily
    });
  };

  return (
    <>
      {render(
        'inner',
        {
          type: 'form',
          wrapWithPanel: false,
          panelClassName: 'border-none shadow-none mb-0',
          bodyClassName: 'p-none',
          actionsClassName: 'border-none mt-2.5',
          wrapperComponent: 'div',
          preventEnterSubmit: true,
          submitOnChange: true,
          body: [
            {
              name: 'fontFamily',
              label: 'font type',
              type: 'select',
              mode: 'row',
              size: 'md',
              placeholder: 'Please select a font',
              menuTpl: '<div style="font-family: ${value};">${label}</div>',
              options: fontFamilyList,
              clearable: false,
              value: value?.fontFamily ?? ''
            },
            {
              name: 'color',
              label: 'font color',
              type: 'input-color',
              mode: 'row',
              size: 'md',
              value: value?.color ?? ''
            },
            {
              name: 'fontSize',
              label: 'font size',
              type: 'input-range',
              max: 100,
              min: 12,
              step: 1,
              clearable: false,
              value: value?.fontSize ?? 12
            },
            {
              type: 'input-group',
              name: 'input-group',
              label: 'text style',
              mode: 'row',
              body: [
                {
                  type: 'button-group-select',
                  name: 'fontWeight',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'bold',
                      icon: 'fa fa-bold',
                      className: 'ae-Font-group-lhs ae-Font-relative-left'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'fontStyle',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'italic',
                      icon: 'fa fa-italic',
                      className: 'ae-Font-group-middle'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'underline',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'underline',
                      icon: 'fa fa-underline',
                      className: 'ae-Font-group-middle ae-Font-relative-right'
                    }
                  ]
                },
                {
                  type: 'button-group-select',
                  name: 'lineThrough',
                  clearable: true,
                  label: false,
                  options: [
                    {
                      label: '',
                      value: 'line-through',
                      icon: 'fa fa-strikethrough',
                      className: 'ae-Font-group-rhs ae-Font-relative-right-2'
                    }
                  ]
                }
              ]
            },
            // TODO: Add 'justify-all', 'start', 'end', 'match-parent' types
            getSchemaTpl('layout:textAlign', {
              label: 'text position',
              mode: 'row'
            }),
            {
              type: 'group',
              label: 'Text layout',
              body: [
                {
                  name: 'letterSpacing',
                  label: '',
                  type: 'input-text',
                  addOn: {
                    className: 'ae-Font-group-lhs',
                    label: '',
                    type: 'text',
                    position: 'left',
                    icon: 'fa fa-text-width'
                  }
                },
                {
                  name: 'lineHeight',
                  label: '',
                  type: 'input-text',
                  addOn: {
                    className: 'ae-Font-group-lhs',
                    label: '',
                    type: 'text',
                    position: 'left',
                    icon: 'fa fa-text-height'
                  }
                }
              ]
            }
          ]
        },
        {
          data: fontContext,
          onSubmit: handleSubmit
        }
      )}
    </>
  );
};

export default Font;

@FormItem({type: 'style-font', renderLabel: false})
export class FontRenderer extends React.Component<FormControlProps> {
  render() {
    return <Font {...this.props} />;
  }
}
