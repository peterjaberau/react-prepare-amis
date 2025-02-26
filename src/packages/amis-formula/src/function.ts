import {Evaluator} from './evalutor';
import {FunctionDocMap, FunctionDocItem} from './types';

export function registerFunction(
  name: string,
  fn: (this: Evaluator, ...args: Array<any>) => any
): void {
  Evaluator.extendDefaultFunctions({
    [`fn${name}`]: fn
  });
}

export const functionDocs: FunctionDocMap = {};

export function registerFunctionDoc(groupName: string, item: FunctionDocItem) {
  if (functionDocs[groupName]) {
    functionDocs[groupName].push(item);
  } else {
    functionDocs[groupName] = [item];
  }
}

export function bulkRegisterFunctionDoc(
  fnDocs: {
    name: string;
    description: string;
    example: string;
    params: {
      type: string;
      name: string;
      description: string | null;
    }[];
    returns: {
      type: string;
      description: string | null;
    };
    namespace: string;
  }[]
) {
  fnDocs.forEach(item => registerFunctionDoc(item.namespace || 'Others', item));
}

/**
 * Register the formula and the formula description at the same time
 * @param name
 * @param fn
 * @param fnInfo
 */
export function registerFormula(
  name: string,
  fn: (this: Evaluator, ...args: Array<any>) => any,
  fnInfo?: FunctionDocItem
) {
  registerFunction(name, fn);
  fnInfo && registerFunctionDoc(fnInfo.namespace || 'Others', fnInfo);
}
