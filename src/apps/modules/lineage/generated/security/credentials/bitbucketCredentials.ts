
/**
 * Credentials for a BitBucket repository
 */
export interface BitbucketCredentials {
    /**
     * Main production branch of the repository. E.g., `main`
     */
    branch:          string;
    repositoryName:  string;
    repositoryOwner: string;
    token?:          string;
    /**
     * Credentials Type
     */
    type?: BitbucketType;
}

/**
 * Credentials Type
 *
 * BitBucket Credentials type
 */
export enum BitbucketType {
    BitBucket = "BitBucket",
}
