
/**
 * This schema defines Event Publisher Run Result.
 */
export interface CreateEventPublisherJob {
    /**
     * Provide After in case of failure to start reindexing after the issue is solved
     */
    afterCursor?: string;
    /**
     * Maximum number of events sent in a batch (Default 100).
     */
    batchSize?: number;
    /**
     * List of Entities to Reindex
     */
    entities?: string[];
    /**
     * Name of the result
     */
    name?: string;
    /**
     * Publisher Type
     */
    publisherType?: PublisherType;
    /**
     * This schema publisher run modes.
     */
    recreateIndex?: boolean;
    /**
     * This schema publisher run modes.
     */
    runMode?: RunMode;
    /**
     * Recreate Indexes with updated Language
     */
    searchIndexMappingLanguage?: SearchIndexMappingLanguage;
}

/**
 * Publisher Type
 *
 * This schema event Publisher Types
 */
export enum PublisherType {
    ElasticSearch = "elasticSearch",
    Kafka = "kafka",
}

/**
 * This schema publisher run modes.
 */
export enum RunMode {
    Batch = "batch",
    Stream = "stream",
}

/**
 * Recreate Indexes with updated Language
 *
 * This schema defines the language options available for search index mappings.
 */
export enum SearchIndexMappingLanguage {
    En = "EN",
    Jp = "JP",
    Zh = "ZH",
}
