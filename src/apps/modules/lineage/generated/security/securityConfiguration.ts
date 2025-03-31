
/**
 * Security configuration for the OpenMetadata server.
 */
export interface SecurityConfiguration {
    /**
     * If enabled, it will mask all the password fields in the responses sent from the API
     * except for the bots
     */
    maskPasswordsAPI?: boolean;
}
