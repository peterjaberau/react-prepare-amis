/**
 * @file switch + more editing combination controls
 * When using, you need to pay attention to whether all configuration items are in one object or the entire data. You can use bulk to distinguish
 *
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import {FormItem, Button, Overlay, PopOver, Icon, Switch} from 'amis';

import {isObject, autobind} from '@/packages/amis-editor-core/src';

import type {Action} from 'amis';
import type {SchemaCollection} from 'amis';
import type {IScopedContext} from 'amis-core';
import type {FormSchema} from 'amis';
import type {FormControlProps} from 'amis-core';
import fromPairs from 'lodash/fromPairs';
import some from 'lodash/some';
import pick from 'lodash/pick';

export interface SwitchMoreProps extends FormControlProps {
  className?: string;
  // popOverclassName?: string;
  // btnLabel?: string;
  // btnIcon?: string;
  // iconPosition?: 'right' | 'left';
  form?: Omit<FormSchema, 'type'>; // More editable forms
  formType: 'extend' | 'dialog' | 'pop'; // More editing methods appear
  body?: SchemaCollection;
  rootClose?: boolean;
  autoFocus?: boolean;
  // placement?: string;
  // offset?: ((clip: object, offset: object) => Offset) | Offset;
  // style?: object;
  overlay?: boolean;
  container?: HTMLElement | (() => HTMLElement);
  target?: React.ReactNode | Function;
  // editable?: boolean;
  removable?: boolean; // Can this configuration be deleted?
  hiddenOnDefault?: boolean; // hidden by default when bulk is not configured
  /**
   *
   * Bulk refers to whether the content of the extend is at the same level as name or a child level, which may result in several situations:
   * 1. When there is a name and bulk is false, it means that this attribute is not a boolean value, but an object. Value = open, no value = closed {kaiguan: {extend: xxx}}
   * 2. When there is a name and bulk is true, it means that this attribute itself is a switch, but there are other related attributes of the same level placed in the extension, so bulk update method is required for batch update {kaiguan: true, extend: xxx}
   * 3. When there is no name and bulk is true, it means that there is no attribute corresponding to this switch. The switch is only used to express the storage meaning of the configuration interaction level {extend: xxx}
   * Note: There will be no case where there is no name and bulk is false
   */
  bulk?: boolean;
  onRemove?: (e: React.UIEvent<any> | void) => void;
  onClose: (e: React.UIEvent<any> | void) => void;
  clearChildValuesOnOff?: boolean; // When the switch is turned off, delete the subform fields, default is true
  defaultData?: any; // default data
  isChecked?: (options: {
    data: any;
    value: any;
    name?: string;
    bulk?: boolean;
  }) => boolean;
  trueValue?: any; // The value corresponding to name when the switch is turned on. When the isChecked attribute is not configured, this match will also be used to check whether it is turned on.
  falseValue?: any; // The value corresponding to name when the switch is turned off
}

interface SwitchMoreState {
  /**
   * Whether to display more editorial content
   */
  show: boolean;

  /**
   * Whether to enable editing
   */
  checked: boolean;

  /**
   * Data key of the subform
   */
  childFormNames: string[];
}

export default class SwitchMore extends React.Component<
  SwitchMoreProps,
  SwitchMoreState
