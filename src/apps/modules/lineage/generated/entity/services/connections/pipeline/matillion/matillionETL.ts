
/**
 * Matillion ETL Auth Config.
 */
export interface MatillionETL {
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
