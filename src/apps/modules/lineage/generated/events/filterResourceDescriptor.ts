
/**
 * Filter descriptor
 */
export interface FilterResourceDescriptor {
    /**
     * Name of the resource. For entity related resources, resource name is same as the entity
     * name. Some resources such as lineage are not entities but are resources.
     */
    name?: string;
    /**
     * List of actions supported filters by the resource.
     */
    supportedActions?: EventFilterRule[];
    /**
     * List of operations supported filters by the resource.
     */
    supportedFilters?: EventFilterRule[];
}

/**
 * Describes an Event Filter Rule
 */
export interface EventFilterRule {
    /**
     * Arguments to the Condition.
     */
    arguments?: string[];
    /**
     * Expression in SpEL used for matching of a `Rule` based on entity, resource, and
     * environmental attributes.
     */
    condition: string;
    /**
     * Description of the Event Filter Rule.
     */
    description?: string;
    /**
     * Display Name of the Filter.
     */
    displayName?: string;
    effect:       Effect;
    /**
     * FullyQualifiedName in the form `eventSubscription.eventFilterRuleName`.
     */
    fullyQualifiedName?: string;
    inputType?:          InputType;
    /**
     * Name of this Event Filter.
     */
    name?: string;
    /**
     * Prefix Condition to be applied to the Condition.
     */
    prefixCondition?: PrefixCondition;
}

export enum Effect {
    Exclude = "exclude",
    Include = "include",
}

export enum InputType {
    None = "none",
    Runtime = "runtime",
    Static = "static",
}

/**
 * Prefix Condition to be applied to the Condition.
 */
export enum PrefixCondition {
    And = "AND",
    Or = "OR",
}
