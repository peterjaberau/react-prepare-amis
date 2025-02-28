/**
 * @file expression control
 */

import React from 'react';
import isString from 'lodash/isString';
import omit from 'lodash/omit';
import cx from 'classnames';
import {FormItem, Button, InputBox, Icon, TooltipWrapper} from '@/packages/amis/src';
import {FormulaExec, isExpression} from '@/packages/amis/src';
import {CodeMirrorEditor, FormulaEditor} from '@/packages/amis/src';
import {FormulaCodeEditor, Overlay, PopOver, VariableList} from '@/packages/amis/src';
import {
  FormControlProps,
  RootClose,
  isMobile,
  isObjectShallowModified
} from '@/packages/amis-core/src';
import FormulaPicker, {
  CustomFormulaPickerProps
} from './textarea-formula/FormulaPicker';
import {FormulaPlugin, editorFactory} from './textarea-formula/plugin';
import {JSONPipeOut, autobind, translateSchema} from '@/packages/amis-editor-core/src';
import {EditorManager} from '@/packages/amis-editor-core/src';
import {reaction} from 'mobx';
import {getVariables, getQuickVariables, utils} from '@/packages/amis-editor-core/src';

import type {BaseEventContext} from '@/packages/amis-editor-core/src';
import type {VariableItem, FuncGroup} from '@/packages/amis/src';
// @ts-ignore
import {SchemaType} from '@/packages/amis/src/Schema';

export enum FormulaDateType {
  NotDate, // Not a time type
  IsDate, // Date and time class
  IsRange // Date time range class
}

/**
 * @deprecated Deprecated, just use codemirror to render the input box, with built-in highlighting
 * @param item
 * @returns
 */
export function renderFormulaValue(item: any) {
  const html = {__html: typeof item === 'string' ? item : item?.html};
  // bca-disable-next-line
  return <span dangerouslySetInnerHTML={html}></span>;
}

export interface FormulaControlProps extends FormControlProps {
  manager?: EditorManager;

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
   * Variable display mode, optional values: 'tabs' | 'tree', default is tabs
   */
  variableMode?: 'tabs' | 'tree';

  /**
   * Function set, which does not need to be passed by default, i.e. the function in amis-formula
   * If there is an extension, it needs to be passed.
   */
  functions: Array<FuncGroup>;

  /**
   * The title of the pop-up window, default is "Expression"
   */
  header: string;

  /**
   * The placeholder hint content of the static input box, which can be used in the default static input box & custom renderer
   */
  placeholder: string;

  /**
   * Editor context data, used to obtain other fields of the Form where the field is located
   */
  context: BaseEventContext;

  /**
   * simple mode
   * Note: When true, only the formula editor icon button is displayed
   */
  simple?: boolean;

  /**
   * Custom renderer:
   * Note: It can be used to set the default value of the specified component type, supports callback functions, but does not support asynchronous acquisition
   */
  rendererSchema?: any; // SchemaObject | (schema: Schema) => Schema | undefined;

  /**
   * Whether the custom renderer needs to be wrapped with a light border. It is not wrapped by default.
   */
  rendererWrapper?: boolean;

  /**
   * Whether to remove attributes
   */
  needDeleteProps?: Array<string>;

  /**
   * The expected value type, which can be used to check whether the formula calculation result type matches
   * Note 1: Currently supported recognition types include int, boolean, date, object, array, and string;
   * Note 2: The switch component can set the corresponding value of true and false. If it is set, it is not a normal boolean type;
   * Note 3: The default type is string;
   */
  valueType?:
    | 'int'
    | 'number'
    | 'boolean'
    | 'date'
    | 'object'
    | 'array'
    | 'string';

  /**
   * When not triggered on a form item, pass in the form props of the variable you want to get to get the corresponding variable
   */
  formProps?: any;

  /**
   * Whether to use external Form data
   */
  useExternalFormData?: boolean;

