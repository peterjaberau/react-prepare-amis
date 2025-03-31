
/**
 * Data Quality report and aggregation model.
 */
export interface DataQualityReport {
    /**
     * Data for the data quality report.
     */
    data: { [key: string]: string }[];
    /**
     * Metadata for the data quality report.
     */
    metadata: DataQualityReportMetadata;
}

/**
 * Metadata for the data quality report.
 *
 * Schema to capture data quality reports and aggregation data.
 */
export interface DataQualityReportMetadata {
    /**
     * Dimensions to capture the data quality report.
     */
    dimensions?: string[];
    /**
     * Keys to identify the data quality report.
     */
    keys?: string[];
    /**
     * Metrics to capture the data quality report.
     */
    metrics?: string[];
    [property: string]: any;
}
