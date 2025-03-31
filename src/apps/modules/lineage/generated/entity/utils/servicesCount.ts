
/**
 * This schema defines Services Count. This contains aggregated services count.
 */
export interface ServicesCount {
    /**
     * Dashboard Service Count
     */
    dashboardServiceCount?: number;
    /**
     * Database Service Count
     */
    databaseServiceCount?: number;
    /**
     * Messaging Service Count
     */
    messagingServiceCount?: number;
    /**
     * MlModel Service Count
     */
    mlModelServiceCount?: number;
    /**
     * Pipeline Service Count
     */
    pipelineServiceCount?: number;
    /**
     * Storage Service Count
     */
    storageServiceCount?: number;
}
