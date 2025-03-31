
/**
 * Represents a CSV file.
 */
export interface CSVFile {
    headers?: CSVHeader[];
    records?: Array<string[]>;
}

/**
 * Represents a header for a field in a CSV file.
 */
export interface CSVHeader {
    /**
     * Description of the header field for documentation purposes.
     */
    description: string;
    /**
     * Example values for the field
     */
    examples:  string[];
    name:      string;
    required?: boolean;
}
