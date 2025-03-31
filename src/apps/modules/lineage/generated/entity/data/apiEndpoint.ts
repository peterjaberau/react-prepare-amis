
/**
 * This schema defines the APIEndpoint entity. An APIEndpoint is a specific endpoint of an
 * API that is part of an API Collection.
 */
export interface APIEndpoint {
    /**
     * Reference to API Collection that contains this API Endpoint.
     */
    apiCollection?: EntityReference;
    certification?: AssetCertification;
    /**
     * Change that lead to this version of the entity.
     */
    changeDescription?: ChangeDescription;
    /**
     * List of data products this entity is part of.
     */
    dataProducts?: EntityReference[];
    /**
     * When `true` indicates the entity has been soft deleted.
     */
    deleted?: boolean;
    /**
     * Description of the API Endpoint, what it is, and how to use it.
     */
    description?: string;
    /**
     * Display Name that identifies this API Endpoint.
     */
    displayName?: string;
    /**
     * Domain the API Collection belongs to. When not set, the API Collection inherits the
     * domain from the API service it belongs to.
     */
    domain?: EntityReference;
    /**
     * EndPoint URL for the API Collection. Capture the Root URL of the collection.
     */
    endpointURL: string;
    /**
     * Entity extension data with custom attributes added to the entity.
     */
    extension?: any;
    /**
     * Followers of this API Collection.
     */
    followers?: EntityReference[];
    /**
     * A unique name that identifies a API Collection in the format
     * 'ServiceName.ApiCollectionName.APIEndpoint'.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the resource corresponding to this entity.
     */
    href?: string;
    /**
     * Unique identifier that identifies a API Endpoint instance.
     */
    id: string;
    /**
     * Change that lead to this version of the entity.
     */
    incrementalChangeDescription?: ChangeDescription;
    /**
     * Life Cycle properties of the entity
     */
    lifeCycle?: LifeCycle;
    /**
     * Name that identifies this API Endpoint.
     */
    name: string;
    /**
     * Owners of this API Collection.
     */
    owners?: EntityReference[];
    /**
     * Request Method for the API Endpoint.
     */
    requestMethod?: APIRequestMethod;
    /**
     * Request Schema for the API Endpoint.
     */
    requestSchema?: APISchema;
    /**
     * Response Schema for the API Endpoint.
     */
    responseSchema?: APISchema;
    /**
     * Link to service where this API Collection is hosted in.
     */
    service: EntityReference;
    /**
     * Service type where this API Collection is hosted in.
     */
    serviceType?: APIServiceType;
    /**
     * Source hash of the entity
     */
    sourceHash?: string;
    /**
     * Tags for this API Collection.
     */
    tags?: TagLabel[];
    /**
     * Last update time corresponding to the new version of the entity in Unix epoch time
     * milliseconds.
     */
    updatedAt?: number;
    /**
     * User who made the update.
     */
    updatedBy?: string;
    /**
     * Metadata version of the entity.
     */
    version?: number;
    /**
     * Votes on the entity.
     */
    votes?: Votes;
}

/**
 * Reference to API Collection that contains this API Endpoint.
 *
 * This schema defines the EntityReference type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 *
 * List of data products this entity is part of.
 *
 * This schema defines the EntityReferenceList type used for referencing an entity.
 * EntityReference is used for capturing relationships from one entity to another. For
 * example, a table has an attribute called database of type EntityReference that captures
 * the relationship of a table `belongs to a` database.
 *
 * Domain the API Collection belongs to. When not set, the API Collection inherits the
 * domain from the API service it belongs to.
 *
 * User, Pipeline, Query that created,updated or accessed the data asset
 *
 * Link to service where this API Collection is hosted in.
 */
export interface EntityReference {
    /**
     * If true the entity referred to has been soft-deleted.
     */
    deleted?: boolean;
    /**
     * Optional description of entity.
     */
    description?: string;
    /**
     * Display Name that identifies this entity.
     */
    displayName?: string;
    /**
     * Fully qualified name of the entity instance. For entities such as tables, databases
     * fullyQualifiedName is returned in this field. For entities that don't have name hierarchy
     * such as `user` and `team` this will be same as the `name` field.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the entity resource.
     */
    href?: string;
    /**
     * Unique identifier that identifies an entity instance.
     */
    id: string;
    /**
     * If true the relationship indicated by this entity reference is inherited from the parent
     * entity.
     */
    inherited?: boolean;
    /**
     * Name of the entity instance.
     */
    name?: string;
    /**
     * Entity type/class name - Examples: `database`, `table`, `metrics`, `databaseService`,
     * `dashboardService`...
     */
    type: string;
}

