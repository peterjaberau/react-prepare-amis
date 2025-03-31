
/**
 * Redshift  Connection Config
 */
export interface RedshiftConnection {
    connectionArguments?: { [key: string]: any };
    connectionOptions?:   { [key: string]: string };
    /**
     * Initial Redshift database to connect to. If you want to ingest all databases, set
     * ingestAllDatabases to true.
     */
    database: string;
    /**
     * Regex to only include/exclude databases that matches the pattern.
     */
    databaseFilterPattern?: DefaultDatabaseFilterPattern;
    /**
     * Host and port of the Redshift service.
     */
    hostPort: string;
    /**
     * Ingest data from all databases in Redshift. You can use databaseFilterPattern on top of
     * this.
     */
    ingestAllDatabases?: boolean;
    /**
     * Password to connect to Redshift.
     */
    password?:                string;
    sampleDataStorageConfig?: SampleDataStorageConfig;
    /**
     * Regex to only include/exclude schemas that matches the pattern.
     */
    schemaFilterPattern?: DefaultSchemaFilterPattern;
    /**
     * SQLAlchemy driver scheme options.
     */
    scheme?:                                RedshiftScheme;
    sslConfig?:                             Config;
    sslMode?:                               SSLMode;
    supportsDatabase?:                      boolean;
    supportsDataDiff?:                      boolean;
    supportsDBTExtraction?:                 boolean;
    supportsIncrementalMetadataExtraction?: boolean;
    supportsLineageExtraction?:             boolean;
    supportsMetadataExtraction?:            boolean;
    supportsProfiler?:                      boolean;
    supportsQueryComment?:                  boolean;
    supportsSystemProfile?:                 boolean;
    supportsUsageExtraction?:               boolean;
    /**
     * Regex to only include/exclude tables that matches the pattern.
     */
    tableFilterPattern?: FilterPattern;
    /**
     * Service Type
     */
    type?: RedshiftType;
    /**
     * Username to connect to Redshift. This user should have privileges to read all the
     * metadata in Redshift.
     */
    username: string;
}

/**
 * Regex to only include/exclude databases that matches the pattern.
 */
export interface DefaultDatabaseFilterPattern {
    excludes?: string[];
    includes?: string[];
    [property: string]: any;
}

/**
 * Storage config to store sample data
 */
export interface SampleDataStorageConfig {
    config?: DataStorageConfig;
}

/**
 * Storage config to store sample data
 */
export interface DataStorageConfig {
    /**
     * Bucket Name
     */
    bucketName?: string;
    /**
     * Provide the pattern of the path where the generated sample data file needs to be stored.
     */
    filePathPattern?: string;
    /**
     * When this field enabled a single parquet file will be created to store sample data,
     * otherwise we will create a new file per day
     */
    overwriteData?: boolean;
    /**
     * Prefix of the data source.
     */
    prefix?:        string;
    storageConfig?: AwsCredentials;
    [property: string]: any;
}

/**
 * AWS credentials configs.
 */
export interface AwsCredentials {
    /**
     * The Amazon Resource Name (ARN) of the role to assume. Required Field in case of Assume
     * Role
     */
    assumeRoleArn?: string;
    /**
     * An identifier for the assumed role session. Use the role session name to uniquely
     * identify a session when the same role is assumed by different principals or for different
     * reasons. Required Field in case of Assume Role
     */
    assumeRoleSessionName?: string;
    /**
     * The Amazon Resource Name (ARN) of the role to assume. Optional Field in case of Assume
     * Role
     */
    assumeRoleSourceIdentity?: string;
    /**
     * AWS Access key ID.
     */
    awsAccessKeyId?: string;
    /**
     * AWS Region
     */
    awsRegion?: string;
    /**
     * AWS Secret Access Key.
     */
    awsSecretAccessKey?: string;
    /**
     * AWS Session Token.
     */
    awsSessionToken?: string;
    /**
     * EndPoint URL for the AWS
     */
    endPointURL?: string;
    /**
     * The name of a profile to use with the boto session.
     */
    profileName?: string;
}

/**
 * Regex to only include/exclude schemas that matches the pattern.
 */
export interface DefaultSchemaFilterPattern {
    excludes?: string[];
    includes?: string[];
    [property: string]: any;
}

/**
 * SQLAlchemy driver scheme options.
 */
export enum RedshiftScheme {
    RedshiftPsycopg2 = "redshift+psycopg2",
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
 * SSL Mode to connect to database.
 */
export enum SSLMode {
    Allow = "allow",
    Disable = "disable",
    Prefer = "prefer",
    Require = "require",
    VerifyCA = "verify-ca",
    VerifyFull = "verify-full",
}

/**
 * Regex to only include/exclude tables that matches the pattern.
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
export enum RedshiftType {
    Redshift = "Redshift",
}
