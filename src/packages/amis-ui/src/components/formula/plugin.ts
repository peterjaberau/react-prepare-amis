/**
 * @file extends codemirror
 */

import type CodeMirror from 'codemirror';
import {findTree} from '@/packages/amis-core/src';
import {FuncGroup, VariableItem} from './CodeEditor';
import {parse} from 'amis-formula';
import debounce from 'lodash/debounce';

export function editorFactory(
  dom: HTMLElement,
  cm: typeof CodeMirror,
  props: any,
  options?: any
) {
  registerLaunguageMode(cm);

  return cm(dom, {
    value: props.value || '',
    autofocus: false,
    mode: props.evalMode ? 'text/formula' : 'text/formula-template',
    readOnly: props.readOnly ? 'nocursor' : false,
    ...options
  });
}

function traverseAst(ast: any, iterator: (ast: any) => void | false) {
  if (!ast || !ast.type) {
    return;
  }

  const ret = iterator(ast);
  if (ret === false) {
    return;
  }

  Object.keys(ast).forEach(key => {
    const value = ast[key];

    if (Array.isArray(value)) {
      value.forEach(child => traverseAst(child, iterator));
    } else {
      traverseAst(value, iterator);
    }
  });
}

export class FormulaPlugin {
  /**
   * A collection of variables used for prompts, empty by default
   */
  variables: Array<VariableItem> = [];

  /**
   * Function set, which does not need to be passed by default, i.e. the function in amis-formula
   * If there is an extension, it needs to be passed.
   */
  functions: Array<FuncGroup> = [];

  /**
   * evalMode is directly an expression, otherwise it is a mixed mode
   */
  evalMode: boolean = true;

  highlightMode: 'expression' | 'formula' = 'formula';

  disableAutoMark = false;

  constructor(
    readonly editor: CodeMirror.Editor,
    readonly cm: typeof CodeMirror
  ) {
    // this.autoMarkText();
    this.autoMarkText = debounce(this.autoMarkText.bind(this), 250, {
      leading: false,
      trailing: true
    });

    editor.on('blur', () => this.autoMarkText());
  }

  setVariables(variables: Array<VariableItem>) {
    this.variables = Array.isArray(variables) ? variables : [];
  }

  setFunctions(functions: Array<FuncGroup>) {
    this.functions = Array.isArray(functions) ? functions : [];
  }

  setEvalMode(evalMode: boolean) {
    this.evalMode = evalMode;
  }

  setHighlightMode(highlightMode: 'expression' | 'formula') {
    this.highlightMode = highlightMode;
  }

  setDisableAutoMark(disableAutoMark: boolean) {
    this.disableAutoMark = disableAutoMark;
    this.autoMarkText(true);
  }

  autoMarkText(forceClear = false) {
    if (forceClear || !this.editor.hasFocus()) {
      this.editor?.getAllMarks().forEach(mark => mark.clear());
    }
    this.disableAutoMark || this.autoMark();
  }

