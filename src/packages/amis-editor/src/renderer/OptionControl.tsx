/**
 * @file component option component's visual editing control
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cx from 'classnames';
import DeepDiff from 'deep-diff';
import uniqBy from 'lodash/uniqBy';
import omit from 'lodash/omit';
import Sortable from 'sortablejs';
import {
  Renderer,
  Button,
  Checkbox,
  Icon,
  RendererProps,
  normalizeApi
} from '@/packages/amis/src';
// @ts-ignore
import {value2array} from '@/packages/amis-ui/src/components/Select';

import {autobind, getI18nEnabled} from '@/packages/amis-editor-core/src';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';

import type {Option} from '@/packages/amis/src';
import {createObject, FormControlProps} from '@/packages/amis-core/src';
import type {OptionValue} from '@/packages/amis-core/src';
import type {SchemaApi} from '@/packages/amis/src';
import debounce from 'lodash/debounce';
import {valueType} from './ValueFormatControl';
import {getOwnValue} from '../util';

export interface PopoverForm {
  optionLabel: string;
  optionValue: any;
  optionValueType: valueType;
}

export type OptionControlItem = Option & {checked: boolean};

export interface OptionControlState {
  options: Array<OptionControlItem>;
  api: SchemaApi;
  labelField: string;
  valueField: string;

  source: SourceType;
}

export interface OptionSourceControlProps
  extends OptionControlState,
    RendererProps {
  onChange: (value: Partial<OptionControlState>) => void;
}

export interface OptionSource {
  label: string;
  value: SourceType;
  test?: (value: Omit<OptionControlState, 'source'>) => boolean;
  render?: (props: OptionSourceControlProps) => JSX.Element;
  component?: React.ComponentType<OptionSourceControlProps>;
}

export interface OptionControlProps extends RendererProps {
  className?: string;

  // Allowed option source types
  enabledOptionSourceType?: Array<SourceType>;

  // Additional extended option source
  extraOptionSources: Array<OptionSource>;
}

export type SourceType = 'custom' | 'api' | 'apicenter' | 'variable' | string;

// Only responsible for the configuration of static options
class CustomOptionControl extends React.Component<OptionSourceControlProps> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;

  @autobind
  targetRef(ref: any) {
    this.target = ref ? (findDOMNode(ref) as HTMLElement) : null;
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  initDragging() {
    const {onChange} = this.props;
    const dom = findDOMNode(this) as HTMLElement;

    this.sortable = new Sortable(
      dom.querySelector('.ae-OptionControl-content') as HTMLElement,
      {
        group: 'OptionControlGroup',
        animation: 150,
        handle: '.ae-OptionControlItem-dragBar',
        ghostClass: 'ae-OptionControlItem--dragging',
        onEnd: (e: any) => {
          // No movement
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // Switch back
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const options = this.props.options.concat();
          options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);

          onChange({options});
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  /**
   * Delete option
   */
  handleDelete(index: number) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();

    options.splice(index, 1);
    onChange({options});
  }

  /**
   * Set default options
   */
  handleToggleDefaultValue(index: number, checked: any, shift?: boolean) {
    const {onChange, options: originOptions} = this.props;
    let options = originOptions.concat();
    const isMultiple =
      getOwnValue(this.props.data, 'multiple') || this.props?.multiple;

    if (isMultiple) {
      options.splice(index, 1, {...options[index], checked});
    } else {
      options = options.map((item, itemIndex) => ({
        ...item,
        checked: itemIndex === index ? checked : false // Supports repeated clicks to uncheck
      }));
    }

    onChange({options});
  }

  /**
   * Editing options
   */
  toggleEdit(index: number) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    options.splice(index, 1, {
      ...options[index],
      editing: !options[index].editing
    });
    onChange({options});
  }

  /**
   * Edit superscript
   */
  toggleBadge(index: number, value: string) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    options.splice(index, 1, {
      ...options[index],
      badge: value
    });
    onChange({options});
  }

  @autobind
  handleEditLabel(index: number, value: string) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    options.splice(index, 1, {...options[index], label: value});
    onChange({options});
  }

  @autobind
  handleHiddenValueChange(index: number, value: string) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    const {hiddenOn, ...option} = options[index];
    const newOption = {
      ...option
    };

    if (value) {
      newOption.hiddenOn = value;
    } else {
      delete newOption.hiddenOn;
    }

    options.splice(index, 1, newOption);
    onChange({options});
  }

  @autobind
  handleAdd() {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    options.push({
      label: '',
      value: null,
      checked: false
    });
    onChange({options});
  }

  handleValueChange(index: number, value: string) {
    const {onChange, options: originOptions} = this.props;
    const options = originOptions.concat();
    options[index].value = value;

    onChange({options});
  }

  @autobind
  handleBatchAdd(values: {batchOption: string}[], action: any) {
    const {onChange, customEdit = true} = this.props;
    const options = getOwnValue(this.props.data, 'options') || [];
    const addedOptions: Array<OptionControlItem> = values[0].batchOption
      .split('\n')
      .map(option => {
        const item = option.trim();
        if (~item.indexOf(' ') && customEdit) {
          let [label, value] = item.split(' ');
          return {label: label.trim(), value: value.trim(), checked: false};
        }
        return {label: item, value: item, checked: false};
      });
    const newOptions = uniqBy([...options, ...addedOptions], 'value');

    onChange({options: newOptions});
  }

  renderOption(props: any) {
    const {
      checked,
      index,
      editing,
      multipleProps,
      closeDefaultCheck,
      hiddenOn,
      customEdit = true
    } = props;
    const {render, node} = this.props;
    const ctx = {...this.props.data};
    const isMultiple = ctx?.multiple === true || multipleProps;
    const i18nEnabled = getI18nEnabled();
    const showBadge = node.type === 'button-group-select';

    const editDom = editing ? (
      <div className="ae-OptionControlItem-extendMore">
        {render(
          'option',
          {
            type: 'container',
            className: 'ae-ExtendMore right mb-2',
            body: [
              {
                type: 'button',
                className: 'ae-OptionControlItem-closeBtn',
                label: '×',
                level: 'link',
                value: checked,
                onClick: () => this.toggleEdit(index)
              },
              {
                children: ({render, innerValue}: any) => {
                  return render(
                    'innerLabel',
                    {
                      name: 'label',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      placeholder: 'Please enter the display text',
                      label: 'text',
                      mode: 'horizontal',
                      labelClassName: 'ae-OptionControlItem-EditLabel',
                      valueClassName: 'ae-OptionControlItem-EditValue'
                    },
                    {
                      value: innerValue.label || '',
                      onChange: (v: string) => this.handleEditLabel(index, v)
                    }
                  );
                }
              },
              {
                children: ({render, innerValue}: any) => {
                  return render(
                    'innerValue',
                    {
                      name: 'value',
                      type: 'ae-valueFormat',
                      placeholder: 'Default is consistent with the text',
                      labelClassName: 'ae-OptionControlItem-EditLabel',
                      valueClassName: 'ae-OptionControlItem-EditValue',
                      label: 'value'
                    },
                    {
                      value: innerValue?.value || '',
                      onChange: (v: any) => this.handleValueChange(index, v)
                    }
                  );
                }
              },
              {
                children: ({render, innerValue}: any) => {
                  return render(
                    'innerHiddenOn',
                    getSchemaTpl('expressionFormulaControl', {
                      label: 'Hide',
                      name: 'hiddenOn',
                      labelClassName: 'ae-OptionControlItem-EditLabel',
                      valueClassName: 'ae-OptionControlItem-EditValue'
                    }),
                    {
                      value: innerValue.hiddenOn || '',
                      onChange: (v: string) =>
                        this.handleHiddenValueChange(index, v)
                    }
                  );
                }
              },
              {
                children: ({render, innerValue}: any) => {
                  return render(
                    'innerBadge',
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      placeholder: 'Please enter the corner text',
                      label: 'corner mark',
                      mode: 'horizontal',
                      name: 'badge',
                      visible: showBadge,
                      labelClassName: 'ae-OptionControlItem-EditLabel',
                      valueClassName: 'ae-OptionControlItem-EditValue'
                    },
                    {
                      value: innerValue.badge || '',
                      onChange: (v: string) => this.toggleBadge(index, v)
                    }
                  );
                }
              }
            ]
          },
          {
            innerValue: {
              label: props.label,
              value: props.value,
              badge: props.badge,
              hiddenOn
            }
          }
        )}
      </div>
    ) : null;

    const operationBtn = [
      {
        type: 'button',
        className: 'ae-OptionControlItem-action',
        label: 'Edit',
        onClick: () => this.toggleEdit(index)
      },
      {
        type: 'button',
        className: 'ae-OptionControlItem-action',
        label: 'Delete',
        onClick: () => this.handleDelete(index)
      }
    ];

    // Single selection mode, add cancel operation when selected
    if (!closeDefaultCheck && !isMultiple && checked) {
      operationBtn.unshift({
        type: 'button',
        className: 'ae-OptionControlItem-action',
        label: 'Uncheck',
        onClick: () => this.handleToggleDefaultValue(index, false)
      });
    }

    const disabled = props?.hidden === true;
    const tooltip = disabled
      ? 'Hidden options cannot be set as default values'
      : 'This item is selected by default';

    return (
      <li className="ae-OptionControlItem" key={index}>
        <div className="ae-OptionControlItem-Main">
          <a className="ae-OptionControlItem-dragBar">
            <Icon icon="drag-bar" className="icon" />
          </a>
          {!this.props.closeDefaultCheck &&
            this.props.data.defaultCheckAll !== true && (
              <span className="inline-flex" data-tooltip={tooltip}>
                <Checkbox
                  className="ae-OptionControlItem-checkbox"
                  checked={checked}
                  disabled={disabled}
                  type={isMultiple ? 'checkbox' : 'radio'}
                  onChange={(newChecked: any, shift?: boolean) =>
                    this.handleToggleDefaultValue(index, newChecked, shift)
                  }
                />
              </span>
            )}
          {/* <InputBox
            className="ae-OptionControlItem-input"
            value={label}
            placeholder="Please enter text/value"
            clearable={false}
            onChange={(value: string) => this.handleEditLabel(index, value)}
          /> */}
          {render(
            'label',
            {
              name: 'label',
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              label: false,
              className: 'ae-OptionControlItem-input',
              placeholder: 'Please enter text/value',
              clearable: false
            },
            {
              value: props?.label || '',
              disabled: editing,
              onChange: (value: string) => {
                this.handleEditLabel(index, value);
              }
            }
          )}
          {customEdit
            ? render(
                'dropdown',
                {
                  type: 'dropdown-button',
                  className: 'ae-OptionControlItem-dropdown',
                  btnClassName: 'px-2',
                  icon: 'fa fa-ellipsis-h',
                  hideCaret: true,
                  closeOnClick: true,
                  align: 'right',
                  menuClassName: 'ae-OptionControlItem-ulmenu',
                  buttons: operationBtn
                },
                {
                  popOverContainer: null // amis renders the mounted node and uses this.target
                }
              )
            : render('delete', {
                type: 'button',
                className: 'ae-OptionControlItem-action-delete',
                icon: 'fa fa-trash',
                level: 'link',
                onClick: () => this.handleDelete(index)
              })}
        </div>
        {editDom}
      </li>
    );
  }

  buildBatchAddSchema() {
    const {customEdit = true} = this.props;
    return {
      type: 'action',
      actionType: 'dialog',
      label: 'Batch add',
      dialog: {
        title: 'Batch add options',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        onConfirm: this.handleBatchAdd,
        body: [
          {
            type: 'alert',
            level: 'warning',
            body: [
              {
                type: 'tpl',
                tpl:
                  'Each option is listed in a separate line, and all items with unique values ​​are added as new options;' +
                  (customEdit
                    ? '<br/>Each line can be used to set label and value separately by space, for example: "张三zhangsan"'
                    : '')
              }
            ],
            showIcon: true,
            className: 'mb-2.5'
          },
          {
            type: 'form',
            wrapWithPanel: false,
            mode: 'normal',
            wrapperComponent: 'div',
            resetAfterSubmit: true,
            autoFocus: true,
            preventEnterSubmit: true,
            horizontal: {
              left: 0,
              right: 12
            },
            body: [
              {
                name: 'batchOption',
                type: 'textarea',
                label: '',
                placeholder: 'Please enter the option content',
                trimContents: true,
                minRows: 10,
                maxRows: 50,
                required: true
              }
            ]
          }
        ]
      }
    };
  }

  render() {
    const {options, multiple: multipleProps, render} = this.props;
    return (
      <div className="ae-OptionControl-wrapper">
        {Array.isArray(options) && options.length ? (
          <ul className="ae-OptionControl-content" ref={this.dragRef}>
            {options.map((option, index) =>
              this.renderOption({
                ...this.props,
                ...option,
                index,
                multipleProps
              })
            )}
          </ul>
        ) : (
          <div className="ae-OptionControl-placeholder">No options</div>
        )}
        <div className="ae-OptionControl-footer">
          <Button level="enhance" onClick={this.handleAdd} ref={this.targetRef}>
            Add options
          </Button>
          {/* {render('option-control-batchAdd', this.buildBatchAddSchema())} */}
          {render('inner', this.buildBatchAddSchema())}
        </div>

        {/* {this.renderPopover()} */}
      </div>
    );
  }
}

