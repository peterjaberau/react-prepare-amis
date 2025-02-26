import {
  types,
  SnapshotIn,
  flow,
  isAlive,
  getEnv,
  Instance
} from 'mobx-state-tree';
import isEqualWith from 'lodash/isEqualWith';
import uniqWith from 'lodash/uniqWith';
import {FormStore, IFormStore} from './form';
import {str2rules, validate as doValidate} from '../utils/validations';
import {Api, Payload, fetchOptions, ApiObject} from '../types';
import {ComboStore, IComboStore, IUniqueGroup} from './combo';
import {evalExpression} from '../utils/tpl';
import {resolveVariableAndFilter} from '../utils/tpl-builtin';
import {buildApi, isEffectiveApi} from '../utils/api';
import findIndex from 'lodash/findIndex';
import {
  isObject,
  isArrayChildrenModified,
  createObject,
  isObjectShallowModified,
  findTree,
  findTreeIndex,
  spliceTree,
  filterTree,
  eachTree,
  mapTree,
  setVariable,
  cloneObject,
  promisify
} from '../utils/helper';
import {flattenTree} from '../utils/helper';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import {SimpleMap} from '../utils/SimpleMap';
import {StoreNode} from './node';
import {getStoreById} from './manager';
import {normalizeOptions} from '../utils/normalizeOptions';
import {
  getOptionValue,
  getOptionValueBindField,
  optionValueCompare
} from '../utils/optionValueCompare';
import {dataMapping} from '../utils/dataMapping';

interface IOption {
  value?: string | number | null;
  label?: string | null;
  children?: IOption[] | null;
  disabled?: boolean | null;
  visible?: boolean | null;
  hidden?: boolean | null;
}

const ErrorDetail = types.model('ErrorDetail', {
  msg: '',
  tag: '',
  rule: ''
});

// Used to cache the calculation results of getSelectedOptions
// It is easy to trigger getSelectedOptions repeatedly in onChange (about 4 times)
// When dealing with large amounts of data, it can effectively improve efficiency
const getSelectedOptionsCache: any = {
  value: null,
  nodeValueArray: null,
  res: null
};

