
/**
 * Create classification request
 */
export interface CreateClassification {
    /**
     * Description of the classification.
     */
    description: string;
    /**
     * Display Name that identifies this classification.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Tags under this classification are mutually exclusive. When mutually exclusive is `true`
     * the tags from this classification are used to **classify** an entity. An entity can only
     * be in one class - example, it can only be either `tier1` or `tier2` and not both. When
     * mutually exclusive is `false`, the tags from this classification are used to
     * **categorize** an entity. An entity can be in multiple categories simultaneously -
     * example a customer can be `newCustomer` and `atRisk` simultaneously.
     */
    mutuallyExclusive?: boolean;
    name:               string;
    provider?:          ProviderType;
}

/**
 * Type of provider of an entity. Some entities are provided by the `system`. Some are
 * entities created and provided by the `user`. Typically `system` provide entities can't be
 * deleted and can only be disabled.
 */
export enum ProviderType {
    System = "system",
    User = "user",
}
