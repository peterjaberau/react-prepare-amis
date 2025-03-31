
/**
 * Creates and Runs an Ingestion Pipeline
 */
export interface CreateAndRunIngestionPipelineTask {
    branches?: string[];
    config?:   Config;
    /**
     * Description of the Node.
     */
    description?: string;
    /**
     * Display Name that identifies this Node.
     */
    displayName?:       string;
    input?:             string[];
    inputNamespaceMap?: InputNamespaceMap;
    /**
     * Name that identifies this Node.
     */
    name?:    string;
    subType?: string;
    type?:    string;
    [property: string]: any;
}

export interface Config {
    /**
     * Define which ingestion pipeline type should be created
     */
    pipelineType: PipelineType;
    /**
     * If True, it will be created and run. Otherwise it will just be created.
     */
    shouldRun?: boolean;
    /**
     * Set the amount of seconds to wait before defining the Ingestion Pipeline has timed out.
     */
    timeoutSeconds: number;
    /**
     * Set if this step should wait until the Ingestion Pipeline finishes running
     */
    waitForCompletion: boolean;
}

/**
 * Define which ingestion pipeline type should be created
 *
 * Type of Pipeline - metadata, usage
 */
export enum PipelineType {
    Application = "application",
    AutoClassification = "autoClassification",
    DataInsight = "dataInsight",
    Dbt = "dbt",
    ElasticSearchReindex = "elasticSearchReindex",
    Lineage = "lineage",
    Metadata = "metadata",
    Profiler = "profiler",
    TestSuite = "TestSuite",
    Usage = "usage",
}

export interface InputNamespaceMap {
    relatedEntity: string;
}
