
/**
 * Remove Test Cases Action Type
 */
export interface RemoveTestCaseAction {
    /**
     * Remove tests to the selected table columns
     */
    applyToChildren?: string[];
    /**
     * Remove all test cases
     */
    removeAll?: boolean;
    /**
     * Test Cases to remove
     */
    testCaseDefinitions?: string[];
    /**
     * Application Type
     */
    type: RemoveTestCaseActionType;
}

/**
 * Application Type
 *
 * Remove Test Case Action Type
 */
export enum RemoveTestCaseActionType {
    RemoveTestCaseAction = "RemoveTestCaseAction",
}
