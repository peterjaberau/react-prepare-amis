
/**
 * This schema defines Event Publisher Job.
 */
export interface EventPublisherJob {
    /**
     * Provide After in case of failure to start reindexing after the issue is solved
     */
    afterCursor?: string;
    /**
     * Maximum number of events sent in a batch (Default 10).
     */
    batchSize?: number;
    /**
     * Number of consumer threads to use for reindexing
     */
    consumerThreads?: number;
    /**
     * List of Entities to Reindex
     */
    entities?: string[];
    /**
     * Failure for the job
     */
    failure?: IndexingAppError;
    /**
     * Initial backoff time in milliseconds
     */
    initialBackoff?: number;
    /**
     * Maximum backoff time in milliseconds
     */
    maxBackoff?: number;
    /**
     * Maximum number of concurrent requests to the search index
     */
    maxConcurrentRequests?: number;
    /**
     * Maximum number of retries for a failed request
     */
    maxRetries?: number;
    /**
     * Name of the result
     */
    name?: string;
    /**
     * Payload size in bytes depending on config.
     */
    payLoadSize?: number;
    /**
     * Number of producer threads to use for reindexing
     */
    producerThreads?: number;
    /**
     * Queue Size to use internally for reindexing.
     */
    queueSize?: number;
    /**
     * This schema publisher run modes.
     */
    recreateIndex?: boolean;
    /**
     * Recreate Indexes with updated Language
     */
    searchIndexMappingLanguage?: SearchIndexMappingLanguage;
    stats?:                      Stats;
    /**
     * This schema publisher run job status.
     */
    status:    Status;
    timestamp: number;
}

/**
 * Failure for the job
 *
 * This schema defines Event Publisher Job Error Schema.
 */
export interface IndexingAppError {
    errorSource?:      ErrorSource;
    failedCount?:      number;
    failedEntities?:   EntityError[];
    lastFailedCursor?: string;
    message?:          string;
    reason?:           string;
    stackTrace?:       string;
    submittedCount?:   number;
    successCount?:     number;
}

export enum ErrorSource {
    Job = "Job",
    Processor = "Processor",
    Reader = "Reader",
    Sink = "Sink",
}

/**
 * Entity And Message Scehma in case of failures.
 */
export interface EntityError {
    entity?:  any;
    message?: string;
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

export interface Stats {
    entityStats?: StepStats;
    jobStats?:    StepStats;
}

/**
 * Stats for Different Steps Reader, Processor, Writer.
 */
export interface StepStats {
    /**
     * Count of Total Failed Records
     */
    failedRecords?: number;
    /**
     * Count of Total Successfully Records
     */
    successRecords?: number;
    /**
     * Count of Total Failed Records
     */
    totalRecords?: number;
    [property: string]: any;
}

/**
 * This schema publisher run job status.
 */
export enum Status {
    Active = "active",
    ActiveError = "activeError",
    Completed = "completed",
    Failed = "failed",
    Running = "running",
    Started = "started",
    StopInProgress = "stopInProgress",
    Stopped = "stopped",
    Success = "success",
}
