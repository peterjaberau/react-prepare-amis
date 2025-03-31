
/**
 * GET entity by id, GET entity by name, and LIST entities can include deleted or
 * non-deleted entities using the parameter include.
 */
export enum Include {
    All = "all",
    Deleted = "deleted",
    NonDeleted = "non-deleted",
}
