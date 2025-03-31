
/**
 * Event tracker (e.g. clicks, etc.)
 */
export interface CustomEvent {
    /**
     * Type of event that was performed
     */
    eventType?: CustomEventTypes;
    /**
     * Value of the event
     */
    eventValue?: string;
    /**
     * complete URL of the page
     */
    fullUrl?: string;
    /**
     * domain name
     */
    hostname?: string;
    /**
     * Unique ID identifying a session
     */
    sessionId?: string;
    /**
     * url part after the domain specification
     */
    url?: string;
    [property: string]: any;
}

/**
 * Type of event that was performed
 *
 * Type of events that can be performed
 */
export enum CustomEventTypes {
    Click = "CLICK",
}
