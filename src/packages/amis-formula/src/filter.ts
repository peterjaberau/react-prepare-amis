import {Evaluator} from './evalutor';
import {FilterMap} from './types';

const entityMap: any = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
const escapeHtml = (str: string) =>
  String(str).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

/**
 * filter is a historical feature and is not recommended. Because this is the previous syntax, it is compatible in formula parsing.
 * It is recommended to use the function call syntax ${ LEFT(xxx) }.
 */
export const filters: FilterMap = {
  raw: input => input,
  html: (input: string) => {
    if (input == null) {
      return input;
    }
    return escapeHtml(input);
  }
};

export function registerFilter(
  name: string,
  fn: (input: any, ...args: any[]) => any
): void {
  filters[name] = fn;
  Evaluator.extendDefaultFilters(filters);
}

export function extendsFilters(value: FilterMap) {
  Object.assign(filters, value);
  Evaluator.extendDefaultFilters(filters);
}

export function getFilters() {
  return filters;
}
