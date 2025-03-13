import { SelectableValue } from '@data/index';
import { fuzzyFind } from '../filter';

export function getAdhocOptionSearcher(options: SelectableValue[]) {
  const haystack = options.map((o) => o.label ?? String(o.value));

  return (search: string) => fuzzyFind<SelectableValue>(options, haystack, search);
}
