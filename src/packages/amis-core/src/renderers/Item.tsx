import React, {StrictMode} from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IFormItemStore, IFormStore} from '../store/form';
import {reaction} from 'mobx';
import {isAlive} from 'mobx-state-tree';
import {isGlobalVarExpression} from '../globalVar';
import {resolveVariableAndFilter} from '../utils/resolveVariableAndFilter';

import {
  renderersMap,
  RendererProps,
  registerRenderer,
  TestFunc,
  RendererConfig
} from '../factory';
import {
  anyChanged,
  ucFirst,
  getWidthRate,
  autobind,
  isMobile,
  createObject,
  getVariable
} from '../utils/helper';
import {observer} from 'mobx-react';
import {FormHorizontal, FormSchemaBase} from './Form';
import {
  ActionObject,
  BaseApiObject,
  BaseSchemaWithoutType,
  ClassName,
  DataChangeReason,
  Schema
} from '../types';
import {HocStoreFactory} from '../WithStore';
import {wrapControl} from './wrapControl';
import debounce from 'lodash/debounce';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {findDOMNode} from 'react-dom';
import {
  createObjectFromChain,
  dataMapping,
  deleteVariable,
  getTreeAncestors,
  isEmpty,
  keyToPath,
  setThemeClassName,
  setVariable
} from '../utils';
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';
import CustomStyle from '../components/CustomStyle';
import classNames from 'classnames';
import isPlainObject from 'lodash/isPlainObject';
import {IScopedContext} from '../Scoped';

export type LabelAlign = 'right' | 'left' | 'top' | 'inherit';

export interface FormBaseControl extends BaseSchemaWithoutType {
  /**
   * Form item size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * Description title
   */
  label?: string | false;

  /**
   * Description title
   */
  labelAlign?: LabelAlign;

  /**
   * Custom label width, default unit is px
   */
  labelWidth?: number | string;

  /**
   * Configure label className
   */
  labelClassName?: string;

  /**
   * Field name, key when submitting a form, supports multiple levels, connected with., such as: a.b.c
   */
  name?: string;

  /**
   * Additional field name, when it is a range component, it can be used to flatten another value
   */
  extraName?: string;

  /**
   * Display a small icon, and display the prompt content when the mouse is placed on it
   */
  remark?: any;

  /**
   * Display a small icon. When the mouse is placed on it, the prompt content is displayed. This small icon is together with the label.
   */
  labelRemark?: any;

  /**
   * Input hint, displayed when focused
   */
  hint?: string;

  /**
   * Whether to submit the form when the modification is completed.
   */
  submitOnChange?: boolean;

  /**
   * Is it read-only?
   */
  readOnly?: boolean;

  /**
   * Read-only condition
   */
  readOnlyOn?: string;

  /**
   * If not set, each modification of the form item after the form is submitted will trigger revalidation.
   * If set, this configuration item determines whether to trigger validation for each modification.
   */
  validateOnChange?: boolean;

  /**
   * Describe the content, support Html fragments.
   */
  description?: string;

  /**
   * @deprecated Use description instead
   */
  desc?: string;

  /**
   * ClassName in configuration description
   */
  descriptionClassName?: ClassName;

  /**
   * Configure the current form item display mode
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * When configured as a horizontal layout, it is used to configure the specific left and right distribution.
   */
  horizontal?: FormHorizontal;

  /**
   * Whether the form control is inline mode.
   */
  inline?: boolean;

  /**
   * Configure input className
   */
  inputClassName?: ClassName;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Is it required?
   */
  required?: boolean;

  /**
   * Prompt message for validation failure
   */
  validationErrors?: {
    isAlpha?: string;
    isAlphanumeric?: string;
    isEmail?: string;
    isFloat?: string;
    isInt?: string;
    isJson?: string;
    isLength?: string;
    isNumeric?: string;
    isRequired?: string;
    isUrl?: string;
    matchRegexp?: string;
    matchRegexp2?: string;
    matchRegexp3?: string;
    matchRegexp4?: string;
    matchRegexp5?: string;
    maxLength?: string;
    maximum?: string;
    minLength?: string;
    minimum?: string;
    isDateTimeSame?: string;
    isDateTimeBefore?: string;
    isDateTimeAfter?: string;
    isDateTimeSameOrBefore?: string;
    isDateTimeSameOrAfter?: string;
    isDateTimeBetween?: string;
    isTimeSame?: string;
    isTimeBefore?: string;
    isTimeAfter?: string;
    isTimeSameOrBefore?: string;
    isTimeSameOrAfter?: string;
    isTimeBetween?: string;
    [propName: string]: any;
  };

