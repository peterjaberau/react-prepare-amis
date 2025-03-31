
/**
 * Refined data for Entity Report.
 */
export interface EntityReportData {
    /**
     * Number of completed description for the entity
     */
    completedDescriptions?: number;
    /**
     * number of entities
     */
    entityCount?: number;
    /**
     * Tier for the entity
     */
    entityTier?: string;
    /**
     * type of the entity
     */
    entityType?: string;
    /**
     * number of entities with owner
     */
    hasOwner?: number;
    /**
     * Number of missing description for the entity
     */
    missingDescriptions?: number;
    /**
     * number of entities missing owners
     */
    missingOwner?: number;
    /**
     * Organization associated with the entity (i.e. owner)
     */
    organization?: string;
    /**
     * Name of the service
     */
    serviceName?: string;
    /**
     * Team associated with the entity (i.e. owner)
     */
    team?: string;
}
