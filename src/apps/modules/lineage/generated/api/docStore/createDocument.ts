
/**
 * This schema defines Document. A Generic entity to capture any kind of Json Payload.
 */
export interface CreateDocument {
    data: { [key: string]: any };
    /**
     * Description of the DocStore Entity.
     */
    description?: string;
    /**
     * Display Name that identifies this column name.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Type of the Entity stored in DocStore.
     */
    entityType:         string;
    fullyQualifiedName: string;
    /**
     * Name of the DocStore
     */
    name: string;
}
