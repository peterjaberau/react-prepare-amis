import {FormItem, utils, Button, Overlay, PopOver, RendererProps} from '@/packages/amis/src';
import React from 'react';
import type {Schema} from '@/packages/amis/src';
import {findDOMNode} from 'react-dom';

interface ClassNameControlProps extends RendererProps {
  schema: Schema;
}

interface ClassNameControlState {
  isFocused: boolean;
  isOpened: boolean;
}

const classOptions = [
  {
    label: 'Margin',
    children: [
      {
        label: 'Overall',
        children: [
          {
            label: 'extremely small',
            value: 'm-xs'
          },
          {
            label: 'small',
            value: 'm-sm'
          },
          {
            label: 'Normal',
            value: 'm'
          },
          {
            label: 'Medium',
            value: 'm-md'
          },
          {
            label: 'big',
            value: 'm-lg'
          }
        ]
      },

      {
        label: 'Top margin',
        children: [
          {
            label: 'extremely small',
            value: 'm-t-xs'
          },
          {
            label: 'small',
            value: 'm-t-sm'
          },
          {
            label: 'Normal',
            value: 'm-t'
          },
          {
            label: 'Medium',
            value: 'm-t-md'
          },
          {
            label: 'big',
            value: 'm-t-lg'
          }
        ]
      },

      {
        label: 'right margin',
        children: [
          {
            label: 'extremely small',
            value: 'm-r-xs'
          },
          {
            label: 'small',
            value: 'm-r-sm'
          },
          {
            label: 'Normal',
            value: 'm-r'
          },
          {
            label: 'Medium',
            value: 'm-r-md'
          },
          {
            label: 'big',
            value: 'm-r-lg'
          }
        ]
      },

      {
        label: 'bottom margin',
        children: [
          {
            label: 'extremely small',
            value: 'm-b-xs'
          },
          {
            label: 'small',
            value: 'm-b-sm'
          },
          {
            label: 'Normal',
            value: 'm-b'
          },
          {
            label: 'Medium',
            value: 'm-b-md'
          },
          {
            label: 'big',
            value: 'm-b-lg'
          }
        ]
      },

      {
        label: 'left margin',
        children: [
          {
            label: 'extremely small',
            value: 'm-l-xs'
          },
          {
            label: 'small',
            value: 'm-l-sm'
          },
          {
            label: 'Normal',
            value: 'm-l'
          },
          {
            label: 'Medium',
            value: 'm-l-md'
          },
          {
            label: 'big',
            value: 'm-l-lg'
          }
        ]
      },

      {
        label: 'None',
        children: [
          {
            label: 'All',
            value: 'm-none'
          },
          '|',
          {
            label: 'up',
            value: 'm-t-none'
          },
          {
            label: 'Right',
            value: 'm-r-none'
          },
          {
            label: 'Next',
            value: 'm-b-none'
          },
          {
            label: 'Left',
            value: 'm-l-none'
          }
        ]
      }
    ]
  },

  {
    label: 'Padding',
    children: [
      {
        label: 'Overall',
        children: [
          {
            label: 'extremely small',
            value: 'p-xs'
          },
          {
            label: 'small',
            value: 'p-sm'
          },
          {
            label: 'Normal',
            value: 'p'
          },
          {
            label: 'Medium',
            value: 'p-md'
          },
          {
            label: 'big',
            value: 'p-lg'
          }
        ]
      },

      {
        label: 'Top margin',
        children: [
          {
            label: 'extremely small',
            value: 'p-t-xs'
          },
          {
            label: 'small',
            value: 'p-t-sm'
          },
          {
            label: 'Normal',
            value: 'p-t'
          },
          {
            label: 'Medium',
            value: 'p-t-md'
          },
          {
            label: 'big',
            value: 'p-t-lg'
          }
        ]
      },

      {
        label: 'right margin',
        children: [
          {
            label: 'extremely small',
            value: 'p-r-xs'
          },
          {
            label: 'small',
            value: 'p-r-sm'
          },
          {
            label: 'Normal',
            value: 'p-r'
          },
          {
            label: 'Medium',
            value: 'p-r-md'
          },
          {
            label: 'big',
            value: 'p-r-lg'
          }
        ]
      },

      {
        label: 'bottom margin',
        children: [
          {
            label: 'extremely small',
            value: 'p-b-xs'
          },
          {
            label: 'small',
            value: 'p-b-sm'
          },
          {
            label: 'Normal',
            value: 'p-b'
          },
          {
            label: 'Medium',
            value: 'p-b-md'
          },
          {
            label: 'big',
            value: 'p-b-lg'
          }
        ]
      },

      {
        label: 'left margin',
        children: [
          {
            label: 'extremely small',
            value: 'p-l-xs'
          },
          {
            label: 'small',
            value: 'p-l-sm'
          },
          {
            label: 'Normal',
            value: 'p-l'
          },
          {
            label: 'Medium',
            value: 'p-l-md'
          },
          {
            label: 'big',
            value: 'p-l-lg'
          }
        ]
      },

      {
        label: 'None',
        children: [
          {
            label: 'All',
            value: 'p-none'
          },
          '|',
          {
            label: 'up',
            value: 'p-t-none'
          },
          {
            label: 'Right',
            value: 'p-r-none'
          },
          {
            label: 'Next',
            value: 'p-b-none'
          },
          {
            label: 'Left',
            value: 'p-l-none'
          }
        ]
      }
    ]
  },

  {
    label: 'border',
    className: 'w2x',
    children: [
      {
        label: 'Location',
        children: [
          {
            label: 'All',
            value: 'b-a'
          },

          '|',

          {
            label: 'up',
            value: 'b-t'
          },

          {
            label: 'Right',
            value: 'b-r'
          },

          {
            label: 'Next',
            value: 'b-b'
          },

          {
            label: 'Left',
            value: 'b-l'
          },

          '|',

          {
            label: 'None',
            value: 'no-border'
          }
        ]
      },

      {
        label: 'size',
        children: [
          {
            label: '2x',
            value: 'b-2x'
          },

          {
            label: '3x',
            value: 'b-3x'
          },

          {
            label: '4x',
            value: 'b-4x'
          },

          {
            label: '5x',
            value: 'b-5x'
          }
        ]
      },

      {
        label: 'color',
        children: [
          {
            label: 'main color',
            value: 'b-primary',
            className: 'bg-primary'
          },

          {
            label: 'Information',
            value: 'b-info',
            className: 'bg-info'
          },

          {
            label: 'Warning',
            value: 'b-warning',
            className: 'bg-warning'
          },

          {
            label: 'danger',
            value: 'b-danger',
            className: 'bg-danger'
          },

          {
            label: 'Success',
            value: 'b-success',
            className: 'bg-success'
          },

          {
            label: 'white',
            value: 'b-white',
            className: 'bg-white'
          },

          {
            label: 'dark',
            value: 'b-dark',
            className: 'bg-dark'
          },

          {
            label: 'light color',
            value: 'b-light',
            className: 'bg-light'
          }
        ]
      }
    ]
  },

  {
    label: 'Other',
    className: 'w2x',
    children: [
      {
        label: 'Rounded corners',
        children: [
          {
            label: 'All',
            value: 'r'
          },

          '|',

          {
            label: 'up',
            value: 'r-t'
          },

          {
            label: 'Right',
            value: 'r-r'
          },

          {
            label: 'Next',
            value: 'r-b'
          },

          {
            label: 'Left',
            value: 'r-l'
          },

          '|',

          {
            label: '2x',
            value: 'r-2x'
          },

          {
            label: '3x',
            value: 'r-3x'
          }
        ]
      },
      {
        label: 'font',
        children: [
          {
            label: 'Normal',
            value: 'font-normal'
          },
          {
            label: 'fine',
            value: 'font-thin'
          },
          {
            label: 'rough',
            value: 'font-bold'
          },

          '|',

          {
            label: 'extremely small',
            value: 'text-xs'
          },
          {
            label: 'small',
            value: 'text-sm'
          },
          {
            label: 'Normal',
            value: 'text-base'
          },
          {
            label: 'Medium',
            value: 'text-md'
          },
          {
            label: 'big',
            value: 'text-lg'
          }
        ]
      },

      {
        label: 'color',
        children: [
          {
            label: 'main color',
            value: 'text-primary',
            className: 'text-primary'
          },

          {
            label: 'Information',
            value: 'text-info',
            className: 'text-info'
          },

          {
            label: 'Warning',
            value: 'text-warning',
            className: 'text-warning'
          },

          {
            label: 'danger',
            value: 'text-danger',
            className: 'text-danger'
          },

          {
            label: 'Success',
            value: 'text-success',
            className: 'text-success'
          },

          {
            label: 'white',
            value: 'text-white',
            className: 'text-white bg-dark'
          },

          {
            label: 'dark',
            value: 'text-dark',
            className: 'text-dark'
          },

          {
            label: 'light color',
            value: 'text-muted',
            className: 'text-muted'
          }
        ]
      },

      {
        label: 'background',
        children: [
          {
            label: 'main color',
            value: 'bg-primary',
            className: 'bg-primary'
          },

          {
            label: 'Information',
            value: 'bg-info',
            className: 'bg-info'
          },

          {
            label: 'Warning',
            value: 'bg-warning',
            className: 'bg-warning'
          },

          {
            label: 'danger',
            value: 'bg-danger',
            className: 'bg-danger'
          },

          {
            label: 'Success',
            value: 'bg-success',
            className: 'bg-success'
          },

          {
            label: 'white',
            value: 'bg-white',
            className: 'bg-white'
          },

          {
            label: 'dark',
            value: 'bg-dark',
            className: 'bg-dark'
          },

          {
            label: 'light color',
            value: 'bg-light',
            className: 'bg-light'
          },

          '|',

          {
            label: 'None',
            value: 'no-bg'
          }
        ]
      },

      {
        label: 'width',
        children: [
          {
            label: 'Extra Small',
            value: 'w-xxs'
          },

          {
            label: 'extremely small',
            value: 'w-xs'
          },

          {
            label: 'small',
            value: 'w-sm'
          },

          {
            label: 'Normal',
            value: 'w'
          },

          {
            label: 'Medium',
            value: 'w-md'
          },

          {
            label: 'big',
            value: 'w-lg'
          },

          {
            label: 'Enlarge',
            value: 'w-xl'
          },

          {
            label: 'Extra Large',
            value: 'w-xxl'
          },

          {
            label: 'Full',
            value: 'w-full'
          }
        ]
      }
    ]
  }
];

