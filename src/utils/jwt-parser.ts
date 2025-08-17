/**
 * JWT parsing utilities for interview scenarios
 */

export interface ParsedJWT {
  header: any;
  payload: any;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export function parseJWT(token: string): ParsedJWT {
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: must have 3 parts separated by dots');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString());
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

    return {
      header,
      payload,
      signature: signatureB64,
      raw: {
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64
      }
    };
  } catch (error) {
    throw new Error(`Failed to parse JWT: ${error}`);
  }
}

export function validateJWTStructure(parsed: ParsedJWT): string[] {
  const errors: string[] = [];

  // Check header
  if (!parsed.header.alg) {
    errors.push('Missing algorithm in header');
  }
  
  if (!parsed.header.typ || parsed.header.typ !== 'JWT') {
    errors.push('Invalid or missing type in header');
  }

  // Check payload
  if (!parsed.payload.iss) {
    errors.push('Missing issuer (iss) in payload');
  }

  if (!parsed.payload.iat) {
    errors.push('Missing issued at (iat) in payload');
  }

  // Check expiration
  if (parsed.payload.exp && parsed.payload.exp < Math.floor(Date.now() / 1000)) {
    errors.push('Token has expired');
  }

  return errors;
}

export function extractVCFromJWT(parsed: ParsedJWT): any {
  // Handle different JWT VC formats
  if (parsed.payload.vc) {
    return parsed.payload.vc; // Standard JWT VC format
  }
  
  // Check if the payload itself is the VC
  if (parsed.payload['@context'] && parsed.payload.type) {
    return parsed.payload; // Direct VC in payload
  }

  throw new Error('No verifiable credential found in JWT payload');
}