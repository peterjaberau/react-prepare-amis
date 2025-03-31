
/**
 * Mode Connection Config
 */
export interface ModeConnection {
    /**
     * Access Token for Mode Dashboard
     */
    accessToken: string;
    /**
     * Access Token Password for Mode Dashboard
     */
    accessTokenPassword: string;
    /**
     * Regex exclude or include charts that matches the pattern.
     */
    chartFilterPattern?: FilterPattern;
    /**
     * Regex to exclude or include dashboards that matches the pattern.
     */
    dashboardFilterPattern?: FilterPattern;
    /**
     * Regex exclude or include data models that matches the pattern.
     */
    dataModelFilterPattern?: FilterPattern;
    /**
     * Filter query parameter for some of the Mode API calls
     */
    filterQueryParam?: string;
    /**
     * URL for the mode instance.
     */
    hostPort?: string;
    /**
     * Regex to exclude or include projects that matches the pattern.
     */
    projectFilterPattern?:       FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: ModeType;
    /**
     * Mode Workspace Name
     */
    workspaceName: string;
}

/**
 * Regex exclude or include charts that matches the pattern.
 *
 * Regex to only fetch entities that matches the pattern.
 *
 * Regex to exclude or include dashboards that matches the pattern.
 *
 * Regex exclude or include data models that matches the pattern.
 *
 * Regex to exclude or include projects that matches the pattern.
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
 * Mode service type
 */
export enum ModeType {
    Mode = "Mode",
}