  validations?:
    | string
    | {
        /**
         * Is it a letter? */
        isAlpha?: boolean;

        /**
         * Is it an alphanumeric? */
        isAlphanumeric?: boolean;

        /**
         * Is it an email address? */
        isEmail?: boolean;

        /**
         * Is it a floating point? */
        isFloat?: boolean;

        /**
         * Is it an integer? */
        isInt?: boolean;

        /**
         * Is it json? */
        isJson?: boolean;

        /**
         * Is the length equal to the specified value? */
        isLength?: number;

        /**
         * Is it a number? */
        isNumeric?: boolean;

        /**
         * Is it required? */
        isRequired?: boolean;

        /**
         * Is it a URL? */
        isUrl?: boolean;

        /**
         * Content hits the specified regular expression
         */
        matchRegexp?: string;
        /**
         * Content hits the specified regular expression
         */
        matchRegexp1?: string;
        /**
         * Content hits the specified regular expression
         */
        matchRegexp2?: string;
        /**
         * Content hits the specified regular expression
         */
        matchRegexp3?: string;
        /**
         * Content hits the specified regular expression
         */
        matchRegexp4?: string;
        /**
         * Content hits the specified regular expression
         */
        matchRegexp5?: string;

        /**
         * Maximum length is the specified value
         */
        maxLength?: number;

        /**
         * Maximum value is the specified value
         */
        maximum?: number;

        /**
         * Minimum length is the specified value
         */
        minLength?: number;

        /**
         * The minimum value is the specified value
         */
        minimum?: number;

        /**
         * Same as the target date, supports the specified granularity, defaults to milliseconds
         * @version 2.2.0
         */
        isDateTimeSame?: string | string[];

        /**
         * Earlier than the target date, supports the specified granularity, defaults to milliseconds
         * @version 2.2.0
         */
        isDateTimeBefore?: string | string[];

        /**
         * Later than the target date, supports the specified granularity, defaults to milliseconds
         * @version 2.2.0
         */
        isDateTimeAfter?: string | string[];

        /**
         * Earlier than the target date or the same as the target date, supports the specified granularity, defaults to milliseconds
         * @version 2.2.0
         */
        isDateTimeSameOrBefore?: string | string[];

        /**
         * Later than the target date or the same as the target date, supports the specified granularity, defaults to milliseconds
         * @version 2.2.0
         */
        isDateTimeSameOrAfter?: string | string[];

        /**
         * The date is within the target date range, supports the specified granularity and the opening and closing form of the interval, the default is milliseconds, and the left and right open intervals
         * @version 2.2.0
         */
        isDateTimeBetween?: string | string[];

        /**
         * The same as the target time, supports the specified granularity, the default is milliseconds
         * @version 2.2.0
         */
        isTimeSame?: string | string[];

        /**
         * Earlier than the target time, supports the specified granularity, the default is milliseconds
         * @version 2.2.0
         */
        isTimeBefore?: string | string[];

        /**
         * Later than the target time, supports the specified granularity, the default is milliseconds
         * @version 2.2.0
         */
        isTimeAfter?: string | string[];

        /**
         * Earlier than the target time or the same as the target time, supports the specified granularity, default to milliseconds
         * @version 2.2.0
         */
        isTimeSameOrBefore?: string | string[];

        /**
         * Later than the target time or the same as the target time, supports the specified granularity, default to milliseconds
         * @version 2.2.0
         */
        isTimeSameOrAfter?: string | string[];

        /**
         * The time is within the target time range, supports the specified granularity and the opening and closing form of the interval, default to milliseconds, left and right open intervals
         * @version 2.2.0
         */
        isTimeBetween?: string | string[];

        [propName: string]: any;
      };

  /**
   * Default value, remember that it can only be a static value, and does not support variable access. The association with data is achieved by setting the name attribute.
   */
  value?: any;

  /**
   * When the form item is hidden, whether to delete the form item value in the current Form. Note that the non-hidden form item value with the same name will also be deleted
   */
  clearValueOnHidden?: boolean;

  /**
   * Remote validation form item interface
   */
  validateApi?: string | BaseApiObject;

  /**
   * Auto-fill, when the option is selected, set the other values ​​in the option to the form synchronously.
   *
   */
  autoFill?:
    | {
        [propName: string]: string;
      }
    | {
        /**
         * Whether it is the reference input mode. Reference input will display candidate values ​​for users to choose from instead of directly filling in.
         */
        showSuggestion?: boolean;

        /**
         * The default selected value when entering a reference
         */
        defaultSelection?: any;

        /**
         * Auto-fill api
         */
        api?: BaseApiObject | string;

        /**
         * Whether to display the data format error prompt, the default is not to display
         * @default true
         */
        silent?: boolean;

        /**
         * Data mapping when filling
         */
        fillMappinng?: {
          [propName: string]: any;
        };

        /**
         * Trigger condition, the default is change
         */
        trigger?: 'change' | 'focus' | 'blur';

        /**
         * Pop-up mode, can be configured when entering a reference
         */
        mode?: 'popOver' | 'dialog' | 'drawer';

        /**
         * When the reference entry is a drawer, the pop-up position can be configured
         */
        position?: string;

        /**
         * When entering a reference, you can configure the size of the pop-up container
         */
        size?: string;

        /**
         * Items displayed for reference entry
         */
        columns?: Array<any>;

        /**
         * Filter conditions for reference entry
         */
        filter?: any;
      };

  /**
   * @default fillIfNotSet
   * Whether to synchronize other fields to the form during initialization.
   */
  initAutoFill?: boolean | 'fillIfNotSet';

  row?: number; // Specify the row number in flex mode
}

export interface FormItemBasicConfig extends Partial<RendererConfig> {
  type?: string;
  wrap?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  test?: RegExp | TestFunc;
  storeType?: string;
  formItemStoreType?: string;
  validations?: string;
  strictMode?: boolean;

  /**
   * Is it thin?
   */
  thin?: boolean;
  /**
   * Whitelist of properties for which schema changes cause view updates
   */
  detectProps?: Array<string>;
  shouldComponentUpdate?: (props: any, prevProps: any) => boolean;
  descriptionClassName?: string;
  storeExtendsData?: boolean;
  sizeMutable?: boolean;
  weight?: number;
  extendsData?: boolean;
  showErrorMsg?: boolean;

  // Compatible with old usage, new usage can be defined directly in Component validate method.
  validate?: (values: any, value: any) => string | boolean;
}

