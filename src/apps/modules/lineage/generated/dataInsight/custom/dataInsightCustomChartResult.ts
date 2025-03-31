
/**
 * Data Insight Custom Chart Result
 */
export interface DataInsightCustomChartResult {
    /**
     * Count of Result
     */
    count?: number;
    /**
     * Date of Result
     */
    day?: number;
    /**
     * Group of Result
     */
    group?: string;
    /**
     * Metric Name
     */
    metric?: string;
    /**
     * Term of Result, used in case of horizontal axis not timestamp
     */
    term?: string;
}
