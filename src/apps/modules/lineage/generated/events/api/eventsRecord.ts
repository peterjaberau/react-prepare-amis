
/**
 * Schema defining the response for event subscription events record, including total,
 * pending, successful, and failed event counts for a specific alert.
 */
export interface EventsRecord {
    /**
     * Count of failed events for specific alert.
     */
    failedEventsCount?: any;
    /**
     * Count of pending events for specific alert.
     */
    pendingEventsCount?: any;
    /**
     * Count of successful events for specific alert.
     */
    successfulEventsCount?: any;
    /**
     * Count of total events (pendingEventsCount + successfulEventsCount + failedEventsCount)
     * for specific alert.
     */
    totalEventsCount?: any;
}
