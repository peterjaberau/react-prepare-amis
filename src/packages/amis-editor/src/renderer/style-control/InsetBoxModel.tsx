/**
 * @file InsetBoxModel
 * @description Box model control, supports editing top, right, bottom, left
 */

import cx from 'classnames';
import React from 'react';
import {observer} from 'mobx-react';
import camelCase from 'lodash/camelCase';
import {FormItem} from '@/packages/amis/src';
import {isNumeric} from '@/packages/amis-editor-core/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import {isAuto} from '../../util';
import type {PlainObject} from './types';

export type Direction = 'left' | 'right' | 'top' | 'bottom';

function InsetBoxModel({
  value,
  onChange
}: {
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}) {
  const directions: Direction[] = ['left', 'right', 'top', 'bottom'];

  function handleChange(styleName: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      if (!inputValue) {
        onChange({...value, [styleName]: ''});
        return;
      }

      // Both numeric types and strings with valid units are supported
      if (
        isNumeric(inputValue) ||
        isAuto(inputValue) ||
        /^(-?(\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/.test(
          inputValue
        )
      ) {
        onChange({
          ...value,
          [styleName]: inputValue
        });
      }
    };
  }

  function renderBoxItem(item: string) {
    return (
      <>
        {directions.map((direction: Direction) => {
          const propsName = camelCase(`${item}-${direction}`);

          return (
            <input
              key={propsName}
              placeholder="0"
              className={`ae-BoxModel-input ${direction}`}
              type="text"
              onChange={handleChange(propsName)}
              value={value?.[propsName] || ''}
            />
          );
        })}
        <div className="ae-BoxModel-title">{item.toUpperCase()}</div>
        {['lt', 'lb', 'rt', 'rb'].map(position => (
          <div key={position} className={cx('ae-BoxModel-line', position)} />
        ))}
      </>
    );
  }

  return (
    <div className="mx-2 ae-BoxModel">
      <div className="ae-BoxModel-inner"></div>
      {renderBoxItem('inset')}
    </div>
  );
}

export default observer(InsetBoxModel);

@FormItem({type: 'inset-box-model'})
export class BoxModelRenderer extends React.Component<FormControlProps> {
  render() {
    return <InsetBoxModel {...this.props} />;
  }
}
