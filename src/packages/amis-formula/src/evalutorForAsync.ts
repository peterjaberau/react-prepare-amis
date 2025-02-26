/**
 * @file formula built-in function
 */
import {FilterContext} from './types';
import {createObject, Evaluator, stripNumber} from './evalutor';
import {FormulaEvalError} from './error';

export async function runSequence<T, U>(
  arr: Array<T>,
  fn: (item: T, index: number) => Promise<U>
) {
  const result: Array<U> = [];

  await arr.reduce(async (promise, item: T, index: number) => {
    await promise;
    result.push(await fn(item, index));
  }, Promise.resolve());

  return result;
}

export class AsyncEvaluator extends (Evaluator as any) {
  constructor(data: any, options?: any) {
    super(data, options);
  }

  async document(ast: {type: 'document'; body: Array<any>}) {
    if (!ast.body.length) {
      return undefined;
    }
    const isString = ast.body.length > 1;
    const content = await runSequence(ast.body, async item => {
      let result = this.evalute(item);

      if (isString && result == null) {
        // Do not use text such as undefined or null
        return '';
      }

      return result;
    });

    return content.length === 1 ? content[0] : content.join('');
  }

  async filter(ast: {
    type: 'filter';
    input: any;
    filters: Array<{name: string; args: Array<any>}>;
  }) {
    let input = await this.evalute(ast.input);
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

      const argsRes = await runSequence(filter.args, async item => {
        if (item?.type === 'mixed') {
          const res = await runSequence(item.body, item =>
            typeof item === 'string' ? item : this.evalute(item)
          );

          return res.join('');
        } else if (item.type) {
          return this.evalute(item);
        }
        return item;
      });

      input = fn.apply(context, [input].concat(argsRes));
    }

