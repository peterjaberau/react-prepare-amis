
/**
 * Credentials for a Gitlab repository
 */
export interface GitlabCredentials {
    repositoryName:  string;
    repositoryOwner: string;
    token?:          string;
    /**
     * Credentials Type
     */
    type?: GitlabType;
}

/**
 * Credentials Type
 *
 * Gitlab Credentials type
 */
export enum GitlabType {
    Gitlab = "Gitlab",
}
