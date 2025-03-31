
/**
 * Functions used for writing SpEL expression based conditions
 */
export interface Function {
    /**
     * Description for the function.
     */
    description?: string;
    /**
     * Examples of the function to help users author conditions.
     */
    examples?: any[];
    /**
     * Description of input taken by the function.
     */
    input?: string;
    /**
     * Name of the function.
     */
    name?:                   string;
    paramAdditionalContext?: ParamAdditionalContext;
    /**
     * List of receivers to send mail to
     */
    parameterInputType?: ParameterType;
}

/**
 * Additional Context
 */
export interface ParamAdditionalContext {
    /**
     * List of Entities
     */
    data?: any;
}

/**
 * List of receivers to send mail to
 */
export enum ParameterType {
    AllIndexElasticSearch = "AllIndexElasticSearch",
    NotRequired = "NotRequired",
    ReadFromParamContext = "ReadFromParamContext",
    ReadFromParamContextPerEntity = "ReadFromParamContextPerEntity",
    SpecificIndexElasticSearch = "SpecificIndexElasticSearch",
}
