/**
 * @file icon button group
 */
import React from 'react';
import {FormControlProps, FormItem} from '@/packages/amis/src';
import ButtonGroup from './ButtonGroupControl';

interface PlainObject {
  [propsName: string]: any;
}

const directionText: any = {
  'row': ['left', 'right', 'top', 'bottom'],
  'column': ['Top', 'Bottom', 'Left', 'Right'],
  'row-reverse': ['right', 'left', 'top', 'bottom'],
  'column-reverse': ['Bottom', 'Top', 'Left', 'Right']
};

const scaleX: any = {
  'row': '',
  'column': 'scaleX-90',
  'row-reverse': 'scaleX-180',
  'column-reverse': 'scaleX-270'
};

const scaleY: any = {
  'row': '',
  'column': 'scaleX-270',
  'row-reverse': '',
  'column-reverse': 'scaleX-270'
};

interface FlexSettingControlProps extends FormControlProps {
  onChange: (value: PlainObject) => void;
  value?: PlainObject;
}

const getFlexItem = (props: FlexSettingControlProps) => {
  const {value, direction, justify, alignItems} = props;
  const curDirection = value?.flexDirection || direction || 'row';
  const isColumn =
    curDirection === 'column' || curDirection === 'column-reverse';

  // Main axis arrangement direction
  const directionItemOptions = [
    {
      label: 'horizontal direction',
      value: 'row',
      icon: 'drow'
    },
    {
      label: 'vertical direction',
      value: 'column',
      icon: 'dcolumn'
    },
    {
      label: 'horizontal reverse',
      value: 'row-reverse',
      icon: 'drowReverse',
      iconClassName: 'scaleX-180'
    },
    {
      label: 'vertical reverse',
      value: 'column-reverse',
      icon: 'dcolumnReverse',
      iconClassName: 'scaleX-180'
    }
  ];

  // Main axis arrangement
  const justifyItemsOptions = [
    {
      label: directionText[curDirection][0],
      value: 'flex-start',
      icon: 'jFlexStart',
      iconClassName: scaleX[curDirection]
    },
    {
      label: isColumn ? 'Vertical center' : 'Horizontal center',
      value: 'center',
      icon: 'jCenter',
      iconClassName: scaleX[curDirection]
    },
    {
      label: directionText[curDirection][1],
      value: 'flex-end',
      icon: 'jFlexEnd',
      iconClassName: scaleX[curDirection]
    },
    {
      label: 'Justify both ends',
      value: 'space-between',
      icon: 'jSpaceBetween',
      iconClassName: scaleX[curDirection]
    },
    {
      label: 'Interval distribution',
      value: 'space-around',
      icon: 'jSpaceAround',
      iconClassName: scaleX[curDirection]
    }
  ];

  // Cross axis arrangement
  const alignItemsOptions = [
    {
      label: directionText[curDirection][2],
      value: 'flex-start',
      icon: 'aFlexStart',
      iconClassName: scaleY[curDirection]
    },
    {
      label: isColumn ? 'Horizontal center' : 'Vertical center',
      value: 'center',
      icon: 'aCenter',
      iconClassName: scaleY[curDirection]
    },
    {
      label: directionText[curDirection][3],
      value: 'flex-end',
      icon: 'aFlexEnd',
      iconClassName: scaleY[curDirection]
    },
    {
      label: 'Baseline alignment',
      value: 'baseline',
      icon: 'aBaseline',
      iconClassName: scaleY[curDirection]
    },
    {
      label: isColumn ? 'Horizontal spread' : 'Full height',
      value: 'stretch',
      icon: 'aStretch',
      iconClassName: isColumn ? 'scaleX-90' : ''
    }
  ];

  const flexItems = [
    {
      field: 'flexDirection',
      options: directionItemOptions,
      default: direction || 'row'
    },
    {
      field: 'justifyContent',
      options: justifyItemsOptions,
      default: justify || 'flex-start'
    },
    {
      field: 'alignItems',
      options: alignItemsOptions,
      default: alignItems || 'stretch'
    }
  ];

  return flexItems;
};

export default class FlexSettingControl extends React.Component<FlexSettingControlProps> {
  constructor(props: any) {
    super(props);
  }

  setField(field: string) {
    const {value, onChange} = this.props;
    return (val: string) => {
      onChange({
        ...value,
        [field]: val
      });
    };
  }

  render() {
    const {value, label, ...rest} = this.props;
    const flexItems = getFlexItem(this.props);

    return (
      <div className="ap-Flex">
        {!label && (
          <div className="ap-Flex-label">Internal alignment settings</div>
        )}
        {flexItems.map(item => (
          <div
            className={`ap-Flex-item ap-Flex-${item.field}`}
            key={item.field}
          >
            <ButtonGroup
              {...rest}
              options={item.options}
              value={value?.[item.field] || item.default}
              onChange={this.setField(item.field)}
            />
          </div>
        ))}
      </div>
    );
  }
}

@FormItem({
  type: 'flex-layout-setting'
})
export class FlexSettingControlRenderer extends FlexSettingControl {}
