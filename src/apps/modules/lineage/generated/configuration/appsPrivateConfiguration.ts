
/**
 * This schema defines a list of configurations for the Application Framework
 */
export interface AppsPrivateConfiguration {
    /**
     * List of configuration for apps
     */
    appsPrivateConfiguration: AppPrivateConfig[];
}

/**
 * Single Application Configuration Definition
 */
export interface AppPrivateConfig {
    /**
     * Application Name
     */
    name: string;
    /**
     * Parameters to initialize the Applications.
     */
    parameters: { [key: string]: any };
    /**
     * Flag to enable/disable preview for the application. If the app is in preview mode, it
     * can't be installed.
     */
    preview?:  boolean;
    schedule?: any[] | boolean | AppScheduleClass | number | number | null | string;
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
