
/**
 * DBTCloud Connection Config
 */
export interface DbtCloudConnection {
    /**
     * ID of your DBT cloud account
     */
    accountId: string;
    /**
     * DBT cloud Metadata API URL.
     */
    discoveryAPI: string;
    /**
     * DBT cloud Access URL.
     */
    host: string;
    /**
     * List of IDs of your DBT cloud jobs seperated by comma `,`
     */
    jobIds?: string[];
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?: FilterPattern;
    /**
     * List of IDs of your DBT cloud projects seperated by comma `,`
     */
    projectIds?: string[];
    /**
     * Generated Token to connect to DBTCloud.
     */
    token: string;
    /**
     * Service Type
     */
    type?: DBTCloudType;
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
export enum DBTCloudType {
    DBTCloud = "DBTCloud",
}
