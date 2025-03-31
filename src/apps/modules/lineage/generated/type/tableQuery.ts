
/**
 * This schema defines structure of table query
 */
export interface TableQuery {
    /**
     * Date of execution of SQL query
     */
    queries?: Array<any[] | boolean | number | number | null | TableQueryObject | string>;
}

export interface TableQueryObject {
    /**
     * Flag to check if query was aborted during execution
     */
    aborted?: boolean;
    /**
     * Date of execution of SQL query
     */
    analysisDate?: Date;
    /**
     * Cost of the query execution
     */
    cost?: number;
    /**
     * Database associated with the table in the query
     */
    databaseName?: string;
    /**
     * Database schema of the associated with query
     */
    databaseSchema?: string;
    /**
     * SQL dialect
     */
    dialect?: string;
    /**
     * How long did the query took to run in milliseconds.
     */
    duration?: number;
    /**
     * End time of execution of SQL query
     */
    endTime?: string;
    /**
     * Flag to check if query is to be excluded while processing usage
     */
    exclude_usage?: boolean;
    /**
     * SQL query
     */
    query: string;
    /**
     * SQL query type
     */
    query_type?: string;
    /**
     * Name that identifies this database service.
     */
    serviceName: string;
    /**
     * Start time of execution of SQL query
     */
    startTime?: string;
    /**
     * Name of the user that executed the SQL query
     */
    userName?: string;
    [property: string]: any;
}
