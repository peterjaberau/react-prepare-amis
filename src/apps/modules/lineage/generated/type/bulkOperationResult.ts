
/**
 * Represents result of bulk Operation performed on entities.
 */
export interface BulkOperationResult {
    /**
     * Reason why import was aborted. This is set only when the `status` field is set to
     * `aborted`
     */
    abortReason?: string;
    /**
     * True if the operation has dryRun flag enabled
     */
    dryRun?: boolean;
    /**
     * Failure Request that can be processed successfully.
     */
    failedRequest?:         Response[];
    numberOfRowsFailed?:    number;
    numberOfRowsPassed?:    number;
    numberOfRowsProcessed?: number;
    status?:                Status;
    /**
     * Request that can be processed successfully.
     */
    successRequest?: Response[];
}

/**
 * Request that can be processed successfully.
 */
export interface Response {
    /**
     * Message for the request.
     */
    message?: string;
    /**
     * Request that can be processed successfully.
     */
    request?: any;
}

/**
 * State of an action over API.
 */
export enum Status {
    Aborted = "aborted",
    Failure = "failure",
    PartialSuccess = "partialSuccess",
    Success = "success",
}
