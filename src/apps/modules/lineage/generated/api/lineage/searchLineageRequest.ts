
/**
 * Search Lineage Request Schema to find linage from Elastic Search.
 */
export interface SearchLineageRequest {
    direction: LineageDirection;
    /**
     * Lineage Direction Value.
     */
    directionValue?: string[];
    /**
     * The downstream depth of the lineage
     */
    downstreamDepth?: number;
    /**
     * Entity Fqn to search lineage
     */
    fqn: string;
    /**
     * Include deleted entities
     */
    includeDeleted?: boolean;
    /**
     * Include source fields
     */
    includeSourceFields?: string[];
    /**
     * Connected Via
     */
    isConnectedVia?: boolean;
    /**
     * Layer to start the search from.
     */
    layerFrom?: number;
    /**
     * Size of the search result.
     */
    layerSize?: number;
    /**
     * Query Filter
     */
    queryFilter?: string;
    /**
     * The upstream depth of the lineage
     */
    upstreamDepth?: number;
}

/**
 * Lineage Direction Schema.
 */
export enum LineageDirection {
    Downstream = "Downstream",
    Upstream = "Upstream",
}
