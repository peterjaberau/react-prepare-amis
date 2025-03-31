
/**
 * Configuration for the Collate AI Quality Agent.
 */
export interface CollateAITierAgentAppConfig {
    /**
     * Query filter to be passed to ES. E.g.,
     * `{"query":{"bool":{"must":[{"bool":{"should":[{"term":{"domain.displayName.keyword":"DG
     * Anim"}}]}}]}}}`. This is the same payload as in the Explore page.
     */
    filter: string;
    /**
     * Patch the tier if it is empty, instead of raising a suggestion
     */
    patchIfEmpty?: boolean;
    /**
     * Application Type
     */
    type?: CollateAITierAgentAppType;
}

/**
 * Application Type
 *
 * Application type.
 */
export enum CollateAITierAgentAppType {
    CollateAITierAgent = "CollateAITierAgent",
}
