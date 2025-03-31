
/**
 * This schema defines the KnowledgePanel entity. A Knowledge panel is an information box
 * used for UX customization in OpenMetadata.
 */
export interface KnowledgePanel {
    /**
     * Configuration for the Knowledge Panel.
     */
    configuration?: { [key: string]: any };
    /**
     * Entity Type.
     */
    entityType: EntityType;
}

/**
 * Entity Type.
 */
export enum EntityType {
    KnowledgePanel = "KnowledgePanel",
}
