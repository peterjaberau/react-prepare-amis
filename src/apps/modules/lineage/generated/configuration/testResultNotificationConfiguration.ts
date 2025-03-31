
/**
 * This schema defines the SSL Config.
 */
export interface TestResultNotificationConfiguration {
    /**
     * Is Test Notification Enabled?
     */
    enabled?: boolean;
    /**
     * Send notification on Success, Failed or Aborted?
     */
    onResult?: TestCaseStatus[];
    /**
     * Send notification on the mail
     */
    receivers?: string[];
    /**
     * Send notification on the mail
     */
    sendToOwners?: boolean;
}

/**
 * Status of Test Case run.
 */
export enum TestCaseStatus {
    Aborted = "Aborted",
    Failed = "Failed",
    Queued = "Queued",
    Success = "Success",
}
