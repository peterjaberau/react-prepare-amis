
/**
 * Define the system validation response
 */
export interface ValidationResponse {
    /**
     * Database connectivity check
     */
    database?: StepValidation;
    /**
     * JWKs validation
     */
    jwks?: StepValidation;
    /**
     * List migration results
     */
    migrations?: StepValidation;
    /**
     * Pipeline Service Client connectivity check
     */
    pipelineServiceClient?: StepValidation;
    /**
     * Search instance connectivity check
     */
    searchInstance?: StepValidation;
}

/**
 * Database connectivity check
 *
 * JWKs validation
 *
 * List migration results
 *
 * Pipeline Service Client connectivity check
 *
 * Search instance connectivity check
 */
export interface StepValidation {
    /**
     * Validation description. What is being tested?
     */
    description?: string;
    /**
     * Results or exceptions to be shared after running the test.
     */
    message?: string;
    /**
     * Did the step validation successfully?
     */
    passed?: boolean;
}
