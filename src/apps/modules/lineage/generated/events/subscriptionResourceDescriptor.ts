
/**
 * Subscription descriptor
 */
export interface SubscriptionResourceDescriptor {
    /**
     * Name of the resource. For entity related resources, resource name is same as the entity
     * name. Some resources such as lineage are not entities but are resources.
     */
    name?: string;
    /**
     * List of operations supported filters by the resource.
     */
    supportedFilters?: Operation[];
}

/**
 * This schema defines all possible filter operations on metadata of entities in
 * OpenMetadata.
 */
export enum Operation {
    FilterByDomain = "filterByDomain",
    FilterByEntityID = "filterByEntityId",
    FilterByEventType = "filterByEventType",
    FilterByFieldChange = "filterByFieldChange",
    FilterByFqn = "filterByFqn",
    FilterByGeneralMetadataEvents = "filterByGeneralMetadataEvents",
    FilterByMentionedName = "filterByMentionedName",
    FilterByOwnerName = "filterByOwnerName",
    FilterBySource = "filterBySource",
    FilterByUpdaterName = "filterByUpdaterName",
}
