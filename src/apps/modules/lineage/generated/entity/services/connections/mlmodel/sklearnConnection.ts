
/**
 * Sklearn Connection Config
 */
export interface SklearnConnection {
    /**
     * Regex to only fetch MlModels with names matching the pattern.
     */
    mlModelFilterPattern?:       FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: SklearnType;
}

/**
 * Regex to only fetch MlModels with names matching the pattern.
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
export enum SklearnType {
    Sklearn = "Sklearn",
}
