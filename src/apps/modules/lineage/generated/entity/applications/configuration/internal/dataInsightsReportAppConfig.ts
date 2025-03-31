
export interface DataInsightsReportAppConfigClass {
    sendToAdmins?: boolean;
    sendToTeams?:  boolean;
    /**
     * Application Type
     */
    type?: DataInsightsReportAppType;
}

/**
 * Application Type
 *
 * Application type.
 */
export enum DataInsightsReportAppType {
    DataInsightsReport = "DataInsightsReport",
}
