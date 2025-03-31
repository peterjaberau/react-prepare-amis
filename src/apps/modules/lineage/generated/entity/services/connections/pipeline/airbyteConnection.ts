
/**
 * Airbyte Metadata Database Connection Config
 */
export interface AirbyteConnection {
    /**
     * Airbyte API version.
     */
    apiVersion?: string;
    /**
     * Pipeline Service Management/UI URL.
     */
    hostPort: string;
    /**
     * Password to connect to Airbyte.
     */
    password?: string;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: AirbyteType;
    /**
     * Username to connect to Airbyte.
     */
    username?: string;
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
export enum AirbyteType {
    Airbyte = "Airbyte",
}
