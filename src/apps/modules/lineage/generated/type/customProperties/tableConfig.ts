
/**
 * Custom property configuration for table-type property where all column data types are
 * strings.
 */
export interface TableConfig {
    /**
     * List of column names defined at the entity type level.
     */
    columns:     string[];
    maxColumns?: number;
    minColumns?: number;
}
