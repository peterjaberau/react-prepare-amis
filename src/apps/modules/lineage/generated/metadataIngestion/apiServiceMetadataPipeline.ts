
/**
 * ApiService Metadata Pipeline Configuration.
 */
export interface APIServiceMetadataPipeline {
    /**
     * Regex to only fetch api collections with names matching the pattern.
     */
    apiCollectionFilterPattern?: FilterPattern;
    /**
     * Optional configuration to soft delete api collections in OpenMetadata if the source
     * collections are deleted. Also, if the collection is deleted, all the associated entities
     * like endpoints, etc., with that collection will be deleted
     */
    markDeletedApiCollections?: boolean;
    /**
     * Set the 'Override Metadata' toggle to control whether to override the existing metadata
     * in the OpenMetadata server with the metadata fetched from the source. If the toggle is
     * set to true, the metadata fetched from the source will override the existing metadata in
     * the OpenMetadata server. If the toggle is set to false, the metadata fetched from the
     * source will not override the existing metadata in the OpenMetadata server. This is
     * applicable for fields like description, tags, owner and displayName
     */
    overrideMetadata?: boolean;
    /**
     * Pipeline type
     */
    type?: APIMetadataConfigType;
}

/**
 * Regex to only fetch api collections with names matching the pattern.
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
 * Pipeline type
 *
 * Api Source Config Metadata Pipeline type
 */
export enum APIMetadataConfigType {
    APIMetadata = "ApiMetadata",
}
