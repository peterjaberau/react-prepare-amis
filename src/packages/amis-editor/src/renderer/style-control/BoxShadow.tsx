/**
 * @file shadow
 * @description Shadow configuration
 * @grammar
 * x offset | y offset | shadow color
 * x offset | y offset | shadow blur radius | shadow color
 * Inset (shadow inward) | x offset | y offset | shadow blur radius | shadow spread radius | shadow color
 */

import React from 'react';
import mapValues from 'lodash/mapValues';

import {FormItem} from '@/packages/src';

import {parseBoxShadow, normalizeBoxShadow} from './transformation';

import type {FormControlProps, RendererProps} from '@/packages/amis-core/src';
import type {BoxShadowProps} from './types';

function BoxShadow({
  value = '',
  onChange,
  render
}: {
  value?: string;
  onChange: (value: any) => void;
} & RendererProps) {
  const boxShadowContext: Record<BoxShadowProps, any> = mapValues(
    parseBoxShadow(typeof value !== 'string' ? '' : value),
    (value, key, collection) =>
      key === 'color' || key === 'inset' ? value : {length: value, unit: 'px'}
  );

  // The style-box-shadow component name needs to be specified, such as style.boxShadow, otherwise no value can be obtained
  const handleSubmit = (formValue: any, action: any) => {
    onChange?.(normalizeBoxShadow(formValue).boxShadow);
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
            ...[
              {
                name: 'X axis offset',
                field: 'x'
              },
              {
                name: 'Y axis offset',
                field: 'y'
              },
              {
                name: 'Blur radius',
                field: 'blur'
              },
              {
                name: 'Diffusion radius',
                field: 'spread'
              }
            ].map(
              (item: {name: string; field: 'x' | 'y' | 'blur' | 'spread'}) => ({
                type: 'combo',
                name: item.field,
                label: item.name,
                formClassName: 'ae-BoxShadow-group',
                items: [
                  {
                    type: 'input-range',
                    label: false,
                    name: 'length',
                    max: 120,
                    min: 0,
                    step: 1
                  },
                  {
                    type: 'select',
                    label: false,
                    name: 'unit',
                    columnClassName: 'ae-BoxShadow-unit',
                    size: 'xs',
                    options: ['px']
                    // TODO: Support px for now
                    // options: ['px', 'em', 'rem', 'vw', 'vh']
                  }
                ]
              })
            ),
            {
              type: 'switch',
              name: 'inset',
              label: 'Inner shadow',
              mode: 'row',
              inputClassName: 'inline-flex justify-between flex-row-reverse'
            },
            {
              type: 'input-color',
              name: 'color',
              label: 'Shadow color',
              placeholder: 'Set shadow color',
              mode: 'row'
            }
          ]
        },
        {
          data: boxShadowContext,
          onSubmit: handleSubmit
        }
      )}
    </>
  );
}

export default BoxShadow;

@FormItem({type: 'style-box-shadow'})
export class BoxShadowRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxShadow {...this.props} />;
  }
}
