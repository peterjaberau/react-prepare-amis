
/**
 * This schema defines the Asset Certification Settings.
 */
export interface AssetCertificationSettings {
    /**
     * Classification that can be used for certifications.
     */
    allowedClassification: string;
    /**
     * ISO 8601 duration for the validity period.
     */
    validityPeriod: string;
}
