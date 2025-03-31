
/**
 * This schema defines the Login Configuration
 */
export interface LoginConfiguration {
    /**
     * Access Block time for user on exceeding failed attempts(in seconds)
     */
    accessBlockTime?: number;
    /**
     * Jwt Token Expiry time for login in seconds
     */
    jwtTokenExpiryTime?: number;
    /**
     * Failed Login Attempts allowed for user.
     */
    maxLoginFailAttempts?: number;
}
