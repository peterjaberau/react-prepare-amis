import { TextBoxVariableModel } from '@data/index';

import { OptionsVariableBuilder } from './optionsVariableBuilder';

export class TextBoxVariableBuilder<T extends TextBoxVariableModel> extends OptionsVariableBuilder<T> {
  withOriginalQuery(original: string) {
    this.variable.originalQuery = original;
    return this;
  }
}
