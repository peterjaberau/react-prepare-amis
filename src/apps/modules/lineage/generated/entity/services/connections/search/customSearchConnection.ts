
/**
 * Custom Search Service connection to build a source that is not supported by OpenMetadata
 * yet.
 */
export interface CustomSearchConnection {
    connectionOptions?: { [key: string]: string };
    /**
     * Regex to only fetch search indexes that matches the pattern.
     */
    searchIndexFilterPattern?: FilterPattern;
    /**
     * Source Python Class Name to instantiated by the ingestion workflow
     */
    sourcePythonClass?: string;
    /**
     * Custom search service type
     */
    type: ServiceType;
}

/**
 * Regex to only fetch search indexes that matches the pattern.
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
 * Custom search service type
 */
export enum ServiceType {
    CustomSearch = "CustomSearch",
}
