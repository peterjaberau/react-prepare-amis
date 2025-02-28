/**
 * @file Display
 * @description Layout display related controls
 */

import React from 'react';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import {FormItem} from '@/packages/amis/src';

import {isObject} from '@/packages/amis-editor-core/src';

import type {FormControlProps} from '@/packages/amis-core/src';
import type {PlainObject} from './types';

export interface DisplayProps extends FormControlProps {
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}

const Display: React.FC<DisplayProps> = props => {
  const {onChange, value, render} = props;
  // Universal rendering of drop-down menu
  const menuTpl = {
    type: 'html',
    html: "<span>${label}</span><code class='ae-Code'>${value}</code>",
    className: 'ae-selection-code'
  };
  const displayContext = pick(isObject(value) ? value : {}, [
    'display',
    'flexWrap',
    'flexDirection',
    'justifyContent',
    'alignItems'
  ]);

  if (!displayContext.display) {
    displayContext.display = 'default';
  }

  const handleSubmit = (form: Record<string, any>, action: any) => {
    const displayValue =
      form.display === 'flex'
        ? form
        : mapValues(displayContext, (value, key) =>
            // Non-flex layout/default layout needs to remove irrelevant parameters
            key !== 'display' || (key === 'display' && form[key] === 'default')
              ? undefined
              : form[key]
          );

    onChange?.({...value, ...displayValue});
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
          formLazyChange: true,
          preventEnterSubmit: true,
          submitOnChange: true,
          body: [
            {
              label: 'Display type',
              name: 'display',
              type: 'select',
              mode: 'row',
              menuTpl,
              options: [
                {
                  label: 'Default',
                  value: 'default'
                },
                {
                  label: 'block',
                  icon: 'display-block',
                  value: 'block'
                },
                {
                  label: 'Inline block',
                  icon: 'display-inline-block',
                  value: 'inline-block'
                },
                {
                  label: 'Inline element',
                  icon: 'display-inline',
                  value: 'inline'
                },
                {
                  label: 'Elastic layout',
                  icon: 'display-flex',
                  value: 'flex'
                }
              ]
            },
            {
              type: 'wrapper',
              visibleOn: "this.display === 'flex'",
              className: 'ae-Display-group',
              body: [
                {
                  type: 'tpl',
                  tpl: 'Flexible layout configuration',
                  className: 'text-base font-bold mb-1'
                },
                {
                  label: 'Automatic line wrap',
                  name: 'flexWrap',
                  type: 'switch',
                  trueValue: 'wrap',
                  falseValue: 'nowrap',
                  mode: 'row',
                  inputClassName:
                    'inline-flex justify-between flex-row-reverse',
                  clearValueOnHidden: true
                },
                {
                  label: 'spindle direction',
                  name: 'flexDirection',
                  type: 'select',
                  clearValueOnHidden: true,
                  menuTpl,
                  options: [
                    {
                      label: 'Default level',
                      value: 'row',
                      icon: 'drow'
                    },
                    {
                      label: 'Default vertical',
                      value: 'column',
                      icon: 'dcolumn'
                    },
                    {
                      label: 'horizontal reverse',
                      value: 'row-reverse',
                      icon: 'drowReverse'
                    },
                    {
                      label: 'vertical reverse',
                      value: 'column-reverse',
                      icon: 'dcolumnReverse'
                    }
                  ]
                },
                {
                  label: 'Spindle alignment',
                  type: 'select',
                  name: 'justifyContent',
                  clearValueOnHidden: true,
                  menuTpl,
                  options: [
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
                      label: 'Leave the beginning and end blank',
                      value: 'space-around'
                    },
                    {
                      label: 'Align head and tail',
                      value: 'space-between'
                    },
                    {
                      label: 'Elements are equally spaced',
                      value: 'space-evenly'
                    },
                    {
                      label: 'Automatic stretching',
                      value: 'stretch'
                    }
                  ]
                },
                {
                  label: 'Cross axis alignment',
                  type: 'select',
                  name: 'alignItems',
                  clearValueOnHidden: true,
                  menuTpl,
                  options: [
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
                  ]
                }
              ]
            }
          ]
        },
        {
          data: displayContext,
          onSubmit: handleSubmit
        }
      )}
    </>
  );
};

@FormItem({type: 'style-display'})
export default class DisplayRenderer extends React.Component<FormControlProps> {
  render() {
    return <Display {...this.props} />;
  }
}
