
/**
 * OpenMetadata server configuration for the Secrets Manager feature.
 */
export interface SecretsManagerConfiguration {
    /**
     * Extra parameters used by the Secrets Manager implementation.
     */
    parameters?: { [key: string]: any };
    /**
     * Prefix to be added to the secret key ID: `/<prefix>/<clusterName>/<key>`
     */
    prefix?: string;
    /**
     * OpenMetadata Secrets Manager Provider. Make sure to configure the same secrets manager
     * providers as the ones configured on the OpenMetadata server.
     */
    secretsManager?: SecretsManagerProvider;
    /**
     * Add tags to the created resource, e.g., in AWS. Format is `[key1:value1,key2:value2,...]`
     */
    tags?: string[];
}

/**
 * OpenMetadata Secrets Manager Provider. Make sure to configure the same secrets manager
 * providers as the ones configured on the OpenMetadata server.
 */
export enum SecretsManagerProvider {
    Aws = "aws",
    AwsSsm = "aws-ssm",
    AzureKv = "azure-kv",
    DB = "db",
    Gcp = "gcp",
    InMemory = "in-memory",
    ManagedAws = "managed-aws",
    ManagedAwsSsm = "managed-aws-ssm",
    ManagedAzureKv = "managed-azure-kv",
}
