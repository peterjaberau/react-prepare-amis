
/**
 * Dagster Metadata Database Connection Config
 */
export interface DagsterConnection {
    /**
     * URL to the Dagster instance
     */
    host: string;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Connection Time Limit Between OM and Dagster Graphql API in second
     */
    timeout?: number;
    /**
     * To Connect to Dagster Cloud
     */
    token?: string;
    /**
     * Service Type
     */
    type?: DagsterType;
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
export enum DagsterType {
    Dagster = "Dagster",
}
