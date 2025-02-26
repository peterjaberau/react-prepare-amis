/**
 * @file FieldSetting.tsx
 * @desc Field management in scaffolding
 */

import React from 'react';
import {reaction} from 'mobx';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import {isObject} from '@/packages/amis-core/src';
import {findDOMNode} from 'react-dom';
import {
  FormItem,
  FormControlProps,
  autobind,
  isValidApi,
  normalizeApi
} from '@/packages/amis-core/src';
import {Button, toast} from '@/packages/amis-ui/src';
import {DSFeatureEnum} from '../builder/constants';

import type {IReactionDisposer} from 'mobx';
import type {InputTableColumnProps} from '@/packages/amis-ui/src';
import type {DSFeatureType, ScaffoldField} from '../builder/type';

interface FieldSettingProps extends FormControlProps {
  /** Scaffolding rendering type*/
  renderer?: string;
  feat: DSFeatureType;
  /** Field collection corresponding to supported functional scenarios, eg: listFields, bulkEditFields, etc.*/
  fieldKeys: string[];
  config: {
    showInputType?: boolean;
    showDisplayType?: boolean;
  };
  onAutoGenerateFields: (params: {
    api: any;
    props: FieldSettingProps;
    setState: (state: any) => void;
  }) => Promise<any[]>;
}

interface RowData extends ScaffoldField {}

interface FieldSettingState {
  loading: boolean;
  fields: RowData[];
}

export class FieldSetting extends React.Component<
  FieldSettingProps,
  FieldSettingState
