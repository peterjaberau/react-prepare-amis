
/**
 * Defines a workflow instance.
 */
export interface WorkflowInstance {
    /**
     * Timestamp on which the workflow instance ended.
     */
    endedAt?:   number;
    exception?: string;
    /**
     * Unique identifier of this workflow instance state.
     */
    id?: string;
    /**
     * Timestamp on which the workflow instance started.
     */
    startedAt?: number;
    status?:    WorkflowStatus;
    /**
     * Timestamp on which the workflow instance state was created.
     */
    timestamp?: number;
    variables?: { [key: string]: any };
    /**
     * Workflow Definition Id.
     */
    workflowDefinitionId?: string;
}

export enum WorkflowStatus {
    Exception = "EXCEPTION",
    Failure = "FAILURE",
    Finished = "FINISHED",
    Running = "RUNNING",
}
