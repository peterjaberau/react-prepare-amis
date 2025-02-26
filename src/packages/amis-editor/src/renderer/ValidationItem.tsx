/**
 * @file checksum
 */

import React from 'react';
import cx from 'classnames';
import {render, Button, Switch} from 'amis';

import {autobind, getI18nEnabled} from '@/packages/amis-editor-core/src';
import {Validator} from '../validator';
import {tipedLabel} from '@/packages/amis-editor-core/src';
import type {ConditionBuilderFields, Schema, SchemaCollection} from 'amis';

export type ValidatorData = {
  name: string;
  value?: any;
  message?: string;
  isBuiltIn?: boolean; // Is it a built-in check?
};

export interface ValidationItemProps {
  /**
   * CSS theme prefix for the component
   */
  classPrefix?: string;

  /**
   * Verify configuration
   */
  data: ValidatorData;

  /**
   * Whether it is the default props, which can be switched by default
   */
  isDefault: boolean;

  validator: Validator;

  fields?: ConditionBuilderFields;

  rendererSchema?: Schema | Schema[];

  onEdit?: (data: ValidatorData) => void;
  onDelete?: (name: string) => void;
  onSwitch?: (checked: boolean, data?: ValidatorData) => void;
}

interface ValidationItemState {
  value: string | number | boolean | undefined;
  checked: boolean;
  message: string;
  isBuiltIn: boolean | undefined;
}

export default class ValidationItem extends React.Component<
  ValidationItemProps,
  ValidationItemState
> {
  validator: Validator;

  constructor(props: ValidationItemProps) {
    super(props);

    const {data} = this.props;

    this.validator = this.props.validator;

    this.state = {
      value: data?.value,
      checked: data.value != null,
      message: data?.message || '',
      isBuiltIn: data?.isBuiltIn
    };
  }

  @autobind
  handleEdit(value: any, action: any) {
    const {onEdit, data} = this.props;

    if (action?.type === 'submit') {
      onEdit &&
        onEdit({
          name: data.name,
          ...value
        });
    }
  }

  @autobind
  handleDelete() {
    const {onDelete, data} = this.props;

    onDelete && onDelete(data.name);
  }

  @autobind
  handleSwitch(checked: boolean) {
    let {onSwitch, data} = this.props;
    let {value, message} = this.state;

    this.setState({
      checked
    });

    if (checked) {
      data.value = this.validator.schema ? value : true;
      data.message = '';
    }

    onSwitch && onSwitch(checked, data);
  }

  renderActions() {
    const {isDefault} = this.props;
    const actions = [];

    if (!isDefault) {
      actions.push(
        <Button
          className="ae-ValidationControl-item-action"
          level="link"
          size="md"
          key="delete"
          onClick={this.handleDelete}
        >
          <i className="fa fa-trash" />
        </Button>
      );
    }

    return actions.length !== 0 ? (
      <>
        <div className="ae-ValidationControl-item-actions">{actions}</div>
        {/* <hr /> */}
      </>
    ) : null;
  }

  renderInputControl() {
    const {value, message, checked} = this.state;
    const {fields, rendererSchema} = this.props;
    const i18nEnabled = getI18nEnabled();
    let control: any = [];

    if (!checked) {
      return null;
    }

    if (rendererSchema) {
      const rendererSchemaArr = Array.isArray(rendererSchema)
        ? rendererSchema
        : [rendererSchema];

      let filteredControl = rendererSchemaArr.filter(
        item => item.validateName === this.validator.name
      );
      if (!filteredControl.length && this.validator.schema) {
        filteredControl = filteredControl.concat(this.validator.schema);
      }
      control = filteredControl;
    } else if (this.validator.schema) {
      control = control.concat(this.validator.schema as SchemaCollection);
    }

    if (this.validator.message) {
      control.push({
        name: 'message',
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        label: tipedLabel(
          'Error message',
          `System default prompt: ${this.validator.message}`
        ),
        placeholder: 'Use system-defined prompts by default'
      });
    }

    return control.length !== 0 ? (
      <section
        className={cx('ae-ValidationControl-item-input', 'ae-ExtendMore')}
      >
        {render(
          {
            type: 'form',
            className: 'w-full',
            wrapWithPanel: false,
            panelClassName: 'border-none shadow-none mb-0',
            bodyClassName: 'p-none',
            actionsClassName: 'border-none mt-2.5',
            wrapperComponent: 'div',
            mode: 'horizontal',
            horizontal: {
              justify: true,
              left: 4,
              right: 8
            },
            preventEnterSubmit: true,
            submitOnChange: true,
            body: control
          },
          {
            data: {value, message, fields},
            onSubmit: this.handleEdit
          }
        )}
      </section>
    ) : null;
  }

  render() {
    const {classPrefix, data, isDefault} = this.props;
    const {checked, isBuiltIn} = this.state;
    return (
      <div
        className={cx('ae-ValidationControl-item', {
          'is-active': checked
        })}
        key={data.name}
      >
        <section
          className={cx('ae-ValidationControl-item-control', {
            'is-active': checked && data.name !== 'required'
          })}
        >
          <label className={cx(`${classPrefix}Form-label`)}>
            {this.validator.label}
          </label>
          <div>
            {this.renderActions()}
            <Switch
              key="switch"
              value={checked}
              disabled={isBuiltIn}
              onChange={this.handleSwitch}
            />
          </div>
        </section>

        {this.renderInputControl()}
      </div>
    );
  }
}
