
/**
 * Oidc client security configs.
 */
export interface OidcClientConfig {
    /**
     * Callback Url.
     */
    callbackUrl?: string;
    /**
     * Client Authentication Method.
     */
    clientAuthenticationMethod?: ClientAuthenticationMethod;
    /**
     * Custom Params.
     */
    customParams?: { [key: string]: any };
    /**
     * Disable PKCE.
     */
    disablePkce?: boolean;
    /**
     * Discovery Uri for the Client.
     */
    discoveryUri?: string;
    /**
     * Client ID.
     */
    id?: string;
    /**
     * Max Clock Skew
     */
    maxClockSkew?: string;
    /**
     * Preferred Jws Algorithm.
     */
    preferredJwsAlgorithm?: string;
    /**
     * Auth0 Client Secret Key.
     */
    responseType?: string;
    /**
     * Oidc Request Scopes.
     */
    scope?: string;
    /**
     * Client Secret.
     */
    secret?: string;
    /**
     * Server Url.
     */
    serverUrl?: string;
    /**
     * Tenant in case of Azure.
     */
    tenant?: string;
    /**
     * Validity for the JWT Token created from SAML Response
     */
    tokenValidity?: number;
    /**
     * IDP type (Example Google,Azure).
     */
    type?: string;
    /**
     * Use Nonce.
     */
    useNonce?: string;
}

/**
 * Client Authentication Method.
 */
export enum ClientAuthenticationMethod {
    ClientSecretBasic = "client_secret_basic",
    ClientSecretJwt = "client_secret_jwt",
    ClientSecretPost = "client_secret_post",
    PrivateKeyJwt = "private_key_jwt",
}
