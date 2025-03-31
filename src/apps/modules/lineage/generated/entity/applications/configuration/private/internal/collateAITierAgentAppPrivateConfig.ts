
/**
 * Private Configuration for the CollateAITierAgent Internal Application.
 */
export interface CollateAITierAgentAppPrivateConfig {
    /**
     * Limits for the CollateAITierAgent Application.
     */
    limits: AppLimitsConfig;
}

/**
 * Limits for the CollateAITierAgent Application.
 *
 * Private Configuration for the App Limits.
 */
export interface AppLimitsConfig {
    /**
     * The records of the limits.
     */
    actions: { [key: string]: number };
    /**
     * The start of this limit cycle.
     */
    billingCycleStart: Date;
}
