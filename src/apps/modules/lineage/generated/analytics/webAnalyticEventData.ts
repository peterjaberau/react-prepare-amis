
/**
 * web analytics event data
 */
export interface WebAnalyticEventData {
    /**
     * Web analytic data captured
     */
    eventData?: Data;
    /**
     * Unique identifier of the report.
     */
    eventId?: string;
    /**
     * event type
     */
    eventType: WebAnalyticEventType;
    /**
     * event timestamp
     */
    timestamp: number;
}

/**
 * Web analytic data captured
 *
 * Page view data event
 *
 * Event tracker (e.g. clicks, etc.)
 */
export interface Data {
    /**
     * complete URL of the page
     */
    fullUrl?: string;
    /**
     * domain name
     */
    hostname?: string;
    /**
     * language set on the page
     */
    language?: string;
    /**
     * time for the page to load in seconds
     */
    pageLoadTime?: number;
    /**
     * referrer URL
     */
    referrer?: string;
    /**
     * Size of the screen
     */
    screenSize?: string;
    /**
     * Unique ID identifying a session
     */
    sessionId?: string;
    /**
     * url part after the domain specification
     */
    url?: string;
    /**
     * OpenMetadata logged in user Id
     */
    userId?: string;
    /**
     * Type of event that was performed
     */
    eventType?: CustomEventTypes;
    /**
     * Value of the event
     */
    eventValue?: string;
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

/**
 * event type
 */
export enum WebAnalyticEventType {
    CustomEvent = "CustomEvent",
    PageView = "PageView",
}
