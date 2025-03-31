
/**
 * Search Request to find entities from Elastic Search based on different parameters.
 */
export interface SearchRequest {
    /**
     * If Need to apply the domain filter.
     */
    applyDomainFilter?: boolean;
    /**
     * Filter documents by deleted param.
     */
    deleted?: boolean;
    /**
     * Internal Object to filter by Domains.
     */
    domains?: any;
    /**
     * Explain the results of the query. Defaults to false. Only for debugging purposes.
     */
    explain?: boolean;
    /**
     * Get document body for each hit
     */
    fetchSource?: boolean;
    /**
     * Field Name to match.
     */
    fieldName?: string;
    /**
     * Field Value in case of Aggregations.
     */
    fieldValue?: string;
    /**
     * Start Index for the req.
     */
    from?: number;
    /**
     * Get only selected fields of the document body for each hit. Empty value will return all
     * fields
     */
    includeSourceFields?: string[];
    /**
     * Index Name.
     */
    index?: string;
    /**
     * If true it will try to get the hierarchy of the entity.
     */
    isHierarchy?: boolean;
    /**
     * Elasticsearch query that will be used as a post_filter
     */
    postFilter?: string;
    /**
     * Query to be send to Search Engine.
     */
    query?: string;
    /**
     * Elasticsearch query that will be combined with the query_string query generator from the
     * `query` arg
     */
    queryFilter?: string;
    /**
     * When paginating, specify the search_after values. Use it ass
     * search_after=<val1>,<val2>,...
     */
    searchAfter?: any;
    /**
     * Size to limit the no.of results returned.
     */
    size?: number;
    /**
     * Sort the search results by field, available fields to sort weekly_stats daily_stats,
     * monthly_stats, last_updated_timestamp.
     */
    sortFieldParam?: string;
    /**
     * Sort order asc for ascending or desc for descending, defaults to desc.
     */
    sortOrder?: string;
    /**
     * Track Total Hits.
     */
    trackTotalHits?: boolean;
}