// Receive the attributes yourself.
export interface FormItemProps extends RendererProps {
  name?: string;
  formStore?: IFormStore;
  formItem?: IFormItemStore;
  formInited: boolean;
  formMode: 'normal' | 'horizontal' | 'inline' | 'row' | 'default';
  formHorizontal: FormHorizontal;
  formLabelAlign: LabelAlign;
  formLabelWidth?: number | string;
  defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  labelAlign?: LabelAlign;
  labelWidth?: number | string;
  disabled?: boolean;
  btnDisabled: boolean;
  defaultValue: any;
  value?: any;
  prinstine: any;
  setPrinstineValue: (value: any) => void;
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onBulkChange?: (
    values: {[propName: string]: any},
    submitOnChange?: boolean,
    changeReason?: DataChangeReason
  ) => void;
  addHook: (
    fn: Function,
    mode?: 'validate' | 'init' | 'flush',
    enforce?: 'prev' | 'post'
  ) => () => void;
  removeHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => void;
  renderFormItems: (
    schema: Partial<FormSchemaBase>,
    region: string,
    props: any
  ) => JSX.Element;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;

  formItemValue: any; // Not recommended for compatibility with v1
  getValue: () => any; // Not recommended for compatibility with v1
  setValue: (value: any, key: string) => void; // Not recommended for compatibility with v1

  inputClassName?: string;
  renderControl?: (props: FormControlProps) => JSX.Element;

  inputOnly?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  sizeMutable?: boolean;
  wrap?: boolean;
  hint?: string;
  description?: string;
  descriptionClassName?: string;
  // error details
  errors?: {
    [propName: string]: string;
  };
  // error string
  error?: string;
  showErrorMsg?: boolean;
}

// The attributes sent down
export type FormControlProps = RendererProps & {
  onOpenDialog: (schema: Schema, data: any) => Promise<any>;
} & Exclude<
    FormItemProps,
    | 'inputClassName'
    | 'renderControl'
    | 'defaultSize'
    | 'size'
    | 'error'
    | 'errors'
    | 'hint'
    | 'descriptionClassName'
    | 'inputOnly'
    | 'renderLabel'
    | 'renderDescription'
    | 'sizeMutable'
    | 'wrap'
  >;

export type FormItemComponent = React.ComponentType<FormItemProps>;
export type FormControlComponent = React.ComponentType<FormControlProps>;

export interface FormItemConfig extends FormItemBasicConfig {
  component: FormControlComponent;
}

const getItemLabelClassName = (props: FormItemProps) => {
  const {staticLabelClassName, labelClassName, id, themeCss} = props;
  return props.static && staticLabelClassName
    ? staticLabelClassName
    : classNames(
        labelClassName,
        setThemeClassName({
          ...props,
          name: 'labelClassName',
          id,
          themeCss,
          extra: 'item'
        })
      );
};

const getItemInputClassName = (props: FormItemProps) => {
  const {staticInputClassName, inputClassName} = props;
  return props.static && staticInputClassName
    ? staticInputClassName
    : inputClassName;
};

export class FormItemWrap extends React.Component<FormItemProps> {
  lastSearchTerm: any;
  target: HTMLElement;
  mounted = false;
  initedOptionFilled = false;
  initedApiFilled = false;
  toDispose: Array<() => void> = [];

