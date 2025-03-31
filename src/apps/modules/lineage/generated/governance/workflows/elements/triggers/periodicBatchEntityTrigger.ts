
/**
 * Periodic Batch Entity Trigger.
 */
export interface PeriodicBatchEntityTrigger {
    config?: TriggerConfiguration;
    output?: string[];
    type?:   string;
}

/**
 * Entity Event Trigger Configuration.
 */
export interface TriggerConfiguration {
    /**
     * Number of Entities to process at once.
     */
    batchSize?: number;
    /**
     * Entity Type for which it should be triggered.
     */
    entityType: string;
    /**
     * Select the Search Filters to filter down the entities fetched.
     */
    filters: string;
    /**
     * Defines the schedule of the Periodic Trigger.
     */
    schedule: any[] | boolean | AppScheduleClass | number | number | null | string;
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