> {
  static defaultProps = {
    config: {
      showInputType: true,
      showDisplayType: true
    }
  };

  static validator = (items: RowData[], isInternal?: boolean) => {
    const cache: Record<string, boolean> = {};
    const fields = items ?? [];
    let error: string | boolean = false;

    for (let [index, item] of fields.entries()) {
      /** Verify when submitting*/
      if (!item.name && isInternal !== true) {
        error = `The field name of sequence number "${
          index + 1
        }" cannot be empty`;
        break;
      }

      if (!cache.hasOwnProperty(item.name)) {
        cache[item.name] = true;
        continue;
      }

      error = `Field name "${item.name}" of sequence number "${
        index + 1
      }" is not unique`;
      break;
    }

    return error;
  };

  reaction: IReactionDisposer;

  dom: HTMLElement;

  formRef = React.createRef<{submit: () => Promise<Record<string, any>>}>();

  tableRef = React.createRef<any>();

  scaffold: RowData = {
    label: '',
    name: '',
    displayType: 'tpl',
    inputType: 'input-text'
  };

  columns: InputTableColumnProps[];

  constructor(props: FieldSettingProps) {
    super(props);

    const {render, classnames: cx, env, config, data, renderer, feat} = props;
    const popOverContainer = env?.getModalContainer?.() ?? this.dom;
    const {showDisplayType, showInputType} = config || {};
    const isFirstStep = data?.__step === 0;

    this.state = {
      loading: false,
      fields: Array.isArray(props.value) ? props.value : []
    };
    this.reaction = reaction(
      () => {
        const ctx = props?.store?.data;
        const initApi = ctx?.initApi;
        const listApi = ctx?.listHere;
        let result = '';

        try {
          result = `${JSON.stringify(initApi)}${JSON.stringify(listApi)}`;
        } catch (error) {}

        return result;
      },
      () => this.forceUpdate()
    );
  }

  componentDidMount() {
    this.dom = findDOMNode(this) as HTMLElement;
  }

  componentDidUpdate(
    prevProps: Readonly<FieldSettingProps>,
    prevState: Readonly<FieldSettingState>,
    snapshot?: any
  ): void {
    const prevValue = prevProps.value;
    const value = this.props.value;

    if (
      (prevValue?.length !== value?.length || !isEqual(prevValue, value)) &&
      !isEqual(value, prevState?.fields)
    ) {
      this.setState({fields: Array.isArray(value) ? value : []});
    }
  }

  componentWillUnmount() {
    this.reaction?.();
  }

  isFirstStep() {
    return this.props?.manager?.store?.scaffoldFormStep === 0;
  }

  @autobind
  handleTableChange(items?: RowData[]) {
    if (!items || !Array.isArray(items)) {
      return;
    }

    const fields = this.state.fields.concat();

    this.handleFieldsChange(
      items.map((row: RowData) => {
        const item = fields.find((r: RowData) => r?.name === row.name);

        return {
          ...pick(
            {
              ...item,
              ...row
            },
            ['label', 'name', 'displayType', 'inputType']
          ),
          checked: true
        };
      })
    );
  }

  @autobind
  handleSubmit(data: {items: RowData[]}) {
    const {onSubmit} = this.props;

    onSubmit?.(data?.items);
  }

  @autobind
  async handleGenerateFields(e: React.MouseEvent<any>) {
    const {
      store,
      renderer,
      feat,
      env,
      manager,
      data: ctx,
      onAutoGenerateFields
    } = this.props;
    const scaffoldData = store?.data;
    let api =
      renderer === 'form'
        ? scaffoldData?.initApi
        : renderer === 'crud'
        ? scaffoldData?.listApi
        : '';

    if (
      !api ||
      (renderer === 'form' &&
        feat !== DSFeatureEnum.Edit &&
        feat !== DSFeatureEnum.View)
    ) {
      return;
    }

    this.setState({loading: true});
    let fields: RowData[] = [];

    if (onAutoGenerateFields && typeof onAutoGenerateFields === 'function') {
      try {
        fields = await onAutoGenerateFields({
          api: api,
          props: this.props,
          setState: this.setState
        });
      } catch (error) {
        toast.warning(
          error.message ??
            'The API response format is incorrect, please check the interface response format requirements'
        );
      }
    } else {
      const schemaFilter = manager?.store?.schemaFilter;

      if (schemaFilter) {
        api = schemaFilter({
          api
        }).api;
      }

      try {
        const result = await env?.fetcher(api, ctx);

        if (!result.ok) {
          toast.warning(
            result.defaultMsg ??
              result.msg ??
              'The API response format is incorrect, please check the interface response format requirements'
          );
          this.setState({loading: false});
          return;
        }

        let sampleRow: Record<string, any>;
        if (feat === 'List') {
          const items = result.data?.rows || result.data?.items || result.data;
          sampleRow = items?.[0];
        } else {
          sampleRow = result.data;
        }

        if (sampleRow) {
          Object.entries(sampleRow).forEach(([key, value]) => {
            let inputType = 'input-text';

            if (Array.isArray(value)) {
              inputType = 'select';
            } else if (isObject(value)) {
              inputType = 'combo';
            } else if (typeof value === 'number') {
              inputType = 'input-number';
            }

            fields.push({
              label: key,
              name: key,
              displayType: 'tpl',
              inputType,
              checked: true
            });
          });
        }
      } catch (error) {
        toast.warning(
          error.message ??
            'The API response format is incorrect, please check the interface response format requirements'
        );
      }
    }

    fields = Array.isArray(fields) && fields.length > 0 ? fields : [];

    this.handleFieldsChange(fields);
    this.setState({loading: false});
  }

  @autobind
  handleFieldsChange(fields: RowData[]) {
    const {
      manager,
      fieldKeys,
      onChange,
      onBulkChange,
      submitOnChange,
      renderer,
      data: ctx
    } = this.props;
    const isFirstStep = this.isFirstStep();
    const scaffoldStepManipulated = manager?.store?.scaffoldStepManipulated;

    this.setState({fields});

    if (renderer === 'form') {
      onChange?.(fields, submitOnChange, true);
    } else {
      if (isFirstStep) {
        /** If the next step has not been performed, initialize all feat fields, otherwise only modify the List scene field*/
        if (scaffoldStepManipulated) {
          onChange?.(fields, submitOnChange, true);
        } else {
          const updatedData: Record<string, RowData[]> = {};

          fieldKeys.forEach(fieldKey => {
            if (!updatedData.hasOwnProperty(fieldKey)) {
              updatedData[fieldKey] = fields;
            }
          });

          onBulkChange?.({...updatedData, listFields: fields}, submitOnChange);
        }
      } else {
        onChange?.(fields, submitOnChange, true);
      }
    }
  }

  debounceGenerateFields = debounce(
    async (e: React.MouseEvent<any>) => this.handleGenerateFields(e),
    200,
    {trailing: true, leading: false}
  );

  @autobind
  renderFooter() {
    const {classnames: cx, renderer, store, data: ctx, feat} = this.props;
    const scaffoldData = store?.data;
    const {initApi, listApi} = scaffoldData || {};
    const {loading} = this.state;
    const isForm = renderer === 'form';
    const isCRUD = renderer === 'crud';
    const fieldApi = isForm ? initApi : isCRUD ? listApi : '';
    const isApiValid = isValidApi(normalizeApi(fieldApi)?.url);
    const showAutoGenBtn =
      (isForm &&
        (feat === DSFeatureEnum.Edit || feat === DSFeatureEnum.View)) ||
      (isCRUD && feat === DSFeatureEnum.List && ctx?.__step === 0);

    return showAutoGenBtn ? (
      <div
        className={cx('ae-FieldSetting-footer', {
          ['ae-FieldSetting-footer--form']: isForm
        })}
      >
        <Button
          size="sm"
          level="link"
          loading={loading}
          disabled={!isApiValid || loading}
          disabledTip={{
            content: loading
              ? 'Data processing...'
              : isForm
              ? 'Please fill in the initialization interface first'
              : 'Please fill in the interface first',
            tooltipTheme: 'dark'
          }}
          onClick={this.debounceGenerateFields}
        >
          <span>Automatically generate fields based on interfaces</span>
        </Button>
      </div>
    ) : null;
  }

  render() {
    const {
      render,
      classnames: cx,
      name = 'items',
      renderer,
      config,
      feat
    } = this.props;
    const {showDisplayType, showInputType} = config || {};
    const isFirstStep = this.isFirstStep();
    const fields = this.state.fields.concat();

    return (
      <>
        {render(
          'field-setting',
          {
            type: 'input-table',
            name: name,
            label: false,
            className: cx(
              'ae-FieldSetting-Table',
              'mb-0'
            ) /** There is an operation area at the bottom, kill the default margin-bottom */,
            toolbarClassName: 'w-1/2',
            showIndex: true,
            showFooterAddBtn: true,
            addable: true,
            addBtnLabel: 'Add',
            addBtnIcon: false,
            editable: true,
            editBtnLabel: 'Edit',
            editBtnIcon: false,
            removable: true,
            deleteBtnLabel: 'Delete',
            deleteBtnIcon: false,
            confirmBtnLabel: 'Confirm',
            cancelBtnLabel: 'Cancel',
            needConfirm: true,
            enableStaticTransform: true,
            autoFocus: false,
            affixHeader: true,
            columnsTogglable: false,
            autoFillHeight: {
              maxHeight: 325 // Display at least 5 elements
            },
            footerAddBtn: {
              level: 'link',
              label: 'Add field'
            },
            placeholder: 'No field yet',
            scaffold: this.scaffold,
            columns: [
              {
                type: 'input-text',
                name: 'name',
                label: 'field name',
                placeholder: 'field name'
              },
              {
                type: 'input-text',
                name: 'label',
                label: 'Title',
                placeholder: 'Field title'
              },
              showInputType &&
              !(renderer === 'crud' && feat === 'List' && !isFirstStep)
                ? {
                    type: 'select',
                    name: 'inputType',
                    label: 'input type',
                    options: [
                      {
                        label: 'Single-line text box',
                        value: 'input-text',
                        icon: 'input-text-plugin'
                      },
                      {label: 'Multi-line text', value: 'textarea'},
                      {label: 'Number input', value: 'input-number'},
                      {label: 'Radio', value: 'radios'},
                      {label: 'checkbox', value: 'checkbox'},
                      {label: 'Checkbox', value: 'checkboxes'},
                      {label: 'Drop-down box', value: 'select'},
                      {label: 'switch', value: 'switch'},
                      {label: 'Date', value: 'input-date'},
                      {label: 'Table Edit', value: 'input-table'},
                      {label: 'Combination input', value: 'combo'},
                      {label: 'File upload', value: 'input-file'},
                      {label: 'Image upload', value: 'input-image'},
                      {label: 'Rich text editor', value: 'input-rich-text'}
                    ]
                  }
                : undefined,
              showDisplayType
                ? {
                    type: 'select',
                    name: 'displayType',
                    label: 'Display type',
                    options: [
                      {
                        value: 'tpl',
                        label: 'text',
                        typeKey: 'tpl'
                      },
                      {
                        value: 'image',
                        label: 'Picture',
                        typeKey: 'src'
                      },
                      {
                        value: 'date',
                        label: 'Date',
                        typeKey: 'value'
                      },
                      {
                        value: 'progress',
                        label: 'Progress',
                        typeKey: 'value'
                      },
                      {
                        value: 'status',
                        label: 'status',
                        typeKey: 'value'
                      },
                      {
                        value: 'mapping',
                        label: 'Mapping',
                        typeKey: 'value'
                      },
                      {
                        value: 'list',
                        label: 'list',
                        typeKey: 'value'
                      }
                    ]
                  }
                : undefined
            ].filter(Boolean)
          },
          {
            data: {
              [name]: fields
            },
            loading: this.state.loading,
            onChange: this.handleTableChange
          }
        )}
        {this.renderFooter()}
      </>
    );
  }
}

@FormItem({type: 'ae-field-setting'})
export default class FieldSettingRenderer extends FieldSetting {}
