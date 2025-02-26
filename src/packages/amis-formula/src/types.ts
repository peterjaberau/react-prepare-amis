import {Evaluator} from './evalutor';

export interface FilterMap {
  [propName: string]: (this: FilterContext, input: any, ...args: any[]) => any;
}

export interface FunctionMap {
  [propName: string]: (this: Evaluator, ...args: Array<any>) => any;
}

export interface FunctionDocItem {
  name: string; // function name
  example?: string; // example
  description?: string; // description
  namespace?: string;
  [propName: string]: any;
}
export interface FunctionDocMap {
  [propName: string]: FunctionDocItem[];
}

export interface FilterContext {
  data: Object;
  filter?: {
    name: string;
    args: Array<any>;
  };
  restFilters: Array<{
    name: string;
    args: Array<any>;
  }>;
}

export interface EvaluatorOptions {
  /**
   * You can pass in ast node processors externally to customize or expand custom functions
   */
  functions?: FunctionMap;

  /**
   * External expansion filter
   */
  filters?: FilterMap;

  defaultFilter?: string;
}

export interface LexerOptions {
  /**
   * Is it a calculation expression directly? Or is it a calculation expression inside ${} starting from the template?
   */
  evalMode?: boolean;

  /**
   * Only supports variable access.
   */
  variableMode?: boolean;

  /**
   * Whether to allow filter syntax, such as:
   *
   * ${abc | html}
   */
  allowFilter?: boolean;

  isFilter?: (name: string) => boolean;
}

export type TokenTypeName =
  | 'Boolean'
  | 'Raw'
  | 'Variable'
  | 'OpenScript'
  | 'CloseScript'
  | 'EOF'
  | 'Identifier'
  | 'Literal'
  | 'Numeric'
  | 'Punctuation'
  | 'String'
  | 'RegularExpression'
  | 'TemplateRaw'
  | 'TemplateLeftBrace'
  | 'TemplateRightBrace'
  | 'OpenFilter'
  | 'Char';

export interface Position {
  index: number;
  line: number;
  column: number;
}

export interface Token {
  type: TokenTypeName;
  value: any;
  raw?: string;
  start: Position;
  end: Position;
}

export type NodeType = 'content' | 'raw' | 'conditional';

export interface ParserOptions {
  /**
   * Is it a calculation expression directly? Or is it a calculation expression inside ${} starting from the template?
   */
  evalMode?: boolean;

  /**
   * Only supports variable access.
   */
  variableMode?: boolean;

  /**
   * Whether to allow filter syntax, such as:
   *
   * ${abc | html}
   */
  allowFilter?: boolean;

  variableNamespaces?: Array<string>;
}

export interface ASTNode {
  type: string;
  start: Position;
  end: Position;
  [propname: string]: any;
}

export type ASTNodeOrNull = ASTNode | null;
