
/**
 * This schema defines Logout Request.
 */
export interface LogoutRequest {
    /**
     * Logout Time
     */
    logoutTime?: Date;
    /**
     * Refresh Token
     */
    refreshToken?: string;
    /**
     * Token To be Expired
     */
    token: string;
    /**
     * Logout Username
     */
    username?: string;
}