/**
 * Defines the Asset Certification schema.
 */
export interface AssetCertification {
    /**
     * The date when the certification was applied.
     */
    appliedDate: number;
    /**
     * The date when the certification expires.
     */
    expiryDate: number;
    tagLabel:   TagLabel;
}

/**
 * This schema defines the type for labeling an entity with a Tag.
 */
export interface TagLabel {
    /**
     * Description for the tag label.
     */
    description?: string;
    /**
     * Display Name that identifies this tag.
     */
    displayName?: string;
    /**
     * Link to the tag resource.
     */
    href?: string;
    /**
     * Label type describes how a tag label was applied. 'Manual' indicates the tag label was
     * applied by a person. 'Derived' indicates a tag label was derived using the associated tag
     * relationship (see Classification.json for more details). 'Propagated` indicates a tag
     * label was propagated from upstream based on lineage. 'Automated' is used when a tool was
     * used to determine the tag label.
     */
    labelType: LabelType;
    /**
     * Name of the tag or glossary term.
     */
    name?: string;
    /**
     * Label is from Tags or Glossary.
     */
    source: TagSource;
    /**
     * 'Suggested' state is used when a tag label is suggested by users or tools. Owner of the
     * entity must confirm the suggested labels before it is marked as 'Confirmed'.
     */
    state:  State;
    style?: Style;
    tagFQN: string;
}

/**
 * Label type describes how a tag label was applied. 'Manual' indicates the tag label was
 * applied by a person. 'Derived' indicates a tag label was derived using the associated tag
 * relationship (see Classification.json for more details). 'Propagated` indicates a tag
 * label was propagated from upstream based on lineage. 'Automated' is used when a tool was
 * used to determine the tag label.
 */
export enum LabelType {
    Automated = "Automated",
    Derived = "Derived",
    Manual = "Manual",
    Propagated = "Propagated",
}

/**
 * Label is from Tags or Glossary.
 */
export enum TagSource {
    Classification = "Classification",
    Glossary = "Glossary",
}

/**
 * 'Suggested' state is used when a tag label is suggested by users or tools. Owner of the
 * entity must confirm the suggested labels before it is marked as 'Confirmed'.
 */
export enum State {
    Confirmed = "Confirmed",
    Suggested = "Suggested",
}

/**
 * UI Style is used to associate a color code and/or icon to entity to customize the look of
 * that entity in UI.
 */
export interface Style {
    /**
     * Hex Color Code to mark an entity such as GlossaryTerm, Tag, Domain or Data Product.
     */
    color?: string;
    /**
     * An icon to associate with GlossaryTerm, Tag, Domain or Data Product.
     */
    iconURL?: string;
}

/**
 * Change that lead to this version of the entity.
 *
 * Description of the change.
 */
export interface ChangeDescription {
    changeSummary?: { [key: string]: ChangeSummary };
    /**
     * Names of fields added during the version changes.
     */
    fieldsAdded?: FieldChange[];
    /**
     * Fields deleted during the version changes with old value before deleted.
     */
    fieldsDeleted?: FieldChange[];
    /**
     * Fields modified during the version changes with old and new values.
     */
    fieldsUpdated?: FieldChange[];
    /**
     * When a change did not result in change, this could be same as the current version.
     */
    previousVersion?: number;
}

export interface ChangeSummary {
    changedAt?: number;
    /**
     * Name of the user or bot who made this change
     */
    changedBy?:    string;
    changeSource?: ChangeSource;
    [property: string]: any;
}

/**
 * The source of the change. This will change based on the context of the change (example:
 * manual vs programmatic)
 */
export enum ChangeSource {
    Automated = "Automated",
    Derived = "Derived",
    Ingested = "Ingested",
    Manual = "Manual",
    Propagated = "Propagated",
    Suggested = "Suggested",
}

export interface FieldChange {
    /**
     * Name of the entity field that changed.
     */
    name?: string;
    /**
     * New value of the field. Note that this is a JSON string and use the corresponding field
     * type to deserialize it.
     */
    newValue?: any;
    /**
     * Previous value of the field. Note that this is a JSON string and use the corresponding
     * field type to deserialize it.
     */
    oldValue?: any;
}

