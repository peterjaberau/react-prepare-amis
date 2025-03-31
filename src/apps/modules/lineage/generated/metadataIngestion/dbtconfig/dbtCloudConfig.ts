
/**
 * dbt Cloud configuration.
 */
export interface DbtCloudConfig {
    /**
     * dbt cloud account Id
     */
    dbtCloudAccountId: string;
    /**
     * dbt cloud account authentication token
     */
    dbtCloudAuthToken: string;
    /**
     * dbt cloud job id.
     */
    dbtCloudJobId?: string;
    /**
     * In case of multiple projects in a dbt cloud account, specify the project's id from which
     * you want to extract the dbt run artifacts
     */
    dbtCloudProjectId?: string;
    /**
     * URL to connect to your dbt cloud instance. E.g., https://cloud.getdbt.com or
     * https://emea.dbt.com/
     */
    dbtCloudUrl: string;
    /**
     * dbt Configuration type
     */
    dbtConfigType: DbtConfigType;
}

/**
 * dbt Configuration type
 */
export enum DbtConfigType {
    Cloud = "cloud",
}
