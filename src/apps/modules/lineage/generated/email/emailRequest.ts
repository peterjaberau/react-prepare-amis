
/**
 * This schema defines the Email Request for creating Email
 */
export interface EmailRequest {
    /**
     * List of BCC
     */
    bccMails?: NameEmailPair[];
    /**
     * List of CC
     */
    ccMails?: NameEmailPair[];
    /**
     * Content for mail
     */
    content?:    string;
    contentType: ContentType;
    /**
     * List of Receiver Name with Email
     */
    recipientMails?: NameEmailPair[];
    /**
     * From Email Address
     */
    senderMail?: string;
    /**
     * Sender Name
     */
    senderName?: string;
    /**
     * Subject for Mail
     */
    subject: string;
}

/**
 * Name Email Pair
 */
export interface NameEmailPair {
    /**
     * Email address of the user.
     */
    email: string;
    /**
     * Name
     */
    name?: string;
}

export enum ContentType {
    HTML = "html",
    Plain = "plain",
}
