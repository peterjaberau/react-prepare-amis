
/**
 * DBT Catalog, Manifest and Run Results file path config.
 */
export interface DbtLocalConfig {
    /**
     * DBT catalog file path to extract dbt models with their column schemas.
     */
    dbtCatalogFilePath?: string;
    /**
     * dbt Configuration type
     */
    dbtConfigType: DbtConfigType;
    /**
     * DBT manifest file path to extract dbt models and associate with tables.
     */
    dbtManifestFilePath: string;
    /**
     * DBT run results file path to extract the test results information.
     */
    dbtRunResultsFilePath?: string;
    /**
     * DBT sources file path to extract the freshness test result.
     */
    dbtSourcesFilePath?: string;
}

/**
 * dbt Configuration type
 */
export enum DbtConfigType {
    Local = "local",
}
