
/**
 * pageViewsByEntities data blob
 */
export interface MostViewedEntities {
    /**
     * Number of page views
     */
    entityFqn?: string;
    /**
     * Entity href link
     */
    entityHref?: string;
    /**
     * Type of entity. Derived from the page URL.
     */
    entityType?: string;
    /**
     * Owner of the entity
     */
    owner?: string;
    /**
     * Type of entity. Derived from the page URL.
     */
    pageViews?: number;
}
