
/**
 * Database Connection Config to capture connection details to a database service.
 */
export interface DatabaseConnectionConfig {
    /**
     * Database of the data source.
     */
    database?: string;
    /**
     * Run data profiler as part of ingestion to get table profile data.
     */
    enableDataProfiler?: boolean;
    /**
     * Regex exclude tables or databases that matches the pattern.
     */
    excludeFilterPattern?: string[];
    /**
     * Turn on/off collecting sample data.
     */
    generateSampleData?: boolean;
    /**
     * Host and port of the data source.
     */
    hostPort?: string;
    /**
     * Regex to only fetch tables or databases that matches the pattern.
     */
    includeFilterPattern?: string[];
    /**
     * Optional configuration to turn off fetching metadata for tables.
     */
    includeTables?: boolean;
    /**
     * optional configuration to turn off fetching metadata for views.
     */
    includeViews?: boolean;
    /**
     * password to connect  to the data source.
     */
    password?: string;
    /**
     * query to generate sample data.
     */
    sampleDataQuery?: string;
    /**
     * schema of the data source.
     */
    schema?: string;
    /**
     * username to connect  to the data source.
     */
    username?: string;
}
