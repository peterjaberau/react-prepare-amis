
/**
 * Response object for the search lineage request from Elastic Search.
 */
export interface EsLineageData {
    /**
     * Asset count in case of child assets lineage.
     */
    assetEdges?: number;
    /**
     * Columns associated.
     */
    columns?: ColumnLineage[];
    /**
     * Last update time corresponding to the new version of the entity in Unix epoch time
     * milliseconds.
     */
    createdAt?: number;
    /**
     * User who created the node.
     */
    createdBy?: string;
    /**
     * Description.
     */
    description?: string;
    /**
     * Doc Id for the Lineage.
     */
    docId?: string;
    /**
     * Doc Unique Id for the Lineage.
     */
    docUniqueId?: string;
    /**
     * From Entity.
     */
    fromEntity?: RelationshipRef;
    /**
     * Pipeline in case pipeline is present between entities.
     */
    pipeline?: any;
    /**
     * Pipeline Entity or Stored procedure.
     */
    pipelineEntityType?: string;
    /**
     * Source of the Lineage.
     */
    source?: string;
    /**
     * Sql Query associated.
     */
    sqlQuery?: string;
    /**
     * To Entity.
     */
    toEntity?: RelationshipRef;
    /**
     * Last update time corresponding to the new version of the entity in Unix epoch time
     * milliseconds.
     */
    updatedAt?: number;
    /**
     * User who made the update.
     */
    updatedBy?: string;
}

export interface ColumnLineage {
    /**
     * One or more source columns identified by fully qualified column name used by
     * transformation function to create destination column.
     */
    fromColumns?: string[];
    /**
     * Transformation function applied to source columns to create destination column. That is
     * `function(fromColumns) -> toColumn`.
     */
    function?: string;
    /**
     * Destination column identified by fully qualified column name created by the
     * transformation of source columns.
     */
    toColumn?: string;
    [property: string]: any;
}

/**
 * From Entity.
 *
 * Relationship Reference to an Entity.
 *
 * To Entity.
 */
export interface RelationshipRef {
    /**
     * FullyQualifiedName Hash of the entity.
     */
    fqnHash?: string;
    /**
     * FullyQualifiedName of the entity.
     */
    fullyQualifiedName?: string;
    /**
     * Unique identifier of this entity instance.
     */
    id?: string;
    /**
     * Type of the entity.
     */
    type?: string;
    [property: string]: any;
}
