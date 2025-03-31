
/**
 * Schema defining email templates.
 */
export interface EmailTemplate {
    /**
     * List of placeholders.
     */
    placeHolders: EmailTemplatePlaceholder[];
    /**
     * Template data.
     */
    template: string;
}

/**
 * Schema defining placeholders used in email templates.
 */
export interface EmailTemplatePlaceholder {
    /**
     * Description of what this placeholder represents.
     */
    description: string;
    /**
     * Name of the placeholder.
     */
    name: string;
}
