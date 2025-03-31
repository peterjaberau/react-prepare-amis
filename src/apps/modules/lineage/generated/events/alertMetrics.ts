
/**
 * Alert Metrics Schema
 */
export interface AlertMetrics {
    /**
     * Number of events that failed to be processed.
     */
    failedEvents?: number;
    /**
     * Number of events that were successfully processed.
     */
    successEvents?: number;
    /**
     * Update time of the job status.
     */
    timestamp?: number;
    /**
     * Total number of events.
     */
    totalEvents?: number;
}
