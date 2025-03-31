
/**
 * Stitch Connection
 */
export interface StitchConnection {
    /**
     * Host and port of the Stitch API host
     */
    hostPort: string;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Token to connect to Stitch api doc
     */
    token: string;
    /**
     * Service Type
     */
    type?: StitchType;
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
export enum StitchType {
    Stitch = "Stitch",
}
