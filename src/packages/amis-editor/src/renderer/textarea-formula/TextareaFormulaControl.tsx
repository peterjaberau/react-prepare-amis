/**
 * @file long text formula input box
 */

import React, {MouseEvent} from 'react';
import cx from 'classnames';
import {Icon, FormItem, TooltipWrapper, Spinner} from 'amis';
import {autobind, FormControlProps, render as renderAmis} from 'amis-core';
import {CodeMirrorEditor, FormulaEditor} from 'amis-ui';
import {FormulaPlugin, editorFactory} from './plugin';
import {Button, Overlay, PopOver, VariableList} from 'amis-ui';
import {RootClose, isMobile} from 'amis-core';
import FormulaPicker, {CustomFormulaPickerProps} from './FormulaPicker';
import {reaction} from 'mobx';
import {renderFormulaValue} from '../FormulaControl';
import {getVariables, getQuickVariables} from '@/packages/amis-editor-core/src';
import {findDOMNode} from 'react-dom';

import type {VariableItem, CodeMirror} from 'amis-ui';

export interface AdditionalMenuClickOpts {
  /**
   * Current expression value
   */
  value: string;
  /**
   * Re-assign the expression
   * @param value
   * @returns
   */
  setValue: (value: string) => void;
  /**
   * Insert a new value at the cursor position
   * @param content The content to be inserted
   * @param type The type of inserted content, currently supports expression expression and normal text string
   * @param brace custom insertion position
   * @returns
   */
  insertContent: (
    content: string,
    type: 'expression' | 'string',
    brace?: Array<CodeMirror.Position>
  ) => void;
}

export interface AdditionalMenu {
  label: string; // text (tooltip content if an icon exists)
  onClick?: (
    e: MouseEvent<HTMLAnchorElement>,
    opts: AdditionalMenuClickOpts
  ) => void; // trigger event
  icon?: string; // Icon
  className?: string; //Outer class name
}
export interface TextareaFormulaControlProps extends FormControlProps {
  /**
   * The height of the input box, default is 100 px
   */
  height?: number;

  /**
   * A collection of variables used for prompts, empty by default
   */
  variables?: Array<VariableItem> | Function;

  /**
   * Use with variables
   * When props.variables exists, whether to get the variable set from the amis data domain, the default is false;
   */
  requiredDataPropsVariables?: boolean;

  /**
   * Variable display mode, optional values: 'tabs' | 'tree'
   */
  variableMode?: 'tree' | 'tabs';

  /**
   * Additional bottom button menu items
   */
  additionalMenus?: Array<AdditionalMenu>;

  /**
   * Click the long text formula input box as a whole
   */
  onOverallClick?: () => void;

  /**
   * Custom fx panel
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;

  /**
   * Custom markup text
   * @param editor
   * @returns
   */
  customMarkText?: (editor: CodeMirror.Editor) => void;

  /**
   * Plugin initialization lifecycle callback
   * @param plugin plugin instance, which contains the formula plugin method
   * @returns
   */
  onPluginInit?: (plugin: FormulaPlugin) => void;

  /**
   * The title of the pop-up window, default is "Expression"
   */
  header: string;

  /**
   * Whether to support full screen, default is true
   */
  allowFullscreen?: boolean;

  /**
   * fx before update event
   */
  beforeFxConfirm?: (plugin: FormulaPlugin) => void;

  /**
   * Simplify member operations
   */
  simplifyMemberOprs?: boolean;

  /**
   * Payment supports quick variables
   */
  quickVariables?: boolean;
}

interface TextareaFormulaControlState {
  value: string; // current text value

  variables: Array<VariableItem>; // variable data

  quickVariables: Array<VariableItem>; // Quick variable data

  formulaPickerOpen: boolean; // Whether to open the formula editor

  formulaPickerValue: string; // Formula editor content

  expressionBrace?: Array<CodeMirror.Position>; // expression position

  isFullscreen: boolean; //Is it full screen?

  tooltipStyle: {[key: string]: string}; // tooltip style

  loading: boolean;

  menuIsOpened: boolean;
  quickVariablesIsOpened: boolean;
}

