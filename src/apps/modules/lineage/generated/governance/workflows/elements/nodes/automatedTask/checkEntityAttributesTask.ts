
/**
 * Checks if an Entity attributes fit given rules.
 */
export interface CheckEntityAttributesTask {
    branches?: string[];
    config?:   NodeConfiguration;
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
     * Define certain set of rules that you would like to check. If all the rules apply, this
     * will be set as 'True' and will continue through the positive flow. Otherwise it will be
     * set to 'False' and continue through the negative flow.
     */
    rules?: string;
}

export interface InputNamespaceMap {
    relatedEntity: string;
}