    return input;
  }

  async template(ast: {type: 'template'; body: Array<any>}) {
    const args = await runSequence(ast.body, arg => this.evaluate(arg));
    return args.join('');
  }

  // Get the subscript
  async getter(ast: {host: any; key: any}) {
    const host = await this.evalute(ast.host);
    let key = await this.evalute(ast.key);
    if (typeof key === 'undefined' && ast.key?.type === 'variable') {
      key = ast.key.name;
    }
    return host?.[key];
  }

  // Bit operations such as +2 ~3!
  async unary(ast: {op: '+' | '-' | '~' | '!'; value: any}) {
    let value = await this.evalute(ast.value);

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

  async power(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return Math.pow(this.formatNumber(left), this.formatNumber(right));
  }

  async multiply(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) * this.formatNumber(right));
  }

  async divide(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) / this.formatNumber(right));
  }

  async remainder(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return this.formatNumber(left) % this.formatNumber(right);
  }

  async add(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    // If one of them is not a number, it will be concatenated into a string
    if (isNaN(left) || isNaN(right)) {
      return left + right;
    }
    return stripNumber(this.formatNumber(left) + this.formatNumber(right));
  }

  async minus(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);
    return stripNumber(this.formatNumber(left) - this.formatNumber(right));
  }

  async shift(ast: {op: '<<' | '>>' | '>>>'; left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.formatNumber(this.evalute(ast.right), true);

    if (ast.op === '<<') {
      return left << right;
    } else if (ast.op == '>>') {
      return left >> right;
    } else {
      return left >>> right;
    }
  }

  async lt(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left < right;
  }

  async gt(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.
    return left > right;
  }

  async le(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left <= right;
  }

  async ge(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left >= right;
  }

  async eq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left == right;
  }

  async ne(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left != right;
  }

  async streq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left === right;
  }

  async strneq(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    // todo If it is a date comparison, this place can be optimized.

    return left !== right;
  }

  async binary(ast: {op: '&' | '^' | '|'; left: any; right: any}) {
    const left = await this.evalute(ast.left);
    const right = await this.evalute(ast.right);

    if (ast.op === '&') {
      return left & right;
    } else if (ast.op === '^') {
      return left ^ right;
    } else {
      return left | right;
    }
  }

  async and(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    return left && this.evalute(ast.right);
  }

  async or(ast: {left: any; right: any}) {
    const left = await this.evalute(ast.left);
    return left || this.evalute(ast.right);
  }

  array(ast: {type: 'array'; members: Array<any>}) {
    return runSequence(ast.members, member => this.evalute(member));
  }

  async object(ast: {members: Array<{key: string; value: any}>}) {
    let object: any = {};
    await ast.members.reduce(
      async (promise: any, {key, value}: any, index: number) => {
        await promise;
        const objKey = await this.evalute(key);
        const objVal = await this.evalute(value);
        object[objKey] = objVal;
      },
      Promise.resolve()
    );

    return object;
  }

  async conditional(ast: {
    type: 'conditional';
    test: any;
    consequent: any;
    alternate: any;
  }) {
    return (await this.evalute(ast.test))
      ? await this.evalute(ast.consequent)
      : await this.evalute(ast.alternate);
  }

  async funcCall(this: any, ast: {identifier: string; args: Array<any>}) {
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
      args = await runSequence(args, a => this.evalute(a));
    }

    return fn.apply(this, args);
  }

  async callAnonymousFunction(
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
    const result = await this.evalute(ast.return);
    this.contextStack.pop();
    return result;
  }

  /**
   * Example: IF(A, B, C)
   *
   * If condition A is met, return B, otherwise return C. Multi-layer nested IF functions are supported.
   *
   * You can also use expressions such as: A ? B : C
   *
   * @example IF(condition, consequent, alternate)
   * @param {expression} condition - conditional expression.
   * @param {any} consequent The result returned if the condition is passed
   * @param {any} alternate The result returned if the condition fails
   * @namespace logical function
   *
   * @returns {any} returns different results according to the conditions
   */
  async fnIF(
    condition: () => any,
    trueValue: () => any,
    falseValue: () => any
  ) {
    return (await condition()) ? await trueValue() : await falseValue();
  }

  /**
   * If all conditions are met, return true, otherwise return false
   *
   * Example: AND(Chinese score>80, Mathematics score>80)
   *
   * If both the Chinese and math scores are greater than 80, return true, otherwise return false
   *
   * You can also use an expression directly, such as: Chinese score>80 && Math score>80
   *
   * @example AND(expression1, expression2, ...expressionN)
   * @param {...expression} conditions - conditional expression.
   * @namespace logical function
   *
   * @returns {boolean}
   */
  async fnAND(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return condtions.reduce(async (promise, c) => {
      const result = await promise;
      if (result) {
        return c();
      }
      return result;
    }, Promise.resolve(true));
  }

  /**
   * If any of the conditions are met, return true, otherwise return false
   *
   * Example: OR(Chinese score>80, Mathematics score>80)
   *
   * If either the Chinese score or the math score is greater than 80, then return true, otherwise return false
   *
   * You can also use expressions directly, such as: Chinese score>80 || Math score>80
   *
   * @example OR(expression1, expression2, ...expressionN)
   * @param {...expression} conditions - conditional expression.
   * @namespace logical function
   *
   * @returns {boolean}
   */
  async fnOR(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return condtions.reduce(async (promise, c) => {
      const result = await promise;
      if (result) {
        return true;
      }
      return c();
    }, Promise.resolve(false));
  }

  /**
   * XOR processing, multiple expression groups are considered true when there are an odd number of true ones.
   *
   * @example XOR(condition1, condition2)
   * @param {expression} condition1 - condition expression 1
   * @param {expression} condition2 - condition expression 2
   * @namespace logical function
   *
   * @returns {boolean}
   */
  async fnXOR(...condtions: Array<() => any>) {
    if (!condtions.length) {
      return false;
    }

    return !!(
      (await runSequence(condtions, c => c())).filter(item => item).length % 2
    );
  }

  /**
   * A set of judgment functions, equivalent to combining multiple else if statements into one.
   *
   * Example: IFS(Chinese score > 80, "Excellent", Chinese score > 60, "Good", "Keep working hard")
   *
   * If the Chinese score is greater than 80, return "Excellent", otherwise if it is greater than 60, return "Good", otherwise return "Keep working hard".
   *
   * @example IFS(condition1, result1, condition2, result2,...conditionN, resultN)
   * @param {...any} args - condition, return value set
   * @namespace logical function
   * @returns {any} The first result that meets the condition. If there is no match, false is returned.
   */
  async fnIFS(...args: Array<() => any>) {
    if (args.length % 2) {
      args.splice(args.length - 1, 0, () => true);
    }

    while (args.length) {
      const c = args.shift()!;
      const v = args.shift()!;

      if (await c()) {
        return await v();
      }
    }
    return;
  }

  /**
   * Arrays need to be used with arrow functions for data conversion. Note that arrow functions only support single expression usage.
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYMAP(arr, item => item)
   * @returns {boolean} result
   */
  fnARRAYMAP(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return (Array.isArray(value) ? value : []).reduce(
      async (promise, item, index) => {
        const arr = await promise;
        arr.push(await this.callAnonymousFunction(iterator, [item, index]));
        return arr;
      },
      Promise.resolve([])
    );
  }

  /**
   * To filter data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Filter out members whose second arrow function returns false.
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFILTER(arr, item => item)
   * @returns {boolean} result
   */
  async fnARRAYFILTER(value: any, iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    return await (Array.isArray(value) ? value : []).reduce(
      async (promise, item, index) => {
        let arr = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);

        if (hit) {
          arr.push(item);
        }

        return arr;
      },
      Promise.resolve([])
    );
  }

  /**
   * To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Find the index of the member for which the second arrow function returns true.
   *
   * Example:
   *
   * ARRAYFINDINDEX([0, 2, false], item => item === 2) returns 1
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFINDINDEX(arr, item => item === 2)
   * @returns {number} result
   */
  async fnARRAYFINDINDEX(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let hitIndex = -1;
    const items = Array.isArray(arr) ? arr : [];

    for (const [index, item] of items.entries()) {
      const hit = await this.callAnonymousFunction(iterator, [item, index]);
      if (hit) {
        hitIndex = index;
        break;
      }
    }

    return hitIndex;
  }

  /**
   * To search for data, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Find the member whose second arrow function returns true.
   *
   * Example:
   *
   * ARRAYFIND([0, 2, false], item => item === 2) gets 2
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYFIND(arr, item => item === 2)
   * @returns {any} result
   */
  async fnARRAYFIND(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let hitItem = undefined;
    const items = Array.isArray(arr) ? arr : [];

    for (const [index, item] of items.entries()) {
      const hit = await this.callAnonymousFunction(iterator, [item, index]);
      if (hit) {
        hitItem = item;
        break;
      }
    }

    return hitItem;
  }

  /**
   * To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Check if the second arrow function has a member that returns true.
   *
   * Example:
   *
   * ARRAYSOME([0, 2, false], item => item === 2) returns true
   *
   * @param {Array<any>} arr array
   * @param {Function<any>} iterator arrow function
   * @namespace array
   * @example ARRAYSOME(arr, item => item === 2)
   * @returns {boolean} result
   */
  async fnARRAYSOME(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let result = await (Array.isArray(arr) ? arr : []).reduce(
      async (promise: any, item: any, index: number) => {
        const prev = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);
        return prev || hit;
      },
      Promise.resolve(false)
    );

    return result;
  }

  /**
   * To perform data traversal judgment, you need to use it with arrow functions. Note that arrow functions only support single expression usage.
   * Determine whether the second arrow function returns true.
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
  async fnARRAYEVERY(arr: any[], iterator: any) {
    if (!iterator || iterator.type !== 'anonymous_function') {
      throw new Error('expected an anonymous function get ' + iterator);
    }

    let result = await (Array.isArray(arr) ? arr : []).reduce(
      async (promise: any, item: any, index: number) => {
        const prev = await promise;
        const hit = await this.callAnonymousFunction(iterator, [item, index]);

        return prev && hit;
      },
      Promise.resolve(true)
    );

    return result;
  }
}
