
/**
 * This schema defines the Kafka Event Publisher Configuration.
 */
export interface KafkaEventConfiguration {
    /**
     * Acknowledgment
     */
    acks?: string;
    /**
     * Buffer Memory
     */
    bufferMemory?: number;
    /**
     * Serializer class for key
     */
    keySerializer?: string;
    /**
     * Artificial Delay in milliseconds
     */
    lingerMS?: number;
    /**
     * No. of retries
     */
    retries?: number;
    /**
     * Kafka security protocol config
     */
    securityProtocol?: SecurityProtocol;
    /**
     * Kafka SSL key password
     */
    SSLKeyPassword?: string;
    /**
     * Kafka SSL keystore location
     */
    SSLKeystoreLocation?: string;
    /**
     * Kafka SSL keystore password
     */
    SSLKeystorePassword?: string;
    /**
     * Kafka SSL protocol config
     */
    SSLProtocol?: string;
    /**
     * Kafka SSL truststore location
     */
    SSLTrustStoreLocation?: string;
    /**
     * Kafka SSL truststore password
     */
    SSLTrustStorePassword?: string;
    /**
     * Topics of Kafka Producer
     */
    topics: string[];
    /**
     * Serializer class for value
     */
    valueSerializer?: string;
}

/**
 * Kafka security protocol config
 */
export enum SecurityProtocol {
    Plaintext = "PLAINTEXT",
    SSL = "SSL",
}
