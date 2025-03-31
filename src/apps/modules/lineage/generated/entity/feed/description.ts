
/**
 * This schema defines the schema for Description Updates.
 */
export interface Description {
    /**
     * The difference between the previous and new descriptions.
     */
    diffMessage?: string;
    /**
     * The new description of the entity.
     */
    newDescription?: string;
    /**
     * The previous description of the entity.
     */
    previousDescription?: string;
}
