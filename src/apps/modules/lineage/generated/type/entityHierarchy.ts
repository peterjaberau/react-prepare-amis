
/**
 * This schema defines the entity hierarchy structure.
 */
export interface EntityHierarchy {
    /**
     * Other entities that are children of this entity.
     */
    children?: ChildElement[];
    /**
     * Description of the entity hierarchy.
     */
    description: string;
    /**
     * Display name that identifies this hierarchy.
     */
    displayName?: string;
    /**
     * A unique name that identifies an entity within the hierarchy. It captures name hierarchy
     * in the form of `rootEntity.childEntity`.
     */
    fullyQualifiedName?: string;
    /**
     * Unique identifier of an entity hierarchy instance.
     */
    id: string;
    /**
     * Preferred name for the entity hierarchy.
     */
    name: string;
    [property: string]: any;
}

/**
 * Other entities that are children of this entity.
 *
 * This schema defines the entity hierarchy structure.
 */
export interface ChildElement {
    /**
     * Other entities that are children of this entity.
     */
    children?: ChildElement[];
    /**
     * Description of the entity hierarchy.
     */
    description: string;
    /**
     * Display name that identifies this hierarchy.
     */
    displayName?: string;
    /**
     * A unique name that identifies an entity within the hierarchy. It captures name hierarchy
     * in the form of `rootEntity.childEntity`.
     */
    fullyQualifiedName?: string;
    /**
     * Unique identifier of an entity hierarchy instance.
     */
    id: string;
    /**
     * Preferred name for the entity hierarchy.
     */
    name: string;
    [property: string]: any;
}
