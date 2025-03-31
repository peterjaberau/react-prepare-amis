
/**
 * Defines a navigation item in the UI navigation menu.
 */
export interface NavigationItem {
    /**
     * Optional sub-navigation items.
     */
    children?: ChildElement[];
    /**
     * Unique identifier for the navigation item.
     */
    id: string;
    /**
     * Determine if item is visible or not
     */
    isHidden?: boolean;
    /**
     * Reference to a Page ID that this navigation item links to.
     */
    pageId: string;
    /**
     * Display title of the navigation item.
     */
    title: string;
}

/**
 * Defines a navigation item in the UI navigation menu.
 */
export interface ChildElement {
    /**
     * Optional sub-navigation items.
     */
    children?: ChildElement[];
    /**
     * Unique identifier for the navigation item.
     */
    id: string;
    /**
     * Determine if item is visible or not
     */
    isHidden?: boolean;
    /**
     * Reference to a Page ID that this navigation item links to.
     */
    pageId: string;
    /**
     * Display title of the navigation item.
     */
    title: string;
}