// Responsible for the configuration of api and apicenter
function APIOptionControl({
  render,
  source,
  api,
  onChange,
  labelField,
  valueField
}: OptionSourceControlProps) {
  const handleAPIChange = React.useCallback((source: SchemaApi) => {
    onChange({api: source});
  }, []);
  const handleLabelFieldChange = React.useCallback((value: string) => {
    onChange({labelField: value});
  }, []);
  const handleValueFieldChange = React.useCallback((value: string) => {
    onChange({valueField: value});
  }, []);

  const footer = React.useMemo(() => {
    return [
      {
        children: ({render, labelField}: any) => {
          return render(
            'inner',
            {
              label: tipedLabel(
                'Display fields',
                'Data fields corresponding to option text, please configure multiple fields through templates'
              ),
              type: 'input-text',
              name: 'labelField',
              clearable: true,
              placeholder: 'Field corresponding to the option text'
            },
            {
              value: labelField,
              onChange: handleLabelFieldChange
            }
          );
        }
      },
      {
        children: ({render, valueField}: any) => {
          return render(
            'inner',
            {
              label: 'value field',
              type: 'input-text',
              name: 'valueField',
              clearable: true,
              placeholder: 'Field corresponding to the value'
            },
            {
              value: valueField,
              onChange: handleValueFieldChange
            }
          );
        }
      }
    ];
  }, []);
  const schema = React.useMemo(() => {
    return getSchemaTpl('apiControl', {
      label: 'Interface',
      name: 'source',
      mode: 'normal',
      className: 'ae-ExtendMore',
      visibleOn: 'this.autoComplete !== false',
      footer
    });
  }, [footer]);

  return render('api', schema, {
    value: api,
    onChange: handleAPIChange,
    sourceType: source,
    labelField,
    valueField
  });
}

