
/**
 * Sets the GlossaryTerm Status to the configured value.
 */
export interface SetGlossaryTermStatusTask {
    config?: NodeConfiguration;
    /**
     * Description of the Node.
     */
    description?: string;
    /**
     * Display Name that identifies this Node.
     */
    displayName?:       string;
    input?:             string[];
    inputNamespaceMap?: InputNamespaceMap;
    /**
     * Name that identifies this Node.
     */
    name?:    string;
    subType?: string;
    type?:    string;
    [property: string]: any;
}

export interface NodeConfiguration {
    /**
     * Choose which Status to apply to the Glossary Term
     */
    glossaryTermStatus: Status;
}

/**
 * Choose which Status to apply to the Glossary Term
 */
export enum Status {
    Approved = "Approved",
    Deprecated = "Deprecated",
    Draft = "Draft",
    InReview = "In Review",
    Rejected = "Rejected",
}

export interface InputNamespaceMap {
    relatedEntity: string;
    updatedBy?:    string;
}
