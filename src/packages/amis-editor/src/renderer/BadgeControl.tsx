/**
 * @file superscript control
 */

import React from 'react';
import cx from 'classnames';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import {FormItem, Switch} from 'amis';

import {
  autobind,
  isObject,
  isEmpty,
  anyChanged,
  getI18nEnabled
} from 'amis-editor-core';
import {defaultValue, tipedLabel} from 'amis-editor-core';

import type {FormControlProps} from 'amis-core';
import type {SchemaExpression} from 'amis';

export interface BadgeControlProps extends FormControlProps {
  /**
   * Subscript type
   */
  mode?: 'text' | 'dot' | 'ribbon';

  /**
   * Text content
   */
  text?: string | number;

  /**
   * Corner size
   */
  size?: any;

  /**
   * Subscript position, priority is greater than position
   */
  offset?: [number, number];

  /**
   * Superscript position
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Capped numeric value
   */
  overflowCount?: number;

  /**
   * Dynamically control whether to display
   */
  visibleOn?: SchemaExpression;

  /**
   * Whether to display animation
   */
  animation?: boolean;

  /**
   * Custom styles for corner marks
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * Prompt Type
   */
  level?: 'info' | 'warning' | 'success' | 'danger' | SchemaExpression;
}

interface BadgeControlState {
  checked: boolean;
}

interface BadgeForm
  extends Partial<
    Pick<
      BadgeControlProps,
      | 'mode'
      | 'text'
      | 'size'
      | 'position'
      | 'overflowCount'
      | 'visibleOn'
      | 'animation'
      | 'style'
      | 'level'
    >
  > {
  offset: [number, number];
}

export default class BadgeControl extends React.Component<
  BadgeControlProps,
  BadgeControlState
