
/**
 * Create bot API request
 */
export interface CreateBot {
    /**
     * Bot user name created for this bot on behalf of which the bot performs all the
     * operations, such as updating description, responding on the conversation threads, etc.
     */
    botUser: string;
    /**
     * Description of the bot.
     */
    description?: string;
    /**
     * Name used for display purposes. Example 'FirstName LastName'.
     */
    displayName?: string;
    /**
     * Fully qualified name of the domain the Table belongs to.
     */
    domain?: string;
    /**
     * Name of the bot.
     */
    name:      string;
    provider?: ProviderType;
}

/**
 * Type of provider of an entity. Some entities are provided by the `system`. Some are
 * entities created and provided by the `user`. Typically `system` provide entities can't be
 * deleted and can only be disabled.
 */
export enum ProviderType {
    System = "system",
    User = "user",
}
