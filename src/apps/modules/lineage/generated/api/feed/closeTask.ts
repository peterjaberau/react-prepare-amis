
/**
 * Close Task request
 */
export interface CloseTask {
    /**
     * The closing comment explaining why the task is being closed.
     */
    comment: string;
    /**
     * Fully qualified name of the test case.
     */
    testCaseFQN?: string;
}
