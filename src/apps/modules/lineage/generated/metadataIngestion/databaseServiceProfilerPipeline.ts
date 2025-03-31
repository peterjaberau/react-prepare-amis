
/**
 * DatabaseService Profiler Pipeline Configuration.
 */
export interface DatabaseServiceProfilerPipeline {
    /**
     * Regex to only compute metrics for table that matches the given tag, tiers, gloassary
     * pattern.
     */
    classificationFilterPattern?: FilterPattern;
    /**
     * Option to turn on/off column metric computation. If enabled, profiler will compute column
     * level metrics.
     */
    computeColumnMetrics?: boolean;
    /**
     * Option to turn on/off computing profiler metrics.
     */
    computeMetrics?: boolean;
    /**
     * Option to turn on/off table metric computation. If enabled, profiler will compute table
     * level metrics.
     */
    computeTableMetrics?: boolean;
    /**
     * Regex to only fetch databases that matches the pattern.
     */
    databaseFilterPattern?: FilterPattern;
    /**
     * Optional configuration to turn off fetching metadata for views.
     */
    includeViews?: boolean;
    /**
     * Percentage of data or no. of rows used to compute the profiler metrics and run data
     * quality tests
     */
    profileSample?:     number;
    profileSampleType?: ProfileSampleType;
    /**
     * Whether to randomize the sample data or not.
     */
    randomizedSample?:   boolean;
    samplingMethodType?: SamplingMethodType;
    /**
     * Regex to only fetch tables or databases that matches the pattern.
     */
    schemaFilterPattern?: FilterPattern;
    /**
     * Regex exclude tables or databases that matches the pattern.
     */
    tableFilterPattern?: FilterPattern;
    /**
     * Number of threads to use during metric computations
     */
    threadCount?: number;
    /**
     * Profiler Timeout in Seconds
     */
    timeoutSeconds?: number;
    /**
     * Pipeline type
     */
    type?: ProfilerConfigType;
    /**
     * Regex will be applied on fully qualified name (e.g
     * service_name.db_name.schema_name.table_name) instead of raw name (e.g. table_name)
     */
    useFqnForFiltering?: boolean;
    /**
     * Use system tables to extract metrics. Metrics that cannot be gathered from system tables
     * will use the default methods. Using system tables can be faster but requires gathering
     * statistics before running (for example using the ANALYZE procedure). More information can
     * be found in the documentation: https://docs.openmetadata.org/latest/profler
     */
    useStatistics?: boolean;
}

/**
 * Regex to only compute metrics for table that matches the given tag, tiers, gloassary
 * pattern.
 *
 * Regex to only fetch entities that matches the pattern.
 *
 * Regex to only fetch databases that matches the pattern.
 *
 * Regex to only fetch tables or databases that matches the pattern.
 *
 * Regex exclude tables or databases that matches the pattern.
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
 * Type of Profile Sample (percentage or rows)
 */
export enum ProfileSampleType {
    Percentage = "PERCENTAGE",
    Rows = "ROWS",
}

/**
 * Type of Sampling Method (BERNOULLI or SYSTEM)
 */
export enum SamplingMethodType {
    Bernoulli = "BERNOULLI",
    System = "SYSTEM",
}

/**
 * Pipeline type
 *
 * Profiler Source Config Pipeline type
 */
export enum ProfilerConfigType {
    Profiler = "Profiler",
}
