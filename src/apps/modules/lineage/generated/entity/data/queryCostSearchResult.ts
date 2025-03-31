
/**
 * Query Cost Search Result
 */
export interface QueryCostSearchResult {
    /**
     * Overall statistics across all queries
     */
    overallStats: OverallStats;
    /**
     * List of query groups with their metrics
     */
    queryGroups: QueryGroup[];
    [property: string]: any;
}

/**
 * Overall statistics across all queries
 */
export interface OverallStats {
    /**
     * Average cost across all queries
     */
    avgCost: number;
    /**
     * Maximum cost among all queries
     */
    maxCost: number;
    /**
     * Minimum cost among all queries
     */
    minCost: number;
    /**
     * Total cost across all queries
     */
    totalCost: number;
    /**
     * Total number of query executions
     */
    totalExecutionCount: number;
    [property: string]: any;
}

export interface QueryGroup {
    /**
     * Average duration per query execution
     */
    avgDuration: number;
    /**
     * Additional query details
     */
    queryDetails: QueryDetails;
    /**
     * The text of the query
     */
    queryText: string;
    /**
     * Total cost of all query executions
     */
    totalCost: number;
    /**
     * Total number of query executions
     */
    totalCount: number;
    /**
     * Total duration of all query executions
     */
    totalDuration: number;
    /**
     * List of users who executed the query
     */
    users: string[];
    [property: string]: any;
}

/**
 * Additional query details
 *
 * Details about the query
 */
export interface QueryDetails {
    /**
     * Query information
     */
    query?: { [key: string]: any };
    [property: string]: any;
}
