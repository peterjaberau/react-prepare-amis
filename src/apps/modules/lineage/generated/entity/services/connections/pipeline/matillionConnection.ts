
/**
 * Matillion Connection
 */
export interface MatillionConnection {
    /**
     * Matillion Auth Configuration
     */
    connection?: Matillion;
    /**
     * Regex exclude pipelines.
     */
    pipelineFilterPattern?:      FilterPattern;
    supportsMetadataExtraction?: boolean;
    /**
     * Service Type
     */
    type?: MatillionType;
}

/**
 * Matillion Auth Configuration
 *
 * Matillion ETL Auth Config.
 */
export interface Matillion {
    /**
     * Matillion Host
     */
    hostPort: string;
    /**
     * Password to connect to the Matillion.
     */
    password:   string;
    sslConfig?: Config;
    type?:      Type;
    /**
     * Username to connect to the Matillion. This user should have privileges to read all the
     * metadata in Matillion.
     */
    username: string;
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

export enum Type {
    MatillionETL = "MatillionETL",
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
export enum MatillionType {
    Matillion = "Matillion",
}
