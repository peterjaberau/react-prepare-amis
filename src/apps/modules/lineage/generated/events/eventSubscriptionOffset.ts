
/**
 * Represents the offsets for an event subscription, tracking the starting point and current
 * position of events processed.
 */
export interface EventSubscriptionOffset {
    /**
     * The current position in the events.
     */
    currentOffset: number;
    /**
     * The offset from where event processing starts.
     */
    startingOffset: number;
    /**
     * Update time of the job status.
     */
    timestamp?: number;
}
