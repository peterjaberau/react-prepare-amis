
/**
 * Private Configuration for the CollateAI External Application.
 */
export interface CollateAIAppPrivateConfig {
    /**
     * Collate Server public URL. WAII will use this information to interact with the server.
     * E.g., https://sandbox.getcollate.io
     */
    collateURL: string;
    /**
     * Limits for the CollateAI Application.
     */
    limits: AppLimitsConfig;
    /**
     * WAII API Token
     */
    token: string;
    /**
     * WAII API host URL
     */
    waiiInstance: string;
}

/**
 * Limits for the CollateAI Application.
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
