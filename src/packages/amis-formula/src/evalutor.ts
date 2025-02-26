/**
 * @file formula built-in function
 */

import moment from 'moment';
import upperFirst from 'lodash/upperFirst';
import padStart from 'lodash/padStart';
import capitalize from 'lodash/capitalize';
import escape from 'lodash/escape';
import truncate from 'lodash/truncate';
import uniqWith from 'lodash/uniqWith';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import get from 'lodash/get';
import {EvaluatorOptions, FilterContext, FilterMap, FunctionMap} from './types';
import {FormulaEvalError} from './error';

export class Evaluator {
  readonly filters: FilterMap;
  readonly functions: FunctionMap = {};
  readonly context: {
    [propName: string]: any;
  };
  contextStack: Array<(varname: string) => any> = [];

  static defaultFilters: FilterMap = {};
  static extendDefaultFilters(filters: FilterMap) {
    Evaluator.defaultFilters = {
      ...Evaluator.defaultFilters,
      ...filters
    };
  }
  static defaultFunctions: FunctionMap = {};
  static extendDefaultFunctions(funtions: FunctionMap) {
    Evaluator.defaultFunctions = {
      ...Evaluator.defaultFunctions,
      ...funtions
    };
  }

  constructor(
    context: {
      [propName: string]: any;
    },
    readonly options: EvaluatorOptions = {
      defaultFilter: 'html'
    }
  ) {
    this.context = context;
    this.contextStack.push((varname: string) =>
      varname === '&' ? context : context?.[varname]
    );

    this.filters = {
      ...Evaluator.defaultFilters,
      ...this.filters,
      ...options?.filters
    };
    this.functions = {
      ...Evaluator.defaultFunctions,
      ...this.functions,
      ...options?.functions
    };
  }

  // Main entrance
  evalute(ast: any) {
    if (ast && ast.type) {
      const name = (ast.type as string).replace(/(?:_|\-)(\w)/g, (_, l) =>
        l.toUpperCase()
      );
      const fn = this.functions[name] || (this as any)[name];
      if (!fn) {
        throw new Error(`${ast.type} unkown.`);
      }

      return fn.call(this, ast);
    } else {
      return ast;
    }
  }

  document(ast: {type: 'document'; body: Array<any>}) {
    if (!ast.body.length) {
      return undefined;
    }
    const isString = ast.body.length > 1;
    const content = ast.body.map(item => {
      let result = this.evalute(item);

      if (isString && result == null) {
        // Do not use text such as undefined or null
        return '';
      }

      return result;
    });
    return content.length === 1 ? content[0] : content.join('');
  }

  filter(ast: {
    type: 'filter';
    input: any;
    filters: Array<{name: string; args: Array<any>}>;
  }) {
    let input = this.evalute(ast.input);
    const filters = ast.filters.concat();
    const context: FilterContext = {
      filter: undefined,
      data: this.context,
      restFilters: filters
    };

    while (filters.length) {
      const filter = filters.shift()!;
      const fn = this.filters[filter.name];
      if (!fn) {
        throw new Error(`filter \`${filter.name}\` not exists.`);
      }
      context.filter = filter;
      input = fn.apply(
        context,
        [input].concat(
          filter.args.map((item: any) => {
            if (item?.type === 'mixed') {
              return item.body
                .map((item: any) =>
                  typeof item === 'string' ? item : this.evalute(item)
                )
                .join('');
            } else if (item.type) {
              return this.evalute(item);
            }
            return item;
          })
        )
      );
    }
    return input;
  }

  raw(ast: {type: 'raw'; value: string}) {
    return ast.value;
  }

  script(ast: {type: 'script'; body: any}) {
    const defaultFilter = this.options.defaultFilter;

    // Only simple variable value usage automatically fills in fitler
    if (defaultFilter && ~['getter', 'variable'].indexOf(ast.body?.type)) {
      ast = {
        ...ast,
        body: {
          type: 'filter',
          input: ast.body,
          filters: [
            {
              name: defaultFilter.replace(/^\s*\|\s*/, ''),
              args: []
            }
          ]
        }
      };
    }

    return this.evalute(ast.body);
  }

  expressionList(ast: {type: 'expression-list'; body: Array<any>}) {
    return ast.body.reduce((prev, current) => this.evalute(current));
  }

  template(ast: {type: 'template'; body: Array<any>}) {
    return ast.body.map(arg => this.evalute(arg)).join('');
  }

  templateRaw(ast: {type: 'template_raw'; value: any}) {
    return ast.value;
  }

  // Get the subscript
  getter(ast: {host: any; key: any}) {
    const host = this.evalute(ast.host);
    let key = this.evalute(ast.key);
    if (typeof key === 'undefined' && ast.key?.type === 'variable') {
      key = ast.key.name;
    }
    return host?.[key];
  }

  // Bit operations such as +2 ~3!
  unary(ast: {op: '+' | '-' | '~' | '!'; value: any}) {
    let value = this.evalute(ast.value);

    switch (ast.op) {
      case '+':
        return +value;
      case '-':
        return -value;
      case '~':
        return ~value;
      case '!':
        return !value;
    }
  }

  formatNumber(value: any, int = false) {
    const typeName = typeof value;
    if (typeName === 'string') {
      return (int ? parseInt(value, 10) : parseFloat(value)) || 0;
    } else if (typeName === 'number' && int) {
      return Math.round(value);
    }

    return value ?? 0;
  }

