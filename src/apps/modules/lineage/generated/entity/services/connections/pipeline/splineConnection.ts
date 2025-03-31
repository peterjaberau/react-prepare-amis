
/**
 * Spline Metadata Database Connection Config
 */
export interface SplineConnection {
    /**
     * Spline REST Server Host & Port.
     */
    hostPort: string;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: SplineType;
    /**
     * Spline UI Host & Port.
     */
    uiHostPort?: string;
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
export enum SplineType {
    Spline = "Spline",
}
