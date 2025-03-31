
/**
 * This schema defines the Slack App Information
 */
export interface SlackAppConfiguration {
    /**
     * Client Id of the Application
     */
    clientId: string;
    /**
     * Client Secret of the Application.
     */
    clientSecret: string;
    /**
     * Signing Secret of the Application. Confirm that each request comes from Slack by
     * verifying its unique signature.
     */
    signingSecret: string;
}
