
/**
 * Refined data for overview report
 */
export interface WebAnalyticUserActivityReportData {
    /**
     * latest session
     */
    lastSession?: number;
    /**
     * the team the user belongs to
     */
    team?: string;
    /**
     * total user count
     */
    totalPageView?: number;
    /**
     * total user count
     */
    totalSessionDuration?: number;
    /**
     * total number of sessions
     */
    totalSessions?: number;
    /**
     * user ID in OM
     */
    userId?: string;
    /**
     * user name
     */
    userName?: string;
}
