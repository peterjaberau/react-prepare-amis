
export interface ComplexTypesObject {
    "table-cp"?: Table;
    [property: string]: any;
}

/**
 * A table-type custom property having rows and columns where all column data types are
 * strings.
 */
export interface Table {
    /**
     * List of column names defined at the entity type level.
     */
    columns: string[];
    /**
     * List of rows added at the entity instance level. Each row contains dynamic fields based
     * on the defined columns.
     */
    rows?: { [key: string]: string }[];
}
