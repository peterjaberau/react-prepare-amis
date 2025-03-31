
/**
 * Data Insight Pipeline Configuration.
 */
export interface DataInsightPipeline {
    /**
     * Pipeline type
     */
    type: DataInsightConfigType;
}

/**
 * Pipeline type
 *
 * Pipeline Source Config Metadata Pipeline type
 */
export enum DataInsightConfigType {
    DataInsight = "dataInsight",
}
