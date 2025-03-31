
/**
 * This schema defines the Limits Configuration.
 */
export interface LimitsConfiguration {
    /**
     * Class Name for authorizer.
     */
    className?: string;
    /**
     * Limits Enabled or Disabled.
     */
    enable: boolean;
    /**
     * Limits Configuration File.
     */
    limitsConfigFile?: string;
}
