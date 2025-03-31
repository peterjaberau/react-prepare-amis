
/**
 * Remove Custom Properties Action Type
 */
export interface RemoveCustomPropertiesAction {
    /**
     * Custom Properties keys to remove
     */
    customProperties: string[];
    /**
     * Application Type
     */
    type: RemoveCustomPropertiesActionType;
}

/**
 * Application Type
 *
 * Remove Custom Properties Action Type.
 */
export enum RemoveCustomPropertiesActionType {
    RemoveCustomPropertiesAction = "RemoveCustomPropertiesAction",
}
