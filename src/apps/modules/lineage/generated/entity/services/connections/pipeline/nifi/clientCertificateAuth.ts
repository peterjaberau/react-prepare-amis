
/**
 * Configuration for connecting to Nifi Client Certificate Auth.
 */
export interface ClientCertificateAuth {
    /**
     * Path to the root CA certificate
     */
    certificateAuthorityPath?: string;
    /**
     * Path to the client certificate
     */
    clientCertificatePath?: string;
    /**
     * Path to the client key
     */
    clientkeyPath?: string;
}
