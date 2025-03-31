
/**
 * Add Test Cases to the selected assets.
 */
export interface AddTestCaseAction {
    /**
     * Add tests to the selected table columns
     */
    applyToChildren?: string[];
    /**
     * Update the test even if it is defined in the asset. By default, we will only apply the
     * test to assets without the existing test already existing.
     */
    overwriteMetadata?: boolean;
    /**
     * Test Cases to apply
     */
    testCases: TestCaseDefinitions[];
    /**
     * Application Type
     */
    type: AddTestCaseActionType;
}

/**
 * Minimum set of requirements to get a Test Case request ready
 */
export interface TestCaseDefinitions {
    /**
     * Compute the passed and failed row count for the test case.
     */
    computePassedFailedRowCount?: boolean;
    parameterValues?:             TestCaseParameterValue[];
    /**
     * Fully qualified name of the test definition.
     */
    testDefinition?: string;
    /**
     * If the test definition supports it, use dynamic assertion to evaluate the test case.
     */
    useDynamicAssertion?: boolean;
    [property: string]: any;
}

/**
 * This schema defines the parameter values that can be passed for a Test Case.
 */
export interface TestCaseParameterValue {
    /**
     * name of the parameter. Must match the parameter names in testCaseParameterDefinition
     */
    name?: string;
    /**
     * value to be passed for the Parameters. These are input from Users. We capture this in
     * string and convert during the runtime.
     */
    value?: string;
    [property: string]: any;
}

/**
 * Application Type
 *
 * Add Test Case Action Type.
 */
export enum AddTestCaseActionType {
    AddTestCaseAction = "AddTestCaseAction",
}
