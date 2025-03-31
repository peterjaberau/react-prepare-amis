
/**
 * This schema defines Email Verification Token Schema.
 */
export interface PasswordResetRequest {
    /**
     * Confirm Password
     */
    confirmPassword?: string;
    /**
     * Password
     */
    password?: string;
    /**
     * Token
     */
    token?: string;
    /**
     * UserName
     */
    username: string;
}
