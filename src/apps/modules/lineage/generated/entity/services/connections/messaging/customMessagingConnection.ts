
/**
 * Custom Messaging Service Connection to build a source that is not supported by
 * OpenMetadata yet.
 */
export interface CustomMessagingConnection {
    connectionOptions?: { [key: string]: string };
    /**
     * Source Python Class Name to instantiated by the ingestion workflow
     */
    sourcePythonClass?: string;
    /**
     * Regex to only fetch topics that matches the pattern.
     */
    topicFilterPattern?: FilterPattern;
    /**
     * Custom messaging service type
     */
    type: ServiceType;
}

/**
 * Regex to only fetch topics that matches the pattern.
 *
 * Regex to only fetch entities that matches the pattern.
 */
export interface FilterPattern {
    /**
     * List of strings/regex patterns to match and exclude only database entities that match.
     */
    excludes?: string[];
    /**
     * List of strings/regex patterns to match and include only database entities that match.
     */
    includes?: string[];
}

/**
 * Custom messaging service type
 */
export enum ServiceType {
    CustomMessaging = "CustomMessaging",
}
