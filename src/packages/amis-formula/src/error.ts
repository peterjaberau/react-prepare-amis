/**
 * Expression parsing error
 */
export class FormulaEvalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormulaEvalError';
  }
}
