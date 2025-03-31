
/**
 * Sets the Entity Certification to the configured value.
 */
export interface SetEntityCertificationTask {
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
     * Choose which Certification to apply to the Data Asset
     */
    certification: CertificationEnum;
}

/**
 * Choose which Certification to apply to the Data Asset
 */
export enum CertificationEnum {
    CertificationBronze = "Certification.Bronze",
    CertificationGold = "Certification.Gold",
    CertificationSilver = "Certification.Silver",
    Empty = "",
}

export interface InputNamespaceMap {
    relatedEntity: string;
    updatedBy?:    string;
}
