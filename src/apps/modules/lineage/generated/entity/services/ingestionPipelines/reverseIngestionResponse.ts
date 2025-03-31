
/**
 * Apply a set of operations on a service
 */
export interface ReverseIngestionResponse {
    /**
     * Error message in case of failure
     */
    message?: string;
    /**
     * List of operations to be performed on the service
     */
    results: ReverseIngestionOperationResult[];
    /**
     * The id of the service to be modified
     */
    serviceId: string;
    /**
     * Whether the workflow was successful. Failure indicates a critical failure such as
     * connection issues.
     */
    success?: boolean;
}

export interface ReverseIngestionOperationResult {
    /**
     * The id of the operation
     */
    id: string;
    /**
     * Error message in case of failure
     */
    message?: string;
    /**
     * Whether the specific operation was successful
     */
    success: boolean;
    [property: string]: any;
}
