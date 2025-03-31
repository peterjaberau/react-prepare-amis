
/**
 * Qlik Cloud Connection Config
 */
export interface QlikCloudConnection {
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
     * Host and Port of the Qlik Cloud instance.
     */
    hostPort: string;
    /**
     * Regex to exclude or include projects that matches the pattern.
     */
    projectFilterPattern?:       FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * token to connect to Qlik Cloud.
     */
    token: string;
    /**
     * Service Type
     */
    type?: QlikCloudType;
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
 * Qlik Cloud service type
 */
export enum QlikCloudType {
    QlikCloud = "QlikCloud",
}
