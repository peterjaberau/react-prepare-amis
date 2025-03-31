
/**
 * Governance Workflow Edge.
 */
export interface Edge {
    /**
     * Defines if the edge will follow a path depending on the source node result.
     */
    condition?: string;
    /**
     * Element from which the edge will start.
     */
    from: string;
    /**
     * Element on which the edge will end.
     */
    to: string;
}
