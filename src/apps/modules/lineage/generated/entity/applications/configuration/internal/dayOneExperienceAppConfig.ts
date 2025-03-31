
/**
 * Configuration for the Day One Experience Flow.
 */
export interface DayOneExperienceAppConfig {
    /**
     * Whether the Day One Experience flow should be active or not.
     */
    active: boolean;
    /**
     * Service Entity Link for which to trigger the application.
     */
    entityLink?: string;
    /**
     * Application Type
     */
    type?: DayOneExperienceAppType;
}

/**
 * Application Type
 *
 * Application type.
 */
export enum DayOneExperienceAppType {
    DayOneExperienceApplication = "DayOneExperienceApplication",
}
