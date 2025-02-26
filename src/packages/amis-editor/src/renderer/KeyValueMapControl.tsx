import React from 'react';
import {FormItem, Button, render as amisRender} from '@/packages/amis/src';
import {autobind, getI18nEnabled} from '@/packages/amis-editor-core/src';
import uniqBy from 'lodash/uniqBy';

import type {FormControlProps} from '@/packages/amis-core/src';

interface IOption {
  label: string;
  value: string;
  editing?: boolean;
}

export interface KeyValueControlProps extends FormControlProps {}
export interface KeyValueControlState {
  unitOptions: IOption[];
}

@FormItem({
  type: 'ae-keyValueMapControl'
})
export class KeyValueMapControl extends React.Component<
  KeyValueControlProps,
  KeyValueControlState
> {
  constructor(props: KeyValueControlProps) {
    super(props);

    this.state = {
      unitOptions: this.transformOptions(props)
    };
  }

  transformOptions(props: KeyValueControlProps) {
    const {value} = props;
    if (Array.isArray(value)) {
      return value.map(item =>
        typeof item === 'string'
          ? {
              label: item,
              value: item
            }
          : item
      );
    } else {
      return [];
    }
  }

  /**
   * Data update
   */
  componentWillReceiveProps(nextProps: KeyValueControlProps) {
    const unitOptions = nextProps.value ? this.transformOptions(nextProps) : [];
    if (
      JSON.stringify(
        this.state.unitOptions.map(item => ({
          ...item,
          editing: undefined
        }))
      ) !== JSON.stringify(unitOptions)
    ) {
      this.setState({
        unitOptions
      });
    }
  }

  /**
   * Increase
   */
  @autobind
  handleAdd() {
    const {unitOptions} = this.state;
    unitOptions.push({
      label: '',
      value: '',
      editing: false
    });
    this.setState({unitOptions}, () => {
      this.onChange();
    });
  }

  /**
   * Batch increase
   */
  @autobind
  handleBatchAdd(values: {batchOption: string}[]) {
    const unitOptions = this.state.unitOptions.concat();
    const addedOptions: Array<{label: string; value: string}> =
      values[0].batchOption.split('\n').map(option => {
        const item = option.trim();
        if (~item.indexOf(' ')) {
          let [label, value] = item.split(' ');
          return {label: label.trim(), value: value.trim()};
        }
        return {label: item, value: item};
      });
    const newOptionsUniqByLabel = uniqBy(
      [...unitOptions, ...addedOptions],
      'label'
    );
    const newOptions = uniqBy(newOptionsUniqByLabel, 'value');

    this.setState({unitOptions: newOptions}, () => this.onChange());
  }

  /**
   * Edit text
   */
  @autobind
  handleEditLabel(index: number, value: string) {
    const unitOptions = this.state.unitOptions.concat();
    unitOptions.splice(index, 1, {...unitOptions[index], label: value});
    this.setState({unitOptions}, () => this.onChange());
  }

  /**
   * Edit value
   */
  @autobind
  handleValueChange(index: number, value: string) {
    const unitOptions = this.state.unitOptions.concat();
    unitOptions.splice(index, 1, {...unitOptions[index], value: value});
    this.setState({unitOptions}, () => this.onChange());
  }

  /**
   * Modify editing status
   */
  toggleEdit(index: number) {
    const {unitOptions} = this.state;
    unitOptions[index].editing = !unitOptions[index].editing;
    this.setState({unitOptions});
  }

  /**
   * Delete option
   */
  handleDelete(index: number) {
    const unitOptions = this.state.unitOptions.concat();
    unitOptions.splice(index, 1);
    this.setState({unitOptions}, () => this.onChange());
  }

  /**
   * Update unified export of unitOptions field
   */
  onChange() {
    const {onBulkChange} = this.props;
    const {unitOptions} = this.state;
    const options = unitOptions.map(item => ({
      label: item.label,
      value: item.value
    }));

    onBulkChange && onBulkChange({unitOptions: options});
    return;
  }

  renderOption(item: IOption, index: number) {
    const {label, value, editing} = item;
    const {render} = this.props;
    const i18nEnabled = getI18nEnabled();
    const editDom = editing ? (
      <div className="ae-KeyValMapControlItem-extendMore">
        {render('option', {
          type: 'container',
          className: 'ae-ExtendMore right mb-2',
          body: [
            {
              type: 'button',
              className: 'ae-KeyValMapControlItem-closeBtn',
              label: '×',
              level: 'link',
              onClick: () => this.toggleEdit(index)
            },
            {
              children: ({render}: any) =>
                render(
                  'label',
                  {
                    type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                    placeholder: 'display text',
                    label: 'text',
                    mode: 'horizontal',
                    name: 'optionLabel',
                    labelClassName: 'ae-KeyValMapControlItem-EditLabel',
                    valueClassName: 'ae-KeyValMapControlItem-EditValue'
                  },
                  {
                    value: label,
                    onChange: (v: string) => this.handleEditLabel(index, v)
                  }
                )
            },
            {
              children: ({render}: any) =>
                render(
                  'value',
                  {
                    type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                    placeholder: 'value content',
                    label: 'value',
                    mode: 'horizontal',
                    name: 'optionValue',
                    labelClassName: 'ae-KeyValMapControlItem-EditLabel',
                    valueClassName: 'ae-KeyValMapControlItem-EditValue'
                  },
                  {
                    value,
                    onChange: (v: string) => this.handleValueChange(index, v)
                  }
                )
            }
          ]
        })}
      </div>
    ) : null;

    const operationBtn = [
      {
        type: 'button',
        className: 'ae-KeyValMapControlItem-action',
        label: 'Edit',
        onClick: () => this.toggleEdit(index)
      },
      {
        type: 'button',
        className: 'ae-KeyValMapControlItem-action',
        label: 'Delete',
        onClick: () => this.handleDelete(index)
      }
    ];

    return (
      <div className="ae-KeyValMapControlItem" key={index}>
        <div className="ae-KeyValMapControlItem-Main">
          {render('dropdown', {
            type: 'flex',
            className: 'ae-KeyValMapControlItem-flex',
            items: [
              {
                children: ({render}: any) =>
                  render(
                    'value',
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      className: 'ae-KeyValMapControlItem-input',
                      label: false,
                      name: 'optionLabel',
                      placeholder: 'Please enter text/value',
                      clearable: false
                    },
                    {
                      value: label,
                      onChange: (value: string) => {
                        this.handleEditLabel(index, value);
                      }
                    }
                  )
              },
              {
                type: 'dropdown-button',
                className: 'ae-KeyValMapControlItem-dropdown',
                btnClassName: 'px-2',
                icon: 'fa fa-ellipsis-h',
                hideCaret: true,
                closeOnClick: true,
                align: 'right',
                menuClassName: 'ae-KeyValMapControlItem-ulmenu',
                buttons: operationBtn
              }
            ]
          })}
        </div>
        {editDom}
      </div>
    );
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
        onConfirm: this.handleBatchAdd,
        body: [
          {
            type: 'alert',
            level: 'warning',
            body: [
              {
                type: 'tpl',
                tpl: 'Each option is listed in a single line, and all items with unique values ​​are added as new options;<br/>Each line can be used to set the label and value separately through spaces, for example: "张三zhangsan"'
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
    const {unitOptions} = this.state;
    const {render} = this.props;
    return (
      <div className="ae-KeyValMapControl-wrapper">
        {unitOptions.length ? (
          <div>
            {unitOptions.map((item, index) => this.renderOption(item, index))}
          </div>
        ) : null}
        <div className="ae-KeyValMapControl-footer">
          <Button level="enhance" onClick={this.handleAdd}>
            Add options
          </Button>
          {render('inner', this.buildBatchAddSchema())}
        </div>
      </div>
    );
  }
}
