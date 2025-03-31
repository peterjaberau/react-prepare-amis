
/**
 * Live Execution object.
 */
export interface LiveExecutionContext {
    /**
     * If Live Execution is enabled
     */
    enabled?: boolean;
    /**
     * Resource full classname to register to extend any endpoints.
     */
    resources?: string[];
    [property: string]: any;
}