  /**
   * Whether the date component uses formulaControl
   * When using expressions for date values, relative values ​​such as now, +1day, -2weeks, +1hours, +2years are supported, and the outermost wrapper is not ${}.
   * When using expressions for date span values, relative values ​​such as 1day, 2weeks, 1hours, and 2years are supported, and the outermost wrapper is ${}
   * Defaults to FormulaDateType.NotDate
   */
  DateTimeType?: FormulaDateType;

  /**
   * Custom fx panel
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;

  /**
   * Simplify member operations
   */
  simplifyMemberOprs?: boolean;

  /**
   * Whether to support shortcut variables
   */
  quickVariables?: boolean;

  /**
   * Additional shortcut variables
   */
  quickVars?: Array<VariableItem>;
}

interface FormulaControlState {
  /** Variable data */
  variables: any;

  quickVariables: Array<VariableItem>; // Quick variable data

  variableMode?: 'tree' | 'tabs';

  formulaPickerOpen: boolean;

  loading: boolean;

  menuIsOpened: boolean;
  quickVariablesIsOpened: boolean;
}

export default class FormulaControl extends React.Component<
  FormulaControlProps,
  FormulaControlState
> {
  static defaultProps: Partial<FormulaControlProps> = {
    simple: false,
    rendererWrapper: false,
    DateTimeType: FormulaDateType.NotDate,
    requiredDataPropsVariables: false
  };
  isUnmount: boolean;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;
  wrapRef = React.createRef<HTMLDivElement>();
  buttonTarget: HTMLElement;
  editorPlugin: FormulaPlugin;

  constructor(props: FormulaControlProps) {
    super(props);
    this.state = {
      variables: [],
      quickVariables: [],
      variableMode: 'tree',
      formulaPickerOpen: false,

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

    const variables = await getVariables(this);
    const quickVariables = await getQuickVariables(
      this,
      this.filterQuickVariablesByType
    );
    this.setState({
      variables,
      quickVariables
    });
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.editorPlugin?.dispose();
    this.unReaction?.();
  }

  @autobind
  menuRef(ref: HTMLDivElement) {
    this.buttonTarget = ref;
  }

  @autobind
  filterQuickVariablesByType(variables: any[]) {
    const rendererSchema = FormulaControl.getRendererSchemaFromProps(
      this.props
    );
    const rawType =
      utils.RAW_TYPE_MAP[rendererSchema?.type as SchemaType] || 'string';
    const filterVars = variables
      .map(item => {
        if (item.children && item.type !== 'quickVars') {
          item.children = item.children.filter(
            (i: any) => i.rawType === rawType
          );
        }
        return item;
      })
      .filter(
        item =>
          item.rawType === rawType || (item.children && item.children?.length)
      );
    return filterVars;
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
      showPopover: false,
      showClearIcon: true
    });
  }

  /**
   * Replace ${xx} (not \${xx}) with \${xx}
   * Note: When editing manually, ${xx} is automatically processed to avoid being recognized as a formula expression
   */
  @autobind
  outReplaceExpression(expression: any): any {
    if (expression && isString(expression) && isExpression(expression)) {
      return expression.replace(/(^|[^\\])\$\{/g, '\\${');
    }
    return expression;
  }

  @autobind
  inReplaceExpression(expression: any): any {
    if (expression && isString(expression)) {
      return expression.replace(/\\\$\{/g, '${');
    }
    return expression;
  }

  // Determine whether there is a circular reference problem in the current expression based on the name value
  @autobind
  isLoopExpression(expression: any, selfName: string): boolean {
    if (!expression || !selfName || !isString(expression)) {
      return false;
    }
    let variables = [];
    try {
      variables = FormulaExec.collect(expression);
    } catch (e) {}
    return variables.some((variable: string) => variable === selfName);
  }

  /**
   * Get the value of rendererSchema
   */
  static getRendererSchemaFromProps(props: FormulaControlProps) {
    let rendererSchema = props.rendererSchema;

    if (typeof rendererSchema === 'function') {
      const schema = props.data ? {...props.data} : undefined;
      return rendererSchema(schema);
    } else {
      return rendererSchema;
    }
  }

  matchDate(str: string): boolean {
    const matchDate =
      /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;
    const m = matchDate.exec(str);
    return m ? (m[1] ? this.matchDate(m[1]) : true) : false;
  }

  matchDateRange(str: string): boolean {
    if (/^(now|today)$/.test(str)) {
      return true;
    }
    return this.matchDate(str);
  }

  //Date component & whether there is a shortcut key to determine
  @autobind
  hasDateShortcutkey(str: string): boolean {
    const {DateTimeType} = this.props;

    if (DateTimeType === FormulaDateType.IsDate) {
      if (/^(now|today)$/.test(str)) {
        return true;
      }
      return this.matchDate(str);
    } else if (DateTimeType === FormulaDateType.IsRange) {
      const start_end = str?.split?.(',');
      if (start_end && start_end.length === 2) {
        return (
          this.matchDateRange(start_end[0].trim()) &&
          this.matchDateRange(start_end[1].trim())
        );
      }
    }
    // For non-date components, set to false directly
    // if (DateTimeType === FormulaDateType.NotDate) {
    //   return false;
    // }
    return false;
  }

  @autobind
  transExpr(str: string) {
    if (
      typeof str === 'string' &&
      str.slice(0, 2) === '${' &&
      str.slice(-1) === '}'
    ) {
      // Expressions exist in non-outermost content
      if (isExpression(str.slice(2, -1))) {
        return str;
      }
      if (str.lastIndexOf('${') > str.indexOf('}') && str.indexOf('}') > -1) {
        return str;
      }
      return str.slice(2, -1);
    }
    return str;
  }

  @autobind
  handleConfirm(value: any) {
    // value = value.replace(/\r\n|\r|\n/g, ' ');
    const val = !value
      ? undefined
      : isExpression(value) || this.hasDateShortcutkey(value)
      ? value
      : `\${${value}}`;
    this.props?.onChange?.(val);

    this.closeFormulaPicker();
    requestAnimationFrame(() => {
      this.editorPlugin?.autoMark?.();
    });
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
  async handleFormulaClick() {
    try {
      await this.beforeFormulaEditorOpen();
    } catch (error) {}

    this.setState({
      formulaPickerOpen: true
    });
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  handleSimpleInputChange = (value: any) => {
    const curValue = this.outReplaceExpression(value);
    this.props?.onChange?.(curValue);
  };

  handleInputChange = (value: any) => {
    this.props?.onChange?.(value);
  };

  // Remove some unused attributes
  @autobind
  filterCustomRendererProps(rendererSchema: any) {
    const {data, name, placeholder} = this.props;

    let curRendererSchema: any = null;
    if (rendererSchema) {
      curRendererSchema = Object.assign({}, rendererSchema, {
        type: rendererSchema.type ?? data.type,
        // Currently the form item wrapControl must also rely on a name
        // So just give it a random name here. When rendering here, it should be controlled by value, not associated with name
        name: 'FORMULA_CONTROL_PLACEHOLDER'
      });

      // Fields to be removed by default
      const deleteProps = [
        'label',
        'id',
        '$$id',
        'className',
        'style',
        'readOnly',
        'horizontal',
        'size',
        'remark',
        'labelRemark',
        'static',
        'staticOn',
        'hidden',
        'hiddenOn',
        'visible',
        'visibleOn',
        'disabled',
        'disabledOn',
        'required',
        'requiredOn',
        'className',
        'labelClassName',
        'labelAlign',
        'inputClassName',
        'description',
        'autoUpdate',
        'prefix',
        'suffix',
        'unitOptions',
        'keyboard',
        'kilobitSeparator',
        'value',
        'inputControlClassName',
        'css',
        'validateApi',
        'themeCss',
        'onEvent',
        'embed'
      ];

      // Fields to be removed from the current component
      if (this.props.needDeleteProps) {
        deleteProps.push(...this.props.needDeleteProps);
      }
      if (name && name === 'min') {
        // Avoid min affecting its own default value setting
        deleteProps.push('min');
      }
      if (name && name === 'max') {
        // Avoid max affecting its own default value setting
        deleteProps.push('max');
      }
      curRendererSchema = omit(curRendererSchema, deleteProps);

      // Set to clear
      curRendererSchema.clearable = true;

      // Set a unified placeholder prompt
      if (curRendererSchema.type === 'select') {
        !curRendererSchema.placeholder &&
          (curRendererSchema.placeholder = 'Please select a static value');
        curRendererSchema.inputClassName =
          'ae-editor-FormulaControl-select-style';
      } else if (placeholder) {
        curRendererSchema.placeholder = placeholder;
      } else {
        curRendererSchema.placeholder = 'Please enter a static value';
      }
    }

    JSONPipeOut(curRendererSchema);

    // Internationalize the schema
    if (this.appLocale && this.appCorpusData) {
      return translateSchema(curRendererSchema, this.appCorpusData);
    }

    return curRendererSchema;
  }

  @autobind
  getContextData() {
    let curContextData = this.props.data?.__super?.__props__?.data;

    if (!curContextData) {
      const curComp = this.props.node?.getComponent();
      if (curComp?.props?.data) {
        curContextData = curComp.props.data;
      }
    }
    // Current data domain
    return curContextData;
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
    this.handleInputChange('${' + item.value + '}');
    this.closeQuickVariablesOuter();
    requestAnimationFrame(() => {
      this.editorPlugin?.autoMark?.();
    });
  }

  @autobind
  renderButton() {
    const {loading, quickVariables, simple, value} = this.props;
    const {menuIsOpened, quickVariablesIsOpened} = this.state;
    const isExpr = isExpression(value);
    const isFx = !simple && (isExpr || this.hasDateShortcutkey(value));

    return (
      <div
        className="ae-editor-FormulaControl-buttonWrapper"
        ref={this.menuRef}
      >
        {quickVariables ? (
          <Button
            className="ae-editor-FormulaControl-button"
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
            className="ae-editor-FormulaControl-button"
            size="sm"
            tooltip={{
              enterable: false,
              content: 'Click to configure the expression',
              tooltipTheme: 'dark',
              placement: 'left',
              mouseLeaveDelay: 0
            }}
            onClick={this.handleFormulaClick}
            loading={loading}
          >
            <Icon
              icon="input-fx"
              className={cx('ae-editor-FormulaControl-icon', 'icon', {
                ['is-filled']: !!isFx
              })}
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
      label,
      value,
      header,
      placeholder,
      simple,
      rendererWrapper,
      manager,
      useExternalFormData = false,
      customFormulaPicker,
      clearable = true,
      simplifyMemberOprs,
      render,
      ...rest
    } = this.props;
    const {formulaPickerOpen, variables, variableMode, loading} = this.state;
    const rendererSchema = FormulaControl.getRendererSchemaFromProps(
      this.props
    );

    // Determine whether it contains a formula expression
    const isExpr = isExpression(value);

    // Determine whether there is a circular reference at present. Note: Inaccurate identification, to be optimized
    let isLoop = false;
    if (isExpr && rendererSchema?.name) {
      isLoop = rendererSchema?.name
        ? this.isLoopExpression(value, rendererSchema?.name)
        : false;
    }

    const exprValue = this.transExpr(value);

    const isError = isLoop;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    //Formula expression pop-up content filtering
    const filterValue = isExpression(value)
      ? exprValue
      : this.hasDateShortcutkey(value)
      ? value
      : undefined;

    // value is an expression or date shortcut
    const isFx = !simple && (isExpr || this.hasDateShortcutkey(value));

    return (
      <div
        className={cx(
          'ae-editor-FormulaControl',
          isError ? 'is-has-tooltip' : '',
          className
        )}
        ref={this.wrapRef}
      >
        {/* Non-simple mode & Non-expression & Non-date shortcut & No custom rendering*/}
        {!simple &&
          !isExpr &&
          !this.hasDateShortcutkey(value) &&
          !rendererSchema && (
            <InputBox
              className="ae-editor-FormulaControl-input"
              value={this.inReplaceExpression(value)}
              clearable={true}
              placeholder={placeholder ?? 'Please enter a static value'}
              onChange={this.handleSimpleInputChange}
            />
          )}
        {/* Non-simple mode & non-expression & non-date shortcut & custom rendering*/}
        {!simple &&
          !isExpr &&
          !this.hasDateShortcutkey(value) &&
          rendererSchema && (
            <div
              className={cx(
                'ae-editor-FormulaControl-custom-renderer',
                rendererWrapper ? 'border-wrapper' : ''
              )}
            >
              {render('inner', this.filterCustomRendererProps(rendererSchema), {
                inputOnly: true,
                value: this.inReplaceExpression(value),
                data: useExternalFormData
                  ? {
                      ...this.props.data
                    }
                  : {},
                onChange: this.handleSimpleInputChange,
                manager: manager
              })}
            </div>
          )}
        {/* Non-simple pattern & (expression or date shortcut) */}
        {isFx && (
          <TooltipWrapper
            trigger="hover"
            placement="left"
            style={{fontSize: '12px'}}
            tooltip={{
              tooltipTheme: 'dark',
              mouseLeaveDelay: 20,
              content: exprValue,
              tooltipClassName: 'btn-configured-tooltip',
              children: () => (
                <FormulaCodeEditor
                  readOnly
                  value={exprValue}
                  variables={variables}
                  evalMode={true}
                  editorTheme="dark"
                  highlightMode="expression"
                  editorOptions={{
                    lineNumbers: false
                  }}
                />
              )
            }}
          >
            <InputBox
              className={cx('ae-editor-FormulaControl-ResultBox')}
              onClick={this.handleFormulaClick}
              hasError={isError}
              inputRender={({value, onChange, onFocus, onBlur}: any) => (
                <div
                  className={cx('ae-editor-FormulaControl-ResultBox-wrapper')}
                >
                  <CodeMirrorEditor
                    className="ae-editor-FormulaControl-ResultBox-editor"
                    value={value}
                    onChange={onChange}
                    editorFactory={this.editorFactory}
                    editorDidMount={this.handleEditorMounted}
                    onBlur={onBlur}
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
                      onClick={() => this.handleInputChange('')}
                    />
                  )}
                </div>
              )}
              value={value}
              onChange={this.handleInputChange}
            />
          </TooltipWrapper>
        )}
        {this.renderButton()}
        {isError && (
          <div className="desc-msg error-msg">
            {isLoop
              ? 'The current expression is abnormal (circular reference exists)'
              : 'The value type does not match'}
          </div>
        )}

        {formulaPickerOpen ? (
          <FormulaPickerCmp
            {...this.props}
            value={filterValue}
            initable={true}
            header={header}
            variables={variables}
            variableMode={rest.variableMode ?? variableMode}
            evalMode={true}
            onClose={this.closeFormulaPicker}
            onConfirm={this.handleConfirm}
            simplifyMemberOprs={simplifyMemberOprs}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-formulaControl',
  shouldComponentUpdate: (
    props: FormulaControlProps,
    nextProps: FormulaControlProps
  ) => {
    const rendererSchema = FormulaControl.getRendererSchemaFromProps(props);
    const newRendererSchema =
      FormulaControl.getRendererSchemaFromProps(nextProps);
    return isObjectShallowModified(rendererSchema, newRendererSchema);
  }
})
export class FormulaControlRenderer extends FormulaControl {}
