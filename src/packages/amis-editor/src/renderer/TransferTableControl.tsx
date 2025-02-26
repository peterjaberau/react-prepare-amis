/**
 * @file Transfer table corresponding options
 */

import React from 'react';
import {render as amisRender, FormItem} from '@/packages/amis/src';
import type {SchemaApi} from '@/packages/amis/src';
import {autobind, getSchemaTpl} from '@/packages/amis-editor-core/src';
import cx from 'classnames';
import {tipedLabel} from '@/packages/amis-editor-core/src';

import type {FormControlProps} from '@/packages/amis-core/src';
import type {Option} from '@/packages/amis/src';

interface OptionControlProps extends FormControlProps {
  className?: string;
}

type SourceType = 'custom' | 'api' | 'form' | 'variable';

interface OptionControlState {
  api: SchemaApi;
  labelField: string;
  valueField: string;
  source: SourceType;
}

function BaseOptionControl(Cmpt: React.JSXElementConstructor<any>) {
  return class extends React.Component<OptionControlProps, OptionControlState> {
    $comp: string; // Record the path, no longer synchronize the internal from the external, only synchronize the external from the internal

    internalProps = ['checked', 'editing'];

    constructor(props: OptionControlProps) {
      super(props);

      this.state = {
        api: props.data.source,
        labelField: props.data.labelField,
        valueField: props.data.valueField,
        source: props.data.source
          ? /\$\{(.*?)\}/g.test(props.data.source)
            ? 'variable'
            : 'api'
          : 'custom'
      };

      this.handleSourceChange = this.handleSourceChange.bind(this);
      this.handleAPIChange = this.handleAPIChange.bind(this);
      this.handleLableFieldChange = this.handleLableFieldChange.bind(this);
      this.handleValueFieldChange = this.handleValueFieldChange.bind(this);
      this.onChange = this.onChange.bind(this);
    }

    /**
     * Update the unified export of options field
     */
    onChange() {
      const {source} = this.state;
      const {onBulkChange} = this.props;

      const data: Partial<OptionControlProps> = {
        source: undefined,
        options: undefined,
        labelField: undefined,
        valueField: undefined
      };

      if (['api', 'variable'].includes(source)) {
        const {api, labelField, valueField} = this.state;
        data.source = api;
        data.labelField = labelField || undefined;
        data.valueField = valueField || undefined;
      }

      onBulkChange && onBulkChange(data);
      return;
    }

    /**
     * Toggle option type
     */
    handleSourceChange(source: SourceType) {
      this.setState({api: '', source: source}, this.onChange);
    }

    handleAPIChange(source: SchemaApi) {
      this.setState({api: source}, this.onChange);
    }

    handleLableFieldChange(labelField: string) {
      this.setState({labelField}, this.onChange);
    }

    handleValueFieldChange(valueField: string) {
      this.setState({valueField}, this.onChange);
    }

    buildBatchAddSchema() {
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
          body: [
            {
              type: 'alert',
              level: 'warning',
              body: [
                {
                  type: 'tpl',
                  tpl: 'Each option is listed in a single line, and all items with unique values ​​are added as new options;<br/>Each line can be used to set label and value separately through spaces, for example: "张三zhangsan"'
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

    renderHeader() {
      const {render, label, labelRemark, useMobileUI, env, popOverContainer} =
        this.props;
      const classPrefix = env?.theme?.classPrefix;
      const {source} = this.state;
      const optionSourceList = (
        [
          {
            label: 'Custom options',
            value: 'custom'
          },
          {
            label: 'Interface acquisition',
            value: 'api'
          },
          {
            label: 'context variable',
            value: 'variable'
          }
        ] as Array<{
          label: string;
          value: SourceType;
        }>
      ).map(item => ({
        ...item,
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
                  selected: optionSourceList.find(
                    item => item.value === source
                  )!.label
                }
              }
            )}
          </div>
        </header>
      );
    }

    renderApiPanel() {
      const {render} = this.props;
      const {source, api, labelField, valueField} = this.state;
      if (source !== 'api') {
        return null;
      }

      return render(
        'api',
        getSchemaTpl('apiControl', {
          label: 'Interface',
          name: 'source',
          className: 'ae-ExtendMore',
          visibleOn: 'this.autoComplete !== false',
          value: api,
          onChange: this.handleAPIChange,
          footer: [
            {
              label: tipedLabel(
                'Display fields',
                'Data fields corresponding to option text, please configure multiple fields through templates'
              ),
              type: 'input-text',
              name: 'labelField',
              value: labelField,
              placeholder: 'Field corresponding to the option text',
              onChange: this.handleLableFieldChange
            },
            {
              label: 'value field',
              type: 'input-text',
              name: 'valueField',
              value: valueField,
              placeholder: 'the field corresponding to the value',
              onChange: this.handleValueFieldChange
            }
          ]
        })
      );
    }

    render() {
      const {source, api, labelField, valueField} = this.state;
      const {className, render} = this.props;
      const cmptProps = {
        ...this.props,
        data: {
          api,
          labelField,
          valueField,
          ...this.props?.data
        }
      };

      return (
        <div className={cx('ae-OptionControl', className)}>
          {this.renderHeader()}

          {source === 'custom' ? <Cmpt {...cmptProps} /> : null}

          {source === 'api' ? this.renderApiPanel() : null}

          {source === 'variable'
            ? render(
                'variable',
                getSchemaTpl('sourceBindControl', {
                  label: false,
                  className: 'ae-ExtendMore'
                }),
                {
                  onChange: this.handleAPIChange
                }
              )
            : null}
        </div>
      );
    }
  };
}

const renderInput = (
  name: string,
  placeholder: string,
  required: boolean = true,
  unique: boolean = false
) => {
  return {
    type: 'input-text',
    name,
    placeholder: placeholder,
    required,
    unique
  };
};

export default class TransferTableOption extends React.Component<
  OptionControlProps,
  {}
> {
  addColumns() {
    const {columns = [{type: 'text'}]} = this.props.data;
    return {
      type: 'action',
      actionType: 'dialog',
      label: 'Set table columns',
      level: 'enhance',
      dialog: {
        title: 'Set table column options',
        headerClassName: 'font-bold',
        closeOnEsc: true,
        closeOnOutside: false,
        showCloseButton: true,
        onConfirm: (...args: Array<any>) =>
          this.handleChange(args[2].columns, 'columns'),
        body: [
          {
            name: 'columns',
            type: 'combo',
            multiple: true,
            label: false,
            strictMode: false,
            addButtonText: 'Add a new column',
            draggable: false,
            value: columns,
            items: [
              {
                type: 'input-text',
                name: 'label',
                placeholder: 'Title',
                required: true
              },
              {
                type: 'input-text',
                name: 'name',
                placeholder: 'Bound field name',
                required: true
              },
              {
                type: 'select',
                name: 'type',
                placeholder: 'type',
                value: 'text',
                options: [
                  {
                    value: 'text',
                    label: 'Plain text'
                  },
                  {
                    value: 'tpl',
                    label: 'Template'
                  },
                  {
                    value: 'image',
                    label: 'Picture'
                  },
                  {
                    value: 'date',
                    label: 'Date'
                  },
                  {
                    value: 'progress',
                    label: 'Progress'
                  },
                  {
                    value: 'status',
                    label: 'status'
                  },
                  {
                    value: 'mapping',
                    label: 'Mapping'
                  },
                  {
                    value: 'operation',
                    label: 'Action bar'
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }

  addRows() {
    const {columns = [], options = [{}]} = this.props.data;
    return {
      type: 'tooltip-wrapper',
      tooltip: 'You need to set table columns before you can set table rows',
      tooltipTheme: 'dark',
      placement: 'top',
      tooltipStyle: {
        fontSize: '12px'
      },
      className: 'ae-formItemControl-label-tip',
      body: [
        {
          type: 'action',
          actionType: 'dialog',
          label: 'Set table row',
          level: 'enhance',
          disabled: columns && columns.length === 0,
          block: true,
          dialog: {
            title: 'Set table row options',
            headerClassName: 'font-bold',
            closeOnEsc: true,
            closeOnOutside: false,
            showCloseButton: true,
            size: columns.length >= 6 ? 'md' : '',
            onConfirm: (...args: Array<any>) =>
              this.handleChange(args[2].options, 'options'),
            body: [
              {
                type: 'form',
                wrapWithPanel: false,
                mode: 'normal',
                body: [
                  {
                    name: 'options',
                    type: 'combo',
                    multiple: true,
                    draggable: true,
                    addButtonText: 'Add',
                    value: options,
                    items: [
                      ...columns.map((item: Option) =>
                        renderInput(item.name, item.label ?? '', false)
                      ),
                      renderInput('value', '值', true, true)
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    };
  }

  @autobind
  handleChange(value: Array<Option>, type: 'options' | 'columns') {
    const {data} = this.props;
    const {onBulkChange, onValueChange} = this.props;
    data[type] = value;
    if (type === 'columns') {
      const keys = value.map(item => item.name);
      data.options = (data.options ?? []).map((item: Option) => {
        return {
          ...keys.reduce(
            (pv, cv) => {
              pv[cv] = item[cv];
              return pv;
            },
            {value: item.value}
          )
        };
      });
    }
    onValueChange && onValueChange(type, data, onBulkChange);
  }

  render() {
    return (
      <div className="ae-OptionControl-footer">
        {amisRender(this.addColumns())}
        {amisRender(this.addRows())}
      </div>
    );
  }
}

const TransferTableControl = BaseOptionControl(TransferTableOption);

@FormItem({
  type: 'ae-transferTableControl',
  strictMode: false,
  renderLabel: false
})
export class TransferTableControlRenderer extends TransferTableControl {}
