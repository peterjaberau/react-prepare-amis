/**
 * @file border
 * @description Border settings
 */

import cx from 'classnames';
import React, {useEffect, useState} from 'react';
import {FormItem} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import cloneDeep from 'lodash/cloneDeep';
import {Select} from '@/packages/amis-ui/src';
import ColorPicker from './ColorPicker';
import ThemeSelect from './ThemeSelect';
import {i18n as _i18n} from 'i18n-runtime';
import {getDefaultValue} from '../util';

interface BorderProps {
  custom?: boolean;
  needColorCustom?: boolean;
}

interface Options {
  label: string;
  value: string;
  realValue?: any;
  parent?: boolean;
}

const defaultStyleOptions = [
  {
    label: 'solid line',
    value: 'solid',
    realValue: 'solid'
  },
  {
    label: 'dashed line',
    value: 'dashed',
    realValue: 'dashed'
  },
  {
    label: 'dot line',
    value: 'dotted',
    realValue: 'dotted'
  }
];

const defaultBorderWidthOptions = [
  {
    value: 'none',
    label: 'None',
    realValue: 'none'
  },
  {
    value: '1px',
    label: '1px',
    realValue: '1px'
  },
  {
    value: '2px',
    label: '2px',
    realValue: '2px'
  },
  {
    value: '4px',
    label: '4px',
    realValue: '4px'
  }
];

const borderItems = [
  {
    item: 'top',
    tip: 'top border'
  },
  {
    item: 'all',
    tip: 'all'
  },
  {
    item: 'left',
    tip: 'left border'
  },
  {
    item: 'right',
    tip: 'right border'
  },
  {
    item: 'bottom',
    tip: 'bottom border'
  }
];

