
/**
 * Resolve Task request
 */
export interface ResolveTask {
    /**
     * The new value object that needs to be updated to resolve the task.
     */
    newValue: string;
    /**
     * Reason of Test Case resolution.
     */
    testCaseFailureReason?: TestCaseFailureReasonType;
    /**
     * Fully qualified name of the test case.
     */
    testCaseFQN?: string;
}

/**
 * Reason of Test Case resolution.
 *
 * Reason of Test Case initial failure.
 */
export enum TestCaseFailureReasonType {
    Duplicates = "Duplicates",
    FalsePositive = "FalsePositive",
    MissingData = "MissingData",
    Other = "Other",
    OutOfBounds = "OutOfBounds",
}
