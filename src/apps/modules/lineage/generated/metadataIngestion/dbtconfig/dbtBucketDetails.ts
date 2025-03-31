
/**
 * Details of the bucket where the dbt files are stored
 */
export interface DbtBucketDetails {
    /**
     * Name of the bucket where the dbt files are stored
     */
    dbtBucketName?: string;
    /**
     * Path of the folder where the dbt files are stored
     */
    dbtObjectPrefix?: string;
}
