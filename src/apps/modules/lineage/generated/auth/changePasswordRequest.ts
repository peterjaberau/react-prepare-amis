
/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
    /**
     * Name of the column in a table.
     */
    confirmPassword: string;
    /**
     * Name of the column in a table.
     */
    newPassword: string;
    /**
     * Name that identifies this Custom Metric.
     */
    oldPassword?: string;
    /**
     * Name of the column in a table.
     */
    requestType?: RequestType;
    /**
     * Name of the user
     */
    username?: string;
}

/**
 * Name of the column in a table.
 */
export enum RequestType {
    Self = "SELF",
    User = "USER",
}
