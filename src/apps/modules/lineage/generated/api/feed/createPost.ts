
/**
 * Create post request
 */
export interface CreatePost {
    /**
     * Name of the User posting the message
     */
    from: string;
    /**
     * Message in Markdown format. See markdown support for more details.
     */
    message: string;
}
