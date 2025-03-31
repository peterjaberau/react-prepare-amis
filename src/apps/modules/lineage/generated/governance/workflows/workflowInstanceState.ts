
/**
 * Defines a workflow instance.
 */
export interface WorkflowInstanceState {
    exception?: string;
    /**
     * Unique identifier of this workflow instance state.
     */
    id?:     string;
    stage?:  Stage;
    status?: WorkflowStatus;
    /**
     * Timestamp on which the workflow instance state was created.
     */
    timestamp?: number;
    /**
     * Workflow Definition Reference.
     */
    workflowDefinitionId?: string;
    /**
     * One WorkflowInstance might execute a flow multiple times. This ID groups together the
     * States of one of those flows.
     */
    workflowInstanceExecutionId?: string;
    /**
     * Workflow Instance ID.
     */
    workflowInstanceId?: string;
}

export interface Stage {
    /**
     * Timestamp on which the workflow instance stage ended.
     */
    endedAt?: number;
    name?:    string;
    /**
     * Timestamp on which the workflow instance stage started.
     */
    startedAt?: number;
    tasks?:     string[];
    variables?: { [key: string]: any };
}

export enum WorkflowStatus {
    Exception = "EXCEPTION",
    Failure = "FAILURE",
    Finished = "FINISHED",
    Running = "RUNNING",
}
