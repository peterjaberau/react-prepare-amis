/**
 * @file superscript control
 */

import React from 'react';
import cx from 'classnames';
import {FormItem, Switch} from 'amis';

import {
  autobind,
  isObject,
  isEmpty,
  anyChanged,
  getI18nEnabled
} from '@/packages/amis-editor-core/src';
import {defaultValue, tipedLabel, getSchemaTpl} from '@/packages/amis-editor-core/src';

import type {FormControlProps} from '@/packages/amis-core/src';
import type {SchemaExpression} from 'amis';

export interface BadgeControlProps extends FormControlProps {
  /**
   * Subscript type
   */
  mode?: 'text' | 'dot' | 'ribbon';
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
    level: 'danger'
  };

  constructor(props: BadgeControlProps) {
    super(props);

    this.state = {
      checked: !!isObject(props?.value)
    };
  }

  transformBadgeValue(): BadgeForm {
    const {data: ctx} = this.props;
    const badge = ctx?.badge ?? {};
    //Avoid getting the size of the upper layer
    const size = ctx?.badge?.size;
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
    const {onBulkChange, data} = this.props;

    this.setState({checked});
    if (checked) {
      if (data.badge) {
        onBulkChange?.({badge: data.badge});
      } else {
        onBulkChange?.({badge: {mode: 'dot'}});
      }
    } else {
      onBulkChange?.({badge: undefined});
    }
  }

  handleSubmit(form: BadgeForm, action: any): void {
    form.visibleOn = '${badge}';
    if (form.mode === 'dot') {
      form.text = undefined;
    } else {
      form.text = '${badge}';
    }
    const {onBulkChange} = this.props;
    if (action?.type === 'submit') {
      onBulkChange?.({badge: this.normalizeBadgeValue(form)});
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
            label: 'corner type',
            name: 'mode',
            type: 'button-group-select',
            size: 'sm',
            tiled: true,
            className: 'ae-BadgeControl-buttonGroup',
            options: [
              {label: 'dot', value: 'dot'},
              {label: 'text', value: 'text'},
              {label: 'ribbon', value: 'ribbon'}
            ],
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            pipeIn: defaultValue('dot')
          },
          {
            label: tipedLabel(
              'Capped number',
              'Only valid when the text content is a number'
            ),
            name: 'overflowCount',
            type: 'input-number',
            size: 'sm',
            visibleOn: "data.mode === 'text'",
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            }
          },
          {
            label: 'size',
            name: 'size',
            type: 'input-number',
            size: 'sm',
            suffix: 'px',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            }
          },

          {
            label: 'Topic',
            name: 'level',
            type: 'select',
            size: 'sm',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            tiled: true,
            className: 'input-select',
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
            type: 'select',
            size: 'sm',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            tiled: true,
            className: 'input-select',
            options: [
              {
                label: 'upper left corner',
                value: 'top-left'
              },
              {
                label: 'upper right corner',
                value: 'top-right'
              },
              {
                label: 'lower left corner',
                value: 'bottom-left'
              },
              {
                label: 'lower right corner',
                value: 'bottom-right'
              }
            ],
            pipeIn: defaultValue('top-right')
          },
          {
            type: 'group',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4
            },
            label: tipedLabel(
              'Offset',
              'Offset of the tip label relative to the horizontal and vertical positions'
            ),
            body: [
              {
                type: 'input-text',
                name: 'offset[0]',
                label: false,
                addOn: {
                  label: 'X',
                  type: 'text',
                  position: 'left'
                },
                validateOnChange: true,
                validations: {
                  isNumeric: true
                }
              },
              {
                type: 'input-text',
                label: false,
                name: 'offset[1]',
                addOn: {
                  label: 'Y',
                  type: 'text',
                  position: 'left'
                },
                validateOnChange: true,
                validations: {
                  isNumeric: true
                }
              }
            ]
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
    const {classPrefix, className, labelClassName, label, disabled, render} =
      this.props;
    const {checked} = this.state;

    return (
      <div className={cx('ae-BadgeControl', className)}>
        {render(
          '',
          getSchemaTpl('switch', {
            label: tipedLabel(
              'Corner',
              'Configure the corner mark style here. The corner mark needs to be configured in the menu item at the same time for the corner mark to take effect'
            ),
            name: 'checked',
            mode: 'horizontal',
            value: checked,
            onChange: (checked: boolean) => this.handleSwitchChange(checked)
          })
        )}
        {checked ? this.renderBody() : null}
      </div>
    );
  }
}

@FormItem({type: 'ae-nav-badge', renderLabel: false})
export class BadgeControlRenderer extends BadgeControl {}
