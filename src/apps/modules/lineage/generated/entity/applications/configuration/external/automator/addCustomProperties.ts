
/**
 * Add a Custom Property to the selected assets.
 */
export interface AddCustomProperties {
    /**
     * Owners to apply
     */
    customProperties: any;
    /**
     * Update the Custom Property even if it is defined in the asset. By default, we will only
     * apply the owners to assets without the given Custom Property informed.
     */
    overwriteMetadata?: boolean;
    /**
     * Application Type
     */
    type: AddCustomPropertiesActionType;
}

/**
 * Application Type
 *
 * Add Custom Properties Action Type.
 */
export enum AddCustomPropertiesActionType {
    AddCustomPropertiesAction = "AddCustomPropertiesAction",
}
