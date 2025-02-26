import {ThemeProps, themeable} from 'amis-core';
import React from 'react';
import CodeMirrorEditor, {CodeMirrorEditorProps} from '../CodeMirror';
import {FormulaPlugin, editorFactory as createEditor} from './plugin';
import type CodeMirror from 'codemirror';

export interface VariableItem {
  label: string;
  value?: string;
  path?: string; // path (label)
  children?: Array<VariableItem>;
  type?: string;
  tag?: string;
  selectMode?: 'tree' | 'tabs';
  isMember?: boolean; // Is it an array member?
  // chunks?: string[]; // Content blocks, highlighted as a whole
}

export interface FuncGroup {
  groupName: string;
  items: Array<FuncItem>;
}

export interface FuncItem {
  name: string; // function name
  example?: string; // example
  description?: string; // description
  [propName: string]: any;
}

export interface CodeEditorProps
  extends ThemeProps,
    Omit<CodeMirrorEditorProps, 'style' | 'editorFactory' | 'editorDidMount'> {
  readOnly?: boolean;

  /**
   * Whether it is single-line mode, the default is false
   */
  singleLine?: boolean;

  /**
   * evalMode is directly an expression, otherwise
   * ${this is the expression} is required
   * Defaults to true
   */
  evalMode?: boolean;

  autoFocus?: boolean;

  editorTheme?: 'dark' | 'light';

  editorOptions?: any;

  /**
   * expression is the highlighted expression as a whole
   * formula is the highlighted expression
   */
  highlightMode?: 'expression' | 'formula';

  /**
   * A collection of variables used for prompts, empty by default
   */
  variables?: Array<VariableItem>;

  /**
   * Function set, which does not need to be passed by default, i.e. the function in amis-formula
   * If there is an extension, it needs to be passed.
   */
  functions?: Array<FuncGroup>;

  placeholder?: string;

  editorDidMount?: (
    cm: typeof CodeMirror,
    editor: CodeMirror.Editor,
    plugin: FormulaPlugin
  ) => void;
}

function CodeEditor(props: CodeEditorProps, ref: any) {
  const {
    classnames: cx,
    className,
    value,
    onChange,
    editorDidMount,
    onFocus,
    onBlur,
    functions,
    variables,
    evalMode,
    singleLine,
    autoFocus,
    editorTheme,
    theme: defaultTheme,
    editorOptions,
    placeholder,
    highlightMode
  } = props;
  const pluginRef = React.useRef<FormulaPlugin>();

  const editorFactory = React.useCallback((dom: HTMLElement, cm: any) => {
    let theme =
      (editorTheme ??
        ((defaultTheme || '').includes('dark') ? 'dark' : 'light')) === 'dark'
        ? 'base16-dark'
        : 'idea';
    let options: any = {
      autoFocus,
      indentUnit: 2,
      lineNumbers: true,
      lineWrapping: true, // Automatic line wrapping
      theme,
      placeholder,
      ...editorOptions
    };
    if (singleLine) {
      options = {
        lineNumbers: false,
        indentWithTabs: false,
        indentUnit: 4,
        lineWrapping: false,
        scrollbarStyle: null,
        theme,
        placeholder,
        ...editorOptions
      };
    }

    return createEditor(dom, cm, props, options);
  }, []);

  const [readOnly, setReadOnly] = React.useState(props.readOnly);

  React.useEffect(() => setReadOnly(props.readOnly), [props.readOnly]);
  React.useEffect(
    () => pluginRef.current?.editor?.setOption('placeholder', placeholder),
    [placeholder]
  );

  // In singleLine mode, line breaks are not allowed
  const onEditorBeforeChange = React.useCallback((cm: any, event: any) => {
    // Identify typing events that add a newline to the buffer.
    const hasTypedNewline =
      event.origin === '+input' &&
      typeof event.text === 'object' &&
      event.text.join('') === '';

    // Prevent newline characters from being added to the buffer.
    if (hasTypedNewline) {
      return event.cancel();
    }

    // Identify paste events.
    const hasPastedNewline =
      event.origin === 'paste' &&
      typeof event.text === 'object' &&
      event.text.length > 1;

    // Format pasted text to replace newlines with spaces.
    if (hasPastedNewline) {
      const newText = event.text.join(' ');
      return event.update(null, null, [newText]);
    }

    return null;
  }, []);

  const onEditorMount = React.useCallback(
    (cm: any, editor: any) => {
      const plugin = (pluginRef.current = new FormulaPlugin(editor, cm));
      plugin.setEvalMode(!!evalMode);
      plugin.setFunctions(functions || []);
      plugin.setVariables(variables || []);
      plugin.setHighlightMode(highlightMode || 'formula');
      editorDidMount?.(cm, editor, plugin);
      plugin.autoMarkText();

      // Single-line mode, line breaks are not allowed, and the original line breaks must also be removed
      if (singleLine) {
        editor.on('beforeChange', onEditorBeforeChange);

        const value = editor.getValue();
        if (value && /[\n\r]/.test(value)) {
          // The initial data has line breaks, so direct editing is not allowed
          // Only pop-up windows can be used for editing in non-single-line mode
          setReadOnly(true);
          editor.setValue(value.replace(/[\n\r]+/g, ''));
        }
      }
    },
    [evalMode, functions, variables]
  );

  React.useEffect(() => {
    return () => {
      pluginRef.current?.editor.off('beforeChange', onEditorBeforeChange);
      pluginRef.current?.dispose();
    };
  }, []);

  React.useImperativeHandle(ref, () => {
    return {
      insertContent: (value: any, type: 'variable' | 'func') =>
        pluginRef.current?.insertContent(value, type),
      setValue: (value: any) => pluginRef.current?.setValue(value),
      getValue: () => pluginRef.current?.getValue(),
      setDisableAutoMark: (value: boolean) =>
        pluginRef.current?.setDisableAutoMark(value)
    };
  });

  React.useEffect(() => {
    const plugin = pluginRef.current;
    if (!plugin) {
      return;
    }

    plugin.setEvalMode(!!evalMode);
    plugin.setFunctions(functions || []);
    plugin.setVariables(variables || []);
    plugin.autoMarkText();
  }, [evalMode, functions, variables, value]);

  return (
    <CodeMirrorEditor
      className={cx(
        'FormulaCodeEditor',
        className,
        singleLine ? 'FormulaCodeEditor--singleLine' : ''
      )}
      value={value}
      onChange={onChange}
      editorFactory={editorFactory}
      editorDidMount={onEditorMount}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readOnly}
    />
  );
}

export default themeable(React.forwardRef(CodeEditor));
