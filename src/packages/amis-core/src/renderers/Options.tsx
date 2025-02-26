/**
 * @file The parent of all list selection controls, such as Select, Radios, Checkboxes,
 * List, ButtonGroup, etc.
 */
import {
  Api,
  PlainObject,
  ActionObject,
  OptionProps,
  BaseApiObject
} from '../types';
import {isEffectiveApi, isApiOutdated} from '../utils/api';
import {isAlive} from 'mobx-state-tree';
import {
  anyChanged,
  autobind,
  createObject,
  setVariable,
  spliceTree,
  findTreeIndex,
  getTree,
  isEmpty,
  getTreeAncestors,
  normalizeNodePath,
  mapTree,
  getTreeDepth,
  flattenTree,
  keyToPath,
  getVariable
} from '../utils/helper';
import {reaction} from 'mobx';
import {
  FormControlProps,
  registerFormItem,
  FormItemBasicConfig,
  detectProps as itemDetectProps,
  FormBaseControl
} from './Item';
import {IFormItemStore} from '../store/formItem';

export type OptionsControlComponent = React.ComponentType<FormControlProps>;

import React from 'react';
import {
  resolveVariableAndFilter,
  isPureVariable,
  dataMapping
} from '../utils/tpl-builtin';

import {filter} from '../utils/tpl';
import findIndex from 'lodash/findIndex';

import isPlainObject from 'lodash/isPlainObject';
import {normalizeOptions} from '../utils/normalizeOptions';
import {optionValueCompare} from '../utils/optionValueCompare';
import type {Option} from '../types';
import {deleteVariable, resolveEventData} from '../utils';

export {Option};

export interface FormOptionsControl extends FormBaseControl {
  /**
   * Option collection
   */
  options?: Array<Option> | string[] | PlainObject;

  /**
   * Can be used to pull options through the API.
   */
  source?: BaseApiObject | string;

  /**
   * The first value of the option is selected by default.
   */
  selectFirst?: boolean;

  /**
   * Use an expression to configure whether the source interface should be initially pulled
   *
   * @deprecated It is recommended to use sendOn of the source interface
   */
  initFetchOn?: string;

  /**
   * Configure whether the source interface should be initially pulled.
   *
   * @deprecated It is recommended to use sendOn of source interface
   */
  initFetch?: boolean;

  /**
   * Is it multiple selection mode
   */
  multiple?: boolean;

  /**
   * Single selection mode: When the user selects an option, the value in the option will be submitted as the value of the form item, otherwise, the entire option object will be submitted as the value of the form item.
   * Multiple selection mode: The `value` of multiple selected options will be connected by `delimiter`, otherwise the value will be submitted directly as an array.
   */
  joinValues?: boolean;

  /**
   * Delimiter
   */
  delimiter?: string;

  /**
   * Multiple selection mode, whether to avoid line breaking when there are too many values
   */
  valuesNoWrap?: boolean;

  /**
   * After turning on, the value of the selected option value will be encapsulated as an array as the value of the current form item.
   */
  extractValue?: boolean;

  /**
   * Is it clearable?: boolean;

   /**
   * When the clear button is clicked, the form item is set to the currently configured value.
   *
   * @default ''
   */
  resetValue?: string;

  /**
   * Lazy loading field
   */
  deferField?: string;

  /**
   * Delayed loading API. When there is a defer: true option in the options, click to expand through this interface.
   */
  deferApi?: BaseApiObject | string;

  /**
   * Interface called when adding
   */
  addApi?: BaseApiObject | string;

  /**
   * Form item when adding.
   */
  addControls?: Array<PlainObject>;

  /**
   * Control the addition of pop-up box settings
   */
  addDialog?: PlainObject;

  /**
   * Can it be added
   */
  creatable?: boolean;

  /**
   * Add text
   */
  createBtnLabel?: string;

  /**
   * Can it be edited
   */
  editable?: boolean;

  /**
   * API called when editing
   */
  editApi?: BaseApiObject | string;

  /**
   * Form item for option modification
   */
  editControls?: Array<PlainObject>;

  /**
   * Control the editing pop-up box settings
   */

  editDialog?: PlainObject;

