
/**
 * This schema defines Email Verification Token Schema.
 */
export interface EmailVerificationToken {
    /**
     * Expiry Date-Time of the token
     */
    expiryDate: number;
    /**
     * Unique Refresh Token for user
     */
    token: string;
    /**
     * Refresh Count
     */
    tokenStatus: TokenStatus;
    /**
     * Token Type
     */
    tokenType: TokenType;
    /**
     * User this email Verification token is given to
     */
    userId: string;
}

/**
 * Refresh Count
 */
export enum TokenStatus {
    StatusConfirmed = "STATUS_CONFIRMED",
    StatusPending = "STATUS_PENDING",
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