function splitOptions(options: Array<any>) {
  const group: Array<Array<any>> = [];
  let host: Array<any> = (group[0] = []);

  for (let i = 0, len = options.length; i < len; i++) {
    const item = options[i];

    if (item === '|') {
      host = [];
      group.push(host);
    } else {
      host.push(item);
    }
  }

  return group;
}

// @ts-ignore
@FormItem({
  type: 'ae-classname'
})
export class ClassNameControl extends React.Component<
  ClassNameControlProps,
  ClassNameControlState
> {
  state = {
    isFocused: false,
    isOpened: false
  };

  values: Array<string> = [];

  @utils.autobind
  open() {
    this.setState({
      isOpened: true
    });
  }

  @utils.autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @utils.autobind
  toggle() {
    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  @utils.autobind
  handleFocus(e: any) {
    this.setState({
      isFocused: true
    });
    this.props.onFocus && this.props.onFocus(e);
  }

  @utils.autobind
  handleBlur(e: any) {
    this.setState({
      isFocused: false
    });
    this.props.onBlur && this.props.onBlur(e);
  }

  @utils.autobind
  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {onChange} = this.props;

    onChange(e.currentTarget.value);
  }

  @utils.autobind
  getParent() {
    return findDOMNode(this);
  }

  @utils.autobind
  getTarget() {
    return findDOMNode(this) as HTMLElement;
  }

  handlePopOverChange(option: any) {
    let value = this.props.value || '';

    const values = value.replace(/\s+/g, ' ').split(/\s+/);
    const idx = values.indexOf(option.value);
    const onChange = this.props.onChange;

    if (~idx) {
      values.splice(idx, 1);
      value = values.join(' ');
    } else {
      // When setting a certain dimension, ignore other dimensions. For example: When setting ml-xs, remove ml-md.
      if (
        /(?:^|\s)(m|p)\-(t|r|b|l)(?:\-(?:xs|sm|md|lg))?(?:$|\s)/.test(
          option.value
        )
      ) {
        const reg = new RegExp(
          `(?:^|\\s)${RegExp.$1}\\-${RegExp.$2}(?:\\-(?:xs|sm|md|lg))?(?=(\\s|$))`,
          'ig'
        );
        value = value.replace(reg, '');
      } else if (
        /(?:^|\s)(m|p)(?:\-(xs|sm|md|lg))?(?:$|\s)/.test(option.value)
      ) {
        // When setting the overall size, remove other sizes, such as: m-xs remove m-md

        const reg = new RegExp(
          `(?:^|\\s)${RegExp.$1}(?:\\-(?:xs|sm|md|lg))?(?=(\\s|$))`,
          'ig'
        );
        value = value.replace(reg, '');
      } else if (
        /(?:^|\s)(m|p)(?:\-(t|r|b|l))?\-none(?:$|\s)/.test(option.value)
      ) {
        // When set to none, the original settings will be eliminated, for example: m-none will eliminate ml-xs m-xs and so on.
        // Remove mt-xs mt when using mt-none
        // When using m-none, delete m-xs, ml-xs, etc.
        const reg = new RegExp(
          RegExp.$2
            ? `(?:^|\\s)${RegExp.$1}(?:(?:\\-${RegExp.$2}(?:\\-(?:xs|sm|md|lg)))|\\-none)?(?=(\\s|$))`
            : `(?:^|\\s)${RegExp.$1}(?:[^\\s$]+)?(?=(\\s|$))`,
          'ig'
        );
        value = value.replace(reg, '$1');
      } else if (/(?:^|\s)w(?:\-\w+)?(?:$|\s)/.test(option.value)) {
        // Mutually exclusive widths: w-xs w-md etc., only one is selected

        value = value.replace(/(?:^|\s)w(?:\-\w+)?(?=(\s|$))/g, '');
      } else if (option.value === 'b-a') {
        // When using ba, remove bl bt and the like
        value = value.replace(/(?:^|\s)b\-(?:t|r|b|l)(?=(\s|$))/g, '');
        value = value.replace(/(?:^|\s)no\-border(?=(\s|$))/g, '');
      } else if (/(?:^|\s)b\-(?:t|r|b|l)?(?:$|\s)/.test(option.value)) {
        // When using ba, remove bl bt and the like
        value = value.replace(/(?:^|\s)b\-a(?=(\s|$))/g, '');
        value = value.replace(/(?:^|\s)no\-border(?=(\s|$))/g, '');
      } else if (/(?:^|\s)b\-\dx(?:$|\s)/.test(option.value)) {
        value = value.replace(/(?:^|\s)b\-\dx(?=(\s|$))/g, '');
      } else if (option.value === 'no-border') {
        value = value.replace(/(?:^|\s)b\-(?:\dx|\w+)(?=(\s|$))/g, '');
      } else if (
        /(?:^|\s)b\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(
          option.value
        )
      ) {
        value = value.replace(
          /(?:^|\s)b\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g,
          ''
        );
      } else if (option.value === 'r') {
        value = value.replace(/(?:^|\s)r\-(?:t|r|b|l)(?=(\s|$))/g, '');
      } else if (/(?:^|\s)r\-(?:t|r|b|l)?(?:$|\s)/.test(option.value)) {
        value = value.replace(/(?:^|\s)r(?=(\s|$))/g, '');
      } else if (/(?:^|\s)r\-\dx(?:$|\s)/.test(option.value)) {
        value = value.replace(/(?:^|\s)r\-\dx(?=(\s|$))/g, '');
      } else if (
        /(?:^|\s)text\-(?:xs|sm|base|md|lg)(?:$|\s)/.test(option.value)
      ) {
        value = value.replace(
          /(?:^|\s)text\-(?:xs|sm|base|md|lg)(?=(\s|$))/g,
          ''
        );
      } else if (
        /(?:^|\s)font\-(?:normal|thin|bold)(?:$|\s)/.test(option.value)
      ) {
        value = value.replace(
          /(?:^|\s)font\-(?:normal|thin|bold)(?=(\s|$))/g,
          ''
        );
      } else if (
        /(?:^|\s)text\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(
          option.value
        )
      ) {
        value = value.replace(
          /(?:^|\s)text\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g,
          ''
        );
      } else if (
        /(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?:$|\s)/.test(
          option.value
        )
      ) {
        value = value.replace(
          /(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g,
          ''
        );
        value = value.replace(/(?:^|\s)no\-bg(?=(\s|$))/g, '');
      } else if (option.value === 'no-bg') {
        value = value.replace(
          /(?:^|\s)bg\-(?:primary|info|warning|danger|success|white|dark|light)(?=(\s|$))/g,
          ''
        );
      }

      value = value.replace(/\s+/g, ' ').trim();
      value += (value ? ' ' : '') + option.value;
    }

    onChange(value);
  }

  renderGroup(option: any, index: number) {
    const {classnames: cx} = this.props;

    return (
      <div
        key={index}
        className={cx('ae-ClassNameControl-group', option.className)}
      >
        <label
          className={cx(
            'ae-ClassNameControl-groupLabel',
            option.labelClassName
          )}
        >
          {option.label}
        </label>

        {option.children && option.children.length
          ? option.children[0].value
            ? this.renderOptions(option.children, index)
            : option.children.map((option: any, index: number) =>
                this.renderGroup(option, index)
              )
          : null}
      </div>
    );
  }

  renderOptions(options: Array<any>, index: number) {
    const {classnames: cx} = this.props;

    return splitOptions(options).map((group, index) => (
      <div className={cx(`ButtonGroup`)} key={index}>
        {group.map((item: any, index) => (
          <div
            key={index}
            onClick={() => this.handlePopOverChange(item)}
            className={cx(
              'Button Button--size-xs',
              item.className,
              ~this.values.indexOf(item.value)
                ? 'Button--primary'
                : 'Button--default'
            )}
          >
            {item.label}
          </div>
        ))}
      </div>
    ));
  }

  renderPopover() {
    const value = this.props.value;
    this.values = typeof value === 'string' ? value.split(' ') : [];

    return (
      <div>
        {classOptions.map((item: any, index) => this.renderGroup(item, index))}
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      readOnly,
      disabled,
      value,
      className,
      name,
      popOverContainer
    } = this.props;

    return (
      <div className={className}>
        <div
          className={cx(`TextControl`, {
            [`TextControl--withAddOn`]: true,
            'is-focused': this.state.isFocused,
            'is-disabled': disabled
          })}
        >
          <div className={cx('TextControl-input')}>
            <input
              name={name}
              placeholder="Please enter the css class name"
              disabled={disabled}
              readOnly={readOnly}
              type="text"
              autoComplete="off"
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={
                typeof value === 'undefined' || value === null
                  ? ''
                  : typeof value === 'string'
                  ? value
                  : JSON.stringify(value)
              }
            />
          </div>
          <div className={cx(`TextControl-button`)}>
            <Button onClick={this.toggle}>
              <i className="fa fa-cog"></i>
            </Button>
          </div>
        </div>
        <Overlay
          placement="right-bottom-right-top  right-top-right-bottom right-bottom-right-top"
          target={this.getTarget}
          container={popOverContainer || this.getParent}
          rootClose={false}
          show={this.state.isOpened}
          watchTargetSizeChange={false}
        >
          <PopOver
            className={'ae-ClassNamePicker-popover'}
            onHide={this.close}
            overlay
          >
            {this.renderPopover()}
          </PopOver>
        </Overlay>
      </div>
    );
  }
}
