
/**
 * Defines a Task for a given User to approve.
 */
export interface UserApprovalTask {
    branches?: string[];
    config?:   NodeConfiguration;
    /**
     * Description of the Node.
     */
    description?: string;
    /**
     * Display Name that identifies this Node.
     */
    displayName?:       string;
    input?:             string[];
    inputNamespaceMap?: InputNamespaceMap;
    /**
     * Name that identifies this Node.
     */
    name?:    string;
    output?:  string[];
    subType?: string;
    type?:    string;
    [property: string]: any;
}

export interface NodeConfiguration {
    /**
     * People/Teams assigned to the Task.
     */
    assignees: Assignees;
}

/**
 * People/Teams assigned to the Task.
 */
export interface Assignees {
    /**
     * Add the Reviewers to the assignees List.
     */
    addReviewers?: boolean;
    [property: string]: any;
}

export interface InputNamespaceMap {
    relatedEntity: string;
}
