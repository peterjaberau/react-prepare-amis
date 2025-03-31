
/**
 * pageViewsByEntities data blob
 */
export interface MostActiveUsers {
    /**
     * avg. duration of a sessions in seconds
     */
    avgSessionDuration?: number;
    /**
     * date time of the most recent session for the user
     */
    lastSession?: number;
    /**
     * Total number of pages viewed by the user
     */
    pageViews?: number;
    /**
     * Total duration of all sessions in seconds
     */
    sessionDuration?: number;
    /**
     * Total number of sessions
     */
    sessions?: number;
    /**
     * Team a user belongs to
     */
    team?: string;
    /**
     * Name of a user
     */
    userName?: string;
}
