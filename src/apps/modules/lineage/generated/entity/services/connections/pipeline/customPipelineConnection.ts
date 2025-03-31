
/**
 * Custom Pipeline Service connection to build a source that is not supported by
 * OpenMetadata yet.
 */
export interface CustomPipelineConnection {
    connectionOptions?: { [key: string]: string };
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?: FilterPattern;
    /**
     * Source Python Class Name to instantiated by the ingestion workflow
     */
    sourcePythonClass?: string;
    /**
     * Custom pipeline service type
     */
    type: ServiceType;
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
 * Custom pipeline service type
 */
export enum ServiceType {
    CustomPipeline = "CustomPipeline",
}
