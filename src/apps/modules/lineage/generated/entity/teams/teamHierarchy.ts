
/**
 * This schema defines the Team entity with Hierarchy. Hierarchical teams are supported
 * `Organization` -> `BusinessUnit` -> `Division` -> `Department` -> `Group`.
 */
export interface TeamHierarchy {
    /**
     * Children teams. An `Organization` can have `BusinessUnit`, `Division` or `Department` as
     * children. A `BusinessUnit` can have `BusinessUnit`, `Division`, or `Department` as
     * children. A `Division` can have `Division` or `Department` as children. A `Department`
     * can have `Department` as children.
     */
    children?: ChildElement[];
    /**
     * Description of the team.
     */
    description?: string;
    /**
     * Name used for display purposes. Example 'Data Science team'.
     */
    displayName?: string;
    /**
     * FullyQualifiedName same as `name`.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the resource corresponding to this entity.
     */
    href?: string;
    id:    string;
    /**
     * Can any user join this team during sign up? Value of true indicates yes, and false no.
     */
    isJoinable?: boolean;
    /**
     * A unique name of the team typically the team ID from an identity provider. Example -
     * group Id from LDAP.
     */
    name: string;
    /**
     * Team type
     */
    teamType?: TeamType;
}

/**
 * Children teams. An `Organization` can have `BusinessUnit`, `Division` or `Department` as
 * children. A `BusinessUnit` can have `BusinessUnit`, `Division`, or `Department` as
 * children. A `Division` can have `Division` or `Department` as children. A `Department`
 * can have `Department` as children.
 *
 * This schema defines the Team entity with Hierarchy. Hierarchical teams are supported
 * `Organization` -> `BusinessUnit` -> `Division` -> `Department` -> `Group`.
 */
export interface ChildElement {
    /**
     * Children teams. An `Organization` can have `BusinessUnit`, `Division` or `Department` as
     * children. A `BusinessUnit` can have `BusinessUnit`, `Division`, or `Department` as
     * children. A `Division` can have `Division` or `Department` as children. A `Department`
     * can have `Department` as children.
     */
    children?: ChildElement[];
    /**
     * Description of the team.
     */
    description?: string;
    /**
     * Name used for display purposes. Example 'Data Science team'.
     */
    displayName?: string;
    /**
     * FullyQualifiedName same as `name`.
     */
    fullyQualifiedName?: string;
    /**
     * Link to the resource corresponding to this entity.
     */
    href?: string;
    id:    string;
    /**
     * Can any user join this team during sign up? Value of true indicates yes, and false no.
     */
    isJoinable?: boolean;
    /**
     * A unique name of the team typically the team ID from an identity provider. Example -
     * group Id from LDAP.
     */
    name: string;
    /**
     * Team type
     */
    teamType?: TeamType;
}

/**
 * Team type
 *
 * Organization is the highest level entity. An Organization has one of more Business Units,
 * Division, Departments, Group, or Users. A Business Unit has one or more Divisions,
 * Departments, Group, or Users. A Division has one or more Divisions, Departments, Group,
 * or Users. A Department has one or more Departments, Group, or Users. A Group has only
 * Users
 */
export enum TeamType {
    BusinessUnit = "BusinessUnit",
    Department = "Department",
    Division = "Division",
    Group = "Group",
    Organization = "Organization",
}
