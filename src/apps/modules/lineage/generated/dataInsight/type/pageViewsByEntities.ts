
/**
 * pageViewsByEntities data blob
 */
export interface PageViewsByEntities {
    /**
     * Type of entity. Derived from the page URL.
     */
    entityType?: string;
    /**
     * Number of page views
     */
    pageViews?: number;
    /**
     * timestamp
     */
    timestamp?: number;
}
