
/**
 * App Extension Object.
 */
export interface AppExtension {
    /**
     * Unique identifier of this application.
     */
    appId: string;
    /**
     * Name of the application.
     */
    appName:   string;
    extension: ExtensionType;
    /**
     * Start of the job status.
     */
    timestamp?: number;
    [property: string]: any;
}

/**
 * Extension type.
 */
export enum ExtensionType {
    Custom = "custom",
    Limits = "limits",
    Status = "status",
}
