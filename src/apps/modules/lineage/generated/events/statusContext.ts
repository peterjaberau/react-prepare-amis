
/**
 * Status Context
 */
export interface StatusContext {
    /**
     * Response entity, if available
     */
    entity?: string;
    /**
     * Response headers as a map
     */
    headers?: any;
    /**
     * Location URI from the response
     */
    location?: string;
    /**
     * Media type of the response
     */
    mediaType?: string;
    /**
     * HTTP status code of the response
     */
    statusCode?: number;
    /**
     * Reason phrase associated with the status code
     */
    statusInfo?: string;
    /**
     * Time in milliseconds since epoch
     */
    timestamp?: number;
}
