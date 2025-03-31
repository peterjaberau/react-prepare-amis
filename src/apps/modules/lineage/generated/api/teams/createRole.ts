
/**
 * Request for creating a Role entity
 */
export interface CreateRole {
    /**
     * Optional description of the role
     */
    description?: string;
    /**
     * Optional name used for display purposes. Example 'Data Consumer'
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    name:    string;
    /**
     * Policies that is attached to this role. At least one policy is required.
     */
    policies: string[];
}
