
/**
 * A `KIP` entity defines a metric and a target.
 */
export interface Kpi {
    /**
     * Change that lead to this version of the entity.
     */
    changeDescription?: ChangeDescription;
    /**
     * Data Insight Chart Referred by this Kpi Objective.
     */
    dataInsightChart: EntityReference;
    /**
     * When `true` indicates the entity has been soft deleted.
     */
    deleted?: boolean;
    /**
     * Description of the KpiObjective.
     */
    description: string;
    /**
     * Display Name that identifies this KPI Definition.
     */
    displayName?: string;
    /**
     * Domain the asset belongs to. When not set, the asset inherits the domain from the parent
     * it belongs to.
     */
    domain?: EntityReference;
    /**
     * End Date for the KPIs
     */
    endDate: number;
    /**
     * FullyQualifiedName same as `name`.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the resource corresponding to this entity.
     */
    href?: string;
    /**
     * Unique identifier of this KPI Definition instance.
     */
    id?: string;
    /**
     * Change that lead to this version of the entity.
     */
    incrementalChangeDescription?: ChangeDescription;
    /**
     * Result of the Kpi
     */
    kpiResult?: KpiResult;
    metricType: KpiTargetType;
    /**
     * Name that identifies this KPI Definition.
     */
    name: string;
    /**
     * Owners of this KPI definition.
     */
    owners?: EntityReference[];
    /**
     * Start Date for the KPIs
     */
    startDate: number;
    /**
     * Metrics from the chart and the target to achieve the result.
     */
    targetValue: number;
    /**
     * Last update time corresponding to the new version of the entity in Unix epoch time
     * milliseconds.
     */
    updatedAt?: number;
    /**
     * User who made the update.
     */
    updatedBy?: string;
    /**
     * Metadata version of the entity.
     */
    version?: number;
}

/**
 * Change that lead to this version of the entity.
 *
 * Description of the change.
 */
export interface ChangeDescription {
    changeSummary?: { [key: string]: ChangeSummary };
    /**
     * Names of fields added during the version changes.
     */
    fieldsAdded?: FieldChange[];
    /**
     * Fields deleted during the version changes with old value before deleted.
     */
    fieldsDeleted?: FieldChange[];
    /**
     * Fields modified during the version changes with old and new values.
     */
    fieldsUpdated?: FieldChange[];
    /**
     * When a change did not result in change, this could be same as the current version.
     */
    previousVersion?: number;
}

export interface ChangeSummary {
    changedAt?: number;
    /**
     * Name of the user or bot who made this change
     */
    changedBy?:    string;
    changeSource?: ChangeSource;
    [property: string]: any;
}

/**
 * The source of the change. This will change based on the context of the change (example:
 * manual vs programmatic)
 */
export enum ChangeSource {
    Automated = "Automated",
    Derived = "Derived",
    Ingested = "Ingested",
    Manual = "Manual",
    Propagated = "Propagated",
    Suggested = "Suggested",
}

export interface FieldChange {
    /**
     * Name of the entity field that changed.
     */
    name?: string;
    /**
     * New value of the field. Note that this is a JSON string and use the corresponding field
     * type to deserialize it.
     */
    newValue?: any;
    /**
     * Previous value of the field. Note that this is a JSON string and use the corresponding
     * field type to deserialize it.
     */
    oldValue?: any;
}

/**
 * Data Insight Chart Referred by this Kpi Objective.
 *
 * This schema defines the EntityReference type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 *
 * Domain the asset belongs to. When not set, the asset inherits the domain from the parent
 * it belongs to.
 *
 * Owners of this KPI definition.
 *
 * This schema defines the EntityReferenceList type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 */
export interface EntityReference {
    /**
     * If true the entity referred to has been soft-deleted.
     */
    deleted?: boolean;
    /**
     * Optional description of entity.
     */
    description?: string;
    /**
     * Display Name that identifies this entity.
     */
    displayName?: string;
    /**
     * Fully qualified name of the entity instance. For entities such as tables, databases
     * fullyQualifiedName is returned in this field. For entities that don't have name hierarchy
     * such as `user` and `team` this will be same as the `name` field.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the entity resource.
     */
    href?: string;
    /**
     * Unique identifier that identifies an entity instance.
     */
    id: string;
    /**
     * If true the relationship indicated by this entity reference is inherited from the parent
     * entity.
     */
    inherited?: boolean;
    /**
     * Name of the entity instance.
     */
    name?: string;
    /**
     * Entity type/class name - Examples: `database`, `table`, `metrics`, `databaseService`,
     * `dashboardService`...
     */
    type: string;
}

/**
 * Result of the Kpi
 *
 * Schema to capture kpi result.
 */
export interface KpiResult {
    /**
     * KPI FQN
     */
    kpiFqn?: string;
    /**
     * Metric and their corresponding current results
     */
    targetResult: KpiTarget[];
    /**
     * Data one which result is updated
     */
    timestamp: number;
}

/**
 * This schema defines the parameter values that can be passed for a Kpi Parameter.
 */
export interface KpiTarget {
    /**
     * name of the parameter. Must match the parameter names in metrics of the chart this
     * objective refers
     */
    name: string;
    /**
     * whether the target value was met or not.
     */
    targetMet?: boolean;
    /**
     * value to be passed for the Parameters. These are input from Users. We capture this in
     * string and convert during the runtime.
     */
    value: string;
}

/**
 * This enum defines the type of key Result
 */
export enum KpiTargetType {
    Number = "NUMBER",
    Percentage = "PERCENTAGE",
}