export class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    height: 100,
    placeholder: 'Please enter'
  };

  wrapRef = React.createRef<HTMLDivElement>();
  tooltipRef = React.createRef<HTMLDivElement>();
  buttonTarget: HTMLElement;

  editorPlugin: FormulaPlugin;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: TextareaFormulaControlProps) {
    super(props);
    this.state = {
      value: this.props.value || '',
      variables: [],
      quickVariables: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      isFullscreen: false,
      tooltipStyle: {},
      loading: false,
      menuIsOpened: false,
      quickVariablesIsOpened: false
    };
  }

  async componentDidMount() {
    const editorStore = (window as any).editorStore;
    this.appLocale = editorStore?.appLocale;
    this.appCorpusData = editorStore?.appCorpusData;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      async () => {
        this.appLocale = editorStore?.appLocale;
        this.appCorpusData = editorStore?.appCorpusData;
      }
    );

    if (this.tooltipRef.current) {
      this.tooltipRef.current.addEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }

    const variables = await getVariables(this);
    const quickVariables = await getQuickVariables(this);
    this.setState({variables, quickVariables});
  }

  async componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    if (
      this.state.value !== this.props.value &&
      prevProps.value !== this.props.value
    ) {
      this.setState(
        {
          value: this.props.value
        },
        this.editorAutoMark
      );
      this.editorPlugin.setValue(this.props.value || '');
    }
  }

  componentWillUnmount() {
    if (this.tooltipRef.current) {
      this.tooltipRef.current.removeEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }
    this.editorPlugin?.dispose();

    this.unReaction?.();
  }

  @autobind
  menuRef(ref: HTMLDivElement) {
    this.buttonTarget = ref;
  }

  @autobind
  onExpressionMouseEnter(
    e: any,
    expression: string,
    brace?: Array<CodeMirror.Position>
  ) {
    const wrapperRect = this.wrapRef.current?.getBoundingClientRect();
    const expressionRect = (
      e.target as HTMLSpanElement
    ).getBoundingClientRect();
    if (!wrapperRect) {
      return;
    }
    const left = expressionRect.left - wrapperRect.left;
    const top = expressionRect.top - wrapperRect.top;
    this.setState({
      tooltipStyle: {
        left: `${left}px`,
        top: `${top}px`,
        width: `${expressionRect.width}px`
      },
      formulaPickerValue: expression,
      expressionBrace: brace
    });
  }

  @autobind
  hiddenToolTip() {
    this.setState({
      tooltipStyle: {
        display: 'none'
      }
    });
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  @autobind
  handleConfirm(value: any) {
    const {beforeFxConfirm} = this.props;
    const {expressionBrace} = this.state;
    beforeFxConfirm && beforeFxConfirm(this.editorPlugin);
    // Remove the outermost ${} that may be wrapped
    value = value.replace(
      /^\$\{([\s\S]*)\}$/m,
      (match: string, p1: string) => p1
    );
    value = value ? `\${${value}}` : value;

    // value = value.replace(/\r\n|\r|\n/g, ' ');
    this.editorPlugin?.insertContent(value, 'expression', expressionBrace);
    this.setState({
      formulaPickerOpen: false,
      expressionBrace: undefined
    });
  }

  @autobind
  handleOnChange(value: any) {
    this.setState({value});
    this.props.onChange?.(value);
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    return editorFactory(dom, cm, this.props.value);
  }
  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.state.variables || [];
    const quickVariables = this.state.quickVariables || [];
    this.editorPlugin = new FormulaPlugin(editor, {
      getProps: () => ({
        ...this.props,
        variables: [...variables, ...quickVariables]
      }),
      onExpressionMouseEnter: this.onExpressionMouseEnter,
      customMarkText: this.props.customMarkText,
      onPluginInit: this.props.onPluginInit,
      showClearIcon: true
    });
  }

  @autobind
  handleFullscreenModeChange() {
    if (this.props.onOverallClick) {
      return;
    }
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  }

  @autobind
  async handleFormulaEditorOpen() {
    const {node, manager, data} = this.props;
    const onFormulaEditorOpen = manager?.config?.onFormulaEditorOpen;

    this.setState({loading: true});

    try {
      if (
        manager &&
        onFormulaEditorOpen &&
        typeof onFormulaEditorOpen === 'function'
      ) {
        const res = await onFormulaEditorOpen(node, manager, data);

        if (res !== false) {
          const variables = await getVariables(this);
          this.setState({variables});
        }
      }
    } catch (error) {
      console.error(
        '[amis-editor][TextareaFormulaControl] onFormulaEditorOpen failed: ',
        error?.stack
      );
    }

    this.setState({loading: false});
  }

  @autobind
  async handleFormulaClick(e: React.MouseEvent, type?: string) {
    if (this.props.onOverallClick) {
      return;
    }

    try {
      await this.handleFormulaEditorOpen();
    } catch (error) {}

    const variablesArr = await getVariables(this);

    this.setState({
      variables: variablesArr,
      formulaPickerOpen: true
    });

    if (type !== 'update') {
      this.setState({
        formulaPickerValue: '',
        expressionBrace: undefined
      });
    }
  }

  @autobind
  editorAutoMark() {
    this.editorPlugin?.autoMark();
  }

  @autobind
  handleAddtionalMenuClick(
    e: MouseEvent<HTMLAnchorElement>,
    item: AdditionalMenu
  ) {
    item.onClick?.(e, {
      value: this.props.value || '',
      setValue: this.editorPlugin.setValue,
      insertContent: this.editorPlugin.insertContent
    });
  }

  @autobind
  closeMenuOuter() {
    this.setState({menuIsOpened: false});
  }

  @autobind
  closeQuickVariablesOuter() {
    this.setState({quickVariablesIsOpened: false});
  }

  @autobind
  renderMenuOuter() {
    const {popOverContainer, classnames: cx, classPrefix: ns} = this.props;
    const {menuIsOpened} = this.state;

    return (
      <Overlay
        container={popOverContainer || this.wrapRef.current}
        target={() => this.wrapRef.current}
        placement="right-bottom-right-top"
        show
      >
        <PopOver classPrefix={ns} className={cx('DropDown-popover')}>
          <RootClose disabled={!menuIsOpened} onRootClose={this.closeMenuOuter}>
            {(ref: any) => {
              return (
                <ul
                  className={cx('DropDown-menu-root', 'DropDown-menu', {
                    'is-mobile': isMobile()
                  })}
                  onClick={this.closeMenuOuter}
                  ref={ref}
                >
                  <li
                    onClick={() =>
                      this.setState({quickVariablesIsOpened: true})
                    }
                  >
                    Quick variables
                  </li>
                  <li onClick={this.handleFormulaClick}>
                    Function calculation
                  </li>
                </ul>
              );
            }}
          </RootClose>
        </PopOver>
      </Overlay>
    );
  }

  @autobind
  renderQuickVariablesOuter() {
    const {popOverContainer, classnames: cx, classPrefix: ns} = this.props;
    const {quickVariables, quickVariablesIsOpened} = this.state;
    return (
      <Overlay
        container={popOverContainer || this.wrapRef.current}
        target={() => this.wrapRef.current}
        placement="right-bottom-right-top"
        show
      >
        <PopOver classPrefix={ns} className={cx('DropDown-popover')}>
          <RootClose
            disabled={!quickVariablesIsOpened}
            onRootClose={this.closeQuickVariablesOuter}
          >
            {(ref: any) => {
              return (
                <ul
                  className={cx('DropDown-menu-root', 'DropDown-menu', {
                    'is-mobile': isMobile()
                  })}
                  ref={ref}
                >
                  <VariableList
                    className={cx(
                      'FormulaEditor-VariableList',
                      'FormulaEditor-VariableList-root'
                    )}
                    data={quickVariables}
                    onSelect={this.handleQuickVariableSelect}
                    popOverContainer={popOverContainer}
                    simplifyMemberOprs
                  />
                </ul>
              );
            }}
          </RootClose>
        </PopOver>
      </Overlay>
    );
  }

  @autobind
  handleQuickVariableSelect(item: VariableItem) {
    const value = this.props.value || '';
    const newValue = value + '${' + item.value + '}';
    this.handleOnChange(newValue);
    this.closeQuickVariablesOuter();
    setTimeout(() => {
      this.editorAutoMark();
    }, 100);
  }

  @autobind
  renderButton() {
    const {loading, quickVariables} = this.props;
    const {menuIsOpened, quickVariablesIsOpened} = this.state;

    return (
      <div ref={this.menuRef}>
        {quickVariables ? (
          <a onClick={() => this.setState({menuIsOpened: true})}>
            <Icon
              icon="add"
              className={cx('ae-TplFormulaControl-icon', 'icon')}
            />
          </a>
        ) : (
          <a
            data-tooltip="Expression"
            data-position="top"
            onClick={this.handleFormulaClick}
          >
            <Icon icon="input-add-fx" className="icon" />
          </a>
        )}

        {menuIsOpened ? this.renderMenuOuter() : null}
        {quickVariablesIsOpened ? this.renderQuickVariablesOuter() : null}
      </div>
    );
  }

  render() {
    const {
      className,
      header,
      label,
      placeholder,
      height,
      additionalMenus,
      onOverallClick,
      customFormulaPicker,
      quickVariables,
      allowFullscreen = true,
      ...rest
    } = this.props;
    const {
      formulaPickerOpen,
      formulaPickerValue,
      isFullscreen,
      variables,
      tooltipStyle,
      loading
    } = this.state;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    // Input box style
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      variables
    ) || {
      html: formulaPickerValue
    };

    return (
      <div
        className={cx(
          'ae-TextareaFormulaControl',
          {
            'is-fullscreen': this.state.isFullscreen
          },
          className
        )}
        ref={this.wrapRef}
      >
        <div className={cx('ae-TextareaResultBox')} style={resultBoxStyle}>
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={this.props.value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
          {!this.state.value && (
            <div className="ae-TextareaResultBox-placeholder">
              {placeholder}
            </div>
          )}
          <ul className="ae-TextareaResultBox-footer">
            {allowFullscreen ? (
              <li className="ae-TextareaResultBox-footer-fullscreen">
                <a
                  className={cx('Modal-fullscreen')}
                  data-tooltip={
                    isFullscreen ? 'Exit full screen' : 'Full screen'
                  }
                  data-position="top"
                  onClick={this.handleFullscreenModeChange}
                >
                  <Icon
                    icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
                    className="icon"
                  />
                </a>
              </li>
            ) : null}
            <li
              className={cx('ae-TextareaResultBox-footer-fxIcon', {
                'is-loading': loading
              })}
            >
              {loading ? (
                <Spinner show icon="reload" size="sm" />
              ) : (
                this.renderButton()
              )}
            </li>
            {/* Additional bottom button menu items */}
            {Array.isArray(additionalMenus) &&
              additionalMenus.length > 0 &&
              additionalMenus?.map((item, i) => {
                return (
                  <li key={i}>
                    {item.icon ? (
                      <a
                        data-tooltip={item.label}
                        data-position="top"
                        onClick={e => this.handleAddtionalMenuClick(e, item)}
                      >
                        {renderAmis({
                          type: 'icon',
                          icon: item.icon,
                          vendor: '',
                          className: item.className
                        })}
                      </a>
                    ) : (
                      <a onClick={e => this.handleAddtionalMenuClick(e, item)}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>

        {!!onOverallClick ? (
          <div
            className={cx('ae-TextareaResultBox-overlay')}
            onClick={onOverallClick}
          ></div>
        ) : null}

        <TooltipWrapper
          container={() => findDOMNode(this) as HTMLElement}
          trigger="hover"
          placement="top"
          style={{fontSize: '12px'}}
          tooltip={{
            tooltipTheme: 'dark',
            children: () => renderFormulaValue(highlightValue)
          }}
        >
          <div
            className="ae-TplFormulaControl-tooltip"
            style={tooltipStyle}
            ref={this.tooltipRef}
            onClick={e => this.handleFormulaClick(e, 'update')}
          ></div>
        </TooltipWrapper>

        {formulaPickerOpen ? (
          <FormulaPickerCmp
            {...this.props}
            value={formulaPickerValue}
            initable={true}
            variables={variables}
            header={header}
            variableMode={rest.variableMode}
            evalMode={true}
            onClose={this.closeFormulaPicker}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-textareaFormulaControl'
})
export default class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
