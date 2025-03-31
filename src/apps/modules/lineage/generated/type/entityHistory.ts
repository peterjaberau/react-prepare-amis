
/**
 * This schema defines the type used for capturing version of history of entity.
 */
export interface EntityHistory {
    /**
     * Entity type, such as `database`, `table`, `dashboard`, for which this version history is
     * produced.
     */
    entityType: string;
    versions:   any[];
}
