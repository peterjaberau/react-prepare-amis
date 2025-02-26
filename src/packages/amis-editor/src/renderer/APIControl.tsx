import React from 'react';
import mergeWith from 'lodash/mergeWith';
import cloneDeep from 'lodash/cloneDeep';
import cx from 'classnames';
import {FormItem, Icon} from 'amis';
import {Input, PickerContainer, Spinner} from '@/packages/amis-ui/src';

import {getEnv} from 'mobx-state-tree';
import {normalizeApi, isEffectiveApi, isApiOutdated} from 'amis-core';

import {
  isObject,
  autobind,
  createObject,
  tipedLabel,
  anyChanged,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';

import type {SchemaObject, SchemaCollection, SchemaApi} from 'amis';
import type {Api} from 'amis';
import type {FormControlProps} from 'amis-core';
import type {ActionSchema} from 'amis';
import debounce from 'lodash/debounce';

export type ApiObject = Api & {
  messages?: Record<
    | 'fetchSuccess'
    | 'fetchFailed'
    | 'saveOrderSuccess'
    | 'saveOrderFailed'
    | 'quickSaveSuccess'
    | 'quickSaveFailed',
    string
  >;
};

export interface APIControlProps extends FormControlProps {
  name?: string;
  label?: string;
  value?: any;

  /**
   * Enable debug mode
   */
  debug?: boolean;

  /**
   * Interface message setting description information
   */
  messageDesc?: string;

  /**
   * Top button collection
   */
  actions?: Array<ActionSchema>;

  /**
   * Bottom Collection
   */
  footer?: Array<SchemaObject>;

  /**
   * Whether to enable the selection mode. If enabled, the actions attribute will be invalid.
   */
  enablePickerMode?: boolean;

  /**
   * Trigger Picker button configuration
   */
  pickerBtnSchema?: ActionSchema;

  /**
   * picker title
   */
  pickerTitle?: string;

  /**
   * Picker bound to the name
   */
  pickerName?: string;

  /**
   * Schema for picker mode
   */
  pickerSchema?: SchemaCollection;

  /**
   * Picker data source
   */
  pickerSource?: SchemaApi;

  /**
   * Picker pop-up window size
   */
  pickerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * CSS class name at the top of the Picker
   */
  pickerHeaderClassName?: string;

  /**
   * Whether to return only the internal TabsPanel
   */
  onlyTabs?: boolean;

  /**
   * Enable highlighting
   */
  enableHighlight?: boolean;

  /**
   * Picker option label field
   */
  labelField?: string;

  /**
   * Search fields
   */
  searchField?: string;

  /**
   * Search field type
   */
  searchType?: string;

  /**
   * Bottom area CSS class name
   */
  footerClassName?: string;

  /**
   * Picker panel confirmation
   */
  onPickerConfirm: (values: any) => void | any;

  /**
   * Picker panel close
   */
  onPickerClose: () => void;

  /**
   * Picker panel selection
   */
  onPickerSelect: (values: any) => void | any;

  onAction: (
    schema: ActionSchema,
    e: React.MouseEvent<any> | void | null,
    action: object,
    data: any
  ) => void;
}

export interface APIControlState {
  apiStr: string;
  selectedItem?: any[];
  schema?: SchemaCollection;
  loading: boolean;
}

export default class APIControl extends React.Component<
  APIControlProps,
  APIControlState
> {
  input?: HTMLInputElement;

  static defaultProps: Pick<
    APIControlProps,
    'pickerBtnSchema' | 'labelField' | 'searchType'
  > = {
    pickerBtnSchema: {
      type: 'button',
      level: 'link',
      size: 'sm'
    },
    labelField: 'label',
    searchType: 'key'
  };

  constructor(props: APIControlProps) {
    super(props);

    this.state = {
      apiStr: this.transformApi2Str(props.value),
      selectedItem: [],
      schema: props.pickerSchema,
      loading: false
    };
  }

  componentDidMount() {
    this.updatePickerOptions();
  }

  componentDidUpdate(prevProps: APIControlProps) {
    const props = this.props;
    if (prevProps.value !== props.value) {
      this.setState({apiStr: this.transformApi2Str(props.value)});
      this.updatePickerOptions();
    }
    if (anyChanged(['enablePickerMode', 'pickerSchema'], prevProps, props)) {
      this.setState({schema: props.pickerSchema});
    }

    if (
      isApiOutdated(
        prevProps?.pickerSource,
        props?.pickerSource,
        prevProps.data,
        props.data
      )
    ) {
      this.fetchOptions();
    }
  }

  /**
   * Selected API details. Because the list interface is paged, it needs to be called once separately.
   */
  async updatePickerOptions() {
    const apiObj = normalizeApi(this.props.value);

    if (apiObj?.url?.startsWith('api://')) {
      this.setState({loading: true});
      const keyword = apiObj.url.replace('api://', '');

      try {
        await this.fetchOptions(keyword);
      } catch (error) {}
    }
    this.setState({loading: false});
  }

  transformApi2Str(value: any) {
    const api = normalizeApi(value);

    return api.url
      ? `${
          api.method &&
          api.method.toLowerCase() !==
            'get' /** The default is GET request, which hides the prefix directly to present more information*/
            ? `${api.method}:`
            : ''
        }${api.url}`
      : '';
  }

  async fetchOptions(keyword?: string) {
    const {value, data, env, searchField, searchType} = this.props;
    let {pickerSource} = this.props;
    const apiObj = normalizeApi(value);

    if (!pickerSource || !apiObj?.url) {
      return;
    }

    const apiKey = apiObj?.url?.split('api://')?.[1];
    const ctx = createObject(data, {
      value,
      on: 'loadOptions',
      ...(keyword && searchField ? {[searchField]: keyword, searchType} : {})
    });
    const schemaFilter = getEnv((window as any).editorStore).schemaFilter;

    // Convert based on the rules of Aisuda
    if (schemaFilter) {
      pickerSource = schemaFilter({api: pickerSource}).api;
    }

    if (isEffectiveApi(pickerSource, ctx)) {
      const res = await env.fetcher(pickerSource, ctx);
      const items: any[] = res.data?.items || res?.data?.rows;

      if (items.length) {
        const selectedItem = items.find(item => item.key === apiKey);

        this.setState({selectedItem: selectedItem ? [selectedItem] : []});
      }
    }
  }

  @autobind
  inputRef(ref: any) {
    this.input = ref;
  }

  focus() {
    if (!this.input) {
      return;
    }

    this.input.focus();
  }

  @autobind
  clearPickerValue() {
    const {onChange} = this.props;

    this.setState(
      {apiStr: this.transformApi2Str(undefined), selectedItem: []},
      () => {
        onChange?.(undefined);
        this.focus();
      }
    );
  }

  handleSimpleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.handleSubmit(e.currentTarget.value, 'input');
  };

  @autobind
  handleSubmit(values: SchemaApi, action?: 'input' | 'picker-submit') {
    const {onChange, value} = this.props;
    let api: Api = values;

    // Picker has not made a selection
    if (!values && action === 'picker-submit') {
      return;
    }

    if (typeof value !== 'string' || typeof values !== 'string') {
      api = mergeWith(
        {},
        normalizeApi(value),
        normalizeApi(values),
        (value, srcValue, key) => {
          // These three attributes that support deleting a single key need to be completely replaced with the new value
          // Otherwise the deletion will be invalid
          if (['data', 'responseData', 'headers'].includes(key)) {
            return srcValue;
          }
        }
      );
      ['data', 'responseData', 'headers'].forEach((item: keyof Api) => {
        if (api[item] == null) {
          delete api[item];
        }
      });
    }
    onChange?.(api);
  }

  handleAction(
    schema: ActionSchema,
    e: React.MouseEvent<any> | void | null,
    action: object,
    data: any
  ) {
    const {onAction} = this.props;

    onAction?.(schema, e, action, data);
  }

  normalizeValue(value: any, callback: (value: any) => any) {
    let transformedValue = cloneDeep(value);

    if (typeof callback === 'function') {
      transformedValue = callback(value);
    }

    return transformedValue;
  }

  @autobind
  handlePickerConfirm(value: any) {
    const {onPickerConfirm} = this.props;

    this.handleSubmit(
      this.normalizeValue(value, onPickerConfirm),
      'picker-submit'
    );
  }

  @autobind
  handlePickerClose() {
    const {onPickerClose} = this.props;

    onPickerClose?.();
  }

  @autobind
  renderHeader() {
    const {render, labelRemark, useMobileUI, popOverContainer, env} =
      this.props;
    const label: any = this.props.label;
    const classPrefix = env?.theme?.classPrefix;

    // const actionsDom =
    //   Array.isArray(actions) && actions.length > 0
    //     ? actions.map((action, index) => {
    //         return render(`action/${index}`, action, {
    //           key: index,
    //           onAction: this.handleAction.bind(this, action)
    //         });
    //       })
    //     : null;

    return (
      <header className="ApiControl-header" key="header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label?.type ? render('label', label) : label || ''}
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
      </header>
    );
  }

  renderPickerSchema() {
    const {
      render,
      pickerTitle,
      pickerName = 'apiPicker',
      pickerSize,
      pickerHeaderClassName,
      pickerBtnSchema,
      enablePickerMode,
      onPickerSelect
    } = this.props;
    const {selectedItem, schema} = this.state;

    if (!schema) {
      return null;
    }

    return (
      <PickerContainer
        title={pickerTitle}
        headerClassName={cx(pickerHeaderClassName, 'font-bold')}
        onConfirm={this.handlePickerConfirm}
        onCancel={this.handlePickerClose}
        size={pickerSize}
        bodyRender={({
          onChange,
          setState
        }: {
          onChange: (value: any) => void;
          setState: (state: any) => void;
        }) => {
          return render('api-control-picker', schema!, {
            value: selectedItem,
            onSelect: (items: Array<any>) => {
              setState({selectedItem: items});
              onChange(this.normalizeValue(items, onPickerSelect));
            }
          });
        }}
      >
        {({
          onClick,
          isOpened
        }: {
          onClick: (e: React.MouseEvent) => void;
          isOpened: boolean;
        }) =>
          render(
            'picker-action',
            {
              icon: (
                <Icon icon="picker-icon" className="icon ae-ApiControl-icon" />
              ),
              ...pickerBtnSchema!,
              className: cx(
                'ae-ApiControl-PickerBtn',
                pickerBtnSchema?.className
              )
            },
            {
              onClick: async (e: React.MouseEvent<any>) => {
                if (!isOpened && enablePickerMode) {
                  try {
                    await this.fetchOptions();
                  } catch {}
                }

                onClick(e);
              }
            }
          )
        }
      </PickerContainer>
    );
  }

  renderApiDialog() {
    return {
      label: '',
      type: 'action',
      acitonType: 'dialog',
      size: 'sm',
      icon: <Icon icon="setting" className="icon ae-ApiControl-icon" />,
      className: 'ae-ApiControl-setting-button',
      actionType: 'dialog',
      dialog: {
        title: 'Advanced Settings',
        size: 'md',
        className: 'ae-ApiControl-dialog',
        headerClassName: 'font-bold',
        bodyClassName: 'ae-ApiControl-dialog-body',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        // data: {},
        body: [this.renderApiConfigTabs()]
      }
    };
  }

  renderApiConfigTabs(submitOnChange: boolean = false) {
    const {messageDesc, debug = false, name} = this.props;

    return {
      type: 'form',
      className: 'ae-ApiControl-form :AMISCSSWrapper',
      mode: 'horizontal',
      submitOnChange,
      wrapWithPanel: false,
      onSubmit: this.handleSubmit,
      debug,
      body: [
        {
          type: 'tabs',
          className: 'ae-ApiControl-tabs',
          contentClassName: 'ae-ApiControl-tabContent',
          tabs: [
            {
              title: 'Interface Settings',
              tab: [
                {
                  label: 'Sending method',
                  name: 'method',
                  value: 'get',
                  type: 'button-group-select',
                  mode: 'horizontal',
                  options: [
                    {
                      value: 'get',
                      label: 'GET'
                    },
                    {
                      value: 'post',
                      label: 'POST'
                    },
                    {
                      value: 'put',
                      label: 'PUT'
                    },
                    {
                      value: 'patch',
                      label: 'PATCH'
                    },
                    {
                      value: 'delete',
                      label: 'DELETE'
                    }
                  ]
                },
                {
                  label: 'Interface address',
                  type: 'input-text',
                  name: 'url',
                  mode: 'horizontal',
                  size: 'lg',
                  placeholder: 'http://',
                  required: true
                },
                {
                  label: 'Sending conditions',
                  type: 'input-text',
                  name: 'sendOn',
                  mode: 'horizontal',
                  size: 'lg',
                  placeholder: '如：this.type == "123"',
                  description:
                    'Use an expression to set the conditions for sending the request'
                },
                {
                  label: 'data format',
                  type: 'button-group-select',
                  name: 'dataType',
                  size: 'sm',
                  mode: 'horizontal',
                  description: `${'The format of the body sent is'}: <%= data.dataType === "json" ? "application/json" : (data.dataType === "form-data" ? "multipart/form-data" : (data.dataType === "form" ? "application/x-www-form-urlencoded" : "")) %>, ${'When there is a file in the sent content, the form-data format will be automatically used. '}`,
                  options: [
                    {
                      label: 'JSON',
                      value: 'json'
                    },
                    {
                      label: 'FormData',
                      value: 'form-data'
                    },
                    {
                      label: 'Form',
                      value: 'form'
                    }
                  ],
                  disabled: false
                },
                {
                  type: 'group',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        'Silent Request',
                        'Whether to send the request silently and block the error message'
                      ),
                      name: 'silent',
                      mode: 'horizontal'
                    }
                  ]
                },
                {
                  type: 'switch',
                  label: 'Whether to set cache',
                  name: 'cache',
                  mode: 'horizontal',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? 3000 : undefined)
                },
                {
                  label: '',
                  type: 'input-number',
                  name: 'cache',
                  mode: 'horizontal',
                  size: 'md',
                  min: 0,
                  step: 500,
                  visibleOn: 'this.cache',
                  description: 'Set the request cache validity period, in ms',
                  pipeIn: (value: any) =>
                    typeof value === 'number' ? value : 0
                },
                {
                  label: 'File download',
                  name: 'responseType',
                  type: 'switch',
                  mode: 'horizontal',
                  description:
                    'Please check this option when the interface is for binary file download, otherwise the file will be garbled. ',
                  pipeIn: (value: any) => value === 'blob',
                  pipeOut: (value: any) => (value ? 'blob' : undefined)
                },
                {
                  label: 'Data replacement',
                  name: 'replaceData',
                  type: 'switch',
                  mode: 'horizontal',
                  description:
                    'The default data is append mode, which will completely replace the current data after it is turned on'
                },
                {
                  label: '',
                  name: 'interval',
                  type: 'input-number',
                  mode: 'horizontal',
                  size: 'md',
                  visibleOn: 'typeof this.interval === "number"',
                  step: 500,
                  description: 'Timed refresh interval, in ms'
                },
                {
                  label: 'Silent refresh',
                  name: 'silentPolling',
                  type: 'switch',
                  mode: 'horizontal',
                  visibleOn: '!!data.interval',
                  description:
                    'Set whether to display loading when automatically refreshing'
                },
                {
                  label: tipedLabel(
                    'Stop timed refresh',
                    'Once the timed refresh is set, it will continue to refresh unless an expression is given. When the condition is met, the refresh will stop.'
                  ),
                  name: 'stopAutoRefreshWhen',
                  type: 'input-text',
                  mode: 'horizontal',
                  horizontal: {
                    leftFixed: 'md'
                  },
                  size: 'lg',
                  visibleOn: '!!data.interval',
                  placeholder: 'Stop timing refresh detection expression'
                }
              ]
            },
            {
              title: 'HTTP Configuration',
              tab: [
                {
                  type: 'switch',
                  label: tipedLabel(
                    'Request header',
                    'You can configure the <code>headers</code> object to add custom request headers'
                  ),
                  name: 'headers',
                  mode: 'horizontal',
                  className: 'm-b-xs',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? {'': ''} : null)
                },
                {
                  type: 'combo',
                  name: 'headers',
                  mode: 'horizontal',
                  syncDefaultValue: false,
                  multiple: true,
                  visibleOn: 'this.headers',
                  items: [
                    {
                      type: 'input-text',
                      name: 'key',
                      placeholder: 'Key',
                      unique: true,
                      required: true,
                      options: [
                        {
                          label: 'Content-Encoding',
                          value: 'Content-Encoding'
                        },
                        {
                          label: 'Content-Type',
                          value: 'Content-Type'
                        }
                      ]
                    },
                    {
                      type: 'input-text',
                      name: 'value',
                      placeholder: 'Value',
                      disabled: false
                    }
                  ],
                  pipeIn: (value: any) => {
                    if (!isObject(value)) {
                      return value;
                    }

                    let arr: Array<any> = [];

                    Object.keys(value).forEach(key => {
                      arr.push({
                        key: key || '',
                        value:
                          typeof value[key] === 'string'
                            ? value[key]
                            : JSON.stringify(value[key])
                      });
                    });
                    return arr;
                  },
                  pipeOut: (value: any) => {
                    if (!Array.isArray(value)) {
                      return value;
                    }
                    let obj: any = {};

                    value.forEach((item: any) => {
                      let key: string = item.key || '';
                      let value: any = item.value;
                      try {
                        value = JSON.parse(value);
                      } catch (e) {}

                      obj[key] = value;
                    });
                    return obj;
                  }
                },
                {
                  type: 'switch',
                  label: tipedLabel(
                    'Send data',
                    'When data mapping is not enabled, as much data as possible will be sent when sending an API. If you want to control the data sent yourself, or need additional data processing, please enable this option'
                  ),
                  name: 'data',
                  mode: 'horizontal',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                },
                {
                  type: 'combo',
                  syncDefaultValue: false,
                  name: 'data',
                  mode: 'horizontal',
                  renderLabel: false,
                  visibleOn: 'this.data',
                  descriptionClassName: 'help-block text-xs m-b-none',
                  description:
                    '<p>When data mapping is not enabled, the sent data will automatically switch to whitelist mode. Whatever is configured will be sent. Please bind the data. For example: <code>{"a": "\\${a}", "b": 2}</code></p><p>If you want to customize based on the default, please add a key of `&` and a value of `\\$$` as the first line. </p><div>When the value is <code>__undefined</code>, it means deleting the corresponding field. You can combine <code>{"&": "\\$$"}</code> to achieve the blacklist effect. </div>',
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (!isObject(value)) {
                      return value;
                    }

                    let arr: Array<any> = [];

                    Object.keys(value).forEach(key => {
                      arr.push({
                        key: key || '',
                        value:
                          typeof value[key] === 'string'
                            ? value[key]
                            : JSON.stringify(value[key])
                      });
                    });
                    return arr;
                  },
                  pipeOut: (value: any) => {
                    if (!Array.isArray(value)) {
                      return value;
                    }
                    let obj: any = {};

                    value.forEach((item: any) => {
                      let key: string = item.key || '';
                      let value: any = item.value;
                      try {
                        value = JSON.parse(value);
                      } catch (e) {}

                      obj[key] = value;
                    });
                    return obj;
                  },
                  items: [
                    {
                      placeholder: 'Key',
                      type: 'input-text',
                      unique: true,
                      name: 'key',
                      required: true
                    },

                    getSchemaTpl('DataPickerControl', {
                      placeholder: 'Value',
                      name: 'value'
                    })
                  ]
                },
                getSchemaTpl('apiRequestAdaptor'),
                {
                  type: 'switch',
                  label: tipedLabel(
                    'Return data',
                    'If you need to do additional data processing on the data in the returned results, please turn on this option'
                  ),
                  name: 'responseData',
                  mode: 'horizontal',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                },
                {
                  type: 'combo',
                  syncDefaultValue: false,
                  name: 'responseData',
                  mode: 'horizontal',
                  renderLabel: false,
                  visibleOn: 'this.responseData',
                  descriptionClassName: 'help-block text-xs m-b-none',
                  multiple: true,
                  pipeIn: (value: any) => {
                    if (!isObject(value)) {
                      return value;
                    }

                    let arr: Array<any> = [];

                    Object.keys(value).forEach(key => {
                      arr.push({
                        key: key || '',
                        value:
                          typeof value[key] === 'string'
                            ? value[key]
                            : JSON.stringify(value[key])
                      });
                    });
                    return arr;
                  },
                  pipeOut: (value: any) => {
                    if (!Array.isArray(value)) {
                      return value;
                    }
                    let obj: any = {};

                    value.forEach((item: any) => {
                      let key: string = item.key || '';
                      let value: any = item.value;
                      try {
                        value = JSON.parse(value);
                      } catch (e) {}

                      obj[key] = value;
                    });
                    return obj;
                  },
                  items: [
                    {
                      placeholder: 'Key',
                      type: 'input-text',
                      unique: true,
                      name: 'key',
                      required: true
                    },

                    {
                      placeholder: 'Value',
                      type: 'input-text',
                      name: 'value'
                    }
                  ]
                },
                getSchemaTpl(
                  name === 'validateApi' ? 'validateApiAdaptor' : 'apiAdaptor'
                )
              ]
            },
            {
              title: 'Prompt information',
              tab: [
                {
                  label: 'Default prompt text',
                  type: 'combo',
                  name: 'messages',
                  mode: 'normal',
                  multiLine: true,
                  items: [
                    {
                      label: 'Request successful',
                      type: 'input-text',
                      name: 'success'
                    },

                    {
                      label: 'Request failed',
                      type: 'input-text',
                      name: 'failed'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  render() {
    const {
      render,
      className,
      footerClassName,
      classPrefix,
      label,
      labelRemark,
      value,
      footer,
      border = false,
      onlyTabs = false,
      messageDesc,
      enablePickerMode,
      disabled,
      mode,
      enableHighlight,
      labelField = 'label',
      useMobileUI,
      popOverContainer,
      env,
      renderLabel
    } = this.props;
    let {apiStr, selectedItem, loading} = this.state;
    selectedItem =
      Array.isArray(selectedItem) && selectedItem.length !== 0
        ? selectedItem
        : [];
    const highlightLabel = selectedItem?.[0]?.[labelField] ?? '';

    return (
      <>
        <div className={cx('ae-ApiControl', className, {border})}>
          {onlyTabs ? (
            render('api-control-tabs', this.renderApiConfigTabs(true), {
              data: normalizeApi(value)
            })
          ) : (
            <>
              {!renderLabel && this.renderHeader()}

              <div className="ae-ApiControl-content" key="content">
                <div className={cx('ae-ApiControl-input')}>
                  {enableHighlight && highlightLabel ? (
                    <div className={cx('ae-ApiControl-highlight')}>
                      {loading ? (
                        <Spinner
                          show
                          icon="reload"
                          size="sm"
                          spinnerClassName={cx('Select-spinner')}
                        />
                      ) : (
                        <span className={cx('ae-ApiControl-highlight-tag')}>
                          <span>{highlightLabel}</span>
                          <a
                            onClick={this.clearPickerValue}
                            className={cx('Modal-close')}
                          >
                            <Icon
                              icon="close"
                              className={cx(
                                'icon',
                                'ae-ApiControl-highlight-close'
                              )}
                            />
                          </a>
                        </span>
                      )}
                    </div>
                  ) : (
                    <Input
                      ref={this.inputRef}
                      value={apiStr}
                      type="text"
                      disabled={disabled}
                      placeholder="http://"
                      onChange={this.handleSimpleInputChange}
                    />
                  )}
                  {enablePickerMode ? this.renderPickerSchema() : null}
                </div>

                {render('api-control-dialog', this.renderApiDialog(), {
                  data: normalizeApi(value)
                })}
              </div>
            </>
          )}
        </div>
        {Array.isArray(footer) && footer.length !== 0 ? (
          <footer className={cx('mt-3', footerClassName)} key="footer">
            {render('api-control-footer', footer)}
          </footer>
        ) : null}
      </>
    );
  }
}

@FormItem({
  type: 'ae-apiControl',
  renderLabel: false
})
export class APIControlRenderer extends APIControl {}
