
/**
 * Create Personal Access Token Request
 */
export interface CreatePersonalToken {
    JWTTokenExpiry: JWTTokenExpiry;
    /**
     * Name of the Personal Access Token
     */
    tokenName: string;
}

/**
 * JWT Auth Token expiration in days
 */
export enum JWTTokenExpiry {
    OneHour = "OneHour",
    The1 = "1",
    The30 = "30",
    The60 = "60",
    The7 = "7",
    The90 = "90",
    Unlimited = "Unlimited",
}
