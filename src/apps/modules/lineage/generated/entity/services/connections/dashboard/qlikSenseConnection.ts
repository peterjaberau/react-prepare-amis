
/**
 * Qlik Sense Connection Config
 */
export interface QlikSenseConnection {
    certificates: QlikCertificatesBy;
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
     * Qlik Sense Base URL, used for genrating dashboard & chat url
     */
    displayUrl?: string;
    /**
     * URL for the Qlik instance.
     */
    hostPort: string;
    /**
     * Regex to exclude or include projects that matches the pattern.
     */
    projectFilterPattern?:       FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: QlikSenseType;
    /**
     * User Directory.
     */
    userDirectory?: string;
    /**
     * User ID.
     */
    userId?: string;
    /**
     * Validate Host Name
     */
    validateHostName?: boolean;
}

/**
 * Qlik Authentication Certificate By Values
 *
 * Qlik Authentication Certificate File Path
 */
export interface QlikCertificatesBy {
    sslConfig?: Config;
    /**
     * Client Certificate
     */
    clientCertificate?: string;
    /**
     * Client Key Certificate.
     */
    clientKeyCertificate?: string;
    /**
     * Root Certificate.
     */
    rootCertificate?: string;
    [property: string]: any;
}

/**
 * Client SSL configuration
 *
 * OpenMetadata Client configured to validate SSL certificates.
 */
export interface Config {
    /**
     * The CA certificate used for SSL validation.
     */
    caCertificate?: string;
    /**
     * The SSL certificate used for client authentication.
     */
    sslCertificate?: string;
    /**
     * The private key associated with the SSL certificate.
     */
    sslKey?: string;
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
 * Qlik sense service type
 */
export enum QlikSenseType {
    QlikSense = "QlikSense",
}
