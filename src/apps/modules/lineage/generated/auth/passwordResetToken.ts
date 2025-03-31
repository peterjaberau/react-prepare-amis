
/**
 * This schema defines Password Verification Token Schema.
 */
export interface PasswordResetToken {
    /**
     * Expiry Date-Time of the token
     */
    expiryDate: number;
    /**
     * Expiry Date-Time of the token
     */
    isActive?: boolean;
    /**
     * Expiry Date-Time of the token
     */
    isClaimed?: boolean;
    /**
     * Unique Refresh Token for user
     */
    token: string;
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
