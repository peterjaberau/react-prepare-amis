
/**
 * Page view data event
 */
export interface PageViewEvent {
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
    [property: string]: any;
}
