
/**
 * Documentation for CSV file that describes headers and example values.
 */
export interface CSVDocumentation {
    /**
     * Documentation for CSV file header
     */
    headers: CSVHeader[];
    /**
     * Summary documentation for CSV file.
     */
    summary: string;
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
