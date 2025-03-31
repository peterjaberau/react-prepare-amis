
/**
 * SearchService Metadata Pipeline Configuration.
 */
export interface SearchServiceMetadataPipeline {
    /**
     * Enable the 'Include Index Template' toggle to manage the ingestion of index template data.
     */
    includeIndexTemplate?: boolean;
    /**
     * Optional configuration to turn off fetching sample data for search index.
     */
    includeSampleData?: boolean;
    /**
     * Optional configuration to soft delete search indexes in OpenMetadata if the source search
     * indexes are deleted. Also, if the search index is deleted, all the associated entities
     * like lineage, etc., with that search index will be deleted
     */
    markDeletedSearchIndexes?: boolean;
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
     * No. of records of sample data we want to ingest.
     */
    sampleSize?: number;
    /**
     * Regex to only fetch search indexes that matches the pattern.
     */
    searchIndexFilterPattern?: FilterPattern;
    /**
     * Pipeline type
     */
    type?: SearchMetadataConfigType;
}

/**
 * Regex to only fetch search indexes that matches the pattern.
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
 * Search Source Config Metadata Pipeline type
 */
export enum SearchMetadataConfigType {
    SearchMetadata = "SearchMetadata",
}
