
/**
 * Databricks Connection Config
 */
export interface DatabricksPipelineConnection {
    connectionArguments?: { [key: string]: any };
    /**
     * Host and port of the Databricks service.
     */
    hostPort: string;
    /**
     * Databricks compute resources URL.
     */
    httpPath?: string;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Generated Token to connect to Databricks.
     */
    token: string;
    /**
     * Service Type
     */
    type?: DatabricksType;
}

/**
 * Regex exclude pipelines.
 *
 * Regex to only fetch entities that matches the pattern.
 */
export interface FilterPattern {
    /**
     * List of strings/regex patterns to match and exclude only database entities that match.
     */
    excludes?: string[];
    /**
     * List of strings/regex patterns to match and include only database entities that match.
     */
    includes?: string[];
}

/**
 * Service Type
 *
 * Service type.
 */
export enum DatabricksType {
    DatabricksPipeline = "DatabricksPipeline",
}
