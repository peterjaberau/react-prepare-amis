
/**
 * Schema defining email templates.
 */
export interface TemplateValidationReponse {
    /**
     * List of additional placeholders.
     */
    additionalPlaceholder?: string[];
    /**
     * Flag indicating if the template is valid.
     */
    isValid?: boolean;
    /**
     * Validation message.
     */
    message?: string;
    /**
     * List of missing placeholders.
     */
    missingPlaceholder?: string[];
}