> {
  static defaultProps = {
    mode: 'dot',
    overflowCount: 99,
    position: 'top-right',
    level: 'danger',
    animation: false
  };

  constructor(props: BadgeControlProps) {
    super(props);

    this.state = {
      checked: !!isObject(props?.value)
    };
  }

  componentDidUpdate(prevProps: BadgeControlProps) {
    const props = this.props;

    if (
      anyChanged(
        [
          'mode',
          'text',
          'size',
          'offset',
          'position',
          'overflowCount',
          'visibleOn',
          'animation',
          'style',
          'level'
        ],
        prevProps?.value ?? {},
        props?.value ?? {}
      )
    ) {
      this.setState({checked: !!isObject(props?.value)});
    }
  }

  transformBadgeValue(): BadgeForm {
    const {data: ctx, node, name} = this.props;
    let badge = ctx?.[name || 'badge'] ?? {};
    //Avoid getting the size of the upper layer
    let size = ctx?.badge?.size;
    if (node.type === 'button-group-select') {
      badge = ctx?.option?.badge ?? {};
      size = badge?.size;
    }
    const offset = [0, 0];

    //Convert to a format that combo can recognize
    if (Array.isArray(badge?.offset) && badge?.offset.length >= 2) {
      offset[0] = badge.offset[0];
      offset[1] = badge.offset[1];
    }

    return {...badge, size, offset};
  }

  normalizeBadgeValue(form: BadgeForm) {
    const offset =
      isObject(form?.offset) && form?.offset?.[0] && form?.offset?.[1]
        ? {offset: [form.offset[0], form.offset[1]]}
        : {};

    return {
      ...form,
      ...offset
    };
  }

  @autobind
  handleSwitchChange(checked: boolean): void {
    const {onChange, disabled} = this.props;
    if (disabled) {
      return;
    }

    this.setState({checked});
    onChange?.(checked ? {mode: 'dot'} : undefined);
  }

  handleSubmit(form: BadgeForm, action: any): void {
    const {onBulkChange, name} = this.props;

    if (action?.type === 'submit') {
      onBulkChange?.({[name || 'badge']: this.normalizeBadgeValue(form)});
    }
  }

  renderBody() {
    const {render} = this.props;
    const data = this.transformBadgeValue();
    const i18nEnabled = getI18nEnabled();
    return render(
      'badge-form',
      {
        type: 'form',
        className: 'ae-BadgeControl-form w-full',
        wrapWithPanel: false,
        panelClassName: 'border-none shadow-none mb-0',
        bodyClassName: 'p-none',
        actionsClassName: 'border-none mt-2.5',
        wrapperComponent: 'div',
        preventEnterSubmit: true,
        submitOnChange: true,
        body: [
          {
            label: 'type',
            name: 'mode',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            inputClassName: 'flex-nowrap',
            options: [
              {label: '点', value: 'dot', icon: 'fa fa-circle'},
              {label: 'language', value: 'text', icon: 'insert-font'},
              {label: '缎带', value: 'ribbon', icon: 'fa fa-ribbon'}
            ],
            pipeIn: defaultValue('dot')
          },
          {
            label: 'text content',
            name: 'text',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            mode: 'row',
            visibleOn: "data.mode !== 'dot'",
            pipeOut: (value: any) => {
              return Number.isNaN(Number(value)) || value === ''
                ? value
                : Number(value);
            }
          },
          {
            label: 'Topic',
            name: 'level',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            inputClassName: 'flex-nowrap',
            options: [
              {label: 'success', value: 'success'},
              {label: 'Warning', value: 'warning'},
              {label: 'danger', value: 'danger'},
              {label: 'information', value: 'info'}
            ],
            pipeIn: defaultValue('danger')
          },
          {
            label: 'Location',
            name: 'position',
            type: 'button-group-select',
            size: 'sm',
            mode: 'row',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            inputClassName: 'flex-nowrap',
            options: [
              {
                label: '',
                value: 'top-left',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--antiClockwise'
              },
              {
                label: '',
                value: 'top-right',
                icon: 'fa fa-long-arrow-alt-up',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '',
                value: 'bottom-left',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--clockwise'
              },
              {
                label: '',
                value: 'bottom-right',
                icon: 'fa fa-long-arrow-alt-down',
                className: 'ae-BadgeControl-position--antiClockwise'
              }
            ],
            pipeIn: defaultValue('top-right')
          },
          {
            type: 'input-group',
            mode: 'row',
            inputClassName: 'inline-flex justify-right flex-row-reverse',
            label: tipedLabel(
              'Offset',
              'Offset of the tip label relative to the horizontal and vertical positions'
            ),
            body: [
              {
                type: 'input-number',
                name: 'offset',
                suffix: 'px',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[0] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => [
                  value,
                  data.offset[1]
                ]
              },
              {
                type: 'input-number',
                name: 'offset',
                suffix: 'px',
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value[1] || 0 : 0,
                pipeOut: (value: any, oldValue: any, data: any) => [
                  data.offset[0],
                  value
                ]
              }
            ]
          },
          {
            label: 'Customize corner mark size',
            name: 'size',
            type: 'switch',
            mode: 'row',
            inputClassName: 'inline-flex justify-between flex-row-reverse',
            pipeIn: (value: any) => !!value,
            pipeOut: (value: any, oldValue: any, data: any) =>
              value
                ? data?.mode === 'dot'
                  ? 6
                  : data?.mode === 'ribbon'
                  ? 12
                  : 16
                : undefined
          },
          {
            label: '',
            name: 'size',
            type: 'input-number',
            size: 'sm',
            mode: 'row',
            min: 1,
            max: 100,
            suffix: 'px',
            visibleOn: 'this.size',
            pipeIn: (value: any) => (typeof value === 'number' ? value : 0)
          },
          {
            label: tipedLabel(
              'Capped number',
              'Only effective when the text content is a number'
            ),
            name: 'overflowCount',
            type: 'input-number',
            size: 'sm',
            mode: 'row',
            visibleOn: "data.mode === 'text'"
          },
          {
            label: 'Animation',
            name: 'animation',
            type: 'switch',
            mode: 'row',
            inputClassName: 'inline-flex justify-between flex-row-reverse'
          }
        ]
      },
      {
        data,
        onSubmit: this.handleSubmit.bind(this)
      }
    );
  }

  render() {
    const {classPrefix, className, labelClassName, label, disabled} =
      this.props;
    const {checked} = this.state;

    return (
      <div className={cx('ae-BadgeControl', className)}>
        <div className={cx('ae-BadgeControl-switch')}>
          <label className={cx(`${classPrefix}Form-label`, labelClassName)}>
            {label || 'superscript'}
          </label>
          <Switch
            value={checked}
            onChange={this.handleSwitchChange}
            disabled={disabled}
          />
        </div>
        {checked ? this.renderBody() : null}
      </div>
    );
  }
}

@FormItem({type: 'ae-badge', renderLabel: false})
export class BadgeControlRenderer extends BadgeControl {}
