
/**
 * This schema defines the Theme Configuration for UI elements.
 */
export interface ThemeConfiguration {
    /**
     * Color used to indicate errors in the UI, in hex code format or empty
     */
    errorColor: string;
    /**
     * Color used for informational messages in the UI, in hex code format or empty
     */
    infoColor: string;
    /**
     * Primary color used in the UI, in hex code format or empty.
     */
    primaryColor: string;
    /**
     * Color used to indicate success in the UI, in hex code format or empty
     */
    successColor: string;
    /**
     * Color used to indicate warnings in the UI, in hex code format or empty
     */
    warningColor: string;
}
