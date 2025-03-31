
/**
 * Remove Owner Action Type
 */
export interface RemoveDescriptionAction {
    /**
     * Remove descriptions from all the children and parent of the selected assets.
     */
    applyToAll?: boolean;
    /**
     * Remove descriptions from the children of the selected assets. E.g., columns, tasks, topic
     * fields,...
     */
    applyToChildren?: string[];
    /**
     * Application Type
     */
    type: RemoveDescriptionActionType;
}

/**
 * Application Type
 *
 * Remove Description Action Type
 */
export enum RemoveDescriptionActionType {
    RemoveDescriptionAction = "RemoveDescriptionAction",
}