// Responsible for the configuration of context variable binding
function variableOptionControl({
  render,
  api,
  onChange,
  labelField,
  valueField
}: OptionSourceControlProps) {
  const handleAPIChange = React.useCallback((source: SchemaApi) => {
    onChange({api: source});
  }, []);
  const handleLabelFieldChange = React.useCallback((value: string) => {
    onChange({labelField: value});
  }, []);
  const handleValueFieldChange = React.useCallback((value: string) => {
    onChange({valueField: value});
  }, []);

  const footer = React.useMemo(() => {
    return [
      {
        children: ({render, controlledValue}: any) => {
          return render(
            'inner',
            {
              label: tipedLabel(
                'Display fields',
                'Data fields corresponding to option text, please configure multiple fields through templates'
              ),
              type: 'input-text',
              name: 'labelField',
              clearable: true,
              placeholder: 'Field corresponding to the option text'
            },
            {
              value: controlledValue.labelField,
              onChange: handleLabelFieldChange
            }
          );
        }
      },
      {
        children: ({render, controlledValue}: any) => {
          return render(
            'inner',
            {
              label: 'value field',
              type: 'input-text',
              name: 'valueField',
              clearable: true,
              placeholder: 'Field corresponding to the value'
            },
            {
              value: controlledValue.valueField,
              onChange: handleValueFieldChange
            }
          );
        }
      }
    ];
  }, []);

  const schema = React.useMemo(() => {
    return {
      type: 'control',
      label: false,
      className: 'ae-ExtendMore',
      body: [
        {
          children: ({render, controlledValue}: any) =>
            render(
              'inner',
              getSchemaTpl('sourceBindControl', {
                label: false
              }),
              {
                value: controlledValue.api,
                onChange: handleAPIChange
              }
            )
        }
      ].concat(footer)
    };
  }, [footer]);
  return render('api', schema, {
    controlledValue: {
      api,
      labelField,
      valueField
    }
  });
}

