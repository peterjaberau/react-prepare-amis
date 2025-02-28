import React from 'react';
import mergeWith from 'lodash/mergeWith';
import cloneDeep from 'lodash/cloneDeep';
import cx from 'classnames';
import {FormItem, InputBox} from '@/packages/amis/src';
import {PickerContainer} from '@/packages/amis/src';

import {getEnv} from 'mobx-state-tree';
import {normalizeApi, isEffectiveApi, isApiOutdated} from '@/packages/amis-core/src';

import {
  autobind,
  isObject,
  anyChanged,
  createObject,
  getSchemaTpl
} from '@/packages/amis-editor-core/src';
import {tipedLabel} from '@/packages/amis-editor-core/src';

import type {SchemaObject, SchemaCollection, SchemaApi} from '@/packages/amis/src';
import type {Api} from '@/packages/amis/src';
import type {FormControlProps} from '@/packages/amis-core/src';
import type {ActionSchema} from '@/packages/amis/src';

export interface APIControlProps extends FormControlProps {
  name?: string;
  label?: string;
  value?: any;
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
}

export default class APIControl extends React.Component<
  APIControlProps,
  APIControlState
> {
  static defaultProps: Pick<APIControlProps, 'pickerBtnSchema'> = {
    pickerBtnSchema: {
      type: 'button',
      level: 'link',
      size: 'sm',
      label: 'Click to select'
    }
  };
  constructor(props: APIControlProps) {
    super(props);

    this.state = {
      apiStr: this.transformApi2Str(props.value),
      selectedItem: [],
      schema: props.pickerSchema
    };
  }

  componentDidUpdate(prevProps: APIControlProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      this.setState({apiStr: this.transformApi2Str(props.value)});
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

  transformApi2Str(value: any) {
    const api = normalizeApi(value);

    return api.url ? `${api.method ? `${api.method}:` : ''}${api.url}` : '';
  }

  async fetchOptions() {
    const {value, data, env} = this.props;
    let {pickerSource} = this.props;
    const apiObj = normalizeApi(value);
    const apiKey = apiObj?.url.split('api://')?.[1];

    if (!pickerSource) {
      return;
    }

    const ctx = createObject(data, {value, op: 'loadOptions'});
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
  handleSubmit(values: SchemaApi, action: any) {
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

  renderHeader() {
    const {render, actions, enablePickerMode} = this.props;

    const actionsDom =
      Array.isArray(actions) && actions.length > 0
        ? actions.map((action, index) => {
            return render(`action/${index}`, action, {
              key: index,
              onAction: this.handleAction.bind(this, action)
            });
          })
        : null;

    return actionsDom || enablePickerMode ? (
      <header className="ae-ApiControl-header" key="header">
        {enablePickerMode ? this.renderPickerSchema() : actionsDom}
      </header>
    ) : null;
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
        value={selectedItem}
        headerClassName={cx(pickerHeaderClassName, 'font-bold')}
        onConfirm={this.handlePickerConfirm}
        onCancel={this.handlePickerClose}
        size={pickerSize}
        bodyRender={({value, onClose, onChange, setState, ...states}) => {
          return render('api-control-picker', schema!, {
            data: {[pickerName]: selectedItem},
            onSelect: (items: Array<any>) => {
              setState({selectedItem: items});
              onChange(this.normalizeValue(items, onPickerSelect));
            }
          });
        }}
      >
        {({onClick, isOpened}) =>
          render('picker-action', pickerBtnSchema!, {
            onClick: async (e: React.MouseEvent<any>) => {
              if (!isOpened && enablePickerMode) {
                try {
                  await this.fetchOptions();
                } catch {}
              }

              onClick(e);
            }
          })
        }
      </PickerContainer>
    );
  }

  renderApiDialog() {
    const {messageDesc: string} = this.props;

    return {
      label: '',
      type: 'action',
      acitonType: 'dialog',
      size: 'sm',
      icon: 'fa fa-code',
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
        body: [this.renderApiConfigTabs(this.props.messageDesc)]
      }
    };
  }

  renderApiConfigTabs(messageDesc?: string, submitOnChange: boolean = false) {
    return {
      type: 'form',
      className: 'ae-ApiControl-form :AMISCSSWrapper',
      mode: 'horizontal',
      submitOnChange,
      wrapWithPanel: false,
      onSubmit: this.handleSubmit,
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
                  description: `${'The format of the body sent is'}: <%= this.dataType === "json" ? "application/json" : (this.dataType === "form-data" ? "multipart/form-data" : (this.dataType === "form" ? "application/x-www-form-urlencoded" : "")) %>, ${'When there is a file in the sent content, the form-data format will be automatically used. '}`,
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
                  label: tipedLabel(
                    'Initial Load',
                    'When the initialization interface is configured, the component will initially pull the interface data, which can be modified through the following configuration'
                  ),
                  type: 'group',
                  visibleOn: 'this.initApi',
                  mode: 'horizontal',
                  direction: 'vertical',
                  // labelRemark: {
                  //   trigger: 'hover',
                  //   rootClose: true,
                  //   content:
                  // 'After configuring the initialization interface, the component will initially pull the interface data, which can be modified through the following configuration',
                  //   placement: 'top'
                  // },

                  body: [
                    {
                      name: 'initFetch',
                      type: 'radios',
                      inline: true,
                      mode: 'normal',
                      renderLabel: false,
                      onChange: () => {
                        document.getElementsByClassName(
                          'ae-Settings-content'
                        )[0].scrollTop = 0;
                      },
                      // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
                      options: [
                        {
                          label: 'Yes',
                          value: true
                        },

                        {
                          label: 'No',
                          value: false
                        },

                        {
                          label: 'expression',
                          value: ''
                        }
                      ]
                    },
                    {
                      name: 'initFetchOn',
                      autoComplete: false,
                      visibleOn: 'typeof this.initFetch !== "boolean"',
                      type: 'input-text',
                      mode: 'normal',
                      size: 'lg',
                      renderLabel: false,
                      placeholder:
                        'For example: this.id means initial loading when there is an id value',
                      className: 'm-t-n-sm'
                    }
                  ]
                },
                {
                  label: 'Timed refresh',
                  name: 'interval',
                  type: 'switch',
                  mode: 'horizontal',
                  visibleOn: 'this.initApi',
                  pipeIn: (value: any) => !!value,
                  pipeOut: (value: any) => (value ? 3000 : undefined)
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
                  visibleOn: '!!this.interval',
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
                  visibleOn: '!!this.interval',
                  placeholder: 'Stop timing refresh detection expression'
                  // labelRemark: {
                  //   trigger: 'hover',
                  //   rootClose: true,
                  //   content:
                  // 'Once the timed refresh is set, it will continue to refresh unless an expression is given. If the condition is met, the refresh will stop.',
                  //   placement: 'top'
                  // }
                }
              ]
            },
            {
              title: 'HTTP Configuration',
              tab: [
                {
                  type: 'fieldSet',
                  title: 'Body',
                  headingClassName: 'ae-ApiControl-title',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        'Send data mapping',
                        'When data mapping is not enabled, as much data as possible will be sent when sending an API. If you want to control the data sent yourself, or need additional data processing, please enable this option'
                      ),
                      name: 'data',
                      mode: 'row',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      // 'When data mapping is not enabled, as much data as possible will be sent when sending an API. If you want to control the data sent yourself, or need additional data processing, please enable this option',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                    },
                    {
                      type: 'combo',
                      syncDefaultValue: false,
                      name: 'data',
                      mode: 'normal',
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

                        {
                          placeholder: 'Value',
                          type: 'input-text',
                          name: 'value'
                        }
                      ]
                    },
                    {
                      type: 'switch',
                      label: tipedLabel(
                        'Return result mapping',
                        'If you need to do additional data processing on the returned results, please turn on this option'
                      ),
                      name: 'responseData',
                      mode: 'row',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      // 'If you need to do additional data processing on the returned results, please turn on this option',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'&': '$$'} : null)
                    },
                    {
                      type: 'combo',
                      syncDefaultValue: false,
                      name: 'responseData',
                      mode: 'normal',
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
                    getSchemaTpl('apiRequestAdaptor'),
                    getSchemaTpl('apiAdaptor')
                  ]
                },
                {
                  type: 'fieldSet',
                  title: 'Header',
                  headingClassName: 'ae-ApiControl-title',
                  body: [
                    {
                      type: 'switch',
                      label: tipedLabel(
                        'Request header',
                        'You can configure the headers object and add custom request headers'
                      ),
                      name: 'headers',
                      mode: 'row',
                      className: 'm-b-xs',
                      // labelRemark: {
                      //   trigger: 'hover',
                      //   rootClose: true,
                      //   content:
                      // 'You can configure the <code>headers</code> object to add custom request headers',
                      //   placement: 'top'
                      // },
                      pipeIn: (value: any) => !!value,
                      pipeOut: (value: any) => (value ? {'': ''} : null)
                    },
                    {
                      type: 'combo',
                      name: 'headers',
                      mode: 'row',
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
                    }
                  ]
                }
              ]
            },
            {
              title: 'Other',
              tab: [
                {
                  label: 'Default message prompt',
                  type: 'combo',
                  name: 'messages',
                  mode: 'normal',
                  multiLine: true,
                  description:
                    messageDesc ||
                    'Set the default prompt message for ajax, which is useful when ajax does not return msg information. If ajax returns with msg value, ajax return is still the main one',
                  items: [
                    {
                      label: 'Get successful prompt',
                      type: 'input-text',
                      name: 'success'
                    },

                    {
                      label: 'Get failed prompt',
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
    // return
  }

  render() {
    const {
      render,
      className,
      value,
      footer,
      border = false,
      messageDesc
    } = this.props;

    return (
      <div className={cx('ae-ApiControl', className, {border})}>
        {this.renderHeader()}

        <div className="ae-ApiControl-content" key="content">
          <InputBox
            className="ae-ApiControl-input m-b-none"
            value={this.state.apiStr}
            clearable={false}
            placeholder="http://"
            onChange={(value: string) => this.handleSubmit(value, 'input')}
          />
          {render('api-control-dialog', this.renderApiDialog(), {
            data: normalizeApi(value)
          })}
        </div>

        {Array.isArray(footer) && footer.length !== 0 ? (
          <footer className="mt-3" key="footer">
            {render('api-control-footer', footer)}
          </footer>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-actionApiControl'
})
export class APIControlRenderer extends APIControl {}