  /**
   * Can it be deleted
   */
  removable?: boolean;

  /**
   * Option deletion API
   */
  deleteApi?: BaseApiObject | string;

  /**
   * Option to delete the prompt text.
   */
  deleteConfirmText?: string;
}

export interface OptionsBasicConfig extends FormItemBasicConfig {
  autoLoadOptionsFromSource?: boolean;
}

export interface OptionsConfig extends OptionsBasicConfig {
  component: React.ComponentType<OptionsControlProps>;
}

// Attributes sent to registered components.
export interface OptionsControlProps
  extends FormControlProps,
    Omit<
      FormOptionsControl,
      | 'type'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
      | 'remark'
      | 'labelRemark'
    > {
  options: Array<Option>;
  onToggle: (
    option: Option,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onToggleAll: () => void;
  selectedOptions: Array<Option>;
  setOptions: (value: Array<any>, skipNormalize?: boolean) => void;
  setLoading: (value: boolean) => void;
  reloadOptions: (
    setError?: boolean,
    isInit?: boolean,
    data?: Record<string, any>
  ) => void;
  deferLoad: (option: Option) => void;
  leftDeferLoad: (option: Option, leftOptions: Option) => void;
  expandTreeOptions: (nodePathArr: any[]) => void;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean,
    callback?: (value: any) => any
  ) => void;
  onEdit?: (
    value: Option,
    origin?: Option,
    skipForm?: boolean,
    callback?: (value: any) => any
  ) => void;
  onDelete?: (value: Option, callback?: (value: any) => any) => void;
}

// The attributes received by yourself.
export interface OptionsProps
  extends FormControlProps,
    Omit<OptionProps, 'className'> {
  source?: Api;
  deferApi?: Api;
  creatable?: boolean;
  addApi?: Api;
  addControls?: Array<any>;
  editInitApi?: Api;
  editApi?: Api;
  editControls?: Array<any>;
  deleteApi?: Api;
  deleteConfirmText?: string;
  optionLabel?: string;
}

export const detectProps = itemDetectProps.concat([
  'value',
  'options',
  'size',
  'buttons',
  'columnsCount',
  'multiple',
  'hideRoot',
  'checkAll',
  'defaultCheckAll',
  'showIcon',
  'showRadio',
  'btnDisabled',
  'joinValues',
  'extractValue',
  'borderMode',
  'hideSelected'
]);

export class OptionsControlBase<
  T extends OptionsProps = OptionsProps,
  S = any