  // Calculate the position of `${`, `}` brackets, such as ${a}+${b}, the result is [ { from: 0, to: 3 }, { from: 5, to: 8 } ]
  computedBracesPosition(exp: string) {
    const braces: {begin: number; end: number}[] = [];

    exp?.replace(/\$\{/g, (val, offset) => {
      if (val) {
        const charArr = exp.slice(offset + val.length).split('');
        const cache = ['${'];

        for (let index = 0; index < charArr.length; index++) {
          const char = charArr[index];
          if (char === '$' && charArr[index + 1] === '{') {
            cache.push('${');
          } else if (char === '}') {
            cache.pop();
          }

          if (cache.length === 0) {
            braces.push({begin: offset + 2, end: index + offset + 2});
            break;
          }
        }
      }
      return '';
    });

    return braces;
  }

  // Check if the string is in ${}
  checkStrIsInBraces(
    [from, to]: number[],
    braces: {begin: number; end: number}[]
  ) {
    let isIn = false;
    if (braces.length) {
      for (let index = 0; index < braces.length; index++) {
        const brace = braces[index];
        if (from >= brace.begin && to <= brace.end) {
          isIn = true;
          break;
        }
      }
    }
    return isIn;
  }

  insertBraces(originFrom: CodeMirror.Position, originTo: CodeMirror.Position) {
    const str = this.editor.getValue();
    const braces = this.computedBracesPosition(str);

    if (!this.checkStrIsInBraces([originFrom.ch, originTo.ch], braces)) {
      this.editor.setCursor({
        line: originFrom.line,
        ch: originFrom.ch
      });
      this.editor.replaceSelection('${');

      this.editor.setCursor({
        line: originTo.line,
        ch: originTo.ch + 2
      });
      this.editor.replaceSelection('}');
    }
  }

  insertContent(value: any, type?: 'variable' | 'func') {
    let from = this.editor.getCursor();
    const evalMode = this.evalMode;

    if (type === 'variable') {
      this.editor.replaceSelection(value.key);
      const to = this.editor.getCursor();

      !evalMode && this.insertBraces(from, to);
    } else if (type === 'func') {
      this.editor.replaceSelection(`${value}()`);
      const to = this.editor.getCursor();

      this.editor.setCursor({
        line: to.line,
        ch: to.ch - 1
      });

      if (!evalMode) {
        this.insertBraces(from, to);
        this.editor.setCursor({
          line: to.line,
          ch: to.ch + 1
        });
      }
    } else if (typeof value === 'string') {
      this.editor.replaceSelection(value);
      // Non-variable, non-function, may be a combination mode, also needs to be marked
    }

    this.editor.focus();
  }

  setValue(value: string) {
    this.editor.setValue(value);
  }

  getValue() {
    return this.editor.getValue();
  }

  markText(
    from: CodeMirror.Position,
    to: CodeMirror.Position,
    label: string,
    className = 'cm-func',
    rawString?: string
  ) {
    const text = document.createElement('span');
    text.className = className;
    text.innerText = label;

    if (rawString) {
      text.setAttribute('data-tooltip', rawString);
      text.setAttribute('data-position', 'bottom');
    }

    return this.editor.markText(from, to, {
      atomic: true,
      replacedWith: text
    });
  }

  widgets: any[] = [];
  marks: any[] = [];
  autoMark() {
    const editor = this.editor;
    const value = editor.getValue();
    const functions = this.functions;
    const variables = this.variables;
    const highlightMode = this.highlightMode;

    // Clear out the old
    this.widgets.forEach(widget => editor.removeLineWidget(widget));
    this.widgets = [];

    this.marks.forEach(mark => mark.clear());
    this.marks = [];

    try {
      const ast = parse(value, {
        evalMode: this.evalMode,
        variableMode: false
      });
      traverseAst(ast, (ast: any): any => {
        if (highlightMode === 'expression') {
          if (ast.type === 'script') {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.end.line - 1,
                ch: ast.end.column - 1
              },
              value.substring(ast.start.index + 2, ast.end.index - 1),
              'cm-expression',
              value
            );
          }
          return;
        }

        if (ast.type === 'func_call') {
          const funName = ast.identifier;
          const exists = functions.some(item =>
            item.items.some(i => i.name === funName)
          );
          if (exists) {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.start.line - 1,
                ch: ast.start.column + funName.length - 1
              },
              funName,
              'cm-func'
            );
          }
        } else if (ast.type === 'getter') {
          // Get the variables in the object
          const list = [ast];
          let current = ast;
          while (current?.type === 'getter') {
            current = current.host;
            list.unshift(current);
          }
          const host = list.shift();
          if (host?.type === 'variable') {
            const variable = findTree(
              variables,
              item => item.value === host.name
            );
            if (variable) {
              // Mark the top-level object first
              this.markText(
                {
                  line: host.start.line - 1,
                  ch: host.start.column - 1
                },
                {
                  line: host.end.line - 1,
                  ch: host.end.column - 1
                },
                variable.label,
                'cm-field',
                host.name
              );

              // Re-mark the child object
              let path = host.name + '.';
              let vars = variable.children || [];
              for (let i = 0, len = list.length; i < len; i++) {
                const item = list[i]?.key;

                // Only this fixed subscript situation can be recognized
                if (item?.type === 'identifier') {
                  const variable =
                    findTree(vars, v => v.value === path + item.name) ??
                    findTree(
                      vars,
                      v => v.value === item.name // Compatible with cases without paths
                    );
                  if (variable) {
                    this.markText(
                      {
                        line: item.start.line - 1,
                        ch: item.start.column - 1
                      },
                      {
                        line: item.end.line - 1,
                        ch: item.end.column - 1
                      },
                      variable.label,
                      'cm-field',
                      item.name
                    );
                    path += item.name + '.';
                    vars = variable.children || [];
                  } else {
                    break;
                  }
                }
              }
            }
          }
          return false;
        } else if (ast.type === 'variable') {
          // Directly variable
          const variable = findTree(variables, item => item.value === ast.name);
          if (variable) {
            this.markText(
              {
                line: ast.start.line - 1,
                ch: ast.start.column - 1
              },
              {
                line: ast.end.line - 1,
                ch: ast.end.column - 1
              },
              variable.label,
              'cm-field',
              ast.name
            );
          }
          return false;
        }
      });
    } catch (e) {
      const reg = /^Unexpected\stoken\s(.+)\sin\s(\d+):(\d+)$/.exec(e.message);
      if (reg) {
        const token = reg[1];
        const line = parseInt(reg[2], 10);
        const column = parseInt(reg[3], 10);
        const msg = document.createElement('div');
        const icon = msg.appendChild(document.createElement('span'));
        icon.innerText = '!!';
        icon.className = 'lint-error-icon';
        msg.appendChild(
          document.createTextNode(`Unexpected token \`${token}\``)
        );
        msg.className = 'lint-error';
        this.widgets.push(
          editor.addLineWidget(line - 1, msg, {
            coverGutter: false,
            noHScroll: true
          })
        );

        this.marks.push(
          this.markText(
            {
              line: line - 1,
              ch: column - 1
            },
            {
              line: line - 1,
              ch: column + token.length - 1
            },
            token,
            'cm-error-token'
          )
        );
      }
      console.warn('synax error, ignore it');
    }
  }

  // Focus on the end
  focus(value: string) {
    this.editor.setCursor({
      line: 0,
      ch: value?.length || 0
    });
  }

  dispose() {
    (this.autoMarkText as any).cancel();
  }

  validate() {}
}

let modeRegisted = false;
function registerLaunguageMode(cm: typeof CodeMirror) {
  if (modeRegisted) {
    return;
  }
  modeRegisted = true;

  // TODO custom language rules

  // Corresponding to evalMode
  cm.defineMode('formula', (config: any, parserConfig: any) => {
    var formula = cm.getMode(config, 'javascript');
    if (!parserConfig || !parserConfig.base) return formula;

    return cm.multiplexingMode(cm.getMode(config, parserConfig.base), {
      open: '${',
      close: '}',
      mode: formula
    });
  });
  cm.defineMIME('text/formula', {name: 'formula'});
  cm.defineMIME('text/formula-template', {name: 'formula', base: 'htmlmixed'});
}
