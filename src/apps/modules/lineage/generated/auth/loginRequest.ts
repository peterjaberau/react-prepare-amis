
/**
 * This schema defines Email Verification Token Schema.
 */
export interface LoginRequest {
    /**
     * Login Email
     */
    email: string;
    /**
     * Login Password in base64 format
     */
    password: string;
}