/**
 * Life Cycle properties of the entity
 *
 * This schema defines Life Cycle Properties.
 */
export interface LifeCycle {
    /**
     * Access Details about accessed aspect of the data asset
     */
    accessed?: AccessDetails;
    /**
     * Access Details about created aspect of the data asset
     */
    created?: AccessDetails;
    /**
     * Access Details about updated aspect of the data asset
     */
    updated?: AccessDetails;
}

/**
 * Access Details about accessed aspect of the data asset
 *
 * Access details of an entity
 *
 * Access Details about created aspect of the data asset
 *
 * Access Details about updated aspect of the data asset
 */
export interface AccessDetails {
    /**
     * User, Pipeline, Query that created,updated or accessed the data asset
     */
    accessedBy?: EntityReference;
    /**
     * Any process that accessed the data asset that is not captured in OpenMetadata.
     */
    accessedByAProcess?: string;
    /**
     * Timestamp of data asset accessed for creation, update, read.
     */
    timestamp: number;
}

/**
 * Request Method for the API Endpoint.
 *
 * This schema defines the Request Method type for APIs .
 */
export enum APIRequestMethod {
    Connect = "CONNECT",
    Delete = "DELETE",
    Get = "GET",
    Head = "HEAD",
    Options = "OPTIONS",
    Patch = "PATCH",
    Post = "POST",
    Put = "PUT",
    Trace = "TRACE",
}

/**
 * Request Schema for the API Endpoint.
 *
 * This schema defines the API Endpoint entity's request/response schema.
 *
 * Response Schema for the API Endpoint.
 */
export interface APISchema {
    /**
     * Columns in this schema.
     */
    schemaFields?: Field[];
    /**
     * Schema used for message serialization.
     */
    schemaType?: SchemaType;
    [property: string]: any;
}

/**
 * This schema defines the nested object to capture protobuf/avro/jsonschema of topic's
 * schema.
 */
export interface Field {
    /**
     * Child fields if dataType or arrayDataType is `map`, `record`, `message`
     */
    children?: Field[];
    /**
     * Data type of the field (int, date etc.).
     */
    dataType: DataTypeTopic;
    /**
     * Display name used for dataType. This is useful for complex types, such as `array<int>`,
     * `map<int,string>`, `struct<>`, and union types.
     */
    dataTypeDisplay?: string;
    /**
     * Description of the column.
     */
    description?: string;
    /**
     * Display Name that identifies this field name.
     */
    displayName?:        string;
    fullyQualifiedName?: string;
    name:                string;
    /**
     * Tags associated with the column.
     */
    tags?: TagLabel[];
}

/**
 * Data type of the field (int, date etc.).
 *
 * This enum defines the type of data defined in schema.
 */
export enum DataTypeTopic {
    Array = "ARRAY",
    Boolean = "BOOLEAN",
    Bytes = "BYTES",
    Date = "DATE",
    Double = "DOUBLE",
    Enum = "ENUM",
    Error = "ERROR",
    Fixed = "FIXED",
    Float = "FLOAT",
    Int = "INT",
    Long = "LONG",
    Map = "MAP",
    Null = "NULL",
    Record = "RECORD",
    String = "STRING",
    Time = "TIME",
    Timestamp = "TIMESTAMP",
    Timestampz = "TIMESTAMPZ",
    Union = "UNION",
    Unknown = "UNKNOWN",
}

/**
 * Schema used for message serialization.
 *
 * Schema type used for the message.
 */
export enum SchemaType {
    Avro = "Avro",
    JSON = "JSON",
    None = "None",
    Other = "Other",
    Protobuf = "Protobuf",
}

/**
 * Service type where this API Collection is hosted in.
 *
 * Type of api service such as REST, Webhook,...
 */
export enum APIServiceType {
    REST = "Rest",
    Webhook = "WEBHOOK",
}

/**
 * Votes on the entity.
 *
 * This schema defines the Votes for a Data Asset.
 */
export interface Votes {
    /**
     * List of all the Users who downVoted
     */
    downVoters?: EntityReference[];
    /**
     * Total down-votes the entity has
     */
    downVotes?: number;
    /**
     * List of all the Users who upVoted
     */
    upVoters?: EntityReference[];
    /**
     * Total up-votes the entity has
     */
    upVotes?: number;
}