  constructor(props: FormItemProps) {
    super(props);

    const {formItem: model, formInited, addHook, initAutoFill} = props;
    if (!model) {
      return;
    }

    this.toDispose.push(
      reaction(
        () =>
          `${model.errors.join('')}${model.isFocused}${
            model.dialogOpen
          }${JSON.stringify(model.filteredOptions)}${model.popOverOpen}`,
        () => this.forceUpdate()
      )
    );

    let onInit = () => {
      this.initedOptionFilled = true;
      initAutoFill !== false &&
        isAlive(model) &&
        this.syncOptionAutoFill(
          model.getSelectedOptions(model.tmpValue),
          initAutoFill === 'fillIfNotSet'
        );
      this.initedApiFilled = true;
      initAutoFill !== false &&
        isAlive(model) &&
        this.syncApiAutoFill(
          model.tmpValue ?? '',
          false,
          initAutoFill === 'fillIfNotSet'
        );

      this.toDispose.push(
        reaction(
          () => JSON.stringify(model.tmpValue),
          () =>
            this.mounted &&
            this.initedApiFilled &&
            this.syncApiAutoFill(model.tmpValue)
        )
      );

      this.toDispose.push(
        reaction(
          () => JSON.stringify(model.getSelectedOptions(model.tmpValue)),
          () =>
            this.mounted &&
            this.initedOptionFilled &&
            this.syncOptionAutoFill(model.getSelectedOptions(model.tmpValue))
        )
      );
    };
    this.toDispose.push(
      formInited || !addHook
        ? model.addInitHook(onInit, 999)
        : addHook(onInit, 'init', 'post')
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.target = findDOMNode(this) as HTMLElement;
  }

  componentDidUpdate(prevProps: FormItemProps) {
    const props = this.props;
    const {formItem: model} = props;

    if (
      isEffectiveApi(props.autoFill?.api, props.data) &&
      isApiOutdated(
        prevProps.autoFill?.api,
        props.autoFill?.api,
        prevProps.data,
        props.data
      )
    ) {
      this.syncApiAutoFill(model?.tmpValue, true);
    }
  }

  componentWillUnmount() {
    this.syncApiAutoFill.cancel();
    this.mounted = false;
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  @autobind
  handleFocus(e: any) {
    const {formItem: model, autoFill} = this.props;
    model && model.focus();
    this.props.onFocus && this.props.onFocus(e);

    if (
      !autoFill ||
      (autoFill && !autoFill?.hasOwnProperty('showSuggestion'))
    ) {
      return;
    }
    this.handleAutoFill('focus');
  }

  @autobind
  handleBlur(e: any) {
    const {formItem: model, autoFill} = this.props;
    model && model.blur();
    this.props.onBlur && this.props.onBlur(e);

    if (
      !autoFill ||
      (autoFill && !autoFill?.hasOwnProperty('showSuggestion'))
    ) {
      return;
    }
    this.handleAutoFill('blur');
  }

  handleAutoFill(type: string) {
    const {autoFill, formItem, data} = this.props;
    const {trigger, mode} = autoFill;
    if (trigger === type && mode === 'popOver') {
      // Refer to the popOver format for input
      formItem?.openPopOver(
        this.buildAutoFillSchema(),
        data,
        (confirmed, result) => {
          if (!confirmed || !result?.selectedItems) {
            return;
          }

          this.updateAutoFillData(result.selectedItems);
        }
      );
    } else if (
      // Reference entry dialog | drawer
      trigger === type &&
      (mode === 'dialog' || mode === 'drawer')
    ) {
      formItem?.openDialog(
        this.buildAutoFillSchema(),
        data,
        (confirmed, result) => {
          if (!confirmed || !result?.selectedItems) {
            return;
          }

          this.updateAutoFillData(result.selectedItems);
        }
      );
    }
  }

  updateAutoFillData(context: any) {
    const {data, autoFill, onBulkChange} = this.props;
    const {fillMapping, multiple} = autoFill;
    //form original data
    const contextData = Array.isArray(context)
      ? createObject(data, {
          items: context
        })
      : createObjectFromChain([
          data,
          {
            items: [context]
          },
          context
        ]);

    this.applyMapping(fillMapping ?? {}, contextData, false);
  }

  syncApiAutoFill = debounce(
    async (term: any, forceLoad?: boolean, skipIfExits = false) => {
      try {
        const {autoFill, onBulkChange, formItem, data} = this.props;

        // Reference entry
        if (
          !onBulkChange ||
          !formItem ||
          !autoFill ||
          (autoFill && !autoFill?.hasOwnProperty('api'))
        ) {
          return;
        } else if (
          skipIfExits &&
          (!autoFill.fillMapping ||
            Object.keys(autoFill.fillMapping).some(
              key => typeof getVariable(data, key) !== 'undefined'
            ))
        ) {
          // As long as there is a value for the target fill value, it will not be automatically filled initially
          return;
        }

        if (autoFill?.showSuggestion) {
          this.handleAutoFill('change');
        } else {
          // Autofill
          const itemName = formItem.name;
          const ctx = createObject(data, {
            __term: term
          });
          setVariable(ctx, itemName, term);

          if (
            forceLoad ||
            (isEffectiveApi(autoFill.api, ctx) && this.lastSearchTerm !== term)
          ) {
            let result = await formItem.loadAutoUpdateData(
              autoFill.api,
              ctx,
              !!(autoFill.api as BaseApiObject)?.silent
            );

            this.lastSearchTerm =
              (result && getVariable(result, itemName)) ?? term;

            // If no return should not be processed
            if (!result) {
              return;
            }

            this.applyMapping(
              autoFill?.fillMapping ?? {'&': '$$'},
              result,
              false
            );
          }
        }
      } catch (e) {
        console.error(e);
      }
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  syncOptionAutoFill(selectedOptions: Array<any>, skipIfExits = false) {
    const {autoFill, multiple, onBulkChange, data} = this.props;
    const formItem = this.props.formItem as IFormItemStore;
    // Reference entry｜Autofill
    if (autoFill?.hasOwnProperty('api')) {
      return;
    }

    if (
      onBulkChange &&
      autoFill &&
      !isEmpty(autoFill) &&
      formItem.filteredOptions.length
    ) {
      this.applyMapping(
        autoFill,
        multiple
          ? {
              items: selectedOptions.map(item =>
                createObject(
                  {
                    ...data,
                    ancestors: getTreeAncestors(
                      formItem.filteredOptions,
                      item,
                      true
                    )
                  },
                  item
                )
              )
            }
          : createObject(
              {
                ...data,
                ancestors: getTreeAncestors(
                  formItem.filteredOptions,
                  selectedOptions[0],
                  true
                )
              },
              selectedOptions[0]
            ),
        skipIfExits
      );
    }
  }

  /**
   * Apply the mapping function to update the data object according to the given mapping relationship
   *
   * @param mapping mapping relationship, type is any type
   * @param ctx context object, type is any type
   * @param skipIfExits whether to skip existing attributes, default is false
   */
  applyMapping(mapping: any, ctx: any, skipIfExits = false) {
    const {onBulkChange, data, formItem} = this.props;
    const toSync = dataMapping(mapping, ctx);

    const tmpData = {...data};
    const result = {...toSync};

    Object.keys(mapping).forEach(key => {
      if (key === '&') {
        return;
      }

      const keys = keyToPath(key);
      let value = getVariable(toSync, key);

      if (skipIfExits) {
        const originValue = getVariable(data, key);
        if (typeof originValue !== 'undefined') {
          value = originValue;
        }
      }

      setVariable(result, key, value);

      // If the key on the left is a path
      // Here we don't want to overwrite the original object
      // Instead, we want to keep the original object and only modify the specified properties
      if (keys.length > 1 && isPlainObject(tmpData[keys[0]])) {
        // Existing situation: update multiple keys of the same subpath in sequence, eg: a.b.c1 and a.b.c2, so we need to update data synchronously
        setVariable(tmpData, key, value);
        result[keys[0]] = tmpData[keys[0]];
      }
    });

    // Whether to ignore your own settings
    // if (ignoreSelf && formItem?.name) {
    // deleteVariable(result, formItem.name);
    // }

    onBulkChange!(result);
  }

  buildAutoFillSchema() {
    const {formItem, autoFill, translate: __} = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }
    const {
      api,
      mode,
      size,
      offset,
      position,
      placement,
      multiple,
      filter,
      columns,
      labelField,
      popOverContainer,
      popOverClassName,
      valueField,
      defaultSelection
    } = autoFill;
    const form = {
      type: 'form',
      // debug: true,
      title: '',
      className: 'suggestion-form',
      body: [
        {
          type: 'picker',
          embed: true,
          joinValues: false,
          strictMode: false,
          label: false,
          labelField,
          valueField: valueField || 'value',
          multiple,
          name: 'selectedItems',
          value: defaultSelection || [],
          options: [],
          required: true,
          source: api,
          pickerSchema: {
            type: 'crud',
            bodyClassName: 'mb-0',
            affixHeader: false,
            alwaysShowPagination: true,
            keepItemSelectionOnPageChange: true,
            headerToolbar: [],
            footerToolbar: [
              {
                type: 'pagination',
                align: 'left'
              },
              {
                type: 'bulkActions',
                align: 'right',
                className: 'ml-2'
              }
            ],
            multiple,
            filter,
            columns: columns || []
          }
        }
      ],
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: __('cancel')
        },
        {
          type: 'submit',
          actionType: 'submit',
          level: 'primary',
          label: __('confirm')
        }
      ]
    };

    if (mode === 'popOver') {
      return {
        popOverContainer,
        popOverClassName,
        placement: placement ?? position,
        offset,
        body: form
      };
    } else {
      return {
        type: mode,
        className: 'auto-fill-dialog',
        title: __('FormItem.autoFillSuggest'),
        size,
        body: {
          ...form,
          wrapWithPanel: false
        },
        actions: [
          {
            type: 'button',
            actionType: 'cancel',
            label: __('cancel')
          },
          {
            type: 'submit',
            actionType: 'submit',
            level: 'primary',
            label: __('confirm')
          }
        ]
      };
    }
  }

  // Refer to input popOver submission
  @autobind
  handlePopOverConfirm(values: any) {
    const {onBulkChange, autoFill} = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }

    this.updateAutoFillData(values.selectedItems);
    this.closePopOver();
  }

