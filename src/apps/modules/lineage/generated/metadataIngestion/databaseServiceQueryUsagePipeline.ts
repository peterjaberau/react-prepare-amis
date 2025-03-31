
/**
 * DatabaseService Query Usage Pipeline Configuration.
 */
export interface DatabaseServiceQueryUsagePipeline {
    /**
     * Configuration the condition to filter the query history.
     */
    filterCondition?: string;
    /**
     * Configuration to process query cost
     */
    processQueryCostAnalysis?: boolean;
    /**
     * Configuration to tune how far we want to look back in query logs to process usage data.
     */
    queryLogDuration?: number;
    /**
     * Configuration to set the file path for query logs
     */
    queryLogFilePath?: string;
    /**
     * Configuration to set the limit for query logs
     */
    resultLimit?: number;
    /**
     * Temporary file name to store the query logs before processing. Absolute file path
     * required.
     */
    stageFileLocation?: string;
    /**
     * Pipeline type
     */
    type?: DatabaseUsageConfigType;
}

/**
 * Pipeline type
 *
 * Database Source Config Usage Pipeline type
 */
export enum DatabaseUsageConfigType {
    DatabaseUsage = "DatabaseUsage",
}
