import { verifyJWT } from "../utils/crypto.js";

export async function verifyJwtVc(token: string, publicKey: any) {
  try {
    const payload = await verifyJWT(token, publicKey);
    
    // Validate VC structure
    const vc = payload as any;
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
