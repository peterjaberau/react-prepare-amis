
/**
 * Remove Owner Action Type
 */
export interface RemoveDomainAction {
    /**
     * Application Type
     */
    type: RemoveDomainActionType;
}

/**
 * Application Type
 *
 * Remove Domain Action Type
 */
export enum RemoveDomainActionType {
    RemoveDomainAction = "RemoveDomainAction",
}
