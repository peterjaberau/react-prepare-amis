
/**
 * SubType of the Node.
 */
export enum NodeSubType {
    CheckEntityAttributesTask = "checkEntityAttributesTask",
    CreateAndRunIngestionPipelineTask = "createAndRunIngestionPipelineTask",
    EndEvent = "endEvent",
    ParallelGateway = "parallelGateway",
    RunAppTask = "runAppTask",
    SetEntityCertificationTask = "setEntityCertificationTask",
    SetGlossaryTermStatusTask = "setGlossaryTermStatusTask",
    StartEvent = "startEvent",
    UserApprovalTask = "userApprovalTask",
}
