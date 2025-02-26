/**
 * @file long text formula input box
 */

import React from 'react';
import cx from 'classnames';
import {reaction} from 'mobx';
import {CodeMirrorEditor, FormulaEditor} from '@/packages/amis-ui/src';
import {Icon, Button, FormItem, TooltipWrapper} from 'amis';
import {autobind, FormControlProps} from 'amis-core';
import {Overlay, PopOver, VariableList} from '@/packages/amis-ui/src';
import {RootClose, isMobile} from 'amis-core';
import {FormulaPlugin, editorFactory} from './textarea-formula/plugin';
import {renderFormulaValue} from './FormulaControl';
import FormulaPicker, {
  CustomFormulaPickerProps
} from './textarea-formula/FormulaPicker';
import {getVariables, getQuickVariables} from '@/packages/amis-editor-core/src';

import type {VariableItem, CodeMirror} from '@/packages/amis-ui/src';

export interface TplFormulaControlProps extends FormControlProps {
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
   * Custom fx panel
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;

  /**
   * Can it be cleared?
   */
  clearable?: boolean;

  /**
   * The title of the pop-up window, default is "Expression"
   */
  header: string;

  /**
   * Simplify member operations
   */
  simplifyMemberOprs?: boolean;

  /**
   * Payment supports quick variables
   */
  quickVariables?: boolean;

  /**
   * Additional shortcut variables
   */
  quickVars?: Array<VariableItem>;
}

interface TplFormulaControlState {
  value: string; // current text value

  variables: Array<VariableItem>; // variable data

  quickVariables: Array<VariableItem>; // Quick variable data

  formulaPickerOpen: boolean; // Whether to open the formula editor

  formulaPickerValue: string; // Formula editor content

  expressionBrace?: Array<CodeMirror.Position>; // expression position

  tooltipStyle: {[key: string]: string}; // tooltip style

  loading: boolean;

  menuIsOpened: boolean;
  quickVariablesIsOpened: boolean;
}

// Temporarily record the input characters for shortcut key judgment
let preInputLocation: {start: number; end: number} | null = {
  start: 0,
  end: 0
};

export class TplFormulaControl extends React.Component<
  TplFormulaControlProps,
  TplFormulaControlState
