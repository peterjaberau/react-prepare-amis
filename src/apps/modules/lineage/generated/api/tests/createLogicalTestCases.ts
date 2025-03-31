
/**
 * Object used to create logical test cases.
 */
export interface CreateLogicalTestCases {
    /**
     * Ids of the test cases to create.
     */
    testCaseIds: string[];
    /**
     * TestSuite ID where we will be adding the test cases.
     */
    testSuiteId: string;
}
