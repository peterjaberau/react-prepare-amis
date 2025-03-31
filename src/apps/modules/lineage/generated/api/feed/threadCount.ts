
/**
 * This schema defines the type for reporting the count of threads related to an entity.
 */
export interface ThreadCount {
    /**
     * Total count of all the active announcements associated with the entity.
     */
    activeAnnouncementCount?: number;
    /**
     * Total count of all the tasks.
     */
    closedTaskCount?: number;
    /**
     * Total count of all the threads of type Conversation.
     */
    conversationCount?: number;
    entityLink?:        string;
    /**
     * Total count of all the inactive announcements associated with the entity.
     */
    inactiveAnnouncementCount?: number;
    /**
     * Total count of all the mentions of a user.
     */
    mentionCount?: number;
    /**
     * Total count of all the open tasks.
     */
    openTaskCount?: number;
    /**
     * Total count of all the announcements associated with the entity.
     */
    totalAnnouncementCount?: number;
    /**
     * Total count of all the tasks.
     */
    totalTaskCount?: number;
}
