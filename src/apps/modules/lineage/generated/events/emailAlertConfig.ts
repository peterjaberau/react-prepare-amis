
/**
 * This schema defines email config for receiving events from OpenMetadata.
 */
export interface EmailAlertConfig {
    /**
     * List of receivers to send mail to
     */
    receivers?: string[];
    /**
     * Send the Mails to Admins
     */
    sendToAdmins?: boolean;
    /**
     * Send the Mails to Followers
     */
    sendToFollowers?: boolean;
    /**
     * Send the Mails to Owners
     */
    sendToOwners?: boolean;
}
