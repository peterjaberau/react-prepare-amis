
/**
 * This schema defines type of query parser data
 */
export interface QueryParserData {
    parsedData?: Array<any[] | boolean | number | number | null | ParsedDataObject | string>;
}

export interface ParsedDataObject {
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
     * Date of execution of SQL query
     */
    date?: string;
    /**
     * SQL dialect
     */
    dialect?: string;
    /**
     * How long did the query took to run in milliseconds.
     */
    duration?: number;
    /**
     * Flag to check if query is to be excluded while processing usage
     */
    exclude_usage?: boolean;
    /**
     * Maps each parsed table name of a query to the join information
     */
    joins?: { [key: string]: any };
    /**
     * SQL query type
     */
    query_type?: string;
    /**
     * Name that identifies this database service.
     */
    serviceName: string;
    /**
     * SQL query
     */
    sql: string;
    /**
     * List of tables used in query
     */
    tables: string[];
    /**
     * Name of the user that executed the SQL query
     */
    userName?: string;
    [property: string]: any;
}
