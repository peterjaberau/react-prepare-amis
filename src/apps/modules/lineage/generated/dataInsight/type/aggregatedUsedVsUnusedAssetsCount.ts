
/**
 * AggregatedUsedVsUnusedAssetsCount data blob
 */
export interface AggregatedUsedVsUnusedAssetsCount {
    /**
     * timestamp
     */
    timestamp?: number;
    /**
     * Count of unused assets (last access >= 3 days)
     */
    Unused?: number;
    /**
     * Percentage of the count of unused assets (last access >= 3 days)
     */
    UnusedPercentage?: number;
    /**
     * Count of used assets (last access < 3 days)
     */
    Used?: number;
    /**
     * Percentage of the count of used assets (last access < 3 days)
     */
    UsedPercentage?: number;
}
