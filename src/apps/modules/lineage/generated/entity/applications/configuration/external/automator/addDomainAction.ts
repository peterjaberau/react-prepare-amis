
/**
 * Add an owner to the selected assets.
 */
export interface AddDomainAction {
    /**
     * Domain to apply
     */
    domain: EntityReference;
    /**
     * Update the domain even if it is defined in the asset. By default, we will only apply the
     * domain to assets without domain.
     */
    overwriteMetadata?: boolean;
    /**
     * Application Type
     */
    type: AddDomainActionType;
}

/**
 * Domain to apply
 *
 * This schema defines the EntityReference type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 */
export interface EntityReference {
    /**
     * If true the entity referred to has been soft-deleted.
     */
    deleted?: boolean;
    /**
     * Optional description of entity.
     */
    description?: string;
    /**
     * Display Name that identifies this entity.
     */
    displayName?: string;
    /**
     * Fully qualified name of the entity instance. For entities such as tables, databases
     * fullyQualifiedName is returned in this field. For entities that don't have name hierarchy
     * such as `user` and `team` this will be same as the `name` field.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the entity resource.
     */
    href?: string;
    /**
     * Unique identifier that identifies an entity instance.
     */
    id: string;
    /**
     * If true the relationship indicated by this entity reference is inherited from the parent
     * entity.
     */
    inherited?: boolean;
    /**
     * Name of the entity instance.
     */
    name?: string;
    /**
     * Entity type/class name - Examples: `database`, `table`, `metrics`, `databaseService`,
     * `dashboardService`...
     */
    type: string;
}

/**
 * Application Type
 *
 * Add Owner Action Type.
 */
export enum AddDomainActionType {
    AddDomainAction = "AddDomainAction",
}
