
/**
 * Metabase Connection Config
 */
export interface MetabaseConnection {
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
     * Host and Port of the Metabase instance.
     */
    hostPort: string;
    /**
     * Password to connect to Metabase.
     */
    password?: string;
    /**
     * Regex to exclude or include projects that matches the pattern.
     */
    projectFilterPattern?:       FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: MetabaseType;
    /**
     * Username to connect to Metabase. This user should have privileges to read all the
     * metadata in Metabase.
     */
    username: string;
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
 * Metabase service type
 */
export enum MetabaseType {
    Metabase = "Metabase",
}
