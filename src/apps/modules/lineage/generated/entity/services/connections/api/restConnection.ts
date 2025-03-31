
/**
 * REST Connection Config
 */
export interface RESTConnection {
    /**
     * Regex to only fetch api collections with names matching the pattern.
     */
    apiCollectionFilterPattern?: FilterPattern;
    /**
     * Open API Schema URL.
     */
    openAPISchemaURL: string;
    /**
     * Supports Metadata Extraction.
     */
    supportsMetadataExtraction?: boolean;
    /**
     * Generated Token to connect to OpenAPI Schema.
     */
    token?: string;
    /**
     * REST API Type
     */
    type?: RESTType;
}

/**
 * Regex to only fetch api collections with names matching the pattern.
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
 * REST API Type
 *
 * REST API type
 */
export enum RESTType {
    REST = "Rest",
}
