
/**
 * Persona entity
 */
export interface CreatePersona {
    /**
     * Optional description of the team.
     */
    description?: string;
    /**
     * Optional name used for display purposes. Example 'Data Steward'.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    name:    string;
    /**
     * Optional IDs of users that are going to assign a Persona.
     */
    users?: string[];
}
