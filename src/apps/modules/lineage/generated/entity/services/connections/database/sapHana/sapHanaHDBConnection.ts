
/**
 * Sap Hana Database HDB User Store Connection Config
 */
export interface SapHanaHDBConnection {
    /**
     * HDB Store User Key generated from the command `hdbuserstore SET <KEY> <host:port>
     * <USERNAME> <PASSWORD>`
     */
    userKey?: string;
}