> {
  static defaultProps: Partial<TplFormulaControlProps> = {
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    placeholder: 'Please enter'
  };

  wrapRef = React.createRef<HTMLDivElement>();
  tooltipRef = React.createRef<HTMLDivElement>();
  buttonTarget: HTMLElement;

  editorPlugin: FormulaPlugin;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: TplFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      quickVariables: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      tooltipStyle: {
        display: 'none'
      },
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
    if (this.wrapRef.current) {
      this.wrapRef.current.addEventListener(
        'keydown',
        this.handleKeyDown,
        true
      );
    }

    const variables = await getVariables(this);
    const quickVariables = await getQuickVariables(this);
    this.setState({
      variables,
      quickVariables
    });
  }

  componentWillUnmount() {
    if (this.tooltipRef.current) {
      this.tooltipRef.current.removeEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }
    if (this.wrapRef.current) {
      this.wrapRef.current.removeEventListener('keydown', this.handleKeyDown);
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
    e: MouseEvent,
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
    this.setState({
      tooltipStyle: {
        left: `${left}px`,
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
  handleKeyDown(e: any) {
    // The component prohibits carriage return and line break, otherwise the content will exceed one line
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  @autobind
  handleConfirm(value: any) {
    const {expressionBrace} = this.state;
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
    this.checkOpenFormulaPicker(value);
    this.props.onChange?.(value);
  }

  // Detect user input '${}' and automatically open the expression pop-up window
  async checkOpenFormulaPicker(value: string) {
    const preLength = this.props.value?.length || 0;
    // Deleted text, no need to detect
    if (value.length < preLength || value === this.props.value) {
      return;
    }
    let left = 0;
    let right = 0;
    let length = value.length;

    while (
      left < preLength &&
      value.charAt(left) === this.props.value.charAt(left)
    ) {
      left++;
    }
    while (
      right < preLength &&
      value.charAt(length - 1 - right) ===
        this.props.value.charAt(preLength - 1 - right)
    ) {
      right++;
    }
    if (preInputLocation?.end !== left) {
      preInputLocation = null;
    }

    const start = preInputLocation ? preInputLocation.start : left;
    const end = left === length - right ? left + 1 : length - right;
    const inputText = value.substring(start, end);

    if (/\$|\{|\}$/.test(inputText)) {
      if (/\$\{\}/.test(inputText)) {
        const newValue =
          value.slice(0, start) +
          inputText.replace('${}', '') +
          value.slice(end);
        this.props.onChange(newValue);

        try {
          await this.beforeFormulaEditorOpen();
        } catch (error) {}

        const corsur = this.editorPlugin.getCorsur();
        this.setState({
          formulaPickerOpen: true,
          formulaPickerValue: '',
          expressionBrace: [
            {
              line: corsur?.line,
              ch: end - 3
            },
            {
              line: corsur?.line,
              ch: end
            }
          ]
        });
        preInputLocation = null;
      } else {
        preInputLocation = {
          start: left,
          ...preInputLocation,
          end
        };
      }
    } else {
      preInputLocation = null;
    }
  }

  @autobind
  handleClear() {
    this.editorPlugin?.setValue('');
  }

  /**
   * The formula editor opens to complete the loading of some asynchronous tasks
   */
  @autobind
  async beforeFormulaEditorOpen() {
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
      } else {
        const variables = await getVariables(this);
        this.setState({variables});
      }
    } catch (error) {
      console.error('[amis-editor] onFormulaEditorOpen failed: ', error?.stack);
    }

    this.setState({loading: false});
  }

  @autobind
  async handleFormulaClick(e: React.MouseEvent, type?: string) {
    try {
      await this.beforeFormulaEditorOpen();
    } catch (error) {}

    this.setState({
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
  editorFactory(dom: HTMLElement, cm: any) {
    return editorFactory(dom, cm, this.props.value, {
      lineWrapping: false,
      cursorHeight: 0.85
    });
  }

  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.state.variables;
    const quickVariables = this.state.quickVariables;
    this.editorPlugin = new FormulaPlugin(editor, {
      getProps: () => ({
        ...this.props,
        variables: [...variables, ...quickVariables]
      }),
      onExpressionMouseEnter: this.onExpressionMouseEnter,
      showPopover: false,
      showClearIcon: true
    });
  }

  @autobind
  editorAutoMark() {
    this.editorPlugin?.autoMark();
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
      <div className="ae-TplFormulaControl-buttonWrapper" ref={this.menuRef}>
        {quickVariables ? (
          <Button
            className="ae-TplFormulaControl-buttonWrapper-button"
            size="sm"
            onClick={() => this.setState({menuIsOpened: true})}
          >
            <Icon
              icon="add"
              className={cx('ae-TplFormulaControl-icon', 'icon')}
            />
          </Button>
        ) : (
          <Button
            className="ae-TplFormulaControl-button"
            size="sm"
            tooltip={{
              enterable: false,
              content: 'Click to add a new expression',
              tooltipTheme: 'dark',
              placement: 'left',
              mouseLeaveDelay: 0
            }}
            onClick={this.handleFormulaClick}
            loading={loading}
          >
            <Icon
              icon="input-add-fx"
              className={cx('ae-TplFormulaControl-icon', 'icon')}
            />
          </Button>
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
      customFormulaPicker,
      clearable,
      quickVariables,
      simplifyMemberOprs,
      ...rest
    } = this.props;
    const {
      formulaPickerOpen,
      formulaPickerValue,
      variables,
      tooltipStyle,
      loading
    } = this.state;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;
    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      variables
    ) || {
      html: formulaPickerValue
    };

    return (
      <div
        className={cx('ae-TplFormulaControl', className, {
          clearable: clearable
        })}
        ref={this.wrapRef}
      >
        <div className={cx('ae-TplResultBox')}>
          <CodeMirrorEditor
            className="ae-TplResultBox-editor"
            value={this.props.value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
          {!this.props.value && (
            <div className="ae-TplFormulaControl-placeholder">
              {placeholder}
            </div>
          )}
          {clearable && this.props.value && (
            <Icon
              icon="input-clear"
              className="input-clear-icon"
              iconContent="InputText-clear"
              onClick={this.handleClear}
            />
          )}
        </div>
        {this.renderButton()}
        <TooltipWrapper
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
            header={header}
            variables={variables}
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
  type: 'ae-tplFormulaControl'
})
export default class TplFormulaControlRenderer extends TplFormulaControl {}
