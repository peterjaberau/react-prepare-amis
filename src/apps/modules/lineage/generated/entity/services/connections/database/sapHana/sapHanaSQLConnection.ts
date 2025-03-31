
/**
 * Sap Hana Database SQL Connection Config
 */
export interface SapHanaSQLConnection {
    /**
     * Database of the data source.
     */
    database?: string;
    /**
     * Database Schema of the data source. This is an optional parameter, if you would like to
     * restrict the metadata reading to a single schema. When left blank, OpenMetadata Ingestion
     * attempts to scan all the schemas.
     */
    databaseSchema?: string;
    /**
     * Host and port of the Hana service.
     */
    hostPort: string;
    /**
     * Password to connect to Hana.
     */
    password: string;
    /**
     * Username to connect to Hana. This user should have privileges to read all the metadata.
     */
    username: string;
}