function BoxBorder(props: BorderProps & FormControlProps) {
  const {
    onChange,
    value = {},
    data,
    custom,
    label,
    needColorCustom,
    state,
    editorValueToken
  } = props;
  const [borderWidthOptions, setBorderWidthOptions] = useState(
    cloneDeep(
      props.borderWidthOptions ||
        data.borderWidthOptions ||
        defaultBorderWidthOptions
    )
  );
  const [borderStyleOptions, setBorderStyleOptions] = useState([
    ...(props.borderStyleOptions ||
      data.borderStyleOptions ||
      defaultStyleOptions),
    {
      label: 'Configure separately',
      value: 'custom',
      realValue: 'custom',
      hidden: true
    }
  ]);
  const [colorOptions, setColorOptions] = useState(
    cloneDeep(props.colorOptions || data.colorOptions)
  );
  const [borderType, setBorderType] = useState<string>('all');

  let borderToken: any;

  if (editorValueToken) {
    borderToken = {
      'top-border-color': `${editorValueToken}-top-border-color`,
      'top-border-width': `${editorValueToken}-top-border-width`,
      'top-border-style': `${editorValueToken}-top-border-style`,
      'right-border-color': `${editorValueToken}-right-border-color`,
      'right-border-width': `${editorValueToken}-right-border-width`,
      'right-border-style': `${editorValueToken}-right-border-style`,
      'bottom-border-color': `${editorValueToken}-bottom-border-color`,
      'bottom-border-width': `${editorValueToken}-bottom-border-width`,
      'bottom-border-style': `${editorValueToken}-bottom-border-style`,
      'left-border-color': `${editorValueToken}-left-border-color`,
      'left-border-width': `${editorValueToken}-left-border-width`,
      'left-border-style': `${editorValueToken}-left-border-style`
    };
    if (typeof editorValueToken === 'object') {
      Object.keys(borderToken).forEach(key => {
        // Convert dash to camelCase
        const tokenKey = key.replace(/-([a-z])/g, function (all, letter) {
          return letter.toUpperCase();
        });
        borderToken[key] =
          editorValueToken[tokenKey] || `${editorValueToken['*']}-${key}`;
        if (key.includes('color') && editorValueToken.color) {
          borderToken[key] = editorValueToken.color;
        }
        if (key.includes('width') && editorValueToken.width) {
          borderToken[key] = editorValueToken.width;
        }
        if (key.includes('style') && editorValueToken.style) {
          borderToken[key] = editorValueToken.style;
        }
      });
    }
  }
  const editorDefaultValue = formatData(getDefaultValue(borderToken, data));
  const borderData = formatData(value || {});

  function formatData(sourceData: any) {
    if (!sourceData) {
      return null;
    }

    const data = cloneDeep(sourceData);

    const fn = (type: string) => {
      if (
        data[`top-border-${type}`] === data[`right-border-${type}`] &&
        data[`right-border-${type}`] === data[`bottom-border-${type}`] &&
        data[`bottom-border-${type}`] === data[`left-border-${type}`]
      ) {
        data[`all-border-${type}`] = data[`top-border-${type}`];
      } else {
        data[`all-border-${type}`] = 'custom';
      }
    };
    fn('width');
    fn('style');
    fn('color');
    return data;
  }

  function getLabel(value?: string, option?: any) {
    const res = option?.find((item: any) => item.value === value);
    if (res) {
      return res.label;
    }
    return value;
  }

  function getKey(field: string) {
    return `${borderType}-border-${field}`;
  }

  function changeType(value: string) {
    setBorderType(value);
  }

  function changeItem(key: string) {
    return (val: string | undefined) => {
      let field = getKey(key);

      if (val === 'custom') {
        return;
      }

      let changeValue = {};

      if (borderType === 'all') {
        let newValue: Record<string, any> = {};

        // Filter out all
        let items = borderItems.filter(position => position?.item !== 'all');
        items.forEach(item => {
          let itemKey = `${item.item}-border-${key}`;
          newValue[itemKey] = val;
        });
        changeValue = {
          ...value,
          ...newValue
        };
      } else {
        changeValue = {
          ...value,
          [field]: val
        };
      }

      onChange(changeValue);
    };
  }

  return (
    <div className="Theme-Border">
      {label ? <div className="Theme-Border-label">{label}</div> : null}
      <div className="Theme-Border-content">
        {custom ? (
          <div className="Theme-Border-items">
            {borderItems.map(item => {
              let valueKey = `border-${item.item}`;
              return (
                <div
                  key={valueKey}
                  className={cx(
                    `Theme-Border-item Theme-Border-item--${item.item}`,
                    {
                      'Theme-Border-item--active': borderType === item.item
                    }
                  )}
                  onClick={() => changeType(item.item)}
                >
                  <span data-tooltip={item.tip} data-position="top"></span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="Theme-Border-all"></div>
        )}

        <div
          className={cx(
            'Theme-Border-settings',
            !custom && 'Theme-Border-settings--all'
          )}
        >
          <ThemeSelect
            {...props}
            options={borderWidthOptions}
            value={borderData[getKey('width')]}
            onChange={value => changeItem('width')(value)}
            itemName={`${
              borderType === 'all' ? 'top' : borderType
            }-border-width`}
            state={state}
            placeholder={
              editorDefaultValue?.[getKey('width')] || 'Border thickness'
            }
          />
          <div className="Theme-Border-settings-style-color">
            <Select
              options={borderStyleOptions}
              value={borderData[getKey('style')]}
              placeholder={
                getLabel(
                  editorDefaultValue?.[getKey('style')],
                  borderStyleOptions
                ) || 'Border style'
              }
              onChange={(item: any) => changeItem('style')(item.value)}
              clearable={!!editorDefaultValue}
              renderMenu={(item: Options) => {
                return item.realValue === 'none' ? (
                  <span>None</span>
                ) : item.parent ? (
                  <span>{item.label}</span>
                ) : (
                  <div className="Theme-Border-style">
                    <div
                      className="Theme-Border-style-line"
                      style={{borderStyle: item.realValue}}
                    ></div>
                    <span>{_i18n(item.label)}</span>
                  </div>
                );
              }}
              renderValueLabel={(item: Options) => {
                if (item?.realValue === 'none') {
                  return <span>无</span>;
                } else if (item.parent) {
                  return <span>{item.label}</span>;
                } else if (item.realValue === 'custom') {
                  return <span>Configure separately</span>;
                } else {
                  return (
                    <div className="Theme-Border-style">
                      <div
                        className="Theme-Border-style-line"
                        style={{borderStyle: item.realValue}}
                      ></div>
                    </div>
                  );
                }
              }}
            />
            <ColorPicker
              {...props}
              value={borderData[getKey('color')]}
              options={colorOptions}
              onChange={changeItem('color')}
              needCustom={needColorCustom ?? false}
              needTheme
              itemName={`${
                borderType === 'all' ? 'top' : borderType
              }-border-color`}
              placeholder={
                editorDefaultValue?.[getKey('color')] || 'Border color'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

@FormItem({
  type: 'amis-theme-border',
  strictMode: false,
  renderLabel: false
})
export class BorderRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxBorder {...this.props} custom={this.props.custom ?? true} />;
  }
}
