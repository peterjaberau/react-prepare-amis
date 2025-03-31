
/**
 * Configuration for the Collate AI Quality Agent.
 */
export interface CollateAIQualityAgentAppConfig {
    /**
     * Whether the suggested tests should be active or not upon suggestion
     */
    active?: boolean;
    /**
     * Query filter to be passed to ES. E.g.,
     * `{"query":{"bool":{"must":[{"bool":{"should":[{"term":{"domain.displayName.keyword":"DG
     * Anim"}}]}}]}}}`. This is the same payload as in the Explore page.
     */
    filter: string;
    /**
     * Application Type
     */
    type?: CollateAIQualityAgentAppType;
}

/**
 * Application Type
 *
 * Application type.
 */
export enum CollateAIQualityAgentAppType {
    CollateAIQualityAgent = "CollateAIQualityAgent",
}
