
/**
 * This schema defines type of table usage request used to publish the usage count on a
 * particular date
 */
export interface UsageRequest {
    /**
     * Usage count of table
     */
    count: number;
    /**
     * Date of execution of SQL query
     */
    date: string;
}