> extends React.Component<T, S> {
  toDispose: Array<() => void> = [];

  input: any;
  mounted = false;

  constructor(props: T, readonly config: OptionsConfig) {
    super(props);

    const {
      initFetch,
      formItem,
      source,
      data,
      setPrinstineValue,
      defaultValue,
      multiple,
      joinValues,
      extractValue,
      addHook,
      formInited,
      valueField,
      options,
      value,
      defaultCheckAll
    } = props;

    if (!formItem) {
      return;
    }

    formItem.setOptions(
      normalizeOptions(options, undefined, valueField),
      this.changeOptionValue,
      data
    );

    this.toDispose.push(
      reaction(
        () => JSON.stringify([formItem.loading, formItem.filteredOptions]),
        () => this.mounted && this.forceUpdate()
      )
    );

    // Select all by default. This will conflict with the default value\backfill value logic, so if a source is configured, the default selection will not be executed.
    if (
      multiple &&
      defaultCheckAll &&
      formItem.filteredOptions?.length &&
      !source
    ) {
      this.defaultCheckAll();
    }

    let loadOptions: boolean = initFetch !== false;
    let setInitValue: Function | null = null;

    if (joinValues === false && defaultValue) {
      setInitValue = () => {
        const selectedOptions = extractValue
          ? formItem
              .getSelectedOptions(value)
              .map(
                (selectedOption: Option) =>
                  selectedOption[valueField || 'value']
              )
          : formItem.getSelectedOptions(value);
        setPrinstineValue(
          multiple ? selectedOptions.concat() : selectedOptions[0]
        );
      };
    }

    if (loadOptions && config.autoLoadOptionsFromSource !== false) {
      this.toDispose.push(
        formInited || !addHook
          ? formItem.addInitHook(async () => {
              await this.reload();
              setInitValue?.();
            })
          : addHook(async (data: any) => {
              await this.initOptions(data);
              setInitValue?.();
            }, 'init')
      );
    } else {
      setInitValue?.();
    }
  }

  componentDidMount() {
    this.mounted = true;
    this.normalizeValue();
  }

  shouldComponentUpdate(nextProps: OptionsProps) {
    if (this.config.strictMode === false || nextProps.strictMode === false) {
      return true;
    } else if (nextProps.source || nextProps.autoComplete) {
      return true;
    } else if (nextProps.formItem?.expressionsInOptions) {
      return true;
    } else if (anyChanged(detectProps, this.props, nextProps)) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps: OptionsProps) {
    const props = this.props;
    const formItem = props.formItem as IFormItemStore;

    if (!props.source && prevProps.options !== props.options && formItem) {
      formItem.setOptions(
        normalizeOptions(props.options || [], undefined, props.valueField),
        this.changeOptionValue,
        props.data
      );
      this.normalizeValue();
    } else if (
      this.config.autoLoadOptionsFromSource !== false &&
      (props.formInited || typeof props.formInited === 'undefined') &&
      props.source &&
      formItem &&
      (prevProps.source !== props.source || prevProps.data !== props.data)
    ) {
      if (isPureVariable(props.source as string)) {
        const prevOptions = resolveVariableAndFilter(
          prevProps.source as string,
          prevProps.data,
          '| raw'
        );
        const options = resolveVariableAndFilter(
          props.source as string,
          props.data,
          '| raw'
        );

        if (prevOptions !== options) {
          formItem.loadOptionsFromDataScope(
            props.source as string,
            props.data,
            this.changeOptionValue
          );

          this.normalizeValue();
        }
      } else if (
        isEffectiveApi(props.source, props.data) &&
        isApiOutdated(
          prevProps.source,
          props.source,
          prevProps.data,
          props.data
        )
      ) {
        formItem
          .loadOptions(
            props.source,
            props.data,
            undefined,
            true,
            this.changeOptionValue
          )
          .then(() => this.normalizeValue());
      }
    }

    if (prevProps.value !== props.value || formItem?.expressionsInOptions) {
      formItem?.syncOptions(undefined, props.data);
    }
  }

  componentWillUnmount() {
    this.props.removeHook?.(this.reload, 'init');
    this.mounted = false;
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  // Not recommended, missing component value
  async oldDispatchOptionEvent(eventName: string, eventData: any = '') {
    const {dispatchEvent, options} = this.props;
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(
        this.props,
        {value: eventData, options, items: options} // To keep the name consistent
      )
    );
    // Return blocking flag
    return !!rendererEvent?.prevented;
  }

  async dispatchOptionEvent(eventName: string, eventData: any = '') {
    const {dispatchEvent, options, value} = this.props;
    const rendererEvent = await dispatchEvent(
      eventName,
      resolveEventData(
        this.props,
        {value, options, items: options, ...eventData} // To keep the name consistent
      )
    );
    // Return blocking flag
    return !!rendererEvent?.prevented;
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange?.('');
    } else if (actionType === 'reset') {
      onChange?.(resetValue ?? '');
    }
  }

  // The current value will be automatically converted if it is inconsistent with the expected value format.
  normalizeValue() {
    const {
      joinValues,
      extractValue,
      value,
      multiple,
      formItem,
      valueField,
      enableNodePath,
      pathSeparator,
      onChange
    } = this.props;

    if (!formItem || joinValues !== false || !formItem.options.length) {
      return;
    }

    if (
      extractValue === false &&
      (typeof value === 'string' || typeof value === 'number')
    ) {
      const selectedOptions = formItem.getSelectedOptions(value);
      onChange?.(multiple ? selectedOptions.concat() : selectedOptions[0]);
    } else if (
      extractValue === true &&
      value &&
      !(
        (Array.isArray(value) &&
          value.every(
            (val: any) => typeof val === 'string' || typeof val === 'number'
          )) ||
        typeof value === 'string' ||
        typeof value === 'number'
      )
    ) {
      const selectedOptions = formItem
        .getSelectedOptions(value)
        .map((selectedOption: Option) => selectedOption[valueField || 'value']);
      onChange?.(multiple ? selectedOptions.concat() : selectedOptions[0]);
    }
  }

  getWrappedInstance() {
    return this.input;
  }

  @autobind
  inputRef(ref: any) {
    this.input = ref;
  }

  @autobind
  async handleToggle(
    option: Option,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) {
    const {onChange, formItem, value} = this.props;

    if (!formItem) {
      return;
    }

    let newValue: string | Array<Option> | Option = this.toggleValue(
      option,
      value
    );

    const isPrevented = await this.dispatchOptionEvent('change', {
      value: newValue
    });
    isPrevented ||
      (onChange && onChange(newValue, submitOnChange, changeImmediately));
  }

  /**
   * Process the default selection logic during initialization
   */
  defaultCheckAll() {
    const {value, formItem, setPrinstineValue} = this.props;
    // If there is a default value\backfill value directly return
    if (!formItem || formItem.getSelectedOptions(value).length) {
      return;
    }
    let valueArray = formItem.filteredOptions.concat();
    const newValue = this.formatValueArray(valueArray);
    setPrinstineValue?.(newValue);
  }

  /**
   * The selected value is processed by joinValues and delimiter rules to output the value of the specified format
   * @param valueArray Array of selected values
   * @returns Output the value of the specified format through joinValues and delimiter rules
   */
  formatValueArray(valueArray: Array<Option>) {
    const {
      joinValues,
      extractValue,
      valueField,
      delimiter,
      resetValue,
      multiple
    } = this.props;
    let newValue: string | Array<Option> | Option = '';
    if (multiple) {
      /** Compatible with tree data structure */
      newValue =
        getTreeDepth(valueArray) > 1 ? flattenTree(valueArray) : valueArray;

      if (joinValues) {
        newValue = (newValue as Array<any>)
          .map(item => item[valueField || 'value'])
          .filter(item => item != null) /** tree的父节点可能没有value值 */
          .join(delimiter);
      } else if (extractValue) {
        newValue = (newValue as Array<any>)
          .map(item => item[valueField || 'value'])
          .filter(item => item != null);
      }
    } else {
      newValue = valueArray[0] || resetValue;

      if (joinValues && newValue) {
        newValue = (newValue as any)[valueField || 'value'];
      }
    }
    return newValue;
  }

  @autobind
  async handleToggleAll() {
    const {value, onChange, formItem, valueField} = this.props;

    if (!formItem) {
      return;
    }
    const selectedOptions = formItem.getSelectedOptions(value);
    /** Flatten and filter out cases where valueField does not exist, to ensure that the length is consistent when selecting all */
    const filteredOptions = flattenTree(
      formItem.filteredOptions.concat()
    ).filter(item => item != null && item[valueField || 'value'] != null);
    let valueArray =
      selectedOptions.length === filteredOptions.length
        ? []
        : formItem.filteredOptions.concat();
    const newValue = this.formatValueArray(valueArray);
    const isPrevented = await this.dispatchOptionEvent('change', {
      value: newValue
    });
    isPrevented || (onChange && onChange(newValue));
  }

  toggleValue(option: Option, originValue?: any) {
    const {
      joinValues,
      extractValue,
      valueField,
      delimiter,
      clearable,
      resetValue,
      multiple,
      formItem
    } = this.props;

    let valueArray =
      originValue !== undefined
        ? formItem!.getSelectedOptions(originValue).concat()
        : [];

    const idx = findIndex(
      valueArray,
      optionValueCompare(option[valueField || 'value'], valueField || 'value')
    );
    let newValue: string | Array<Option> | Option = '';

    if (multiple) {
      if (~idx) {
        valueArray.splice(idx, 1);
      } else {
        valueArray.push(option);
      }

      newValue = valueArray;

      if (joinValues) {
        newValue = (newValue as Array<any>)
          .map(item => item[valueField || 'value'])
          .join(delimiter);
      } else if (extractValue) {
        newValue = (newValue as Array<any>).map(
          item => item[valueField || 'value']
        );
      }
    } else {
      if (~idx && clearable) {
        valueArray.splice(idx, 1);
      } else {
        valueArray = [option];
      }

      newValue = valueArray[0] || resetValue;

      if ((joinValues || extractValue) && newValue) {
        newValue = (newValue as any)[valueField || 'value'];
      }
    }

    return newValue;
  }

  // When an action is triggered, if a reload target component is specified, it may come here
  @autobind
  reload() {
    return this.reloadOptions();
  }

  @autobind
  reloadOptions(setError?: boolean, isInit = false, data = this.props.data) {
    const {source, formItem, onChange, setPrinstineValue, valueField} =
      this.props;

    if (formItem && isPureVariable(source as string)) {
      isAlive(formItem) &&
        formItem.loadOptionsFromDataScope(
          source as string,
          data,
          this.changeOptionValue
        );
      return;
    } else if (!formItem || !isEffectiveApi(source, data)) {
      return;
    }

    return isAlive(formItem)
      ? formItem.loadOptions(
          source,
          data,
          undefined,
          false,
          isInit ? setPrinstineValue : onChange,
          setError
        )
      : undefined;
  }

  @autobind
  async deferLoad(option: Option) {
    const {deferApi, source, env, formItem, data} = this.props;
    const api = option.deferApi || deferApi || source;

    if (!api) {
      env.notify(
        'error',
        'Please set `deferApi` in options or `deferApi` in form items to load suboptions.'
      );
      return;
    }

    const json = await formItem?.deferLoadOptions(
      option,
      api,
      createObject(data, option)
    );

    // Trigger event notification, loading completed
    // Deprecated, not recommended
    this.oldDispatchOptionEvent('loadFinished', json);

    // Avoid breakchange and add new event names to correct previous design problems
    this.dispatchOptionEvent('deferLoadFinished', {result: json});
  }

  @autobind
  leftDeferLoad(option: Option, leftOptions: Option) {
    const {deferApi, source, env, formItem, data} = this.props;
    const api = option.deferApi || deferApi || source;

    if (!api) {
      env.notify(
        'error',
        'Please set `deferApi` in options or `deferApi` in form items to load suboptions.'
      );
      return;
    }

    formItem?.deferLoadLeftOptions(
      option,
      leftOptions,
      api,
      createObject(data, option)
    );
  }

  @autobind
  expandTreeOptions(nodePathArr: any[]) {
    const {deferApi, source, env, formItem, data} = this.props;
    const api = deferApi || source;

    if (!api) {
      env.notify(
        'error',
        'Please set `deferApi` in options or `deferApi` in form items to load suboptions.'
      );
      return;
    }

    formItem?.expandTreeOptions(nodePathArr, api, createObject(data));
  }

  @autobind
  async initOptions(data: any) {
    await this.reloadOptions(false, true);
    const {formItem, name, multiple, defaultCheckAll} = this.props;
    if (!formItem) {
      return;
    }
    if (isAlive(formItem) && formItem.value) {
      setVariable(data, name!, formItem.value);
    }

    // 默认全选
    if (multiple && defaultCheckAll && formItem.filteredOptions?.length) {
      this.defaultCheckAll();
    }
  }

  focus() {
    this.input && this.input.focus && this.input.focus();
  }

  @autobind
  changeOptionValue(value: any) {
    const {
      onChange,
      formInited,
      setPrinstineValue,
      value: originValue
    } = this.props;

    if (formInited === false) {
      originValue === undefined && setPrinstineValue?.(value);
    } else {
      onChange?.(value);
    }
  }

  @autobind
  setOptions(options: Array<any>, skipNormalize = false) {
    const formItem = this.props.formItem as IFormItemStore;
    formItem &&
      formItem.setOptions(
        skipNormalize
          ? options
          : normalizeOptions(options || [], undefined, this.props.valueField),
        this.changeOptionValue,
        this.props.data
      );
  }

  @autobind
  syncOptions() {
    const formItem = this.props.formItem as IFormItemStore;
    formItem && formItem.syncOptions(undefined, this.props.data);
  }

  @autobind
  setLoading(value: boolean) {
    const formItem = this.props.formItem as IFormItemStore;
    formItem && formItem.setLoading(value);
  }

  @autobind
  async handleOptionAdd(
    idx: number | Array<number> = -1,
    value?: any,
    skipForm: boolean = false,
    callback?: (value: any) => any
  ) {
    let {
      addControls,
      addDialog,
      disabled,
      labelField,
      onOpenDialog,
      optionLabel,
      addApi,
      source,
      data,
      valueField,
      deferField,
      formItem: model,
      createBtnLabel,
      env,
      translate: __
    } = this.props;

    // Disabled or no name configured
    if (disabled || !model) {
      return;
    }

    // If the user does not configure the form item, a label input is automatically created
    if (!skipForm && (!Array.isArray(addControls) || !addControls.length)) {
      addControls = [
        {
          type: 'text',
          name: labelField || 'label',
          label: false,
          required: true,
          placeholder: __('Options.addPlaceholder')
        }
      ];
    }
    const parent = Array.isArray(idx)
      ? getTree(model.options, idx.slice(0, -1))
      : undefined;

    const ctx: any = createObject(
      data,
      Array.isArray(idx)
        ? {
            parent: parent,
            ...value
          }
        : value
    );

    let customAddPrevent = false;
    let result: any = skipForm
      ? ctx
      : await onOpenDialog(
          {
            type: 'dialog',
            title: createBtnLabel || `Add ${optionLabel || 'option'}`,
            ...addDialog,
            body: {
              type: 'form',
              api: addApi,
              controls: [
                {
                  type: 'hidden',
                  name: 'idx',
                  value: idx
                },
                {
                  type: 'hidden',
                  name: 'parent',
                  value: parent
                },
                ...(addControls || [])
              ],
              onSubmit: async (payload: any) => {
                const labelKey = labelField || 'label';
                const valueKey = valueField || 'value';
                // Send confirmation event
                customAddPrevent = await this.dispatchOptionEvent(
                  'addConfirm',
                  {
                    item: {
                      [labelKey]: payload[labelKey],
                      [valueKey]: payload[valueKey] ?? payload[labelKey]
                    }
                  }
                );

                return !customAddPrevent;
              }
            }
          },
          ctx
        );

    // Dispatching confirmation add event
    if (skipForm) {
      // Avoid breakchange, add new event name to correct previous design problems
      const prevent = await this.dispatchOptionEvent('addConfirm', {
        item: result
      });

      if (prevent) {
        return;
      }
    } else if (customAddPrevent) {
      return;
    }

    // Send a single request
    if (skipForm && addApi) {
      try {
        const payload = await env.fetcher(addApi!, result, {
          method: 'post'
        });

        if (!payload.ok) {
          !(addApi as BaseApiObject).silent &&
            env.notify(
              'error',
              (addApi as BaseApiObject)?.messages?.failed ??
                (payload.msg || __('Options.createFailed'))
            );
          result = null;
        } else {
          result = payload.data || result;
        }
      } catch (e) {
        result = null;
        console.error(e);
        !(addApi as BaseApiObject).silent && env.notify('error', e.message);
      }
    }

    // If there is a result, it means that the pop-up box has been confirmed. Otherwise, it is cancelled.
    if (!result) {
      return;
    }

    // The server did not go through.
    if (!result.hasOwnProperty(valueField || 'value')) {
      result = {
        ...result,
        [valueField || 'value']: result[labelField || 'label']
      };
    }
    // Trigger event notification
    // Deprecated, not recommended
    const isPrevented = await this.oldDispatchOptionEvent('add', {
      ...result,
      idx
    });

    if (isPrevented) {
      return;
    }

    const ret = await callback?.(result);

    if (ret === false) {
      // If the callback returns false, do not continue.
      return;
    } else if (
      // If it is lazy loaded, only lazy load the current node.
      (parent?.hasOwnProperty(deferField) && parent[deferField]) ||
      parent?.defer
    ) {
      await this.deferLoad(parent);
    } else if (source && addApi) {
      // If source and addApi are configured, just re-pull the interface
      // You cannot refresh without judging addApi, because some scenes are temporarily added.
      this.reload();
    } else {
      // Otherwise, change options directly on the front end
      let options = model.options.concat();
      if (Array.isArray(idx)) {
        options = spliceTree(options, idx, 0, {...result});
      } else {
        ~idx ? options.splice(idx, 0, {...result}) : options.push({...result});
      }
      model.setOptions(options, this.changeOptionValue, data);
    }
  }

  @autobind
  async handleOptionEdit(
    value: any,
    origin: any = value,
    skipForm: boolean = false,
    callback?: (value: any) => any
  ) {
    let {
      editControls,
      editDialog,
      disabled,
      labelField,
      valueField,
      onOpenDialog,
      editApi,
      editInitApi,
      env,
      source,
      data,
      formItem: model,
      optionLabel,
      translate: __
    } = this.props;

    if (disabled || !model) {
      return;
    }

    if (!skipForm && (!Array.isArray(editControls) || !editControls.length)) {
      editControls = [
        {
          type: 'text',
          name: labelField || 'label',
          label: false,
          placeholder: __('Options.addPlaceholder')
        }
      ];
    }

    let customEditPrevent = false;
    let result = skipForm
      ? value
      : await onOpenDialog(
          {
            type: 'dialog',
            title: __('Options.editLabel', {
              label: optionLabel || __('Options.label')
            }),
            ...editDialog,
            body: {
              type: 'form',
              initApi: editInitApi,
              api: editApi,
              controls: editControls,
              onSubmit: async (payload: any) => {
                const labelKey = labelField || 'label';
                const valueKey = valueField || 'value';
                // Avoid breakchange and add new event names to correct previous design problems
                customEditPrevent = await this.dispatchOptionEvent(
                  'editConfirm',
                  {
                    item: {
                      [labelKey]: payload[labelKey],
                      [valueKey]: payload[valueKey] ?? payload[labelKey]
                    }
                  }
                );

                return !customEditPrevent;
              }
            }
          },
          createObject(data, value)
        );

    if (skipForm) {
      // Avoid breakchange and add new event names to correct previous design problems
      const prevent = await this.dispatchOptionEvent('editConfirm', {
        item: result
      });

      if (prevent) {
        return;
      }
    } else if (customEditPrevent) {
      return;
    }

    // Send a single request
    if (skipForm && editApi) {
      try {
        const payload = await env.fetcher(
          editApi!,
          createObject(data, result),
          {
            method: 'post'
          }
        );

        if (!payload.ok) {
          !(editApi as BaseApiObject).silent &&
            env.notify(
              'error',
              (editApi as BaseApiObject)?.messages?.failed ??
                (payload.msg || __('saveFailed'))
            );
          result = null;
        } else {
          result = payload.data || result;
        }
      } catch (e) {
        result = null;
        console.error(e);
        !(editApi as BaseApiObject).silent && env.notify('error', e.message);
      }
    }

    // No result, indicating cancellation.
    if (!result) {
      return;
    }
    // Trigger event notification
    // Deprecated, not recommended
    const isPrevented = await this.oldDispatchOptionEvent('edit', result);

    if (isPrevented) {
      return;
    }

    const ret = await callback?.(result);

    if (ret === false) {
      // If the callback returns false, the process will not continue.
      return;
    } else if (source && editApi) {
      this.reload();
    } else {
      const indexes = findTreeIndex(model.options, item => item === origin);

      if (indexes) {
        model.setOptions(
          spliceTree(model.options, indexes, 1, {
            ...origin,
            ...result
          }),
          this.changeOptionValue,
          data
        );
      }
    }
  }

  @autobind
  async handleOptionDelete(value: any, callback?: (value: any) => any) {
    let {
      deleteConfirmText,
      disabled,
      data,
      deleteApi,
      onDelete,
      env,
      formItem: model,
      source,
      valueField,
      translate: __
    } = this.props;

    if (disabled || !model) {
      return;
    }

    const ctx = createObject(data, value);

    // If deleteConfirmText is configured, let the user confirm first.
    const confirmed = deleteConfirmText
      ? await env.confirm(filter(__(deleteConfirmText), ctx))
      : true;
    if (!confirmed) {
      return;
    }

    // Trigger event notification
    // Deprecated, not recommended
    const isPrevented = await this.oldDispatchOptionEvent('delete', ctx);
    if (isPrevented) {
      return;
    }

    // Avoid breakchange and add new event names to correct previous design problems
    const delConfirmPrevent = await this.dispatchOptionEvent('deleteConfirm', {
      item: value
    });
    if (delConfirmPrevent) {
      return;
    }

    // Delete via deleteApi.
    try {
      if (deleteApi) {
        const result = await env.fetcher(deleteApi!, ctx, {
          method: 'delete'
        });
        if (!result.ok) {
          !(deleteApi as BaseApiObject).silent &&
            env.notify(
              'error',
              (deleteApi as BaseApiObject)?.messages?.failed ??
                (result.msg || __('deleteFailed'))
            );
          return;
        }
      }

      // Deletion logic is implemented by external code
      if (onDelete) {
        onDelete(ctx);
      }

      const ret = callback?.(ctx);

      if (ret === false) {
        // If the callback returns false, do not continue.
        return;
      } else if (source) {
        this.reload();
      } else {
        const options = model.options.concat();
        const indexes = findTreeIndex(
          options,
          item => item[valueField || 'value'] == value[valueField || 'value']
        );

        if (indexes) {
          model.setOptions(
            spliceTree(options, indexes, 1),
            this.changeOptionValue,
            data
          );
        }
      }
    } catch (e) {
      console.error(e);
      !(deleteApi as BaseApiObject).silent && env.notify('error', e.message);
    }
  }

  render(): React.ReactNode {
    const {
      value,
      formItem,
      addApi,
      editApi,
      deleteApi,
      creatable,
      editable,
      removable,
      enableNodePath,
      pathSeparator,
      delimiter = ',',
      labelField = 'label',
      valueField = 'value',
      translate: __
    } = this.props;

    const {nodePathArray, nodeValueArray} = normalizeNodePath(
      value,
      enableNodePath,
      labelField,
      valueField,
      pathSeparator,
      delimiter
    );

    const Control = this.config.component;

    return (
      <Control
        {...this.props}
        placeholder={__(this.props.placeholder)}
        ref={this.inputRef}
        options={formItem ? formItem.filteredOptions : []}
        onToggle={this.handleToggle}
        onToggleAll={this.handleToggleAll}
        selectedOptions={
          formItem
            ? formItem.getSelectedOptions(
                value,
                enableNodePath ? nodeValueArray : undefined
              )
            : []
        }
        nodePath={nodePathArray}
        loading={formItem ? formItem.loading : false}
        setLoading={this.setLoading}
        setOptions={this.setOptions}
        syncOptions={this.syncOptions}
        reloadOptions={this.reload}
        deferLoad={this.deferLoad}
        leftDeferLoad={this.leftDeferLoad}
        expandTreeOptions={this.expandTreeOptions}
        creatable={
          creatable !== false && isEffectiveApi(addApi) ? true : creatable
        }
        editable={editable || (editable !== false && isEffectiveApi(editApi))}
        removable={
          removable || (removable !== false && isEffectiveApi(deleteApi))
        }
        onAdd={this.handleOptionAdd}
        onEdit={this.handleOptionEdit}
        onDelete={this.handleOptionDelete}
      />
    );
  }
}

export function registerOptionsControl(config: OptionsConfig) {
  const Control = config.component;

  class FormOptionsItem extends OptionsControlBase<OptionsProps> {
    static displayName = `OptionsControl(${config.type})`;
    static defaultProps = {
      delimiter: ',',
      labelField: 'label',
      valueField: 'value',
      joinValues: true,
      extractValue: false,
      multiple: false,
      placeholder: 'Select.placeholder',
      resetValue: '',
      deleteConfirmText: 'deleteConfirm',
      ...Control.defaultProps
    };
    static propsList: any = (Control as any).propsList
      ? [...(Control as any).propsList]
      : [];
    static ComposedComponent = Control;

    constructor(props: OptionsProps) {
      super(props, config);
    }
  }

  return registerFormItem({
    ...(config as FormItemBasicConfig),
    strictMode: false,
    component: FormOptionsItem
  });
}

export function OptionsControl(config: OptionsBasicConfig) {
  return function <T extends React.ComponentType<OptionsControlProps>>(
    component: T
  ): T {
    const renderer = registerOptionsControl({
      ...config,
      component: component
    });
    return renderer.component as any;
  };
}