  @autobind
  handlePopOverAction(
    e: React.UIEvent<any>,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onAction} = this.props;
    if (action.actionType === 'cancel') {
      this.closePopOver();
    } else if (onAction) {
      // Unrecognized ones are thrown to the upper layer for processing.
      return onAction(e, action, data, throwErrors, delegate);
    }
  }

  @autobind
  closePopOver() {
    this.props.formItem?.closePopOver();
  }

  @autobind
  async handleOpenDialog(schema: Schema, data: any) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    return new Promise(resolve =>
      model.openDialog(schema, data, (confirmed: any, value: any) =>
        resolve(confirmed ? value : false)
      )
    );
  }

  @autobind
  handleDialogConfirm([values]: Array<any>) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    model.closeDialog(true, values);
  }

  @autobind
  handleDialogClose(confirmed = false) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }
    model.closeDialog(confirmed);
  }

  renderControl(): JSX.Element | null {
    const {
      // Deconstructed here, cannot be easily deleted to avoid being passed to child components by rest
      inputClassName,
      formItem: model,
      classnames: cx,
      children,
      type,
      renderControl,
      formItemConfig,
      sizeMutable,
      size,
      defaultSize,
      mobileUI,
      ...rest
    } = this.props;

    if (renderControl) {
      const controlSize = size || defaultSize;
      return renderControl({
        ...rest,
        onOpenDialog: this.handleOpenDialog,
        type,
        classnames: cx,
        formItem: model,
        className: cx(
          `Form-control`,
          {
            'is-inline': !!rest.inline && !mobileUI,
            'is-error': model && !model.valid,
            'is-full': size === 'full',
            [`Form-control--withSize Form-control--size${ucFirst(
              controlSize
            )}`]:
              sizeMutable !== false &&
              typeof controlSize === 'string' &&
              !!controlSize &&
              controlSize !== 'full'
          },
          model?.errClassNames,
          setThemeClassName({
            ...this.props,
            name: 'wrapperCustomStyle',
            id: rest.id,
            themeCss: rest.wrapperCustomStyle,
            extra: 'item'
          }),
          getItemInputClassName(this.props)
        )
      });
    }

    return null;
  }

  /**
   * Layout extension point, you can expand the layout of form items yourself
   */
  static layoutRenderers: {
    [propsName: string]: (
      props: FormItemProps,
      renderControl: () => JSX.Element | null
    ) => JSX.Element;
  } = {
    horizontal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        description,
        descriptionClassName,
        captionClassName,
        desc,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        id,
        wrapperCustomStyle,
        themeCss
      } = props;

      // If you force not to render the label
      if (renderLabel === false) {
        label = label === false ? false : '';
      }

      description = description || desc;
      const horizontal = props.horizontal || props.formHorizontal || {};
      const left = getWidthRate(horizontal.left);
      const right = getWidthRate(horizontal.right);
      const labelAlign =
        (props.labelAlign !== 'inherit' && props.labelAlign) ||
        props.formLabelAlign;
      const labelWidth = props.labelWidth || props.formLabelWidth;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--horizontal`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'Form-item--horizontal-justify': horizontal.justify,
              [`is-error`]: model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label !== false ? (
            <label
              className={cx(
                `Form-label`,
                {
                  [`Form-itemColumn--${
                    typeof horizontal.leftFixed === 'string'
                      ? horizontal.leftFixed
                      : 'normal'
                  }`]: horizontal.leftFixed,
                  [`Form-itemColumn--${left}`]: !horizontal.leftFixed,
                  'Form-label--left': labelAlign === 'left',
                  'Form-label-noLabel': label === ''
                },
                getItemLabelClassName(props)
              )}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label ? render('label', label) : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      mobileUI,
                      className: cx(`Form-labelRemark`),
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div
            className={cx(`Form-value`, {
              // [`Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
              [`Form-itemColumn--${right}`]:
                !horizontal.leftFixed && !!right && right !== 12 - left
            })}
          >
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  tooltip: remark,
                  className: cx(`Form-remark`),
                  mobileUI,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(
                    `Form-description`,
                    descriptionClassName,
                    setThemeClassName({
                      ...props,
                      name: 'descriptionClassName',
                      id,
                      themeCss,
                      extra: 'item'
                    })
                  )
                })
              : null}
          </div>
        </div>
      );
    },

    normal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        themeCss,
        wrapperCustomStyle,
        id
      } = props;

      description = description || desc;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--normal`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label && renderLabel !== false ? (
            <label className={cx(`Form-label`, getItemLabelClassName(props))}>
              <span>
                {label ? render('label', label) : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      mobileUI,
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          {mobileUI ? (
            <div className={cx('Form-item-controlBox')}>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    mobileUI,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}

              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx(`Form-feedback`)}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}

              {renderDescription !== false && description
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </div>
          ) : (
            <>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    mobileUI,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}

              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx(`Form-feedback`)}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}
              {renderDescription !== false && description
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </>
          )}
        </div>
      );
    },

    inline: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        descriptionClassName,
        captionClassName,
        formItem: model,
        remark,
        labelRemark,
        env,
        hint,
        renderLabel,
        renderDescription,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        themeCss,
        wrapperCustomStyle,
        id
      } = props;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;

      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--inline`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          {label && renderLabel !== false ? (
            <label
              className={cx(`Form-label`, getItemLabelClassName(props))}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label ? render('label', label) : label}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      mobileUI,
                      container: props.popOverContainer || env.getModalContainer
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div className={cx(`Form-value`)}>
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  mobileUI,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(
                    `Form-description`,
                    descriptionClassName,
                    setThemeClassName({
                      ...props,
                      name: 'descriptionClassName',
                      id,
                      themeCss,
                      extra: 'item'
                    })
                  )
                })
              : null}
          </div>
        </div>
      );
    },

    row: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        wrapperCustomStyle,
        themeCss,
        id
      } = props;
      description = description || desc;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--row`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          <div className={cx('Form-rowInner')}>
            {label && renderLabel !== false ? (
              <label
                className={cx(`Form-label`, getItemLabelClassName(props))}
                style={labelWidth != null ? {width: labelWidth} : undefined}
              >
                <span>
                  {render('label', label)}
                  {required && (label || labelRemark) ? (
                    <span className={cx(`Form-star`)}>*</span>
                  ) : null}
                  {labelRemark
                    ? render('label-remark', {
                        type: 'remark',
                        icon: labelRemark.icon || 'warning-mark',
                        tooltip: labelRemark,
                        className: cx(`Form-lableRemark`),
                        mobileUI,
                        container:
                          props.popOverContainer || env.getModalContainer
                      })
                    : null}
                </span>
              </label>
            ) : null}

            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  container: props.popOverContainer || env.getModalContainer
                })
              : null}
          </div>

          {hint && model && model.isFocused
            ? render('hint', hint, {
                className: cx(`Form-hint`)
              })
            : null}

          {model &&
          !model.valid &&
          showErrorMsg !== false &&
          Array.isArray(model.errors) ? (
            <ul className={cx('Form-feedback')}>
              {model.errors.map((msg: string, key: number) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          ) : null}

          {description && renderDescription !== false
            ? render('description', description, {
                className: cx(
                  `Form-description`,
                  descriptionClassName,
                  setThemeClassName({
                    ...props,
                    name: 'descriptionClassName',
                    id,
                    themeCss,
                    extra: 'item'
                  })
                )
              })
            : null}
        </div>
      );
    },

    flex: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        style,
        classnames: cx,
        desc,
        description,
        label,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        mobileUI,
        translate: __,
        static: isStatic,
        staticClassName,
        wrapperCustomStyle,
        themeCss,
        id
      } = props;

      let labelAlign =
        (props.labelAlign !== 'inherit' && props.labelAlign) ||
        props.formLabelAlign;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;
      return (
        <div
          data-role="form-item"
          data-amis-name={props.name}
          className={cx(
            `Form-item Form-item--flex`,
            isStatic && staticClassName ? staticClassName : className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames,
            setThemeClassName({
              ...props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle,
              extra: 'item'
            })
          )}
          style={style}
        >
          <div
            className={cx(
              'Form-flexInner',
              labelAlign && `Form-flexInner--label-${labelAlign}`
            )}
          >
            {label && renderLabel !== false ? (
              <label
                className={cx(`Form-label`, getItemLabelClassName(props))}
                style={
                  labelWidth != null
                    ? {width: labelAlign === 'top' ? '100%' : labelWidth}
                    : undefined
                }
              >
                <span>
                  {render('label', label)}
                  {required && (label || labelRemark) ? (
                    <span className={cx(`Form-star`)}>*</span>
                  ) : null}
                  {labelRemark
                    ? render('label-remark', {
                        type: 'remark',
                        icon: labelRemark.icon || 'warning-mark',
                        tooltip: labelRemark,
                        className: cx(`Form-lableRemark`),
                        mobileUI,
                        container:
                          props.popOverContainer || env.getModalContainer
                      })
                    : null}
                </span>
              </label>
            ) : null}

            <div className={cx(`Form-value`)}>
              {renderControl()}

              {caption
                ? render('caption', caption, {
                    className: cx(`Form-caption`, captionClassName)
                  })
                : null}

              {remark
                ? render('remark', {
                    type: 'remark',
                    icon: remark.icon || 'warning-mark',
                    className: cx(`Form-remark`),
                    tooltip: remark,
                    container: props.popOverContainer || env.getModalContainer
                  })
                : null}
              {hint && model && model.isFocused
                ? render('hint', hint, {
                    className: cx(`Form-hint`)
                  })
                : null}

              {model &&
              !model.valid &&
              showErrorMsg !== false &&
              Array.isArray(model.errors) ? (
                <ul className={cx('Form-feedback')}>
                  {model.errors.map((msg: string, key: number) => (
                    <li key={key}>{msg}</li>
                  ))}
                </ul>
              ) : null}

              {description && renderDescription !== false
                ? render('description', description, {
                    className: cx(
                      `Form-description`,
                      descriptionClassName,
                      setThemeClassName({
                        ...props,
                        name: 'descriptionClassName',
                        id,
                        themeCss,
                        extra: 'item'
                      })
                    )
                  })
                : null}
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      formMode,
      inputOnly,
      wrap,
      render,
      formItem: model,
      css,
      themeCss,
      id,
      wrapperCustomStyle,
      env,
      classnames: cx,
      popOverContainer,
      data
    } = this.props;
    const mode = this.props.mode || formMode;

    if (wrap === false || inputOnly) {
      return this.renderControl();
    }

    const renderLayout =
      FormItemWrap.layoutRenderers[mode] ||
      FormItemWrap.layoutRenderers['normal'];

    return (
      <>
        {renderLayout(this.props, this.renderControl.bind(this))}

        {model
          ? render(
              'modal',
              {
                type: 'dialog',
                ...model.dialogSchema
              },
              {
                show: model.dialogOpen,
                onClose: this.handleDialogClose,
                onConfirm: this.handleDialogConfirm,
                data: model.dialogData,
                formStore: undefined
              }
            )
          : null}

        {model ? (
          <Overlay
            container={popOverContainer || this.target}
            target={() => this.target}
            placement={model.popOverSchema?.placement || 'left-bottom-left-top'}
            show={model.popOverOpen}
          >
            <PopOver
              className={cx(
                `Autofill-popOver`,
                model.popOverSchema?.popOverClassName
              )}
              style={{
                minWidth: this.target ? this.target.offsetWidth : undefined
              }}
              offset={model.popOverSchema?.offset}
              onHide={this.closePopOver}
            >
              {render('popOver-auto-fill-form', model.popOverSchema?.body, {
                // data: model.popOverData,
                onAction: this.handlePopOverAction,
                onSubmit: this.handlePopOverConfirm
              })}
            </PopOver>
          </Overlay>
        ) : null}
        <CustomStyle
          {...this.props}
          config={{
            themeCss: themeCss || css,
            classNames: [
              {
                key: 'labelClassName',
                weights: {
                  default: {
                    suf: `.${cx('Form-label')}`,
                    parent: `.${cx('Form-item')}`
                  }
                }
              },
              {
                key: 'descriptionClassName'
              }
            ],
            wrapperCustomStyle,
            id: id && id + '-item'
          }}
          env={env}
        />
      </>
    );
  }
}

// Whitelist format, only when these properties change will they be updated.
// Unless strictMode is configured
export const detectProps = [
  'formPristine', // This must not be done.
  'formInited',
  'addable',
  'addButtonClassName',
  'addButtonText',
  'addOn',
  'btnClassName',
  'btnLabel',
  'style',
  'btnDisabled',
  'className',
  'clearable',
  'columns',
  'columnsCount',
  'controls',
  'desc',
  'description',
  'disabled',
  'static',
  'staticClassName',
  'staticLabelClassName',
  'staticInputClassName',
  'draggable',
  'editable',
  'editButtonClassName',
  'formHorizontal',
  'formMode',
  'hideRoot',
  'horizontal',
  'icon',
  'inline',
  'inputClassName',
  'label',
  'labelClassName',
  'labelField',
  'language',
  'level',
  'max',
  'maxRows',
  'min',
  'minRows',
  'multiLine',
  'multiple',
  'option',
  'placeholder',
  'removable',
  'required',
  'remark',
  'hint',
  'rows',
  'searchable',
  'showCompressOptions',
  'size',
  'step',
  'showInput',
  'unit',
  'value',
  'diffValue',
  'borderMode',
  'items',
  'showCounter',
  'minLength',
  'maxLength',
  'embed',
  'displayMode',
  'revealPassword',
  'loading',
  'themeCss',
  'formLabelAlign',
  'formLabelWidth',
  'formHorizontal',
  'labelAlign',
  'colSize'
];

export function asFormItem(config: Omit<FormItemConfig, 'component'>) {
  return (Control: FormControlComponent) => {
    const supportRef =
      Control.prototype instanceof React.Component ||
      (Control as any).$$typeof === Symbol.for('react.forward_ref');

    // Compatible with old FormItem usage.
    if (config.validate && !Control.prototype.validate) {
      const fn = config.validate;
      Control.prototype.validate = function () {
        const host = {
          input: this
        };

        return fn.apply(host, arguments);
      };
    } else if (config.validate) {
      console.error(
        'The validate in the FormItem configuration will not work, because the validate method has been defined in the member function of the class, and the implementation in the class will be used first.'
      );
    }

    if (config.storeType) {
      Control = HocStoreFactory({
        storeType: config.storeType,
        extendsData: config.extendsData
      })(observer(Control));
      delete config.storeType;
    }

    return wrapControl(
      config,
      hoistNonReactStatic(
        class extends FormItemWrap {
          static defaultProps: any = {
            initAutoFill: 'fillIfNotSet',
            className: '',
            renderLabel: config.renderLabel,
            renderDescription: config.renderDescription,
            sizeMutable: config.sizeMutable,
            wrap: config.wrap,
            showErrorMsg: config.showErrorMsg,
            ...Control.defaultProps
          };
          static propsList: any = [
            'value',
            'defaultValue',
            'onChange',
            'setPrinstineValue',
            'readOnly',
            'strictMode',
            ...((Control as any).propsList || [])
          ];

          static displayName: string = `FormItem${
            config.type ? `(${config.type})` : ''
          }`;
          static ComposedComponent = Control;

          ref: any;

          constructor(props: FormControlProps) {
            super(props);
            this.refFn = this.refFn.bind(this);
            this.getData = this.getData.bind(this);

            const {validations, formItem: model} = props;

            // When registering a component, the validator type may be specified by default.
            if (model && !validations && config.validations) {
              model.config({
                rules: config.validations
              });
            }
          }

          shouldComponentUpdate(nextProps: FormControlProps) {
            if (
              config.shouldComponentUpdate?.(this.props, nextProps) ||
              nextProps.strictMode === false ||
              config.strictMode === false
            ) {
              return true;
            }

            // Make a whitelist of views that may affect the view and reduce the number of re-renderings.
            if (
              anyChanged(
                detectProps.concat(config.detectProps || []),
                this.props,
                nextProps
              )
            ) {
              return true;
            }

            return false;
          }

          getWrappedInstance() {
            return this.ref;
          }

          refFn(ref: any) {
            this.ref = ref;
          }

          getData() {
            return this.props.data;
          }

          renderControl() {
            const {
              // Deconstructed here, cannot be easily deleted to avoid being passed to child components by rest
              inputClassName,
              formItem: model,
              classnames: cx,
              children,
              type,
              size,
              defaultSize,
              mobileUI,
              ...rest
            } = this.props;

            const isRuleSize =
              size && ['xs', 'sm', 'md', 'lg', 'full'].includes(size);

            const controlSize = isRuleSize ? size : defaultSize;

            return (
              <>
                <Control
                  {...rest}
                  // Because the formItem may not be updated to the latest data, a method is exposed to obtain the latest data
                  // The latest data cannot be obtained because of restrictions. Only the value associated with the form item name is updated
                  getData={this.getData}
                  mobileUI={mobileUI}
                  onOpenDialog={this.handleOpenDialog}
                  size={config.sizeMutable !== false ? undefined : size}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  type={type}
                  classnames={cx}
                  ref={supportRef ? this.refFn : undefined}
                  forwardedRef={supportRef ? undefined : this.refFn}
                  formItem={model}
                  style={{
                    width: !isRuleSize && size ? size : undefined
                  }}
                  className={cx(
                    `Form-control`,
                    {
                      'is-inline': !!rest.inline && !mobileUI,
                      'is-error': model && !model.valid,
                      'is-full': size === 'full',
                      'is-thin': config.thin,
                      [`Form-control--withSize Form-control--size${ucFirst(
                        controlSize
                      )}`]:
                        config.sizeMutable !== false &&
                        typeof controlSize === 'string' &&
                        !!controlSize &&
                        controlSize !== 'full'
                    },
                    model?.errClassNames,
                    getItemInputClassName(this.props)
                  )}
                ></Control>
              </>
            );
          }
        },
        Control
      ) as any
    );
  };
}

export function registerFormItem(config: FormItemConfig): RendererConfig {
  let Control = asFormItem(config)(config.component);

  return registerRenderer({
    ...config,
    weight: typeof config.weight !== 'undefined' ? config.weight : -100, //Higher priority
    component: Control as any,
    isFormItem: true,
    onGlobalVarChanged: function (instance, schema, data): any {
      if (config.onGlobalVarChanged?.apply(this, arguments) === false) {
        return false;
      }

      if (isGlobalVarExpression(schema.source)) {
        (instance.props as any).reloadOptions?.();
      }

      // Currently, the global variables of the form items are updated in this way
      if (isGlobalVarExpression(schema.value)) {
        (instance.props as any).onChange(
          resolveVariableAndFilter(schema.value, data, '| raw')
        );
        return false;
      }
    }
  });
}

export function FormItem(config: FormItemBasicConfig) {
  return function (component: FormControlComponent): any {
    const renderer = registerFormItem({
      ...config,
      component
    });

    return renderer.component as any;
  };
}

export function getFormItemByName(name: string) {
  return renderersMap[name];
}

export default FormItem;
