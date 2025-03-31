
/**
 * This schema defines the create applications request for Open-Metadata.
 */
export interface CreateAppRequest {
    /**
     * Application Configuration object.
     */
    appConfiguration?: any;
    appSchedule?:      any[] | boolean | AppScheduleClass | number | number | null | string;
    /**
     * Fqn of Bot Associated with this application.
     */
    bot?: string;
    /**
     * Description of the Application.
     */
    description?: string;
    /**
     * Display Name for the application.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Name of the Application.
     */
    name?: string;
    /**
     * Owners of this workflow.
     */
    owners?: EntityReference[];
    /**
     * If the app run can be interrupted as part of the execution.
     */
    supportsInterrupt?: boolean;
}

export interface AppScheduleClass {
    /**
     * Cron Expression in case of Custom scheduled Trigger
     */
    cronExpression?:  string;
    scheduleTimeline: ScheduleTimeline;
}

/**
 * This schema defines the Application ScheduleTimeline Options
 */
export enum ScheduleTimeline {
    Custom = "Custom",
    Daily = " Daily",
    Hourly = "Hourly",
    Monthly = "Monthly",
    None = "None",
    Weekly = "Weekly",
}

/**
 * Owners of this workflow.
 *
 * This schema defines the EntityReferenceList type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 *
 * This schema defines the EntityReference type used for referencing an entity.
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
