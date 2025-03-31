
/**
 * ML Tagging action configuration for external automator.
 */
export interface MlTaggingAction {
    /**
     * Application Type
     */
    type: MlTaggingActionType;
}

/**
 * Application Type
 *
 * ML PII Tagging action type.
 */
export enum MlTaggingActionType {
    MLTaggingAction = "MLTaggingAction",
}
