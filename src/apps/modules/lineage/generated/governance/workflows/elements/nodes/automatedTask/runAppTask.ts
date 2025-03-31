
/**
 * Runs an App based on its name.
 */
export interface RunAppTask {
    branches?: string[];
    config?:   Config;
    /**
     * Description of the Node.
     */
    description?: string;
    /**
     * Display Name that identifies this Node.
     */
    displayName?:       string;
    input?:             string[];
    inputNamespaceMap?: InputNamespaceMap;
    /**
     * Name that identifies this Node.
     */
    name?:    string;
    subType?: string;
    type?:    string;
    [property: string]: any;
}

export interface Config {
    /**
     * Set which App should Run
     */
    appName: string;
    /**
     * Set the amount of seconds to wait before defining the App has timed out.
     */
    timeoutSeconds: number;
    /**
     * Set if this step should wait until the App finishes running
     */
    waitForCompletion: boolean;
}

export interface InputNamespaceMap {
    relatedEntity: string;
}
