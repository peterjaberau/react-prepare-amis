import React from 'react';
import {
  createObject,
  IScopedContext,
  Renderer,
  RendererProps,
  resolveEventData,
  ScopedComponentType,
  ScopedContext,
  autobind,
  getPropValue,
  setVariable
} from '@/packages/amis-core/src';

import {BaseSchema, SchemaClassName} from '../Schema';
import {SearchBox} from '@/packages/amis-ui/src';

import {ListenerAction, TestIdBuilder} from '@/packages/amis-core/src';
import type {SpinnerExtraProps} from '@/packages/amis-ui/src';

/**
 * 搜索框渲染器
 */
export interface SearchBoxSchema extends BaseSchema {
  /**
   * 指定为搜索框。
   *
   * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/search-box
   */
  type: 'search-box';

  /**
   * 外层 css 类名
   */
  className?: SchemaClassName;

  /**
   * 关键字名字。
   *
   * @default keywords
   */
  name?: string;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否为 Mini 样式。
   */
  mini?: boolean;

  /**
   * 是否为加强样式
   */
  enhance?: boolean;

  /**
   * 是否可清除
   */
  clearable?: boolean;

  /**
   * 是否立马搜索。
   */
  searchImediately?: boolean;

  /**
   * 是否开启清空内容后立即重新搜索
   */
  clearAndSubmit?: boolean;

  /** 是否处于加载状态 */
  loading?: boolean;
}

interface SearchBoxProps
  extends RendererProps,
    Omit<SearchBoxSchema, 'type' | 'className'>,
    SpinnerExtraProps {
  name: string;
  onQuery?: (query: {[propName: string]: string}) => any;
  loading?: boolean;
  testIdBuilder?: TestIdBuilder;
}

export interface SearchBoxState {
  value: string;
}

@Renderer({
  type: 'search-box'
})
export class SearchBoxRenderer extends React.Component<
  SearchBoxProps,
  SearchBoxState
> {
  static defaultProps = {
    name: 'keywords',
    mini: false,
    enhance: false,
    clearable: false,
    searchImediately: false,
    clearAndSubmit: false
  };
  static contextType = ScopedContext;

  static propsList: Array<string> = ['mini', 'searchImediately'];

  constructor(props: SearchBoxProps, context: IScopedContext) {
    super(props);
    this.state = {
      value: getPropValue(props) || ''
    };

    const scoped = context;
    scoped.registerComponent(this as ScopedComponentType);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this as ScopedComponentType);
  }

  @autobind
  async handleChange(value: string) {
    const {onChange, dispatchEvent} = this.props;
    this.setState({value});

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange?.(value);
  }

  @autobind
  handleCancel() {
    const name = this.props.name;
    const onQuery = this.props.onQuery;

    const value = getPropValue(this.props);
    if (value !== '') {
      const data: any = {};
      setVariable(data, name, '');
      onQuery?.(data);
    }
  }

  @autobind
  async handleSearch(text: string) {
    const {name, onQuery: onQuery, dispatchEvent} = this.props;
    const data: any = {};
    setVariable(data, name, text);

    const rendererEvent = await dispatchEvent(
      'search',
      createObject(this.props.data, data)
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onQuery?.(data);
  }

  @autobind
  dispatchEvent(name: string) {
    const {dispatchEvent} = this.props;
    dispatchEvent(
      name,
      resolveEventData(this.props, {value: this.state.value})
    );
  }

  doAction(
    action: ListenerAction,
    data: any,
    throwErrors: boolean,
    args?: any
  ) {
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      this.setState({value: ''});
    }
  }
  setData(value: any) {
    if (typeof value === 'string') {
      this.handleChange(value);
    }
  }

  render() {
    const {
      data,
      name,
      disabled,
      onQuery: onQuery,
      mini,
      enhance,
      clearable,
      searchImediately,
      clearAndSubmit,
      placeholder,
      onChange,
      className,
      style,
      mobileUI,
      loading,
      loadingConfig,
      onEvent,
      testIdBuilder
    } = this.props;
    const value = this.state.value;
    /** 有可能通过Search事件处理 */
    const isDisabled = (!onQuery && !onEvent?.search) || disabled;

    return (
      <SearchBox
        className={className}
        style={style}
        name={name}
        disabled={isDisabled}
        loading={loading}
        loadingConfig={loadingConfig}
        defaultActive={!!value}
        defaultValue={onChange ? undefined : value}
        value={value}
        mini={mini}
        enhance={enhance}
        clearable={clearable}
        searchImediately={searchImediately}
        clearAndSubmit={clearAndSubmit}
        onSearch={this.handleSearch}
        onCancel={this.handleCancel}
        placeholder={placeholder}
        onChange={this.handleChange}
        onFocus={() => this.dispatchEvent('focus')}
        onBlur={() => this.dispatchEvent('blur')}
        mobileUI={mobileUI}
        testIdBuilder={testIdBuilder}
      />
    );
  }
}
