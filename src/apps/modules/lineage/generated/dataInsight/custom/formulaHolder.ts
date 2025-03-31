
/**
 * formulaHolder
 */
export interface FormulaHolder {
    /**
     * Group of Result
     */
    field?: string;
    /**
     * Formula
     */
    formula?:  string;
    function?: Function;
    /**
     * Group of Result
     */
    query?: string;
}

/**
 * aggregation function for chart
 */
export enum Function {
    Avg = "avg",
    Count = "count",
    Max = "max",
    Min = "min",
    Sum = "sum",
    Unique = "unique",
}
