
/**
 * Data Insight Custom Chart Result List
 */
export interface DataInsightCustomChartResultList {
    kpiDetails?: KpiDetails;
    /**
     * List of Results
     */
    results?: DataInsightCustomChartResult[];
}

/**
 * KPI details for the data insight chart.
 */
export interface KpiDetails {
    /**
     * End Date of KPI
     */
    endDate?: string;
    /**
     * Start Date of KPI
     */
    startDate?: string;
    /**
     * Target value of KPI
     */
    target?: number;
    [property: string]: any;
}

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
