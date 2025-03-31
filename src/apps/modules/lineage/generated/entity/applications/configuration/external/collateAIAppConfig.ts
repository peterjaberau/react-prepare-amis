
/**
 * Configuration for the CollateAI External Application.
 */
export interface CollateAIAppConfig {
    /**
     * Query filter to be passed to ES. E.g.,
     * `{"query":{"bool":{"must":[{"bool":{"should":[{"term":{"domain.displayName.keyword":"DG
     * Anim"}}]}}]}}}`. This is the same payload as in the Explore page.
     */
    filter: string;
    /**
     * Patch the description if it is empty, instead of raising a suggestion
     */
    patchIfEmpty?: boolean;
    /**
     * Application Type
     */
    type?: CollateAIAppType;
}

/**
 * Application Type
 *
 * Application type.
 */
export enum CollateAIAppType {
    CollateAI = "CollateAI",
}
