/**
 * @file expression input box component
 */

import React from 'react';
import {autobind, FormControlProps, isExpression} from '@/packages/amis-core/src';
import cx from 'classnames';
import {FormItem, Button, Icon, PickerContainer} from 'amis';
import {FormulaCodeEditor, FormulaEditor, InputBox} from '@/packages/amis-ui/src';
import type {VariableItem} from '@/packages/amis-ui/src';
import {reaction} from 'mobx';
import {getVariables} from '@/packages/amis-editor-core/src';

interface ExpressionFormulaControlProps extends FormControlProps {
  /**
   * A collection of variables used for prompts, empty by default
   */
  variables?: Array<VariableItem> | Function;

  /**
   * Use with variables
   * When props.variables exists, whether to take the variable set from the amis data domain, the default is false
   */
  requiredDataPropsVariables?: boolean;

  /**
   * Variable display mode, optional values: 'tabs' | 'tree'
   */
  variableMode?: 'tabs' | 'tree';
  /**
   * Whether the outermost expression should be wrapped with ${}, the default is true
   */
  evalMode: boolean;
}

interface ExpressionFormulaControlState {
  variables: Array<VariableItem>;

  formulaPickerValue: string;
}

export default class ExpressionFormulaControl extends React.Component<
  ExpressionFormulaControlProps,
  ExpressionFormulaControlState
> {
  static defaultProps: Partial<ExpressionFormulaControlProps> = {
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    evalMode: true
  };

  isUnmount: boolean;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: ExpressionFormulaControlProps) {
    super(props);
    this.state = {
      variables: [],
      formulaPickerValue: ''
    };
  }

  async componentDidMount() {
    this.initFormulaPickerValue(this.props.value);
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

    // To highlight, load it initially
    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });
  }

  async componentDidUpdate(prevProps: ExpressionFormulaControlProps) {
    if (prevProps.value !== this.props.value) {
      this.initFormulaPickerValue(this.props.value);
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.unReaction?.();
  }

  @autobind
  initFormulaPickerValue(value: string) {
    let formulaPickerValue =
      value?.replace(/^\$\{([\s\S]*)\}$/, (match: string, p1: string) => p1) ||
      '';

    this.setState({
      formulaPickerValue
    });
  }

  @autobind
  handleConfirm(value = '') {
    const expressionReg = /^\$\{([\s\S]*)\}$/;
    // value = value.replace(/\r\n|\r|\n/g, ' ');

    if (value && !expressionReg.test(value)) {
      value = `\${${value}}`;
    }
    this.props?.onChange?.(value);
  }

  @autobind
  handleClearExpression(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    e.preventDefault();
    this.props?.onChange?.(undefined);
  }

  @autobind
  async handleOnClick(
    e: React.MouseEvent,
    onClick: (e: React.MouseEvent) => void
  ) {
    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });

    return onClick?.(e);
  }

  render() {
    const {value, className, variableMode, header, size, ...rest} = this.props;
    const {formulaPickerValue, variables} = this.state;
    const isNewExpression = isExpression(value);

    // Own fields
    const selfName = this.props?.data?.name;
    return (
      <div className={cx('ae-ExpressionFormulaControl', className)}>
        <PickerContainer
          showTitle={false}
          bodyRender={({
            value,
            onChange
          }: {
            onChange: (value: any) => void;
            value: any;
          }) => {
            return (
              <FormulaEditor
                {...rest}
                evalMode={true}
                variableMode={variableMode}
                variables={variables}
                header={header || 'expression'}
                value={value}
                onChange={onChange}
                selfVariableName={selfName}
              />
            );
          }}
          value={formulaPickerValue}
          onConfirm={this.handleConfirm}
          size={size ?? 'lg'}
        >
          {({onClick}: {onClick: (e: React.MouseEvent) => any}) =>
            value && !isNewExpression ? (
              <InputBox value={value} onChange={rest.onChange} />
            ) : formulaPickerValue ? (
              <Button
                className="btn-configured"
                tooltip={{
                  placement: 'left',
                  tooltipTheme: 'dark',
                  mouseLeaveDelay: 20,
                  content: value,
                  tooltipClassName: 'btn-configured-tooltip',
                  children: () => (
                    <FormulaCodeEditor
                      readOnly
                      value={
                        typeof value === 'string'
                          ? value.substring(2, value.length - 1)
                          : ''
                      }
                      variables={variables}
                      evalMode={true}
                      editorTheme="dark"
                      editorOptions={{
                        lineNumbers: false
                      }}
                    />
                  )
                }}
                onClick={e => this.handleOnClick(e, onClick)}
              >
                <FormulaCodeEditor
                  singleLine
                  readOnly
                  highlightMode="expression"
                  value={value}
                  variables={variables}
                  evalMode={false}
                />
                <Icon
                  icon="input-clear"
                  className="icon"
                  onClick={this.handleClearExpression}
                />
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  className="btn-set-expression"
                  onClick={e => this.handleOnClick(e, onClick)}
                >
                  Click to write an expression
                </Button>
              </>
            )
          }
        </PickerContainer>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-expressionFormulaControl'
})
export class ExpressionFormulaControlRenderer extends ExpressionFormulaControl {}
