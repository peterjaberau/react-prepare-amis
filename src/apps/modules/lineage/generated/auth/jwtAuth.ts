
/**
 * User/Bot JWTAuthMechanism.
 */
export interface JwtAuth {
    /**
     * JWT Auth Token.
     */
    JWTToken?: string;
    /**
     * JWT Auth Token expiration time.
     */
    JWTTokenExpiresAt?: number;
    JWTTokenExpiry:     JWTTokenExpiry;
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
