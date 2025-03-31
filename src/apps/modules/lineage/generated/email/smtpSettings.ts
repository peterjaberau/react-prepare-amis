
/**
 * This schema defines the SMTP Settings for sending Email
 */
export interface SMTPSettings {
    /**
     * Emailing Entity
     */
    emailingEntity?: string;
    /**
     * If this is enable password will details will be shared on mail
     */
    enableSmtpServer?: boolean;
    /**
     * Smtp Server Password
     */
    password?: string;
    /**
     * Mail of the sender
     */
    senderMail: string;
    /**
     * Smtp Server Endpoint
     */
    serverEndpoint: string;
    /**
     * Smtp Server Port
     */
    serverPort: number;
    /**
     * Support Url
     */
    supportUrl?:             string;
    templatePath?:           string;
    templates?:              Templates;
    transportationStrategy?: TransportationStrategy;
    /**
     * Smtp Server Username
     */
    username?: string;
}

export enum Templates {
    Collate = "collate",
    Openmetadata = "openmetadata",
}

export enum TransportationStrategy {
    SMTP = "SMTP",
    SMTPTLS = "SMTP_TLS",
    Smtps = "SMTPS",
}
