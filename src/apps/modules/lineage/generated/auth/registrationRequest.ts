
/**
 * This schema defines the SMTP Settings for sending Email
 */
export interface RegistrationRequest {
    /**
     * Email address of the user.
     */
    email: string;
    /**
     * First Name
     */
    firstName: string;
    /**
     * Last Name
     */
    lastName: string;
    /**
     * Login Password
     */
    password: string;
}
