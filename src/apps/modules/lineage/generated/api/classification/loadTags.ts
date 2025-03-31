
/**
 * Load classifications and tags
 */
export interface LoadTags {
    createClassification: CreateClassificationRequest;
    createTags?:          CreateTagRequest[];
}

/**
 * Create classification request
 */
export interface CreateClassificationRequest {
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

/**
 * Create tag API request
 */
export interface CreateTagRequest {
    /**
     * Fully qualified names of tags associated with this tag
     */
    associatedTags?: string[];
    /**
     * Name of the classification that this tag is part of.
     */
    classification?: string;
    /**
     * Unique name of the classification
     */
    description: string;
    /**
     * Display Name that identifies this tag.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Children tags under this group are mutually exclusive. When mutually exclusive is `true`
     * the tags from this group are used to **classify** an entity. An entity can only be in one
     * class - example, it can only be either `tier1` or `tier2` and not both. When mutually
     * exclusive is `false`, the tags from this group are used to **categorize** an entity. An
     * entity can be in multiple categories simultaneously - example a customer can be
     * `newCustomer` and `atRisk` simultaneously.
     */
    mutuallyExclusive?: boolean;
    name:               string;
    /**
     * Fully qualified name of the parent tag. When null, the term is at the root of the
     * classification.
     */
    parent?:   string;
    provider?: ProviderType;
    style?:    Style;
}

/**
 * UI Style is used to associate a color code and/or icon to entity to customize the look of
 * that entity in UI.
 */
export interface Style {
    /**
     * Hex Color Code to mark an entity such as GlossaryTerm, Tag, Domain or Data Product.
     */
    color?: string;
    /**
     * An icon to associate with GlossaryTerm, Tag, Domain or Data Product.
     */
    iconURL?: string;
}
