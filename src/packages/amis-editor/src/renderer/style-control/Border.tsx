/**
 * @file border rounded corners
 * @description Border & corner radius settings
 */

import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import camelCase from 'lodash/camelCase';
import {observer} from 'mobx-react';
import {FormItem, Select, NumberInput} from 'amis';

import type {PlainObject} from './types';
import type {FormControlProps, RendererProps, SchemaNode} from '@/packages/amis-core/src';

const borderItems = [
  {
    item: 'left',
    tip: 'left border',
    content: '┣'
  },
  {
    item: 'top',
    tip: 'top border',
    content: '┳'
  },
  {
    item: 'right',
    tip: 'right border',
    content: '┫'
  },
  {
    item: 'bottom',
    tip: 'bottom border',
    content: '┻'
  },
  {
    item: 'all',
    tip: 'all',
    content: '╋'
  }
];

const radiusItems = [
  {
    item: 'top-left',
    tip: 'upper left corner',
    content: '┏'
  },
  {
    item: 'top-right',
    tip: 'upper right corner',
    content: '┓'
  },
  {
    item: 'bottom-left',
    tip: 'lower left corner',
    content: '┗'
  },
  {
    item: 'bottom-right',
    tip: 'lower right corner',
    content: '┛'
  },
  {
    item: 'all',
    tip: 'all',
    content: '╋'
  }
];

function BoxBorder({
  disableBorder = false,
  disableRadius = false,
  onChange,
  value = {},
  render
}: {
  disableBorder?: boolean;
  disableRadius?: boolean;
  onChange: (value: PlainObject) => void;
  value?: PlainObject;
} & RendererProps) {
  const [borderItem, setBorderItem] = useState<string>('all');
  const [radiusItem, setRadiusItem] = useState<string>('all');

  function getKey(type: string, field: string) {
    let activeItem = field === 'radius' ? radiusItem : borderItem;

    // TODO: When getting all, should we determine whether all values ​​are equal? ​​If not, return empty or return a combined prompt?
    if (activeItem === 'all') {
      return field === 'radius'
        ? camelCase(`${type}-top-left-${field}`)
        : camelCase(`${type}-left-${field}`);
    }

    return camelCase(`${type}-${activeItem}-${field}`);
  }

  function changeItem(type: string, key: string) {
    return (e: any) => {
      let val = e?.value || e;
      let field = getKey(type, key);
      let isRadius = key === 'radius';
      let activeItem = isRadius ? radiusItem : borderItem;

      if (activeItem === 'all') {
        let newValue: Record<string, any> = {};

        // Filter out all
        let items = (isRadius ? radiusItems : borderItems).filter(
          position => position?.item !== 'all'
        );
        items.forEach(item => {
          let itemKey = camelCase(`${type}-${item.item}-${key}`);
          newValue[itemKey] = val;
        });

        onChange({
          ...value,
          ...newValue
        });
      } else {
        onChange({
          ...value,
          [field]: val
        });
      }
    };
  }

  function renderRadius() {
    return (
      <div className="ae-border-wrap ae-border-radius flex items-center">
        <div className="ae-border-items">
          {radiusItems.map(item => {
            let valueKey = camelCase(`border-${item.item}`);
            return (
              <div
                key={valueKey}
                className={cx(`ae-border-item ${item.item}`, {
                  active: radiusItem === item.item
                })}
                onClick={() => setRadiusItem(item.item)}
              >
                <span data-tooltip={item.tip} data-position="top">
                  {item.content}
                </span>
              </div>
            );
          })}
        </div>

        <div className="ae-border-settings">
          <div className="flex items-center">
            <label>Rounded Corners</label>
            <NumberInput
              placeholder="Corner size"
              value={value[getKey('border', 'radius')]}
              step={1}
              min={0}
              onChange={changeItem('border', 'radius')}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderBorder() {
    return (
      <div className="ae-border-wrap flex flex-top mb-2">
        <div className="ae-border-items">
          {borderItems.map(item => {
            let valueKey = camelCase(`border-${item.item}`);
            return (
              <div
                key={valueKey}
                className={cx(`ae-border-item ${item.item}`, {
                  active: borderItem === item.item
                })}
                onClick={() => setBorderItem(item.item)}
              >
                <span data-tooltip={item.tip} data-position="top">
                  {item.content}
                </span>
              </div>
            );
          })}
        </div>

        <div className="ae-border-settings">
          <div className="flex items-center">
            <label>Linear</label>
            <Select
              className="ae-border-input"
              placeholder="border line type"
              onChange={changeItem('border', 'style')}
              value={value[getKey('border', 'style')]}
              options={[
                {
                  label: 'None',
                  value: 'none'
                },
                {
                  label: 'solid line',
                  value: 'solid'
                },
                {
                  label: 'dot line',
                  value: 'dotted'
                },
                {
                  label: 'dashed line',
                  value: 'dashed'
                }
              ]}
            />
          </div>

          <div className="flex items-center">
            <label>Line Width</label>
            <NumberInput
              placeholder="border width"
              value={value[getKey('border', 'width')]}
              step={1}
              min={0}
              onChange={changeItem('border', 'width')}
            />
          </div>

          <div className="flex items-center">
            <label>Color</label>
            {render(
              'color',
              {
                type: 'input-color',
                placeholder: 'border color',
                clearable: true,
                value: value[getKey('border', 'color')],
                inputClassName: 'ae-border-colorpicker',
                label: false
              },
              {
                onChange: changeItem('border', 'color')
              }
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 ae-border">
      {!disableBorder && renderBorder()}
      {!disableRadius && renderRadius()}
    </div>
  );
}

export default observer(BoxBorder);

@FormItem({type: 'style-border', renderLabel: false})
export class BorderRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxBorder {...this.props} />;
  }
}
