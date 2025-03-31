
/**
 * Parallel Gateway. It should be used when we want to Parallelize or sync back Parallelized
 * tasks.
 */
export interface ParallelGateway {
    /**
     * Description of the Node.
     */
    description?: string;
    /**
     * Display Name that identifies this Node.
     */
    displayName?: string;
    /**
     * Name that identifies this Node.
     */
    name?:    string;
    subType?: string;
    type?:    string;
    [property: string]: any;
}
