
/**
 * ElasticSearch Connection.
 */
export interface ElasticSearchConnection {
    /**
     * Choose Auth Config Type.
     */
    authType?:            AuthConfigurationType;
    connectionArguments?: { [key: string]: any };
    /**
     * Connection Timeout in Seconds
     */
    connectionTimeoutSecs?: number;
    /**
     * Host and port of the ElasticSearch service.
     */
    hostPort?: string;
    /**
     * Regex to only fetch search indexes that matches the pattern.
     */
    searchIndexFilterPattern?:   FilterPattern;
    sslConfig?:                  SSLConfig;
    supportsMetadataExtraction?: boolean;
    /**
     * ElasticSearch Type
     */
    type?: ElasticSearchType;
}

/**
 * Choose Auth Config Type.
 *
 * Basic Auth Configuration for ElasticSearch
 *
 * API Key Authentication for ElasticSearch
 */
export interface AuthConfigurationType {
    /**
     * Elastic Search Password for Login
     */
    password?: string;
    /**
     * Elastic Search Username for Login
     */
    username?: string;
    /**
     * Elastic Search API Key for API Authentication
     */
    apiKey?: string;
    /**
     * Elastic Search API Key ID for API Authentication
     */
    apiKeyId?: string;
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
 * SSL Config
 */
export interface SSLConfig {
    /**
     * SSL Certificates
     */
    certificates?: SSLCertificates;
    [property: string]: any;
}

/**
 * SSL Certificates
 *
 * SSL Certificates By Path
 *
 * SSL Certificates By Values
 */
export interface SSLCertificates {
    /**
     * CA Certificate Path
     */
    caCertPath?: string;
    /**
     * Client Certificate Path
     */
    clientCertPath?: string;
    /**
     * Private Key Path
     */
    privateKeyPath?: string;
    /**
     * CA Certificate Value
     */
    caCertValue?: string;
    /**
     * Client Certificate Value
     */
    clientCertValue?: string;
    /**
     * Private Key Value
     */
    privateKeyValue?: string;
    /**
     * Staging Directory Path
     */
    stagingDir?: string;
}

/**
 * ElasticSearch Type
 *
 * ElasticSearch service type
 */
export enum ElasticSearchType {
    ElasticSearch = "ElasticSearch",
}
