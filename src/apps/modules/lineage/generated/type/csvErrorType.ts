
/**
 * What type of error occurred when importing a CSV file.
 */
export enum CSVErrorType {
    FieldRequired = "FIELD_REQUIRED",
    InvalidField = "INVALID_FIELD",
    InvalidFieldCount = "INVALID_FIELD_COUNT",
    InvalidHeader = "INVALID_HEADER",
    ParserFailure = "PARSER_FAILURE",
    Unknown = "UNKNOWN",
}
