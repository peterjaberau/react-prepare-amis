
/**
 * Apply Tags to the selected assets.
 */
export interface AddDescriptionAction {
    /**
     * Apply the description to the children of the selected assets that match the criteria.
     * E.g., columns, tasks, topic fields,...
     */
    applyToChildren?: string[];
    /**
     * Description to apply
     */
    description: string;
    /**
     * Update the description even if they are already defined in the asset. By default, we'll
     * only add the descriptions to assets without the description set.
     */
    overwriteMetadata?: boolean;
    /**
     * Application Type
     */
    type: AddDescriptionActionType;
}

/**
 * Application Type
 *
 * Add Description Action Type.
 */
export enum AddDescriptionActionType {
    AddDescriptionAction = "AddDescriptionAction",
}