export const FormItemStore = StoreNode.named('FormItemStore')
  .props({
    isFocused: false,
    isControlled: false, // Is it a controlled form item? Usually used in other components
    type: '',
    label: '',
    unique: false,
    loading: false,
    required: false,
    /** Whether the schema default value is in expression format*/
    isValueSchemaExp: types.optional(types.boolean, false),
    tmpValue: types.frozen(),
    emitedValue: types.frozen(),
    changeMotivation: 'input',
    rules: types.optional(types.frozen(), {}),
    messages: types.optional(types.frozen(), {}),
    errorData: types.optional(types.array(ErrorDetail), []),
    name: types.string,
    extraName: '',
    itemId: '', // Because the name may be repeated, add an id if necessary to locate a specific item
    unsetValueOnInvisible: false,
    itemsRef: types.optional(types.array(types.string), []),
    inited: false,
    validated: false,
    validating: false,
    multiple: false,
    delimiter: ',',
    valueField: 'value',
    labelField: 'label',
    joinValues: true,
    extractValue: false,
    options: types.optional(types.frozen<Array<any>>(), []),
    optionsRaw: types.optional(types.frozen<Array<any>>(), []),
    expressionsInOptions: false,
    selectFirst: false,
    autoFill: types.frozen(),
    clearValueOnHidden: false,
    validateApi: types.optional(types.frozen(), ''),
    selectedOptions: types.optional(types.frozen(), []),
    filteredOptions: types.optional(types.frozen(), []),
    dialogSchema: types.frozen(),
    dialogOpen: false,
    dialogData: types.frozen(),
    resetValue: types.optional(types.frozen(), ''),
    validateOnChange: false,
    /** The parent element of the InputGroup to which the current form item belongs, used to collect the child elements of the InputGroup*/
    inputGroupControl: types.optional(types.frozen(), {}),
    colIndex: types.frozen(),
    rowIndex: types.frozen(),
    /** Transfer component paging mode*/
    pagination: types.optional(types.frozen(), {
      enable: false,
      /** Current page number*/
      page: 1,
      /**Number of items displayed per page*/
      perPage: 10,
      /**Total number of entries*/
      total: 0
    }),
    accumulatedOptions: types.optional(types.frozen<Array<any>>(), []),
    popOverOpen: false,
    popOverData: types.frozen(),
    popOverSchema: types.frozen()
  })
  .views(self => {
    function getForm(): any {
      const form = self.parentStore;
      return form?.storeType === FormStore.name ? form : undefined;
    }

    function getValue(): any {
      return getForm()?.getValueByName(self.name);
    }

    function getLastOptionValue(): any {
      if (self.selectedOptions.length) {
        return self.selectedOptions[self.selectedOptions.length - 1].value;
      }

      return '';
    }

    function getErrors(): Array<string> {
      return self.errorData.map(item => item.msg);
    }

    return {
      get subFormItems(): any {
        return self.itemsRef.map(item => getStoreById(item));
      },

      get form(): any {
        return getForm();
      },

      get value(): any {
        return getValue();
      },

      get prinstine(): any {
        return (getForm() as IFormStore)?.getPristineValueByName(self.name);
      },

      get errors() {
        return getErrors();
      },

      get valid() {
        const errors = getErrors();
        return !!(!errors || !errors.length);
      },

      get errClassNames() {
        return self.errorData
          .map(item => item.rule)
          .filter((item, index, arr) => item && arr.indexOf(item) === index)
          .map(item => `has-error--${item}`)
          .join(' ');
      },

      get lastSelectValue(): string {
        return getLastOptionValue();
      },

      /** Whether the data source interface data is paging enabled*/
      get enableSourcePagination(): boolean {
        return !!self.pagination.enable;
      },

      /** Current page number when paging is enabled in the data source interface*/
      get sourcePageNum(): number {
        return self.pagination.page ?? 1;
      },

      /** The number of entries displayed per page when paging is enabled in the data source interface*/
      get sourcePerPageNum(): number {
        return self.pagination.perPage ?? 10;
      },

      /** Total number of data when paging is enabled on the data source interface*/
      get sourceTotalNum(): number {
        return self.pagination.total ?? 0;
      },

      getSelectedOptions: (
        value: any = self.tmpValue,
        nodeValueArray?: any[] | undefined
      ) => {
        // Check if the cache is hit
        if (
          value != null &&
          nodeValueArray != null &&
          isEqual(value, getSelectedOptionsCache.value) &&
          isEqual(nodeValueArray, getSelectedOptionsCache.nodeValueArray) &&
          getSelectedOptionsCache.res
        ) {
          return getSelectedOptionsCache.res;
        }

        if (typeof value === 'undefined') {
          return [];
        }

        const filteredOptions = self.filteredOptions;
        const {labelField, extractValue, multiple, delimiter} = self;
        const valueField = self.valueField || 'value';

        const valueArray = nodeValueArray
          ? nodeValueArray
          : Array.isArray(value)
            ? value
            : // Single selection should not be split
            typeof value === 'string' && multiple
              ? // The value of the picker may be value: "1, 2", so you need to remove the space
              value.split(delimiter || ',').map((v: string) => v.trim())
              : [value];

        const selected = valueArray.map(item =>
          item && item.hasOwnProperty(valueField) ? item[valueField] : item
        );

        const selectedOptions: Array<any> = [];

        selected.forEach((item, index) => {
          const matched = findTree(
            filteredOptions,
            optionValueCompare(item, valueField),
            {
              resolve: getOptionValueBindField(valueField),
              value: getOptionValue(item, valueField)
            }
          );

          if (matched) {
            selectedOptions.push(matched);
            return;
          }

          let unMatched = (valueArray && valueArray[index]) || item;
          let hasValue = unMatched || unMatched === 0;

          if (
            hasValue &&
            (typeof unMatched === 'string' || typeof unMatched === 'number')
          ) {
            unMatched = {
              [valueField || 'value']: item,
              [labelField || 'label']: item,
              __unmatched: true
            };

            // Some special cases, such as select autocomplete
            // Items that are not matched by the keyword will be hidden and not included in filteredOptions, resulting in no matches
            // At this time, you need to search from the original data to avoid label loss
            const origin: any = self.selectedOptions
              ? find(self.selectedOptions, optionValueCompare(item, valueField))
              : null;

            if (origin) {
              unMatched[labelField] = origin[labelField];
            }
          } else if (hasValue && extractValue) {
            unMatched = {
              [valueField || 'value']: item,
              [labelField || 'label']: 'UnKnown',
              __unmatched: true
            };
          }

          hasValue && selectedOptions.push(unMatched);
        });

        if (selectedOptions.length) {
          getSelectedOptionsCache.value = value;
          getSelectedOptionsCache.nodeValueArray = nodeValueArray;
          getSelectedOptionsCache.res = selectedOptions;
        }

        return selectedOptions;
      },
      splitExtraValue(value: any) {
        const delimiter = self.delimiter || ',';
        const values =
          value === ''
            ? ['', '']
            : Array.isArray(value)
              ? value
              : typeof value === 'string'
                ? value.split(delimiter || ',').map((v: string) => v.trim())
                : [];
        return values;
      },

      getMergedData(data: any) {
        const result = cloneObject(data);
        setVariable(result, self.name, self.tmpValue);
        setVariable(result, '__value', self.tmpValue);
        setVariable(result, '__name', self.name);
        return result;
      }
    };
  })

  .actions(self => {
    const form = self.form as IFormStore;
    const dialogCallbacks = new SimpleMap<
      (confirmed?: any, result?: any) => void
    >();
    let loadAutoUpdateCancel: Function | null = null;

    const initHooks: Array<(store: any) => any> = [];

    function config({
                      name,
                      extraName,
                      required,
                      unique,
                      value,
                      isValueSchemaExp,
                      rules,
                      messages,
                      delimiter,
                      multiple,
                      valueField,
                      labelField,
                      joinValues,
                      extractValue,
                      type,
                      id,
                      selectFirst,
                      autoFill,
                      clearValueOnHidden,
                      validateApi,
                      maxLength,
                      minLength,
                      validateOnChange,
                      label,
                      inputGroupControl,
                      pagination
                    }: {
      name?: string;
      extraName?: string;
      required?: boolean;
      unique?: boolean;
      value?: any;
      isValueSchemaExp?: boolean;
      rules?: string | {[propName: string]: any};
      messages?: {[propName: string]: string};
      multiple?: boolean;
      delimiter?: string;
      valueField?: string;
      labelField?: string;
      joinValues?: boolean;
      extractValue?: boolean;
      type?: string;
      id?: string;
      selectFirst?: boolean;
      autoFill?: any;
      clearValueOnHidden?: boolean;
      validateApi?: boolean;
      minLength?: number;
      maxLength?: number;
      validateOnChange?: boolean;
      label?: string;
      inputGroupControl?: {
        name: string;
        path: string;
        [propsName: string]: any;
      };
      pagination?: {
        enable?: boolean;
        page?: number;
        perPage?: number;
      };
    }) {
      if (typeof rules === 'string') {
        rules = str2rules(rules);
      }

      typeof name !== 'undefined' && (self.name = name);
      typeof extraName !== 'undefined' && (self.extraName = extraName);
      typeof type !== 'undefined' && (self.type = type);
      typeof id !== 'undefined' && (self.itemId = id);
      typeof messages !== 'undefined' && (self.messages = messages);
      typeof required !== 'undefined' && (self.required = !!required);
      typeof unique !== 'undefined' && (self.unique = !!unique);
      typeof multiple !== 'undefined' && (self.multiple = !!multiple);
      typeof selectFirst !== 'undefined' && (self.selectFirst = !!selectFirst);
      typeof autoFill !== 'undefined' && (self.autoFill = autoFill);
      typeof joinValues !== 'undefined' && (self.joinValues = !!joinValues);
      typeof extractValue !== 'undefined' &&
      (self.extractValue = !!extractValue);
      typeof delimiter !== 'undefined' &&
      (self.delimiter = (delimiter as string) || ',');
      typeof valueField !== 'undefined' &&
      (self.valueField = (valueField as string) || 'value');
      typeof labelField !== 'undefined' &&
      (self.labelField = (labelField as string) || 'label');
      typeof clearValueOnHidden !== 'undefined' &&
      (self.clearValueOnHidden = !!clearValueOnHidden);
      typeof validateApi !== 'undefined' && (self.validateApi = validateApi);
      typeof validateOnChange !== 'undefined' &&
      (self.validateOnChange = !!validateOnChange);
      typeof label === 'string' && (self.label = label);
      self.isValueSchemaExp = !!isValueSchemaExp;
      isObject(inputGroupControl) &&
      inputGroupControl?.name != null &&
      (self.inputGroupControl = inputGroupControl);

      if (pagination && isObject(pagination) && !!pagination.enable) {
        self.pagination = {
          enable: true,
          page: pagination.page ? pagination.page || 1 : 1,
          perPage: pagination.perPage ? pagination.perPage || 10 : 10,
          total: 0
        };
      }

      if (
        typeof rules !== 'undefined' ||
        typeof required !== 'undefined' ||
        typeof minLength === 'number' ||
        typeof maxLength === 'number'
      ) {
        rules = {
          ...(rules ?? self.rules),
          isRequired: self.required || rules?.isRequired
        };

        // todo This configuration is determined by the renderer itself
        // For now
        if (~['input-text', 'textarea'].indexOf(self.type)) {
          if (typeof minLength === 'number') {
            (rules as any).minLength = minLength;
          }

          if (typeof maxLength === 'number') {
            (rules as any).maxLength = maxLength;
          }
        }

        if (isObjectShallowModified(rules, self.rules)) {
          self.rules = rules;
          clearError('builtin');
          self.validated = false;
        }
      }
    }

    function focus() {
      self.isFocused = true;
    }

    function blur() {
      self.isFocused = false;
    }

    let validateCancel: Function | null = null;
    const validate: (
      data: Object,
      hook?: any,
      /**
       * customRules is mainly to support the verification method of action.require
       * This allows you to implement different validation rules based on different actions
       */
      customRules?: {[propName: string]: any}
    ) => Promise<boolean> = flow(function* validate(
      data: Object,
      hook?: any,
      customRules?: {[propName: string]: any}
    ) {
      if (self.validating && !isEffectiveApi(self.validateApi, data)) {
        return self.valid;
      }

      self.validating = true;
      clearError();
      if (hook) {
        yield hook();
      }

      addError(
        doValidate(
          self.tmpValue,
          data,
          customRules ? str2rules(customRules) : self.rules,
          self.messages,
          self.__
        )
      );

      if (!self.errors.length && isEffectiveApi(self.validateApi, data)) {
        if (validateCancel) {
          validateCancel();
          validateCancel = null;
        }

        try {
          const json: Payload = yield getEnv(self).fetcher(
            self.validateApi,
            /** If validateApi is configured, the user's latest input needs to be synchronized to the data domain*/
            createObject(data, {[self.name]: self.tmpValue}),
            {
              cancelExecutor: (executor: Function) =>
                (validateCancel = executor)
            }
          );
          validateCancel = null;

          if (!json.ok && json.status === 422 && json.errors) {
            addError(
              String(
                (self.validateApi as ApiObject)?.messages?.failed ??
                (json.errors || json.msg || `Form item "${self.name}" validation failed`)
              )
            );
          }
        } catch (err) {
          addError(String(err));
        }
      }

      self.validated = true;

      if (self.unique && self.form?.parentStore?.storeType === 'ComboStore') {
        const combo = self.form.parentStore as IComboStore;
        const group = combo.uniques.get(self.name) as IUniqueGroup;

        if (
          group.items.some(
            item =>
              item !== self &&
              self.tmpValue !== undefined &&
              self.tmpValue !== '' &&
              item.value === self.tmpValue
          )
        ) {
          addError(self.__('Form.unique'));
        }
      }

      self.validating = false;
      return self.valid;
    });

    function setError(msg: string | Array<string>, tag: string = 'builtin') {
      clearError();
      addError(msg, tag);
    }

    function addError(
      msg:
        | string
        | Array<
        | string
        | {
        msg: string;
        rule: string;
      }
      >,
      tag: string = 'builtin'
    ) {
      const msgs: Array<
        | string
        | {
        msg: string;
        rule: string;
      }
      > = Array.isArray(msg) ? msg : [msg];
      msgs.forEach(item =>
        self.errorData.push({
          msg: typeof item === 'string' ? item : item.msg,
          rule: typeof item !== 'string' ? item.rule : undefined,
          tag: tag
        })
      );
    }

    function clearError(tag?: string) {
      if (tag) {
        const filtered = self.errorData.filter(item => item.tag !== tag);
        self.errorData.replace(filtered);
      } else {
        self.errorData.clear();
      }
    }

    function getFirstAvaibleOption(options: Array<any>): any {
      if (!Array.isArray(options)) {
        return;
      }

      for (let option of options) {
        if (Array.isArray(option.children) && option.children.length) {
          const childFirst = getFirstAvaibleOption(option.children);
          if (childFirst !== undefined) {
            return childFirst;
          }
        } else if (
          option[self.valueField || 'value'] != null &&
          !option.disabled
        ) {
          return option;
        }
      }
    }

    function setPagination(params: {
      page?: number;
      perPage?: number;
      total?: number;
    }) {
      const {page, perPage, total} = params || {};

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          ...(page != null && typeof page === 'number' ? {page} : {}),
          ...(perPage != null && typeof perPage === 'number' ? {perPage} : {}),
          ...(total != null && typeof total === 'number' ? {total} : {})
        };
      }
    }

    function setOptions(
      options: Array<object>,
      onChange?: (value: any) => void,
      data?: Object
    ) {
      if (!Array.isArray(options)) {
        return;
      }
      options = filterTree(options, item => item);
      const originOptions = self.options.concat();
      self.options = options;
      /** After opening paging, the current option content needs to be accumulated*/
      self.accumulatedOptions = self.enableSourcePagination
        ? uniqWith(
          [...originOptions, ...options],
          (lhs, rhs) =>
            lhs[self.valueField ?? 'value'] ===
            rhs[self.valueField ?? 'value']
        )
        : options;
      syncOptions(originOptions, data);
      let selectedOptions;

      if (
        onChange &&
        self.selectFirst &&
        self.filteredOptions.length &&
        (selectedOptions = self.getSelectedOptions(self.value)) &&
        !selectedOptions.filter((item: any) => !item.__unmatched).length
      ) {
        const fistOption = getFirstAvaibleOption(self.filteredOptions);
        if (!fistOption) {
          return;
        }

        const list = [fistOption].map((item: any) => {
          if (self.extractValue || self.joinValues) {
            return item[self.valueField || 'value'];
          }

          return item;
        });

        const value =
          self.joinValues && self.multiple
            ? list.join(self.delimiter)
            : self.multiple
              ? list
              : list[0];

        onChange(value);
      }
    }

    let loadCancel: Function | null = null;
    const fetchOptions: (
      api: Api,
      data?: object,
      config?: fetchOptions,
      setErrorFlag?: boolean
    ) => Promise<Payload | null> = flow(function* getInitData(
      api: string,
      data: object,
      config?: fetchOptions,
      setErrorFlag?: boolean
    ) {
      try {
        if (loadCancel) {
          loadCancel();
          loadCancel = null;
          self.loading = false;
        }

        if (!config?.silent) {
          self.loading = true;
        }

        const json: Payload = yield getEnv(self).fetcher(api, data, {
          autoAppend: false,
          cancelExecutor: (executor: Function) => (loadCancel = executor),
          ...config
        });
        loadCancel = null;
        let result: any = null;

        if (!json.ok) {
          const apiObject = buildApi(api, data);
          setErrorFlag !== false &&
          setError(
            self.__('Form.loadOptionsFailed', {
              reason:
                apiObject.messages?.failed ??
                json.msg ??
                (config && config.errorMessage)
            })
          );
          let msg = json.msg;
          // If there is no msg, then prompt the status information
          if (!msg) {
            msg = `status: ${json.status}`;
          }
          !(api as any)?.silent &&
          getEnv(self).notify(
            'error',
            apiObject.messages?.failed ??
            (self.errors.join('') || `${apiObject.url}: ${msg}`),
            json.msgTimeout !== undefined
              ? {
                closeButton: true,
                timeout: json.msgTimeout
              }
              : undefined
          );
        } else {
          result = json;
        }

        self.loading = false;
        return result;
      } catch (e) {
        const env = getEnv(self);

        if (!isAlive(self) || self.disposed) {
          return;
        }

        self.loading = false;
        if (env.isCancel(e)) {
          return;
        }

        console.error(e);
        !(api as any)?.silent && env.notify('error', e.message);
        return;
      }
    } as any);

    const loadOptions: (
      api: Api,
      data?: object,
      config?: fetchOptions & {
        extendsOptions?: boolean;
      },
      clearValue?: boolean,
      onChange?: (value: any) => void,
      setErrorFlag?: boolean
    ) => Promise<Payload | null> = flow(function* getInitData(
      api: string,
      data: object,
      config?: fetchOptions,
      clearValue?: any,
      onChange?: (
        value: any,
        submitOnChange?: boolean,
        changeImmediately?: boolean
      ) => void,
      setErrorFlag?: boolean
    ) {
      let json: Payload = yield fetchOptions(api, data, config, setErrorFlag);
      if (!json) {
        return null;
      }

      clearError();
      self.validated = false; // After pulling the data, you should verify it again

      let options: Array<IOption> =
        json.data?.options ||
        json.data?.items ||
        json.data?.rows ||
        json.data ||
        [];

      options = normalizeOptions(options as any, undefined, self.valueField);

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          page: parseInt(json.data?.page, 10) || 1,
          total: parseInt(json.data?.total ?? json.data?.count, 10) || 0
        };
      }

      if (config?.extendsOptions && self.selectedOptions.length > 0) {
        self.selectedOptions.forEach((item: any) => {
          const exited = findTree(
            options as any,
            optionValueCompare(item, self.valueField || 'value'),
            {
              resolve: getOptionValueBindField(self.valueField),
              value: getOptionValue(item, self.valueField)
            }
          );

          if (!exited) {
            options.push(item);
          }
        });
      }

      setOptions(options, onChange, data);

      if (json.data && typeof (json.data as any).value !== 'undefined') {
        onChange && onChange((json.data as any).value, false, true);
      } else if (clearValue && !self.selectFirst) {
        self.selectedOptions.some((item: any) => item.__unmatched) &&
        onChange &&
        onChange(
          self.joinValues === false && self.multiple ? [] : '',
          false,
          true
        );
      }

      return json;
    });

    /**
     * Load the option data source from the data domain. Note that the default source variable is parsed as the full data source.
     */
    function loadOptionsFromDataScope(
      source: string,
      ctx: Record<string, any>,
      onChange?: (value: any) => void
    ) {
      let options: any[] = resolveVariableAndFilter(source, ctx, '| raw');

      if (!Array.isArray(options)) {
        return [];
      }

      options = normalizeOptions(options, undefined, self.valueField);

      if (self.enableSourcePagination) {
        self.pagination = {
          ...self.pagination,
          ...(ctx?.page ? {page: ctx?.page} : {}),
          ...(ctx?.perPage ? {perPage: ctx?.perPage} : {}),
          total: options.length
        };

        options = options.slice(
          (self.pagination.page - 1) * self.pagination.perPage,
          self.pagination.page * self.pagination.perPage
        );
      }

      setOptions(options, onChange, ctx);

      return options;
    }

    const loadAutoUpdateData: (
      api: Api,
      data?: object,
      silent?: boolean
    ) => Promise<Payload> = flow(function* getAutoUpdateData(
      api: string,
      data: object,
      silent: boolean = true
    ) {
      if (loadAutoUpdateCancel) {
        loadAutoUpdateCancel();
        loadAutoUpdateCancel = null;
      }

      const json: Payload = yield getEnv(self).fetcher(api, data, {
        cancelExecutor: (executor: Function) =>
          (loadAutoUpdateCancel = executor)
      });
      loadAutoUpdateCancel = null;

      if (!json) {
        return;
      }

      const result = json.data?.items || json.data?.rows;
      // Only process data with one result
      if (result?.length === 1) {
        return result[0];
      } else if (isPlainObject(json.data)) {
        return json.data;
      }

      !silent &&
      !(api as any)?.silent &&
      getEnv(self).notify('info', self.__('FormItem.autoFillLoadFailed'));

      return;
    });

    const tryDeferLoadLeftOptions: (
      option: any,
      leftOptions: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      leftOptions: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      if (!Array.isArray(leftOptions)) {
        return;
      }

      const indexes = findTreeIndex(
        self.options,
        item => item.leftOptions === leftOptions
      );
      const leftIndexes = findTreeIndex(leftOptions, item => item === option);
      const topOption = findTree(
        self.options,
        item => item.leftOptions === leftOptions
      );

      if (!indexes || !leftIndexes || !topOption) {
        return;
      }

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...topOption,
          loading: true,
          leftOptions: spliceTree(topOption.leftOptions, leftIndexes, 1, {
            ...option,
            loading: true
          })
        }),
        undefined,
        data
      );

      let json = yield fetchOptions(
        api,
        data,
        {
          ...config,
          silent: true
        },
        false
      );

      if (!json) {
        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...topOption,
            loading: false,
            error: true,
            leftOptions: spliceTree(topOption.leftOptions, leftIndexes, 1, {
              ...option,
              loading: false,
              error: true
            })
          }),
          undefined,
          data
        );
        return;
      }

      const options: Array<IOption> =
        json.data?.options ||
        json.data.items ||
        json.data.rows ||
        json.data ||
        [];
      const newLeftOptions = spliceTree(topOption.leftOptions, leftIndexes, 1, {
        ...option,
        loading: false,
        loaded: true,
        children: options
      });

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...topOption,
          loading: false,
          loaded: true,
          children: options,
          leftOptions: newLeftOptions
        }),
        undefined,
        data
      );

      // Insert a new child node for later search in BaseSelection.resolveSelected
      if (Array.isArray(topOption.children)) {
        const children = topOption.children.concat();
        flattenTree(newLeftOptions).forEach(item => {
          if (
            !findTree(topOption.children, node => node.ref === item.value, {
              resolve: node => node.ref,
              value: item.value
            })
          ) {
            children.push({ref: item.value, defer: true});
          }
        });

        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...topOption,
            leftOptions: newLeftOptions,
            children
          }),
          undefined,
          data
        );
      }

      return json;
    });

    const deferLoadLeftOptions: (
      option: any,
      leftOptions: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      leftOptions: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      return yield tryDeferLoadLeftOptions(
        option,
        leftOptions,
        api,
        data,
        config
      );
    });

    const deferLoadOptions: (
      option: any,
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null> = flow(function* (
      option: any,
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      const labelField = self.labelField || 'label';
      const valueField = self.valueField || 'value';
      const indexes = findTreeIndex(
        self.options,
        item =>
          item === option ||
          /** In tree-select, collapsed and visible attributes will be added to option, causing item === option to fail*/
          isEqualWith(
            item,
            option,
            (source, target) =>
              source?.[valueField] != null &&
              target?.[valueField] != null &&
              source?.[labelField] === target?.[labelField] &&
              source?.[valueField] === target?.[valueField]
          )
      );
      if (!indexes) {
        const leftOptions = self.options[0]?.leftOptions;
        return yield tryDeferLoadLeftOptions(
          option,
          leftOptions,
          api,
          data,
          config
        );
      }

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...option,
          loading: true
        }),
        undefined,
        data
      );

      let json = yield fetchOptions(
        api,
        data,
        {
          ...config,
          silent: true
        },
        false
      );
      if (!json) {
        setOptions(
          spliceTree(self.options, indexes, 1, {
            ...option,
            loading: false,
            error: true
          }),
          undefined,
          data
        );
        return;
      }

      let options: Array<IOption> =
        json.data?.options ||
        json.data.items ||
        json.data.rows ||
        json.data ||
        [];

      setOptions(
        spliceTree(self.options, indexes, 1, {
          ...option,
          loading: false,
          loaded: true,
          children: options
        }),
        undefined,
        data
      );

      return json;
    });

    /**
     * Expand the parent node of the tree component according to the current node path
     */
    const expandTreeOptions: (
      nodePathArr: any[],
      api: Api,
      data?: object,
      config?: fetchOptions
    ) => Promise<Payload | null | void> = flow(function* getInitData(
      nodePathArr: any[],
      api: string,
      data: object,
      config?: fetchOptions
    ) {
      // In multi-select mode, you need to record the traversed Nodes to avoid sending the same request
      const traversedNode = new Map();

      for (let nodePath of nodePathArr) {
        // The root node is already expanded and does not need to be loaded
        if (nodePath.length <= 1) {
          continue;
        }

        // Leaf nodes do not need to be expanded
        for (let level = 0; level < nodePath.length - 1; level++) {
          let tree = self.options.concat();
          let nodeValue = nodePath[level];

          if (traversedNode.has(nodeValue)) {
            continue;
          }
          // Node value is considered unique
          let node = findTree(tree, (item, key, treeLevel: number) => {
            return (
              treeLevel === level + 1 &&
              optionValueCompare(nodeValue, self.valueField || 'value')(item)
            );
          });

          // Only process lazy loaded nodes
          if (!node || !node.defer) {
            continue;
          }
          const indexes = findTreeIndex(
            tree,
            item => item === node
          ) as number[];

          setOptions(
            spliceTree(tree, indexes, 1, {
              ...node,
              loading: true
            }),
            undefined,
            node
          );

          let json = yield fetchOptions(
            api,
            node,
            {...config, silent: true},
            false
          );

          if (!json) {
            setOptions(
              spliceTree(tree, indexes, 1, {
                ...node,
                loading: false,
                error: true
              }),
              undefined,
              node
            );
          }

          traversedNode.set(nodeValue, true);

          let childrenOptions: Array<IOption> =
            json.data?.options ||
            json.data.items ||
            json.data.rows ||
            json.data ||
            [];

          setOptions(
            spliceTree(tree, indexes, 1, {
              ...node,
              loading: false,
              loaded: true,
              children: childrenOptions
            }),
            undefined,
            node
          );
        }
      }
    });

    // @issue strongly depends on form and needs to be modified, so let's ignore it for now.
    function syncOptions(originOptions?: Array<any>, data?: Object) {
      if (!self.options.length && typeof self.value === 'undefined') {
        isArrayChildrenModified(self.filteredOptions, []) &&
        (self.filteredOptions = []);
        isArrayChildrenModified(self.selectedOptions, []) &&
        (self.selectedOptions = []);
        return;
      }

      const value = self.tmpValue;
      const valueField = self.valueField || 'value';
      const labelField = self.labelField || 'label';

      const selected = Array.isArray(value)
        ? value.map(item =>
          item && item.hasOwnProperty(valueField) ? item[valueField] : item
        )
        : typeof value === 'string'
          ? value.split(self.delimiter || ',').map((v: string) => v.trim())
          : value === void 0
            ? []
            : [
              value && value.hasOwnProperty(valueField)
                ? value[valueField]
                : value
            ];

      if (value && value.hasOwnProperty(labelField)) {
        selected[0] = {
          [labelField]: value[labelField],
          [valueField]: value[valueField]
        };
      }

      let expressionsInOptions = false;
      const oldFilteredOptions = self.filteredOptions;
      let filteredOptions = self.options
        .filter((item: any) => {
          if (
            !expressionsInOptions &&
            (item.visibleOn || item.hiddenOn || item.disabledOn)
          ) {
            expressionsInOptions = true;
          }

          return item.visibleOn
            ? evalExpression(item.visibleOn, data) !== false
            : item.hiddenOn
              ? evalExpression(item.hiddenOn, data) !== true
              : item.visible !== false && item.hidden !== true;
        })
        .map((item: any, index) => {
          const disabled = evalExpression(item.disabledOn, data);
          const newItem = item.disabledOn
            ? oldFilteredOptions.length > index &&
            oldFilteredOptions[index].disabled === disabled
              ? oldFilteredOptions[index]
              : {
                ...item,
                disabled: disabled
              }
            : item;

          return newItem;
        });

      self.expressionsInOptions = expressionsInOptions;
      const flattenedMap: Map<any, any> = new Map();
      const flattened: Array<any> = [];
      eachTree(filteredOptions, item => {
        const value = getOptionValue(item, valueField);
        value != null && flattenedMap.set(value, item);
        value != null && flattened.push(item);
      });
      const selectedOptions: Array<any> = [];
      selected.forEach((item, index) => {
        const value = getOptionValue(item, valueField);
        if (flattenedMap.get(value)) {
          selectedOptions.push(flattenedMap.get(value));
          return;
        }

        let idx = findIndex(flattened, optionValueCompare(item, valueField));

        if (~idx) {
          selectedOptions.push(flattened[idx]);
        } else {
          let unMatched = (value && value[index]) || item;
          let hasValue = unMatched || unMatched === 0;

          if (
            hasValue &&
            (typeof unMatched === 'string' || typeof unMatched === 'number')
          ) {
            unMatched = {
              [valueField]: item,
              [labelField]: item,
              __unmatched: true
            };

            const orgin: any =
              originOptions &&
              find(originOptions, optionValueCompare(item, valueField));

            if (orgin) {
              unMatched[labelField] = orgin[labelField];
            }
          } else if (hasValue && self.extractValue) {
            unMatched = {
              [valueField]: item,
              [labelField]: 'UnKnown',
              __unmatched: true
            };
          }

          hasValue && selectedOptions.push(unMatched);
        }
      });

      const form = self.form;

      let parentStore = form?.parentStore;
      if (parentStore?.storeType === ComboStore.name) {
        let combo = parentStore as IComboStore;
        let group = combo.uniques.get(self.name) as IUniqueGroup;
        let options: Array<any> = [];
        group &&
        group.items.forEach(item => {
          if (self !== item) {
            options.push(
              ...item.selectedOptions.map(
                (item: any) => item && item[valueField]
              )
            );
          }
        });

        if (filteredOptions.length && options.length) {
          filteredOptions = mapTree(filteredOptions, item => {
            if (~options.indexOf(item[valueField])) {
              return {
                ...item,
                disabled: true
              };
            }
            return item;
          });
        }
      }

      isArrayChildrenModified(self.selectedOptions, selectedOptions) &&
      (self.selectedOptions = selectedOptions);
      isArrayChildrenModified(self.filteredOptions, filteredOptions) &&
      (self.filteredOptions = filteredOptions);
    }

    function setLoading(value: boolean) {
      self.loading = value;
    }

    let subStore: any;
    function getSubStore() {
      return subStore;
    }

    function setSubStore(store: any) {
      subStore = store;
    }

    function reset(keepErrors: boolean = false) {
      self.validated = false;

      if (subStore && subStore.storeType === 'ComboStore') {
        const combo = subStore as IComboStore;
        combo.forms.forEach(form => form.reset(undefined, false)); // Reset only the validation status, do not reset the data
      }

      !keepErrors && clearError();
    }

    function resetValidationStatus(tag?: string) {
      self.validated = false;
      clearError();
    }

    function openDialog(
      schema: any,
      ctx: any,
      callback?: (confirmed?: any, value?: any) => void
    ) {
      if (schema.data) {
        self.dialogData = dataMapping(schema.data, ctx);
      } else {
        self.dialogData = ctx;
      }

      self.dialogSchema = schema;
      self.dialogOpen = true;
      callback && dialogCallbacks.set(self.dialogData, callback);
    }

    function closeDialog(confirmed?: any, result?: any) {
      const callback = dialogCallbacks.get(self.dialogData);
      self.dialogOpen = false;

      if (callback) {
        dialogCallbacks.delete(self.dialogData);
        setTimeout(() => callback(confirmed, result), 200);
      }
    }

    function openPopOver(
      schema: any,
      ctx: any,
      callback?: (confirmed?: any, value?: any) => void
    ) {
      self.popOverData = ctx || {};
      self.popOverOpen = true;
      self.popOverSchema = schema;
      callback && dialogCallbacks.set(self.popOverData, callback);
    }

    function closePopOver(confirmed?: any, result?: any) {
      const callback = dialogCallbacks.get(self.popOverData);
      self.popOverOpen = false;

      if (callback) {
        dialogCallbacks.delete(self.popOverData);
        setTimeout(() => callback(confirmed, result), 200);
      }
    }

    function changeTmpValue(
      value: any,
      changeReason?:
        | 'initialValue' // Initial value, read from the current data field, or the upper data field
        | 'formInited' // Form initialization
        | 'dataChanged' // Form data changes
        | 'formulaChanged' // formula calculation result changes
        | 'controlled' // controlled
        | 'input' // User interaction changes
        | 'defaultValue' // default value
    ) {
      // Clear the exception that the value is an empty array when extraName is cleared, which causes the required check to fail
      if (self.extraName && Array.isArray(value)) {
        self.tmpValue = value.filter(item => item).length ? value : '';
      } else {
        self.tmpValue = value;
      }

      if (changeReason) {
        self.changeMotivation = changeReason;
      }
    }

    function changeEmitedValue(value: any) {
      self.emitedValue = value;
    }

    function addSubFormItem(item: IFormItemStore) {
      self.itemsRef.push(item.id);
    }

    function removeSubFormItem(item: IFormItemStore) {
      const idx = self.itemsRef.findIndex(a => a === item.id);
      if (~idx) {
        self.itemsRef.splice(idx, 1);
      }
    }

    function setIsControlled(value: any) {
      self.isControlled = !!value;
    }

    const init: () => Promise<void> = flow(function* init() {
      const hooks = initHooks.sort(
        (a: any, b: any) => (a.__weight || 0) - (b.__weight || 0)
      );
      try {
        for (let hook of hooks) {
          yield hook(self);
        }
      } finally {
        if (isAlive(self)) {
          self.inited = true;
        }
      }
    });

    return {
      focus,
      blur,
      config,
      validate,
      setError,
      addError,
      clearError,
      setPagination,
      setOptions,
      loadOptions,
      loadOptionsFromDataScope,
      deferLoadOptions,
      deferLoadLeftOptions,
      expandTreeOptions,
      syncOptions,
      setLoading,
      setSubStore,
      getSubStore,
      reset,
      resetValidationStatus,
      openDialog,
      closeDialog,
      openPopOver,
      closePopOver,
      changeTmpValue,
      changeEmitedValue,
      addSubFormItem,
      removeSubFormItem,
      loadAutoUpdateData,
      setIsControlled,

      init,

      addInitHook(fn: (store: any) => any, weight = 0) {
        fn = promisify(fn);
        initHooks.push(fn);
        (fn as any).__weight = weight;
        return () => {
          const idx = initHooks.indexOf(fn);
          ~idx && initHooks.splice(idx, 1);
        };
      },

      beforeDestroy: () => {
        // Destroy
        initHooks.splice(0, initHooks.length);
      }
    };
  });

export type IFormItemStore = Instance<typeof FormItemStore>;
export type SFormItemStore = SnapshotIn<typeof FormItemStore>;
