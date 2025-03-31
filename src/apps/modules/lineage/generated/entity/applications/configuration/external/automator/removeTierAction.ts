
/**
 * Remove Owner Action Type
 */
export interface RemoveTierAction {
    /**
     * Application Type
     */
    type: RemoveTierActionType;
}

/**
 * Application Type
 *
 * Remove Tier Action Type
 */
export enum RemoveTierActionType {
    RemoveTierAction = "RemoveTierAction",
}
