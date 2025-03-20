import { ScopedVars } from '@data/index';
import { VariableCustomFormatterFn } from '@scenes/index';

export interface MacroHandler {
  (
    match: string,
    fieldPath: string | undefined,
    scopedVars: ScopedVars | undefined,
    format: string | VariableCustomFormatterFn | undefined
  ): string;
}
