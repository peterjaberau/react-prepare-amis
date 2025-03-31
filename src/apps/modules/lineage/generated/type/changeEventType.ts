
/**
 * Type of event.
 */
export enum ChangeEventType {
    EntityCreated = "entityCreated",
    EntityDeleted = "entityDeleted",
    EntityFieldsChanged = "entityFieldsChanged",
    EntityNoChange = "entityNoChange",
    EntityRestored = "entityRestored",
    EntitySoftDeleted = "entitySoftDeleted",
    EntityUpdated = "entityUpdated",
    LogicalTestCaseAdded = "logicalTestCaseAdded",
    PostCreated = "postCreated",
    PostUpdated = "postUpdated",
    SuggestionAccepted = "suggestionAccepted",
    SuggestionCreated = "suggestionCreated",
    SuggestionDeleted = "suggestionDeleted",
    SuggestionRejected = "suggestionRejected",
    SuggestionUpdated = "suggestionUpdated",
    TaskClosed = "taskClosed",
    TaskResolved = "taskResolved",
    ThreadCreated = "threadCreated",
    ThreadUpdated = "threadUpdated",
}
