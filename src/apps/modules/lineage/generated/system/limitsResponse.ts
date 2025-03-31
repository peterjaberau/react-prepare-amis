
/**
 * Limits Config schema
 */
export interface LimitsResponse {
    /**
     * Limits Enabled
     */
    enable?: boolean;
    /**
     * Limits
     */
    limits?: { [key: string]: any };
}
