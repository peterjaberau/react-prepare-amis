
/**
 * This schema defines Personal Access Token Schema.
 */
export interface PersonalAccessToken {
    /**
     * Expiry Date-Time of the token
     */
    expiryDate: number;
    /**
     * JWT Auth Token.
     */
    jwtToken?: string;
    /**
     * Unique Refresh Token for user
     */
    token: string;
    /**
     * Name of the token
     */
    tokenName?: string;
    /**
     * Token Type
     */
    tokenType?: TokenType;
    /**
     * User Id of the User this refresh token is given to
     */
    userId: string;
}

/**
 * Token Type
 *
 * Different Type of User token
 */
export enum TokenType {
    EmailVerification = "EMAIL_VERIFICATION",
    PasswordReset = "PASSWORD_RESET",
    PersonalAccessToken = "PERSONAL_ACCESS_TOKEN",
    RefreshToken = "REFRESH_TOKEN",
}
