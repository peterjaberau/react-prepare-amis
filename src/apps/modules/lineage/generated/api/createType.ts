
/**
 * Create a Type to be used for extending entities.
 */
export interface CreateType {
    category?: Category;
    /**
     * Optional description of the type.
     */
    description: string;
    /**
     * Display Name that identifies this Type.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Unique name that identifies a Type.
     */
    name: string;
    /**
     * Namespace or group to which this type belongs to.
     */
    nameSpace: string;
    /**
     * JSON schema encoded as string. This will be used to validate the type values.
     */
    schema: string;
}

/**
 * Metadata category to which a type belongs to.
 */
export enum Category {
    Entity = "entity",
    Field = "field",
}