> {
  static defaultProps: Pick<
    SwitchMoreProps,
    // | 'btnIcon'
    // | 'iconPosition'
    | 'container'
    | 'autoFocus'
    // | 'placement'
    | 'overlay'
    | 'rootClose'
    | 'trueValue'
    | 'falseValue'
    | 'formType'
    | 'bulk'
    | 'clearChildValuesOnOff'
    // | 'editable'
  > = {
    // btnIcon: 'pencil',
    // iconPosition: 'right',
    container: document.body,
    autoFocus: true,
    // placement: 'left',
    overlay: true,
    rootClose: false,
    formType: 'pop',
    bulk: true,
    clearChildValuesOnOff: true
    // editable: true
  };

  overlay: HTMLElement | null;
  formNames: null | Array<string>;

  constructor(props: SwitchMoreProps) {
    super(props);
    this.state = this.initState();
  }

  initState() {
    const {data, value, trueValue, name, bulk, hiddenOnDefault, isChecked} =
      this.props;
    let checked = false;
    const formNames = this.getFormItemNames();

    // Give priority to using the passed in selection function to judge
    if (isChecked && typeof isChecked === 'function') {
      checked = isChecked({data, value, name, bulk});
    }
    // Secondly, trueValue is used. This is mainly when the attribute value is an antonym such as disableXX, but the configuration needs to be changed to a positive meaning such as enabledXX. Here, trueValue will be false
    else if (trueValue != null) {
      checked = value === trueValue;
    }
    // has an attribute name, which corresponds to the switch itself
    else if (name) {
      checked = data[name] != null && data[name] !== false;
    }
    // This switch has no specific attribute corresponding to it. If any of the subform items is turned on, it means it is turned on.
    else {
      checked = some(formNames, key => data[key] !== undefined);
    }

    // The switch has corresponding attributes
    return {
      checked,
      show: hiddenOnDefault === true ? false : checked,
      childFormNames: formNames
    };
  }

  // Get the content of the subform item
  getFormItemNames() {
    const {form} = this.props;

    const formNames =
      form && Array.isArray(form?.body)
        ? form.body
            .map((item: any) =>
              typeof item === 'string' ? undefined : item?.name
            )
            .filter(name => name)
        : [];

    return formNames;
  }

  @autobind
  overlayRef(ref: any) {
    this.overlay = ref ? (findDOMNode(ref) as HTMLElement) : null;
  }

  @autobind
  openPopover() {
    this.setState({show: true});
  }

  @autobind
  toogleExtend() {
    this.setState({show: !this.state.show});
  }

  @autobind
  closePopover() {
    this.setState({show: false});
  }

  @autobind
  handleDelete(e: React.UIEvent<any> | void) {
    const {onRemove} = this.props;

    onRemove && onRemove(e);
  }

  @autobind
  handleSwitchChange(checked: boolean) {
    const {
      onBulkChange,
      onChange,
      bulk,
      name,
      defaultData,
      trueValue,
      falseValue,
      clearChildValuesOnOff
    } = this.props;

    if (name) {
      let newValue = checked
        ? this.getInitTureValue()
        : falseValue ?? undefined;

      onChange(newValue);
    }

    // Subform items are at the same level and need to be updated separately
    if (bulk) {
      // When selected, the value needs to be updated
      if (checked) {
        let newValue = defaultData ?? trueValue;
        newValue && onBulkChange && onBulkChange(newValue);
      }
      // This logic is mainly for some related configurations that have default values. I don't want to delete them, but just want to keep the initial
      else if (clearChildValuesOnOff) {
        onBulkChange &&
          onBulkChange(
            fromPairs(this.state.childFormNames.map(i => [i, undefined]))
          );
      }
    }

    this.setState({checked, show: checked});
  }

  /**
   * Returns the data of the subform. If it is at the same level, directly returns the current data field, otherwise returns the current data as a subform
   */
  getExtendValues() {
    const {name, data: ctx, bulk} = this.props;

    if (!ctx) {
      return {};
    }

    if (bulk) {
      return ctx;
    }

    return name ? ctx[name] : {};
  }

  /**
   * After opening, the default value is followed first, and then the selected value is followed
   * When neither is set, check whether it is an object type. If it is an object type, it needs to be an empty object
   *
   * After closing, follow the closing value setting first, otherwise everything returns to the original deleted attribute state
   */
  getInitTureValue() {
    const {bulk, defaultData, trueValue} = this.props;

    if (defaultData) {
      return {...defaultData};
    }

    if (trueValue != null) {
      return trueValue;
    }

    if (bulk) {
      return true;
    }

    return {};
  }

  /**
   * Submission of pop-up window configuration
   * @param values
   */
  @autobind
  handleSubmit(values: any) {
    const {onChange, onBulkChange, bulk} = this.props;

    if (bulk) {
      onBulkChange && onBulkChange(values);
    } else {
      onChange && onChange(values);
    }
  }

  @autobind
  handleAction(
    e: React.UIEvent<any> | void,
    action: Action,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onClose} = this.props;

    if (action.actionType === 'close') {
      this.setState({show: false});
      onClose && onClose(e);
    }
  }

  renderActions() {
    const {removable, disabled, form, formType, hiddenOnDefault, render} =
      this.props;
    const {checked, show} = this.state;

    if (!form || !checked || disabled) {
      return null;
    }

    const actions = [];
    if (formType === 'dialog') {
      actions.push(
        render('switch-more-dialog', this.renderDialogMore(), {
          key: 'edit',
          onSubmit: this.handleSubmit
        })
      );
    } else if (formType === 'pop') {
      actions.push(
        <Button
          key="edit"
          level="link"
          size="sm"
          className="action-btn"
          ref={this.overlayRef}
          onClick={this.openPopover}
        >
          <Icon icon="pencil" className="icon" />
        </Button>
      );
    } else if (hiddenOnDefault && formType === 'extend') {
      actions.push(
        <div
          key="open"
          data-tooltip={!show ? 'Expand more' : undefined}
          data-position="bottom"
        >
          <Button
            level="link"
            size="sm"
            className={'action-btn open-btn' + (show ? ' opening' : '')}
            onClick={this.toogleExtend}
          >
            <Icon icon="caret" className="icon" />
          </Button>
        </div>
      );
    }

    if (removable) {
      actions.push(
        <Button key="remove" level="link" size="sm" onClick={this.handleDelete}>
          <Icon icon="delete-btn" className="icon ae-SwitchMore-icon" />
        </Button>
      );
    }

    return actions;
  }

  renderPopover() {
    const {
      popOverclassName,
      overlay,
      offset,
      target,
      container,
      placement,
      rootClose,
      style,
      title,
      render
    } = this.props;

    return (
      <Overlay
        show
        rootClose={rootClose}
        placement={placement}
        target={target || this.overlay}
        container={container}
      >
        <PopOver
          className={cx('ae-SwitchMore-popover', popOverclassName)}
          placement={placement}
          overlay={overlay}
          offset={offset}
          style={style}
        >
          <header>
            <p className="ae-SwitchMore-title">
              {title || 'More configuration'}
            </p>
            <a onClick={this.closePopover} className="ae-SwitchMore-close">
              <Icon icon="close" className="icon" />
            </a>
          </header>
          {render('switch-more-form', this.renderForm(), {
            onSubmit: this.handleSubmit
          })}
        </PopOver>
      </Overlay>
    );
  }

  renderExtend() {
    const {render} = this.props;
    const {show} = this.state;

    if (!show) {
      return null;
    }

    return (
      <div>
        <div className={cx('ae-SwitchMore-content', 'inFormItem')}>
          {render('switch-more-form', this.renderForm(), {
            onSubmit: this.handleSubmit
          })}
        </div>
      </div>
    );
  }

  renderDialogMore() {
    return {
      type: 'input-sub-form',
      btnLabel: '',
      className: 'inline-block m-0 h-6 bg-white ',
      itemClassName: 'bg-white hover:bg-white m-0 p-0',
      icon: 'fa fa-cog',
      form: {
        title: this.props.label,
        ...this.renderForm()
      }
    };
  }

  renderForm() {
    const {form, formType, autoFocus, bulk} = this.props;

    return {
      type: 'form',
      wrapWithPanel: false,
      panelClassName: 'border-none shadow-none mb-0',
      actionsClassName: 'border-none mt-2.5',
      wrapperComponent: 'div',
      mode: 'horizontal',
      horizontal: {
        justify: true,
        left: 4
      },
      autoFocus: autoFocus,
      formLazyChange: true,
      preventEnterSubmit: true,
      submitOnChange: ['pop', 'extend'].includes(formType),
      canAccessSuperData: bulk, // Avoid having the same name
      data: this.getExtendValues(),
      ...form
    };
  }

  renderMoreSection() {
    const {formType} = this.props;
    const {show, checked} = this.state;

    if (!checked) {
      return null;
    }

    if (formType === 'pop') {
      return show ? this.renderPopover() : null;
    } else if (formType === 'extend') {
      return this.renderExtend();
    }

    return null;
  }

  render() {
    const {
      render,
      disabled,
      className,
      body,
      env,
      hidden,
      formType,
      onText,
      offText
    } = this.props;

    if (hidden) {
      return null;
    }

    const {show, checked} = this.state;
    const actions = this.renderActions();

    const classPrefix = env?.theme?.classPrefix;

    return (
      <div
        className={cx('ae-SwitchMore', 'ae-SwitchMore-' + formType, className)}
      >
        <div className={cx('ae-SwitchMore-switch')}>
          {body ? render('body', body) : null}
          {actions && actions.length ? (
            <div className="ae-SwitchMore-actions">
              {actions}
              {checked ? <hr /> : null}
            </div>
          ) : null}
          <Switch
            value={checked}
            onChange={this.handleSwitchChange}
            disabled={disabled}
            onText={onText}
            offText={offText}
          />
        </div>

        {this.renderMoreSection()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-switch-more',
  strictMode: false
})
export class SwitchMoreRenderer extends SwitchMore {}
