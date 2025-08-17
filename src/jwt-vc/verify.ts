import { verifyJWT } from "../utils/crypto.js";

export async function verifyJwtVc(token: string, publicKey: any) {
  try {
    const payload = await verifyJWT(token, publicKey);

    // Extract VC from JWT payload
    const jwtPayload = payload as any;
    let vc: any;

    // Handle different JWT VC formats
    if (jwtPayload.vc) {
      // Standard JWT VC format where VC is nested under 'vc' property
      vc = jwtPayload.vc;
    } else if (jwtPayload['@context'] && jwtPayload.type) {
      // Direct VC in payload format
      vc = jwtPayload;
    } else {
      throw new Error('Invalid JWT VC structure: no verifiable credential found');
    }

    // Validate VC structure
    if (!vc['@context'] || !vc.type || !vc.issuer || !vc.credentialSubject) {
      throw new Error('Invalid VC structure: missing required fields');
    }

    // Check if VC is expired
    if (vc.expirationDate && new Date(vc.expirationDate) < new Date()) {
      throw new Error('Credential has expired');
    }

    // Validate context
    if (!vc['@context'].includes('https://www.w3.org/2018/credentials/v1')) {
      throw new Error('Invalid @context: must include W3C credentials context');
    }

    // Validate type
    if (!vc.type.includes('VerifiableCredential')) {
      throw new Error('Invalid type: must include VerifiableCredential');
    }

    console.log("✅ JWT VC verified and validated:", payload);
    return payload;
  } catch (error) {
    console.error("❌ JWT VC verification failed:", error);
    throw error;
  }
}
