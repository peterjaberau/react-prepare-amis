
/**
 * Arguments for enum removal job.
 */
export interface EnumCleanupArgs {
    /**
     * Type of the entity.
     */
    entityType: string;
    /**
     * Name of the property.
     */
    propertyName: string;
    /**
     * List of removed enum keys.
     */
    removedEnumKeys: string[];
}
