
/**
 * Object to send Status responses about your Ingestion Pipelines ops.
 */
export interface PipelineServiceClientResponse {
    /**
     * Status code
     */
    code: number;
    /**
     * Orchestration platform used by the Pipeline Service Client.
     */
    platform: string;
    /**
     * Extra information to be sent back to the client, such as error traces.
     */
    reason?: string;
    /**
     * Ingestion version being used.
     */
    version?: string;
}