  // Determine whether it is a number or a string number
  isValidValue(value: string | number) {
    return (
      typeof value === 'number' ||
      (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value as string))
    );
  }

  power(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    if (!this.isValidValue(left) || !this.isValidValue(right)) {
      return left;
    }
    return Math.pow(left, right);
  }

  multiply(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) * this.formatNumber(right));
  }

  divide(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) / this.formatNumber(right));
  }

  remainder(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return this.formatNumber(left) % this.formatNumber(right);
  }

  add(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    // If one of them is not a number, it will be concatenated into a string
    if (isNaN(left) || isNaN(right)) {
      return left + right;
    }
    return stripNumber(this.formatNumber(left) + this.formatNumber(right));
  }

  minus(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) - this.formatNumber(right));
  }

  shift(ast: {op: '<<' | '>>' | '>>>'; left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.formatNumber(this.evalute(ast.right), true);

    if (ast.op === '<<') {
      return left << right;
    } else if (ast.op == '>>') {
      return left >> right;
    } else {
      return left >>> right;
    }
  }

  lt(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left < right;
  }

  gt(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.
    return left > right;
  }

  le(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left <= right;
  }

  ge(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left >= right;
  }

  eq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left == right;
  }

  ne(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left != right;
  }

  streq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left === right;
  }

  strneq(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left !== right;
  }

  binary(ast: {op: '&' | '^' | '|'; left: any; right: any}) {
    const left = this.evalute(ast.left);
    const right = this.evalute(ast.right);

    if (ast.op === '&') {
      return left & right;
    } else if (ast.op === '^') {
      return left ^ right;
    } else {
      return left | right;
    }
  }

  and(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    return left && this.evalute(ast.right);
  }

  or(ast: {left: any; right: any}) {
    const left = this.evalute(ast.left);
    return left || this.evalute(ast.right);
  }

  number(ast: {value: any; raw: string}) {
    // todo You can support large numbers here later.
    return ast.value;
  }

  /**
   * Get variables in the namespace. There may be special cases where the variable name contains -. Currently, it is not possible to directly get ${ns:xxx-xxx}
   * Want to use ${ns:&['xxx-xxx']} to support special characters.
   *
   * Cookies, localstorage, and sessionstorage do not support obtaining full data, such as ${ns: &}
   * So when the above usage exists, & is used as a placeholder
   *
   * For example, if there is a value with key xxx-xxx in the cookie, it can be obtained through &['xxx-xxx'].
   * It cannot be obtained through ${cookie:xxx-xxx} because it will be considered as a reduction operation.
   * @param ast
   * @returns
   */
  convertHostGetterToVariable(ast: any) {
    if (ast.type !== 'getter') {
      return ast;
    }

    let gettter = ast;
    const keys: Array<string> = [];
    while (gettter.host?.type === 'getter') {
      keys.push('host');
      gettter = gettter.host;
    }
    if (gettter.host?.type === 'variable' && gettter.host.name === '&') {
      const ret: any = {
        host: ast
      };
      const host = keys.reduce((host, key) => {
        host[key] = {...host[key]};
        return host[key];
      }, ret);

      host.host = {
        start: host.host.start,
        end: host.host.end,
        type: 'variable',
        name: this.evalute(host.host.key)
      };
      return ret.host;
    }
    return ast;
  }

  nsVariable(ast: {namespace: string; body: any}) {
    let body = ast.body;
    if (ast.namespace === 'window') {
      this.contextStack.push((name: string) =>
        name === '&' ? window : (window as any)[name]
      );
    } else if (ast.namespace === 'cookie') {
      // You may use &['xxx-xxx'] to get special variables
      body = this.convertHostGetterToVariable(body);
      this.contextStack.push((name: string) => {
        return getCookie(name);
      });
    } else if (ast.namespace === 'ls' || ast.namespace === 'ss') {
      const ns = ast.namespace;
      // You may use &['xxx-xxx'] to get special variables
      body = this.convertHostGetterToVariable(body);
      this.contextStack.push((name: string) => {
        const raw =
          ns === 'ss'
            ? sessionStorage.getItem(name)
            : localStorage.getItem(name);

        if (typeof raw === 'string') {
          // Determine whether the string is a pure numeric string. If so, compare the parsed value with the original value to see if they are the same.
          // If they are different, return the original value, because if the original value is a very long pure numeric string, the precision may be lost after parsing
          if (/^\d+$/.test(raw)) {
            const parsed = JSON.parse(raw);
            return `${parsed}` === raw ? parsed : raw;
          }

          return parseJson(raw, raw);
        }

        return undefined;
      });
    } else {
      throw new Error('Unsupported namespace: ' + ast.namespace);
    }

    const result = this.evalute(body);
    result?.then
      ? result.then(() => this.contextStack.pop())
      : this.contextStack.pop();
    return result;
  }

  variable(ast: {name: string}) {
    const contextGetter = this.contextStack[this.contextStack.length - 1];
    return contextGetter(ast.name);
  }

  identifier(ast: {name: string}) {
    return ast.name;
  }

  array(ast: {type: 'array'; members: Array<any>}) {
    return ast.members.map(member => this.evalute(member));
  }

  literal(ast: {type: 'literal'; value: any}) {
    return ast.value;
  }

  string(ast: {type: 'string'; value: string}) {
    return ast.value;
  }

  object(ast: {members: Array<{key: string; value: any}>}) {
    let object: any = {};
    ast.members.forEach(({key, value}) => {
      object[this.evalute(key)] = this.evalute(value);
    });
    return object;
  }

  conditional(ast: {
    type: 'conditional';
    test: any;
    consequent: any;
    alternate: any;
  }) {
    return this.evalute(ast.test)
      ? this.evalute(ast.consequent)
      : this.evalute(ast.alternate);
  }

  funcCall(this: any, ast: {identifier: string; args: Array<any>}) {
    const fnName = `fn${ast.identifier}`;
    const fn =
      this.functions[fnName] ||
      this[fnName] ||
      (this.filters.hasOwnProperty(ast.identifier) &&
        this.filters[ast.identifier]);

    if (!fn) {
      throw new FormulaEvalError(`${ast.identifier} function is not defined`);
    }

    let args: Array<any> = ast.args;

    // Logical functions are handled specially because sometimes some operations can be skipped.
    if (~['IF', 'AND', 'OR', 'XOR', 'IFS'].indexOf(ast.identifier)) {
      args = args.map(a => () => this.evalute(a));
    } else {
      args = args.map(a => this.evalute(a));
    }

    return fn.apply(this, args);
  }

  anonymousFunction(ast: any) {
    return ast;
  }

  callAnonymousFunction(
    ast: {
      args: any[];
      return: any;
    },
    args: Array<any>
  ) {
    const ctx: any = createObject(
      this.contextStack[this.contextStack.length - 1]('&') || {},
      {}
    );
    ast.args.forEach((arg: any) => {
      if (arg.type !== 'variable') {
        throw new Error('expected a variable as argument');
      }
      ctx[arg.name] = args.shift();
    });
    this.contextStack.push((varName: string) =>
      varName === '&' ? ctx : ctx[varName]
    );
    const result = this.evalute(ast.return);
    this.contextStack.pop();
    return result;
  }

  /**
   * If the condition is met, it returns consequent, otherwise it returns alternate. It supports multi-layer nested IF functions.
   *
   * Equivalent to directly using JS expressions such as: condition ? consequent : alternate.
   *
   * @example IF(condition, consequent, alternate)
   * @param {expression} condition conditional expression. For example: Chinese score>80
   * @param {any} consequent The result returned if the condition is passed
   * @param {any} alternate The result returned if the condition fails
   * @namespace logical function
   *
   * @returns {any} returns different results according to the conditions
   */
  fnIF(condition: () => any, trueValue: () => any, falseValue: () => any) {
    return condition() ? trueValue() : falseValue();
  }

  /**
   * If all conditions are met, return true, otherwise return false.
   *
   * Example: AND(Chinese score>80, Mathematics score>80),
   *
   * If both the Chinese and math scores are greater than 80, it returns true, otherwise it returns false.
   *
   * Equivalent to using JS expressions directly such as: Chinese score>80 && Math score>80.
   *
   * @example AND(expression1, expression2, ...expressionN)
   * @param {...expression} conditions Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
   * @namespace logical function
   *
   * @returns {boolean}
   */
  fnAND(...condtions: Array<() => any>) {
    return condtions.every(c => c());
  }

  /**
   * If any of the conditions are met, return true, otherwise return false.
   *
   * Example: OR (Chinese score>80, Mathematics score>80),
   *
   * If either the Chinese score or the math score is greater than 80, then return true, otherwise return false.
   *
   * Equivalent to using JS expressions directly such as: Chinese score>80 || Math score>80.
   *
   * @example OR(expression1, expression2, ...expressionN)
   * @param {...expression} conditions Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
   * @namespace logical function
   *
   * @returns {boolean}
   */
  fnOR(...condtions: Array<() => any>) {
    return condtions.some(c => c());
  }

  /**
   * XOR processing, multiple expression groups are considered true when there are an odd number of true ones.
   *
   * Example: XOR(Chinese score > 80, Mathematics score > 80, English score > 80)
   *
   * If one or all of the three scores are greater than 80, return true, otherwise return false.
   *
   * @example XOR(condition1, condition2, ...expressionN)
   * @param {...expression} condition Conditional expressions, multiple expressions separated by commas. For example: Chinese score>80, Math score>80
   * @namespace logical function
   *
   * @returns {boolean}
   */
  fnXOR(...condtions: Array<() => any>) {
    return !!(condtions.filter(c => c()).length % 2);
  }

  /**
   * A set of judgment functions, equivalent to combining multiple else if statements into one.
   *
   * Example: IFS (Chinese score > 80, "Excellent", Chinese score > 60, "Good", "Keep working hard"),
   *
   * If the Chinese score is greater than 80, return "Excellent", otherwise if it is greater than 60, return "Good", otherwise return "Keep working hard".
   *
   * @example IFS(condition1, result1, condition2, result2,...conditionN, resultN)
   * @param {...expression} condition conditional expression
   * @param {...any} result return value
   * @namespace logical function
   * @returns {any} The first result that meets the condition. If there is no match, false is returned.
   */
  fnIFS(...args: Array<() => any>) {
    if (args.length % 2) {
      args.splice(args.length - 1, 0, () => true);
    }

    while (args.length) {
      const c = args.shift()!;
      const v = args.shift()!;

      if (c()) {
        return v();
      }
    }
    return;
  }

  /**
   * Returns the absolute value of the passed number.
   *
   * @example ABS(num)
   * @param {number} num - value
   * @namespace math functions
   *
   * @returns {number} the absolute value of the passed value
   */
  fnABS(a: number) {
    a = this.formatNumber(a);
    return Math.abs(a);
  }

  /**
   * Get the maximum value. If there is only one parameter and it is an array, calculate the value in the array.
   *
   * @example MAX(num1, num2, ...numN) or MAX([num1, num2, ...numN])
   * @param {...number} num - value
   * @namespace math functions
   *
   * @returns {number} the largest of all passed values
   */
  fnMAX(...args: Array<any>) {
    const arr = normalizeArgs(args);
    return Math.max.apply(
      Math,
      arr.map(item => this.formatNumber(item))
    );
  }

  /**
   * Get the minimum value. If there is only one parameter and it is an array, calculate the value in the array.
   *
   * @example MIN(num1, num2, ...numN) or MIN([num1, num2, ...numN])
   * @param {...number} num - value
   * @namespace math functions
   *
   * @returns {number} The smallest of all passed values
   */
  fnMIN(...args: Array<number>) {
    const arr = normalizeArgs(args);
    return Math.min.apply(
      Math,
      arr.map(item => this.formatNumber(item))
    );
  }

  /**
   * Sum. If there is only one parameter and it is an array, calculate the value in the array.
   *
   * @example SUM(num1, num2, ...numN) or SUM([num1, num2, ...numN])
   * @param {...number} num - value
   * @namespace math functions
   *
   * @returns {number} the sum of all passed values
   */
  fnSUM(...args: Array<number>) {
    const arr = normalizeArgs(args);
    return arr.reduce((sum, a) => sum + this.formatNumber(a) || 0, 0);
  }

  /**
   * Rounds a value down to the nearest integer.
   *
   * @example INT(num)
   * @param {number} num - value
   * @namespace math functions
   *
   * @returns {number} The integer corresponding to the value
   */
  fnINT(n: number) {
    return Math.floor(this.formatNumber(n));
  }

  /**
   * Returns the remainder after dividing two numbers. The parameter number is the dividend and divisor is the divisor.
   *
   * @example MOD(num, divisor)
   * @param {number} num - the dividend
   * @param {number} divisor - divisor
   * @namespace math functions
   *
   * @returns {number} the remainder of the division of two numbers
   */
  fnMOD(a: number, b: number) {
    return this.formatNumber(a) % this.formatNumber(b);
  }

  /**
   * Pi is 3.1415…
   *
   * @example PI()
   * @namespace math functions
   *
   * @returns {number} the value of pi
   */
  fnPI() {
    return Math.PI;
  }

  /**
   * Rounds a number to a specified number of decimal places.
   *
   * @example ROUND(num[, numDigits = 2])
   * @param {number} num - the number to be processed
   * @param {number} numDigits - the number of decimal places, default is 2
   * @namespace math functions
   *
   * @returns {number} The result after rounding the passed value
   */
  fnROUND(a: number, b: number = 2) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.round(a * c) / c;
    }

    return Math.round(a);
  }

  /**
   * Rounds a number down to the specified number of decimal places.
   *
   * @example FLOOR(num[, numDigits=2])
   * @param {number} num - the number to be processed
   * @param {number} numDigits - the number of decimal places, default is 2
   * @namespace math functions
   *
   * @returns {number} The result after the passed value is rounded down
   */
  fnFLOOR(a: number, b: number = 2) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.floor(a * c) / c;
    }

    return Math.floor(a);
  }

  /**
   * Rounds a number up to the specified number of decimal places.
   *
   * @example CEIL(num[, numDigits=2])
   * @param {number} num - the number to be processed
   * @param {number} numDigits - the number of decimal places, default is 2
   * @namespace math functions
   *
   * @returns {number} The result after the passed value is rounded up
   */
  fnCEIL(a: number, b: number = 2) {
    a = this.formatNumber(a);
    b = this.formatNumber(b);
    const bResult = Math.round(b);

    if (bResult) {
      const c = Math.pow(10, bResult);
      return Math.ceil(a * c) / c;
    }

    return Math.ceil(a);
  }

  /**
   * Square root, parameter number is a non-negative number
   *
   * @example SQRT(num)
   * @param {number} num - the number to be processed
   * @namespace math functions
   *
   * @returns the square root of {number}
   */
  fnSQRT(n: number) {
    return Math.sqrt(this.formatNumber(n));
  }

  /**
   * Returns the average value of all parameters. If there is only one parameter and it is an array, calculates the value in the array.
   *
   * @example AVG(num1, num2, ...numN) or AVG([num1, num2, ...numN])
   * @param {...number} num - the number to be processed
   * @namespace math functions
   *
   * @returns {number} the average of all values
   */
  fnAVG(...args: Array<any>) {
    const arr = normalizeArgs(args);
    return (
      this.fnSUM.apply(
        this,
        arr.map(item => this.formatNumber(item))
      ) / arr.length
    );
  }

  /**
   * Returns the sum of the squares of the differences between the data point and the data mean point (data deviation). If there is only one parameter and it is an array, the value in the array is calculated.
   *
   * @example DEVSQ(num1, num2, ...numN)
   * @param {...number} num - the number to be processed
   * @namespace math functions
   *
   * @returns {number} the average of all values
   */
  fnDEVSQ(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    const arr = normalizeArgs(args);

    const nums = arr.map(item => this.formatNumber(item));
    const sum = nums.reduce((sum, a) => sum + a || 0, 0);
    const mean = sum / nums.length;
    let result = 0;
    for (const num of nums) {
      result += Math.pow(num - mean, 2);
    }
    return result;
  }

  /**
   * The average of the absolute deviations of the data points from their arithmetic mean.
   *
   * @example AVEDEV(num1, num2, ...numN)
   * @param {...number} num - the number to be processed
   * @namespace math functions
   *
   * @returns {number} the average of all values
   */
  fnAVEDEV(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    let arr = args;
    if (args.length === 1 && Array.isArray(args[0])) {
      arr = args[0];
    }
    const nums = arr.map(item => this.formatNumber(item));
    const sum = nums.reduce((sum, a) => sum + a || 0, 0);
    const mean = sum / nums.length;
    let result = 0;
    for (const num of nums) {
      result += Math.abs(num - mean);
    }
    return result / nums.length;
  }

  /**
   * The harmonic mean of the data points. If there is only one parameter and it is an array, the value in the array is calculated.
   *
   * @example HARMEAN(num1, num2, ...numN)
   * @param {...number} num - the number to be processed
   * @namespace math functions
   *
   * @returns {number} the average of all values
   */
  fnHARMEAN(...args: Array<any>) {
    if (args.length === 0) {
      return null;
    }
    let arr = args;
    if (args.length === 1 && Array.isArray(args[0])) {
      arr = args[0];
    }
    const nums = arr.map(item => this.formatNumber(item));
    let den = 0;
    for (const num of nums) {
      den += 1 / num;
    }
    return nums.length / den;
  }

  /**
   * The kth largest value in the data set.
   *
   * @example LARGE(array, k)
   * @param {array} nums - the numbers to be processed
   * @param {number} k - the largest number
   * @namespace math functions
   *
   * @returns {number} the average of all values
   */
  fnLARGE(nums: Array<any>, k: number) {
    if (nums.length === 0) {
      return null;
    }
    const numsFormat = nums.map(item => this.formatNumber(item));
    if (k < 0 || numsFormat.length < k) {
      return null;
    }
    return numsFormat.sort(function (a, b) {
      return b - a;
    })[k - 1];
  }

  /**
   * Convert the value to Chinese uppercase amount.
   *
   * @example UPPERMONEY(num)
   * @param {number} num - the number to be processed
   * @namespace math functions
   *
   * @returns {string} numerical Chinese uppercase characters
   */
  fnUPPERMONEY(n: number) {
    n = this.formatNumber(n);
    const maxLen = 14;
    if (n.toString().split('.')[0]?.length > maxLen) {
      return `The maximum amount supported is only up to megabytes (i.e. ${maxLen} digits before the decimal point)`;
    }

    const fraction = ['angle', 'minute'];
    const digit = ['零', '壹', '贰', '叁', '４', '５', '６', '７', '８', '９'];
    const unit = [
      ['yuan', 'wan', 'yi', 'trillion'],
      ['', '拾', '佰', '千']
    ];
    const head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '');
    }
    s = s || 'whole';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^whole$/, 'zero yuan whole')
    );
  }

  /**
   * Returns a uniformly distributed random real number greater than or equal to 0 and less than 1. The calculation changes every time it is triggered.
   *
   * Example: `RAND()*100`,
   *
   * Returns a random number between 0-100.
   *
   * @example RAND()
   * @namespace math functions
   *
   * @returns {number} random number
   */
  fnRAND() {
    return Math.random();
  }

  /**
   * Get the last data.
   *
   * @example LAST(array)
   * @param {...number} arr - the array to be processed
   * @namespace math functions
   *
   * @returns {any} the last value
   */
  fnLAST(arr: Array<any>) {
    return arr.length ? arr[arr.length - 1] : null;
  }

  /**
   * Returns the exponential power of the base. The parameter base is the base and exponent is the exponent. If the parameter value is illegal, the base itself is returned. If the calculation result is illegal, NaN is returned.
   *
   * @example POW(base, exponent)
   * @param {number} base base
   * @param {number} exponent exponent
   * @namespace math functions
   *
   * @returns {number} the exponential power of the base
   */
  fnPOW(base: number, exponent: number) {
    if (!this.isValidValue(base) || !this.isValidValue(exponent)) {
      return base;
    }

    return Math.pow(this.formatNumber(base), this.formatNumber(exponent));
  }

  // Text function

  normalizeText(raw: any) {
    if (raw instanceof Date) {
      return moment(raw).format();
    }

    return `${raw}`;
  }

  /**
   * Returns a string of the specified length from the left side of the passed text.
   *
   * @example LEFT(text, len)
   * @param {string} text - the text to be processed
   * @param {number} len - the length to be processed
   * @namespace text function
   *
   * @returns {string} corresponding string
   */
  fnLEFT(text: string, len: number) {
    text = this.normalizeText(text);
    return text.substring(0, len);
  }

  /**
   * Returns a string of the specified length from the right side of the passed text.
   *
   * @example RIGHT(text, len)
   * @param {string} text - the text to be processed
   * @param {number} len - the length to be processed
   * @namespace text function
   *
   * @returns {string} corresponding string
   */
  fnRIGHT(text: string, len: number) {
    text = this.normalizeText(text);
    return text.substring(text.length - len, text.length);
  }

  /**
   * Calculate the length of the text.
   *
   * @example LEN(text)
   * @param {string} text - the text to be processed
   * @namespace text function
   *
   * @returns {number} length
   */
  fnLEN(text: string) {
    if (text === undefined || text === null) {
      return 0;
    }
    text = this.normalizeText(text);
    return text?.length;
  }

  /**
   * Calculate the length of all text in a text collection.
   *
   * @example LENGTH(textArr)
   * @param {string[]} textArr - the text collection to be processed
   * @namespace text function
   *
   * @returns {number[]} length collection
   */
  fnLENGTH(...args: any[]) {
    return this.fnLEN.apply(this, args);
  }

  /**
   * Check if the text is empty.
   *
   * @example ISEMPTY(text)
   * @param {string} text - the text to be processed
   * @namespace text function
   *
   * @returns {boolean} judgment result
   */
  fnISEMPTY(text: string) {
    return !text || !String(text).trim();
  }

  /**
   * Concatenate multiple incoming values ​​into text.
   *
   * @example CONCATENATE(text1, text2, ...textN)
   * @param {...string} text - text collection
   * @namespace text function
   *
   * @returns {string} the concatenated text
   */
  fnCONCATENATE(...args: Array<any>) {
    return args.map(this.normalizeText).join('');
  }

  /**
   * Returns the character corresponding to the numeric code of the computer's character set.
   *
   * Example: `CHAR(97)` is equivalent to "a".
   *
   * @example CHAR(code)
   * @param {number} code - the encoding value
   * @namespace text function
   *
   * @returns {string} The character at the specified position
   */
  fnCHAR(code: number) {
    return String.fromCharCode(code);
  }

  /**
   * Convert the incoming text to lowercase.
   *
   * @example LOWER(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnLOWER(text: string) {
    text = this.normalizeText(text);
    return text.toLowerCase();
  }

  /**
   * Convert the incoming text to uppercase.
   *
   * @example UPPER(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnUPPER(text: string) {
    text = this.normalizeText(text);
    return text.toUpperCase();
  }

  /**
   * Convert the first letter of the incoming text to uppercase.
   *
   * @example UPPERFIRST(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnUPPERFIRST(text: string) {
    text = this.normalizeText(text);
    return upperFirst(text);
  }

  /**
   * Pad forward to the length of the text.
   *
   * Example `PADSTART("6", 2, "0")`,
   *
   * Returns `06`.
   *
   * @example PADSTART(text)
   * @param {string} text - text
   * @param {number} num - target length
   * @param {string} pad - the text to use for padding
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnPADSTART(text: string, num: number, pad: string): string {
    text = this.normalizeText(text);
    return padStart(text, num, pad);
  }

  /**
   * Convert text to titles.
   *
   * Example `CAPITALIZE("star")`,
   *
   * Returns `Star`.
   *
   * @example CAPITALIZE(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnCAPITALIZE(text: string): string {
    text = this.normalizeText(text);
    return capitalize(text);
  }

  /**
   * HTML escape the text.
   *
   * Example `ESCAPE("<star>&")`,
   *
   * Returns `<start>&`.
   *
   * @example ESCAPE(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnESCAPE(text: string): string {
    text = this.normalizeText(text);
    return escape(text);
  }

  /**
   * Truncate the text length.
   *
   * Example `TRUNCATE("amis.baidu.com", 6)`,
   *
   * Returns `amis...`.
   *
   * @example TRUNCATE(text, 6)
   * @param {string} text - text
   * @param {number} text - maximum length
   * @namespace text function
   *
   * @returns {string} result text
   */
  fnTRUNCATE(text: string, length: number): string {
    text = this.normalizeText(text);
    return truncate(text, {length});
  }

  /**
   * Take all the strings before a certain delimiter.
   *
   * @example  BEFORELAST(text, '.')
   * @param {string} text - text
   * @param {string} delimiter - end text
   * @namespace text function
   *
   * @returns {string} judgment result
   */
  fnBEFORELAST(text: string, delimiter: string = '.') {
    text = this.normalizeText(text);
    delimiter = this.normalizeText(delimiter);
    return text.split(delimiter).slice(0, -1).join(delimiter) || text + '';
  }

  /**
   * Split the text into an array based on the specified fragment.
   *
   * Example: `SPLIT("a,b,c", ",")`,
   *
   * Returns `["a", "b", "c"]`.
   *
   * @example SPLIT(text, ',')
   * @param {string} text - text
   * @param {string} delimiter - text fragment
   * @namespace text function
   *
   * @returns {Array<string>} text set
   */
  fnSPLIT(text: string, sep: string = ',') {
    text = this.normalizeText(text);
    return text.split(sep);
  }

  /**
   * Remove leading and trailing spaces from the text.
   *
   * @example TRIM(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} processed text
   */
  fnTRIM(text: string) {
    text = this.normalizeText(text);
    return text.trim();
  }

  /**
   * Remove HTML tags from text.
   *
   * Example: `STRIPTAG("<b>amis</b>")`,
   *
   * Returns: `amis`.
   *
   * @example STRIPTAG(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} processed text
   */
  fnSTRIPTAG(text: string) {
    text = this.normalizeText(text);
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  }

  /**
   * Convert line breaks in strings to HTML `<br>` for simple line breaks.
   *
   * Example: `LINEBREAK("\n")`,
   *
   * Returns: `<br/>`.
   *
   * @example LINEBREAK(text)
   * @param {string} text - text
   * @namespace text function
   *
   * @returns {string} processed text
   */
  fnLINEBREAK(text: string) {
    text = this.normalizeText(text);
    return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
  }

  /**
   * Determines whether the string (text) starts with a specific string (startString), and returns true if it does, otherwise returns false.
   *
   * @example STARTSWITH(text, 'fragment')
   * @param {string} text - text
   * @param {string} startString - starting text
   * @namespace text function
   *
   * @returns {boolean} judgment result
   */
  fnSTARTSWITH(text: string, search: string) {
    search = this.normalizeText(search);
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return text.indexOf(search) === 0;
  }

  /**
   * Determines whether the string (text) ends with a specific string (endString), and returns true if it does, otherwise returns false.
   *
   * @example ENDSWITH(text, 'fragment')
   * @param {string} text - text
   * @param {string} endString - end text
   * @namespace text function
   *
   * @returns {boolean} judgment result
   */
  fnENDSWITH(text: string, search: string) {
    search = this.normalizeText(search);
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return text.indexOf(search, text.length - search.length) !== -1;
  }

  /**
   * Determines whether the text in parameter 1 contains the text in parameter 2. If so, returns true; otherwise, returns false.
   *
   * @example CONTAINS(text, searchText)
   * @param {string} text - text
   * @param {string} searchText - search text
   * @namespace text function
   *
   * @returns {boolean} judgment result
   */
  fnCONTAINS(text: string, search: string) {
    search = this.normalizeText(search);
    if (!search) {
      return false;
    }

    text = this.normalizeText(text);
    return !!~text.indexOf(search);
  }

  /**
   * Replace all text.
   *
   * @example REPLACE(text, search, replace)
   * @param {string} text - the text to be processed
   * @param {string} search - the text to be replaced
   * @param {string} replace - the text to replace
   * @namespace text function
   *
   * @returns {string} processing result
   */
  fnREPLACE(text: string, search: string, replace: string) {
    text = this.normalizeText(text);
    search = this.normalizeText(search);
    replace = this.normalizeText(replace);
    let result = text;

    if (typeof replace === 'undefined' || !search) {
      return result;
    }

    const shouldLoop = !(
      typeof replace === 'string' && replace.includes(search)
    );
    while (true) {
      const idx = result.indexOf(search);

      if (!~idx) {
        break;
      }

      result =
        result.substring(0, idx) +
        replace +
        result.substring(idx + search.length);

      if (!shouldLoop) {
        break;
      }
    }

    return result;
  }

  /**
   * Search for text and return the location of the hit.
   *
   * @example SEARCH(text, search, 0)
   * @param {string} text - the text to be processed
   * @param {string} search - the text to search for
   * @param {number} start - starting position
   * @namespace text function
   *
   * @returns {number} hit position
   */
  fnSEARCH(text: string, search: string, start: number = 0) {
    search = this.normalizeText(search);
    text = this.normalizeText(text);
    start = this.formatNumber(start);

    const idx = text.indexOf(search, start);
    if (~idx && search) {
      return idx;
    }

    return -1;
  }

  /**
   * Returns a specific number of characters from a text string starting at a specified position.
   *
   * Example: `MID("amis.baidu.com", 6, 3)`,
   *
   * Returns `aid`.
   *
   * @example MID(text, from, len)
   * @param {string} text - the text to be processed
   * @param {number} from - starting position
   * @param {number} len - processing length
   * @namespace text function
   *
   * @returns {string} hit position
   */
  fnMID(text: string, from: number, len: number) {
    text = this.normalizeText(text);
    from = this.formatNumber(from);
    len = this.formatNumber(len);
    return text.substring(from, from + len);
  }

  /**
   * Returns the file name in path.
   *
   * Example: `/home/amis/a.json`,
   *
   * Returns: `a.json`.
   *
   * @example BASENAME(text)
   * @param {string} text - the text to be processed
   * @namespace text function
   *
   * @returns {string} filename
   */
  fnBASENAME(text: string) {
    text = this.normalizeText(text);
    return text.split(/[\\/]/).pop();
  }

  /**
   * Generate UUID string
   *
   * @param {number} length - the length of the generated UUID string, default is 32 bits
   * @example UUID()
   * @example UUID(8)
   * @namespace text function
   *
   * @returns {string} Generated UUID string
   */
  fnUUID(length: number = 36) {
    const len = Math.min(Math.max(length, 0), 36);
    return uuidv4().slice(0, len);
  }

  // Date function

  /**
   * Create a date object, either by a string in a specific format or by a numeric value.
   *
   * Note that the month value starts from 0.
   * That is, if it is December, you should pass in the value 11.
   *
   * @example DATE(2021, 11, 6, 8, 20, 0)
   * @example DATE('2021-12-06 08:20:00')
   * @namespace date function
   *
   * @returns {Date} date object
   */
  fnDATE(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number
  ) {
    if (month === undefined) {
      return new Date(year);
    }

    return new Date(year, month, day, hour, minute, second);
  }

  /**
   * Returns the timestamp of the time.
   *
   * @example TIMESTAMP(date[, format = "X"])
   * @namespace date function
   * @param {date} date date object
   * @param {string} format Timestamp format, pass 'x' with milliseconds. Default is 'X' without milliseconds.
   *
   * @returns {number} timestamp
   */
  fnTIMESTAMP(date: Date, format?: 'x' | 'X') {
    return parseInt(
      moment(this.normalizeDate(date)).format(format === 'x' ? 'x' : 'X'),
      10
    );
  }

  /**
   * Returns today's date.
   *
   * @example TODAY()
   * @namespace date function
   *
   * @returns {number} date
   */
  fnTODAY() {
    return new Date();
  }

  /**
   * Returns the current date
   *
   * @example NOW()
   * @namespace date function
   *
   * @returns {number} date
   */
  fnNOW() {
    return new Date();
  }

  /**
   * Get the day of the week for a date.
   *
   * Example
   *
   * WEEKDAY('2023-02-27') returns 0.
   * WEEKDAY('2023-02-27', 2) returns 1.
   *
   * @example WEEKDAY(date)
   * @namespace date function
   * @param {any} date date
   * @param {number} type Week definition type, the default is 1, 1 means 0 to 6 represents Monday to Sunday, 2 means 1 to 7 represents Monday to Sunday
   *
   * @returns {number} the numeric identifier of the day of the week
   */
  fnWEEKDAY(date: Date | string | number, type?: number) {
    const md = moment(this.normalizeDate(date));
    return type === 2 ? md.isoWeekday() : md.weekday();
  }

  /**
   * Get the week of the year, that is, the number of weeks.
   *
   * Example
   *
   * WEEK('2023-03-05') yields 9.
   *
   * @example WEEK(date)
   * @namespace date function
   * @param {any} date date
   * @param {boolean} isISO whether it is ISO week
   *
   * @returns {number} the numeric identifier of the day of the week
   */
  fnWEEK(date: Date | string | number, isISO = false) {
    const md = moment(this.normalizeDate(date));
    return isISO ? md.isoWeek() : md.week();
  }

  /**
   * Format dates, date strings, and timestamps.
   *
   * Example
   *
   * DATETOSTR('12/25/2022', 'YYYY-MM-DD') gives '2022.12.25',
   * DATETOSTR(1676563200, 'YYYY.MM.DD') gives '2023.02.17',
   * DATETOSTR(1676563200000, 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
   * DATETOSTR(DATE('2021-12-21'), 'YYYY.MM.DD hh:mm:ss') 得到 '2021.12.21 08:00:00'。
   *
   * @example DATETOSTR(date, 'YYYY-MM-DD')
   * @namespace date function
   * @param {any} date date object, date string, timestamp
   * @param {string} format date format, default is "YYYY-MM-DD HH:mm:ss"
   *
   * @returns {string} date string
   */
  fnDATETOSTR(
    date: Date | string | number,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ) {
    date = this.normalizeDate(date);
    return moment(date).format(format);
  }

  /**
   * Get the start time and end time in the date range string.
   *
   * Example:
   *
   * DATERANGESPLIT('1676563200, 1676735999') gets [1676563200, 1676735999],
   * DATERANGESPLIT('1676563200, 1676735999', undefined , 'YYYY.MM.DD hh:mm:ss') 得到 [2023.02.17 12:00:00, 2023.02.18 11:59:59]，
   * DATERANGESPLIT('1676563200, 1676735999', 0 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
   * DATERANGESPLIT('1676563200, 1676735999', 'start' , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.17 12:00:00',
   * DATERANGESPLIT('1676563200, 1676735999', 1 , 'YYYY.MM.DD hh:mm:ss') gets '2023.02.18 11:59:59',
   * DATERANGESPLIT('1676563200, 1676735999', 'end' , 'YYYY.MM.DD hh:mm:ss') gives '2023.02.18 11:59:59'.
   *
   * @example DATERANGESPLIT(date, 'YYYY-MM-DD')
   * @namespace date function
   * @param {string} date date range string
   * @param {string} key value identifier, 0 or 'start' indicates the start time of acquisition, 1 or 'end' indicates the end time of acquisition
   * @param {string} format date format, optional
   * @param {string} delimiter separator, optional, default is ','
   *
   * @returns {string} date string
   */
  fnDATERANGESPLIT(
    daterange: string,
    key?: string,
    format?: string,
    delimiter = ','
  ) {
    if (!daterange || typeof daterange !== 'string') {
      return daterange;
    }

    const dateArr = daterange
      .split(delimiter)
      .map(item =>
        item && format
          ? moment(this.normalizeDate(item.trim())).format(format)
          : item.trim()
      );

    if ([0, '0', 'start'].includes(key!)) {
      return dateArr[0];
    }

    if ([1, '1', 'end'].includes(key!)) {
      return dateArr[1];
    }

    return dateArr;
  }

  /**
   * Returns the start of a specified range of dates.
   *
   * @namespace date function
   * @example STARTOF(date[unit = "day"])
   * @param {date} date date object
   * @param {string} unit For example, you can pass in 'day', 'month', 'year' or `week`, etc.
   * @param {string} format date format, optional
   * @returns {any} new date object, if format is passed in, the formatted date string is returned
   */
  fnSTARTOF(date: Date, unit?: any, format?: string) {
    const md = moment(this.normalizeDate(date)).startOf(unit || 'day');
    return format ? md.format(format) : md.toDate();
  }

  /**
   * Returns the end of a specified range of dates.
   *
   * @namespace date function
   * @example ENDOF(date[unit = "day"])
   * @param {date} date date object
   * @param {string} unit For example, you can pass in 'day', 'month', 'year' or `week`, etc.
   * @param {string} format date format, optional
   * @returns {any} new date object, if format is passed in, the formatted date string is returned
   */
  fnENDOF(date: Date, unit?: any, format?: string) {
    const md = moment(this.normalizeDate(date)).endOf(unit || 'day');
    return format ? md.format(format) : md.toDate();
  }

  normalizeDate(raw: any): Date {
    if (typeof raw === 'string' || typeof raw === 'number') {
      let formats = ['', 'YYYY-MM-DD HH:mm:ss', 'X'];

      if (/^\d{10}((\.\d+)*)$/.test(raw.toString())) {
        formats = ['X', 'x', 'YYYY-MM-DD HH:mm:ss', ''];
      } else if (/^\d{13}((\.\d+)*)$/.test(raw.toString())) {
        formats = ['x', 'X', 'YYYY-MM-DD HH:mm:ss', ''];
      }
      while (formats.length) {
        const format = formats.shift()!;
        const date = moment(raw, format);

        if (date.isValid()) {
          return date.toDate();
        }
      }
    }

    return raw;
  }

  normalizeDateRange(raw: string | Date[]): Date[] {
    return (Array.isArray(raw) ? raw : raw.split(',')).map((item: any) =>
      this.normalizeDate(String(item).trim())
    );
  }

  /**
   * Returns the year of a date.
   *
   * @namespace date function
   * @example YEAR(date)
   * @param {date} date date object
   * @returns {number} value
   */
  fnYEAR(date: Date) {
    date = this.normalizeDate(date);
    return date.getFullYear();
  }

  /**
   * Returns the month of the date, here is the natural month.
   *
   * @namespace date function
   * @example MONTH(date)
   * @param {date} date date object
   * @returns {number} value
   */
  fnMONTH(date: Date) {
    date = this.normalizeDate(date);
    return date.getMonth() + 1;
  }

  /**
   * Returns the day of a date.
   *
   * @namespace date function
   * @example DAY(date)
   * @param {date} date date object
   * @returns {number} value
   */
  fnDAY(date: Date) {
    date = this.normalizeDate(date);
    return date.getDate();
  }

  /**
   * Returns the hour of a date.
   *
   * @param {date} date date object
   * @namespace date function
   * @example HOUR(date)
   * @returns {number} value
   */
  fnHOUR(date: Date) {
    date = this.normalizeDate(date);
    return date.getHours();
  }

  /**
   * Returns the minute of a date.
   *
   * @param {date} date date object
   * @namespace date function
   * @example MINUTE(date)
   * @returns {number} value
   */
  fnMINUTE(date: Date) {
    date = this.normalizeDate(date);
    return date.getMinutes();
  }

  /**
   * Returns the seconds of a date.
   *
   * @param {date} date date object
   * @namespace date function
   * @example SECOND(date)
   * @returns {number} value
   */
  fnSECOND(date: Date) {
    date = this.normalizeDate(date);
    return date.getSeconds();
  }

  /**
   * Returns the number of years between two dates.
   *
   * @param {date} endDate date object
   * @param {date} startDate date object
   * @namespace date function
   * @example YEARS(endDate, startDate)
   * @returns {number} value
   */
  fnYEARS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'year');
  }

  /**
   * Returns the number of minutes between two dates.
   *
   * @param {date} endDate date object
   * @param {date} startDate date object
   * @namespace date function
   * @example MINUTES(endDate, startDate)
   * @returns {number} value
   */
  fnMINUTES(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'minutes');
  }

  /**
   * Returns the number of days between two dates.
   *
   * @param {date} endDate date object
   * @param {date} startDate date object
   * @namespace date function
   * @example DAYS(endDate, startDate)
   * @returns {number} value
   */
  fnDAYS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'days');
  }

  /**
   * Returns the number of hours between two dates.
   *
   * @param {date} endDate date object
   * @param {date} startDate date object
   * @namespace date function
   * @example HOURS(endDate, startDate)
   * @returns {number} value
   */
  fnHOURS(endDate: Date, startDate: Date) {
    endDate = this.normalizeDate(endDate);
    startDate = this.normalizeDate(startDate);
    return moment(endDate).diff(moment(startDate), 'hour');
  }

  /**
   * Modify the date by adding or subtracting days, months, years, etc.
   *
   * Example:
   *
   * DATEMODIFY(A, -2, 'month')，
   *
   * Subtract 2 months from date A.
   *
   * @param {date} date date object
   * @param {number} num value
   * @param {string} unit: supports year, month, day, etc.
   * @namespace date function
   * @example DATEMODIFY(date, 2, 'days')
   * @returns {date} date object
   */
  fnDATEMODIFY(date: Date, num: number, format: any) {
    date = this.normalizeDate(date);
    return moment(date).add(num, format).toDate();
  }

  /**
   * Convert a string date into a date object. You can specify the date format.
   *
   * Example: STRTODATE('2021/12/6', 'YYYY/MM/DD')
   *
   * @param {string} value date character
   * @param {string} format date format
   * @namespace date function
   * @example STRTODATE(value[, format=""])
   * @returns {date} date object
   */
  fnSTRTODATE(value: any, format: string = '') {
    return moment(value, format).toDate();
  }

  /**
   * Determine whether the first date is before the second date. If yes, return true; otherwise, return false.
   *
   * @param {date} a first date
   * @param {date} b second date
   * @param {string} unit unit, default is 'day', that is, compare to day
   * @namespace date function
   * @example ISBEFORE(a, b)
   * @returns {boolean} judgment result
   */
  fnISBEFORE(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isBefore(moment(b), unit);
  }

  /**
   * Determine whether the first date is after the second date. If so, return true; otherwise, return false.
   *
   * @param {date} a first date
   * @param {date} b second date
   * @param {string} unit unit, default is 'day', that is, compare to day
   * @namespace date function
   * @example ISAFTER(a, b)
   * @returns {boolean} judgment result
   */
  fnISAFTER(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isAfter(moment(b), unit);
  }

  /**
   * Check if the date is within the specified range, if yes, return true, otherwise return false.
   *
   * Example: BETWEENRANGE('2021/12/6', ['2021/12/5','2021/12/7']).
   *
   * @param {any} date first date
   * @param {any[]} daterange date range
   * @param {string} unit unit, default is 'day', that is, compare to day
   * @param {string} inclusivity Inclusivity rule, default is '[]'. [ means inclusion, ( means exclusion. If the inclusive parameter is used, two indicators must be passed in, such as '()' means both the left and right ranges are excluded.
   * @namespace date function
   * @example BETWEENRANGE(date, [start, end])
   * @returns {boolean} judgment result
   */
  fnBETWEENRANGE(
    date: Date,
    daterange: Date[],
    unit: any = 'day',
    inclusivity: '[]' | '()' | '(]' | '[)' = '[]'
  ) {
    const range = this.normalizeDateRange(daterange);
    return moment(this.normalizeDate(date)).isBetween(
      range[0],
      range[1],
      unit,
      inclusivity
    );
  }

  /**
   * Determines whether the first date is before or equal to the second date. If so, returns true; otherwise, returns false.
   *
   * @param {date} a first date
   * @param {date} b second date
   * @param {string} unit unit, default is 'day', that is, compare to day
   * @namespace date function
   * @example ISSAMEORBEFORE(a, b)
   * @returns {boolean} judgment result
   */
  fnISSAMEORBEFORE(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isSameOrBefore(moment(b), unit);
  }

  /**
   * Determines whether the first date is after or equal to the second date. If so, returns true; otherwise, returns false.
   *
   * @param {date} a first date
   * @param {date} b second date
   * @param {string} unit unit, default is 'day', that is, compare to day
   * @namespace date function
   * @example ISSAMEORAFTER(a, b)
   * @returns {boolean} judgment result
   */
  fnISSAMEORAFTER(a: Date, b: Date, unit: any = 'day') {
    a = this.normalizeDate(a);
    b = this.normalizeDate(b);
    return moment(a).isSameOrAfter(moment(b), unit);
  }

  /**
   * Returns the length of the array.
   *
   * @param {Array<any>} arr array
   * @namespace array
   * @example COUNT(arr)
   * @returns {number} result
   */
  fnCOUNT(value: any) {
    return Array.isArray(value) ? value.length : value ? 1 : 0;
  }

  /**
   * Arrays need to be used with arrow functions for data conversion. Note that arrow functions only support single expression usage.
   *
   * Convert each element in the array to the value returned by the arrow function.
   *
   * Example:
   *
   * ARRAYMAP([1, 2, 3], item => item + 1) gives [2, 3, 4].
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYMAP(arr, item => item)
   * @returns {Array<any>} returns the converted array
   */
  fnARRAYMAP(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(value) ? value : []).map((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * To filter data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Filter out members whose second arrow function returns false.
   *
   * Example:
   *
   * ARRAYFILTER([1, 2, 3], item => item > 1) yields [2, 3].
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFILTER(arr, item => item)
   * @returns {Array<any>} returns the filtered array
   */
  fnARRAYFILTER(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(value) ? value : []).filter((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Find the index of the member for which the second arrow function returns true.
   *
   * Example:
   *
   * ARRAYFINDINDEX([0, 2, false], item => item === 2) returns 1.
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFINDINDEX(arr, item => item === 2)
   * @returns {number} result
   */
  fnARRAYFINDINDEX(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(arr) ? arr : []).findIndex((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Find the member whose second arrow function returns true.
   *
   * Example:
   *
   * ARRAYFIND([0, 2, false], item => item === 2) gets 2.
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFIND(arr, item => item === 2)
   * @returns {any} result
   */
  fnARRAYFIND(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(arr) ? arr : []).find((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Determine whether the second arrow function has a member that returns true. If so, return true; otherwise, return false.
   *
   * Example:
   *
   * ARRAYSOME([0, 2, false], item => item === 2) returns true.
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYSOME(arr, item => item === 2)
   * @returns {boolean} result
   */
  fnARRAYSOME(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(arr) ? arr : []).some((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Determine whether the second arrow function returns true. If so, return true; otherwise, return false.
   *
   * Example:
   *
   * ARRAYEVERY([0, 2, false], item => item === 2) returns false
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYEVERY(arr, item => item === 2)
   * @returns {boolean} result
   */
  fnARRAYEVERY(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(arr) ? arr : []).every((item, index, arr) =>
      this.callAnonymousFunction(iterator, [item, index, arr])
    );
  }

  /**
   * Determine whether the specified element exists in the data.
   *
   * Example:
   *
   * ARRAYINCLUDES([0, 2, false], 2) returns true.
   *
   * @param {Array<any>} arr array
   * @param {any} item element
   * @namespace array
   * @example ARRAYINCLUDES(arr, 2)
   * @returns {any} result
   */
  fnARRAYINCLUDES(arr: any[], item: any) {
    return (Array.isArray(arr) ? arr : []).includes(item);
  }

  /**
   * The array filters out false, null, 0 and "".
   *
   * Example:
   *
   * COMPACT([0, 1, false, 2, '', 3]) yields [1, 2, 3].
   *
   * @param {Array<any>} arr array
   * @namespace array
   * @example COMPACT(arr)
   * @returns {Array<any>} result
   */
  fnCOMPACT(arr: any[]) {
    if (Array.isArray(arr)) {
      let resIndex = 0;
      const result = [];
      for (const item of arr) {
        if (item) {
          result[resIndex++] = item;
        }
      }
      return result;
    } else {
      return [];
    }
  }

  /**
   * Convert array to string.
   *
   * Example:
   *
   * JOIN(['a', 'b', 'c'], '=') results in 'a=b=c'.
   *
   * @param {Array<any>} arr array
   * @param {String} separator separator
   * @namespace array
   * @example JOIN(arr, string)
   * @returns {string} result
   */
  fnJOIN(arr: any[], separator = '') {
    if (Array.isArray(arr)) {
      return arr.join(separator);
    } else {
      return '';
    }
  }

  /**
   * Array merging.
   *
   * Example:
   *
   * CONCAT(['a', 'b', 'c'], ['1'], ['3']) gives ['a', 'b', 'c', '1', '3'].
   *
   * @param {Array<any>} arr array
   * @namespace array
   * @example CONCAT(['a', 'b', 'c'], ['1'], ['3'])
   * @returns {Array<any>} result
   */
  fnCONCAT(...arr: any[]) {
    if (arr?.[0] && !Array.isArray(arr[0])) {
      arr[0] = [arr[0]];
    }
    return arr.reduce((a, b) => a.concat(b), []).filter((item: any) => item);
  }

  /**
   * Array deduplication, the second parameter "field" can specify the field to be deduplicated.
   *
   * Example:
   *
   * UNIQ([{a: '1'}, {b: '2'}, {a: '1'}]) gets [{a: '1'}, {b: '2'}].
   *
   * @param {Array<any>} arr array
   * @param {string} field field
   * @namespace array
   * @example UNIQ([{a: '1'}, {b: '2'}, {a: '1'}])
   * @example UNIQ([{a: '1'}, {b: '2'}, {a: '1'}], 'x')
   * @returns {Array<any>} result
   */
  fnUNIQ(arr: any[], field?: string) {
    return field ? uniqBy(arr, field) : uniqWith(arr, isEqual);
  }

  /**
   * Convert a JS object to a JSON string.
   *
   * Example:
   *
   * ENCODEJSON({name: 'amis'}) returns '{"name":"amis"}'.
   *
   * @param {object} obj JS object
   * @namespace encoding
   * @example ENCODEJSON({name: 'amis'})
   * @returns {string} result
   */
  fnENCODEJSON(obj: object): string {
    return JSON.stringify(obj);
  }

  /**
   * Parse JSON encoded data and return a JS object.
   *
   * Example:
   *
   * DECODEJSON('{\"name\": "amis"}') gets {name: 'amis'}.
   *
   * @param {string} str string
   * @namespace encoding
   * @example DECODEJSON('{\"name\": "amis"}')
   * @returns {object} result
   */
  fnDECODEJSON(str: string): object {
    return JSON.parse(str);
  }

  /**
   * Get the value according to the path of the object or array. If the parsed value is undefined, it will be replaced by defaultValue.
   *
   * Example:
   *
   * GET([0, 2, {name: 'amis', age: 18}], 1) gets 2,
   * GET([0, 2, {name: 'amis', age: 18}], '2.name') gets 'amis',
   * GET({arr: [{name: 'amis', age: 18}]}, 'arr[0].name') 得到 'amis'，
   * GET({arr: [{name: 'amis', age: 18}]}, 'arr.0.name') 得到 'amis'，
   * GET({arr: [{name: 'amis', age: 18}]}, 'arr.1.name', 'not-found') 得到 'not-found'。
   *
   * @param {any} obj object or array
   * @param {string} path path
   * @param {any} defaultValue If the value cannot be parsed, the default value will be returned
   * @namespace other
   * @example GET(arr, 2)
   * @returns {any} result
   */
  fnGET(obj: any, path: string, defaultValue?: any) {
    return get(obj, path, defaultValue);
  }

  /**
   * Check whether the type is supported: string, number, array, date, plain-object.
   *
   * @param {string} judgment object
   * @namespace other
   * @example ISTYPE([{a: '1'}, {b: '2'}, {a: '1'}], 'array')
   * @returns {boolean} result
   */
  fnISTYPE(
    target: any,
    type: 'string' | 'number' | 'array' | 'date' | 'plain-object' | 'nil'
  ) {
    switch (type) {
      case 'string':
        return typeof target === 'string';

      case 'number':
        return typeof target === 'number';

      case 'array':
        return Array.isArray(target);

      case 'date':
        return !!(target && target instanceof Date);

      case 'plain-object':
        return isPlainObject(target);

      case 'nil':
        return !target;
    }
    return false;
  }
}

// Compatible
(Evaluator as any).setDefaultFilters = Evaluator.extendDefaultFilters;
(Evaluator as any).setDefaultFunctions = Evaluator.extendDefaultFunctions;

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift();
  }
  return undefined;
}

export function parseJson(str: string, defaultValue?: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

export function stripNumber(number: number) {
  if (typeof number === 'number' && !Number.isInteger(number)) {
    return parseFloat(number.toPrecision(16));
  } else {
    return number;
  }
}

// If there is only one member, and the first member is args
// Expand it and treat it as multiple parameters. After all, the formula does not support the ...args syntax.
export function normalizeArgs(args: Array<any>) {
  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return args;
}

export function createObject(
  superProps?: {[propName: string]: any},
  props?: {[propName: string]: any},
  properties?: any
): object {
  const obj = superProps
    ? Object.create(superProps, {
        ...properties,
        __super: {
          value: superProps,
          writable: false,
          enumerable: false
        }
      })
    : Object.create(Object.prototype, properties);

  props && Object.keys(props).forEach(key => (obj[key] = props[key]));

  return obj;
}

export function createStr() {
  return (
    '00000000000000000' + (Math.random() * 0xffffffffffffffff).toString(16)
  ).slice(-16);
}

export function uuidv4() {
  const a = createStr();
  const b = createStr();
  return (
    a.slice(0, 8) +
    '-' +
    a.slice(8, 12) +
    '-4' +
    a.slice(13) +
    '-a' +
    b.slice(1, 4) +
    '-' +
    b.slice(4)
  );
}
