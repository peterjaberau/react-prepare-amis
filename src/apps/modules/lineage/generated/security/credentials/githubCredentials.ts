
/**
 * Credentials for a GitHub repository
 */
export interface GithubCredentials {
    repositoryName:  string;
    repositoryOwner: string;
    token?:          string;
    /**
     * Credentials Type
     */
    type?: GithubType;
}

/**
 * Credentials Type
 *
 * GitHub Credentials type
 */
export enum GithubType {
    GitHub = "GitHub",
}
