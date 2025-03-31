
/**
 * AggregatedUsedVsUnusedAssetsSize data blob
 */
export interface AggregatedUsedVsUnusedAssetsSize {
    /**
     * timestamp
     */
    timestamp?: number;
    /**
     * Size of unused assets (last access >= 3 days)
     */
    Unused?: number;
    /**
     * Percentage of the size of unused assets (last access >= 3 days)
     */
    UnusedPercentage?: number;
    /**
     * Size of used assets (last access < 3 days)
     */
    Used?: number;
    /**
     * Percentage of the size of used assets (last access < 3 days)
     */
    UsedPercentage?: number;
}
