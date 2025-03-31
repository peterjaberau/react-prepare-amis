
/**
 * This schema defines the Audit Log type to capture the audit trail of POST, PUT, and PATCH
 * API operations.
 */
export interface AuditLog {
    /**
     * Identifier of entity that was modified by the operation.
     */
    entityId: string;
    /**
     * Type of Entity that is modified by the operation.
     */
    entityType: string;
    /**
     * HTTP Method used in a call.
     */
    method: Method;
    /**
     * Requested API Path.
     */
    path: string;
    /**
     * HTTP response code for the api requested.
     */
    responseCode: number;
    /**
     * Timestamp when the API call is made in Unix epoch time milliseconds in Unix epoch time
     * milliseconds.
     */
    timestamp?: number;
    /**
     * Name of the user who made the API request.
     */
    userName: string;
}

/**
 * HTTP Method used in a call.
 */
export enum Method {
    Delete = "DELETE",
    Patch = "PATCH",
    Post = "POST",
    Put = "PUT",
}
