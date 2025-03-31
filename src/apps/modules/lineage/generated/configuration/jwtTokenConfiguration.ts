
/**
 * This schema defines the JWT Configuration.
 */
export interface JwtTokenConfiguration {
    /**
     * JWT Issuer
     */
    jwtissuer: string;
    /**
     * Key ID
     */
    keyId: string;
    /**
     * RSA Private Key File Path
     */
    rsaprivateKeyFilePath?: string;
    /**
     * RSA Public Key File Path
     */
    rsapublicKeyFilePath?: string;
}
