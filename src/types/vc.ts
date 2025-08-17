export interface VerifiableCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: Record<string, any>;
  proof?: any; // For non-JWT VCs
}

export interface SDDisclosure {
  salt: string;
  claimName: string;
  claimValue: any;
  disclosure?: string; // Base64url encoded disclosure
}

export interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
}

export interface JWTPayload {
  iss: string;
  sub: string;
  iat: number;
  exp?: number;
  vc?: VerifiableCredential;
  [key: string]: any;
}
