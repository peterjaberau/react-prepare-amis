
/**
 * This schema defines the Lineage Settings.
 */
export interface LineageSettings {
    /**
     * DownStream Depth for Lineage.
     */
    downstreamDepth: number;
    /**
     * Lineage Layer.
     */
    lineageLayer: LineageLayer;
    /**
     * Upstream Depth for Lineage.
     */
    upstreamDepth: number;
}

/**
 * Lineage Layer.
 *
 * Lineage Layers
 */
export enum LineageLayer {
    ColumnLevelLineage = "ColumnLevelLineage",
    DataObservability = "DataObservability",
    EntityLineage = "EntityLineage",
}
