
/**
 * Refined data for overview report
 */
export interface WebAnalyticEntityViewReportData {
    /**
     * entity fully qualified name
     */
    entityFqn?: string;
    /**
     * entity href
     */
    entityHref?: string;
    /**
     * entity tier
     */
    entityTier?: string;
    /**
     * entity type
     */
    entityType?: string;
    /**
     * Name of the entity owner
     */
    owner?: string;
    /**
     * Name of the entity owner
     */
    ownerId?: string;
    /**
     * Tags FQN
     */
    tagsFQN?: string[];
    /**
     * Number of time the entity was viewed
     */
    views?: number;
}
