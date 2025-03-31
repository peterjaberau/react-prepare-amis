
/**
 * Fivetran Metadata Database Connection Config
 */
export interface FivetranConnection {
    /**
     * Fivetran API Secret.
     */
    apiKey: string;
    /**
     * Fivetran API Secret.
     */
    apiSecret: string;
    /**
     * Pipeline Service Management/UI URI.
     */
    hostPort?: string;
    /**
     * Fivetran API Limit For Pagination.
     */
    limit?: number;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: FivetranType;
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
export enum FivetranType {
    Fivetran = "Fivetran",
}
