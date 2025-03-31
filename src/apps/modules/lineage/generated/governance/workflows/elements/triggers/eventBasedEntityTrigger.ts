
/**
 * Event Based Entity Trigger.
 */
export interface EventBasedEntityTrigger {
    config?: TriggerConfiguration;
    output?: string[];
    type?:   string;
}

/**
 * Entity Event Trigger Configuration.
 */
export interface TriggerConfiguration {
    /**
     * Entity Type for which it should be triggered.
     */
    entityType: string;
    events:     Event[];
    /**
     * Select fields that should not trigger the workflow if only them are modified.
     */
    exclude?: string[];
}

/**
 * Event for which it should be triggered.
 */
export enum Event {
    Created = "Created",
    Updated = "Updated",
}