const builtinOptionSource: Array<OptionSource> = [
  {
    label: 'Custom options',
    value: 'custom',
    component: CustomOptionControl
  },
  {
    label: 'External interface',
    value: 'api',
    component: APIOptionControl,
    test: ({api}) => {
      const url = normalizeApi(api).url;
      return !!(
        typeof url === 'string' &&
        url &&
        !(typeof api === 'string' && /\$\{(.*?)\}/g.test(api))
      );
    }
  },
  {
    label: 'API Center',
    value: 'apicenter',
    component: APIOptionControl,
    test: ({api}) => {
      const url = normalizeApi(api).url;
      return typeof url === 'string' && url.startsWith('api://');
    }
  },
  {
    label: 'context variable',
    value: 'variable',
    component: variableOptionControl,
    test: ({api}) => typeof api === 'string' && /\$\{(.*?)\}/g.test(api)
  }
];

export default class OptionControl extends React.Component<
  OptionControlProps,
  OptionControlState
> {
  internalProps = ['checked', 'editing'];
  optionSources: Array<OptionSource> = [];
  lastOptions: OptionControlProps;

  constructor(props: OptionControlProps) {
    super(props);

    this.optionSources = builtinOptionSource.concat(
      Array.isArray(props.extraOptionSources) ? props.extraOptionSources : []
    );
    const state = {
      options: this.transformOptions(props) || [],
      api: getOwnValue(props.data, 'source'),
      labelField: props.data.labelField,
      valueField: props.data.valueField
    };

    let source: SourceType =
      this.enabledOptionSources.reduce(
        (type: string | undefined, source) =>
          type ?? (source.test?.(state) === true ? source.value : type),
        undefined
      ) || 'custom';

    this.state = {
      ...state,
      source
    };
  }

  /**
   * Data update
   */
  componentWillReceiveProps(nextProps: OptionControlProps) {
    const options = nextProps.data.options;
    // When the code on the left is manually updated, synchronize the configuration panel
    if (DeepDiff.diff(options, this.lastOptions)) {
      this.setState({
        options: this.transformOptions(nextProps)
      });
    }
  }

  get enabledOptionSources() {
    const {hasApiCenter, enabledOptionSourceType} = this.props;
    let options = this.optionSources;

    if (!hasApiCenter) {
      options = options.filter(item => item.value !== 'apicenter');
    }

    if (Array.isArray(enabledOptionSourceType)) {
      options = enabledOptionSourceType
        .map(type => options.find(a => a.value === type)!)
        .filter(item => item);
    }

    return options;
  }

  transformOptions(props: OptionControlProps) {
    const ctx = {...props.data};
    const options = ctx.options;
    let defaultValue: Array<OptionValue> | OptionValue = ctx.value;

    const valueArray = value2array(defaultValue, ctx as any).map(
      (item: Option) => item[ctx?.valueField ?? 'value']
    );

    return Array.isArray(options)
      ? options.map((item: Option) => ({
          label: item.label,
          // In order to make the value take effect when the user writes the label
          value: item.label === item.value ? null : item.value,
          checked: !!~valueArray.indexOf(item[ctx?.valueField ?? 'value']),
          ...(item?.badge ? {badge: item.badge} : {}),
          ...(item.hidden !== undefined ? {hidden: item.hidden} : {}),
          ...(item.hiddenOn !== undefined ? {hiddenOn: item.hiddenOn} : {})
        }))
      : [];
  }

  /**
   * Process the default value of the current component
   */
  normalizeValue() {
    const {multiple: multipleProps} = this.props;
    const ctx = {...this.props.data};
    const {
      joinValues = true,
      extractValue,
      multiple,
      delimiter,
      valueField
    } = ctx;

    const checkedOptions = this.state.options
      .filter(item => item.checked && item?.hidden !== true)
      .map(item => omit(item, this.internalProps));
    let value: Array<OptionValue> | OptionValue;

    if (!checkedOptions.length) {
      return undefined;
    }

    if (multiple || multipleProps) {
      value = checkedOptions;

      if (joinValues) {
        value = checkedOptions
          .map(
            (item: any) =>
              item[valueField || 'value'] || item[valueField || 'label']
          )
          .join(delimiter || ',');
      } else if (extractValue) {
        value = checkedOptions.map(
          (item: Option) =>
            item[valueField || 'value'] || item[valueField || 'label']
        );
      }
    } else {
      value = checkedOptions[0];

      if (joinValues || extractValue) {
        value = value[valueField || 'value'] || value[valueField || 'label'];
      }
    }

    return value;
  }

  /**
   * Update the unified export of options field
   */
  @autobind
  emitChange() {
    const {source, options} = this.state;
    const {onBulkChange} = this.props;
    const defaultValue = this.normalizeValue();
    const data: Partial<OptionControlProps> = {
      source: undefined,
      options: undefined,
      labelField: undefined,
      valueField: undefined
    };

    if (source === 'custom') {
      data.options = options.map(item => ({
        ...(item?.badge ? {badge: item.badge} : {}),
        label: item.label,
        value:
          item.value == null || item.value === '' ? item.label : item.value,
        ...(item.hiddenOn !== undefined ? {hiddenOn: item.hiddenOn} : {})
      }));
      data.value = defaultValue;
      this.lastOptions = data.options;
    }

    if (source === 'api' || source === 'apicenter' || source === 'variable') {
      const {api, labelField, valueField} = this.state;
      data.source = api;
      data.labelField = labelField || undefined;
      data.valueField = valueField || undefined;
      this.lastOptions = data.source;
    }

    onBulkChange && onBulkChange(data);
  }

  /**
   * Toggle option type
   */
  @autobind
  handleSourceChange(source: SourceType) {
    if (this.state.source === source) {
      return;
    }
    this.setState({api: '', source: source}, this.emitChange);
  }

  @autobind
  handleSourceControlChange(value: OptionControlState) {
    this.setState(value, this.emitChange);
  }

  renderHeader() {
    const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
      this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    let optionSourceList = this.enabledOptionSources.map(item => ({
      label: item.label,
      value: item.value,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-OptionControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                useMobileUI,
                container: popOverContainer || env.getModalContainer
              })
            : null}
        </label>
        <div>
          {render(
            'validation-control-addBtn',
            {
              type: 'dropdown-button',
              level: 'link',
              size: 'sm',
              label: '${selected}',
              align: 'right',
              closeOnClick: true,
              closeOnOutside: true,
              buttons: optionSourceList
            },
            {
              popOverContainer: null,
              data: {
                selected: optionSourceList.find(item => item.value === source)
                  ?.label
              }
            }
          )}
        </div>
      </header>
    );
  }

  render() {
    const {source} = this.state;
    const {className} = this.props;
    const sourceControl = this.optionSources.find(
      item => item.value === source
    );
    const sourceControlProps = {
      ...this.props,
      ...this.state,
      onChange: this.handleSourceControlChange
    };

    return (
      <div className={cx('ae-OptionControl', className)}>
        {this.renderHeader()}

        {sourceControl ? (
          sourceControl.component ? (
            <sourceControl.component {...sourceControlProps} key={source} />
          ) : (
            sourceControl.render!(sourceControlProps)
          )
        ) : null}
      </div>
    );
  }
}

@Renderer({
  type: 'ae-optionControl'
})
export class OptionControlRenderer extends OptionControl {}
