
/**
 * AggregatedUnusedAssetsCount data blob
 */
export interface AggregatedUnusedAssetsCount {
    /**
     * Frequently used Data Assets
     */
    frequentlyUsedDataAssets?: DataAssetValues;
    /**
     * timestamp
     */
    timestamp?: number;
    /**
     * Unused Data Assets
     */
    unusedDataAssets?: DataAssetValues;
}

/**
 * Frequently used Data Assets
 *
 * Count or Size in bytes of Data Assets over a time period
 *
 * Unused Data Assets
 */
export interface DataAssetValues {
    /**
     * Data Asset Count or Size for 14 days
     */
    fourteenDays?: number | null;
    /**
     * Data Asset Count or Size for 7 days
     */
    sevenDays?: number | null;
    /**
     * Data Asset Count or Size for 60 days
     */
    sixtyDays?: number | null;
    /**
     * Data Asset Count or Size for 30 days
     */
    thirtyDays?: number | null;
    /**
     * Data Asset Count or Size for 3 days
     */
    threeDays?: number | null;
}
