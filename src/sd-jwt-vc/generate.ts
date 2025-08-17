import { createHash, randomBytes } from "crypto";
import { SDDisclosure } from "../types/vc.js";
import { generateKeyPair, signJWT } from "../utils/crypto.js";

export async function generateSdJwtVc() {
  const disclosures: SDDisclosure[] = [];

  // More complex subject claims with nested objects and arrays
  const subjectClaims = {
    name: "Alice Johnson",
    role: "Senior Developer",
    department: "Engineering",
    email: "alice@example.com",
    clearanceLevel: "L3",
    skills: ["TypeScript", "Rust", "Cryptography"]
  };

  const saltedClaims: Record<string, any> = {};
  
  // Create selective disclosure for each claim
  for (const [key, value] of Object.entries(subjectClaims)) {
    const salt = randomBytes(16).toString("base64url"); // Use base64url for better compatibility
    const claimValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // Create disclosure array: [salt, claim_name, claim_value]
    const disclosureArray = [salt, key, value];
    const disclosureString = JSON.stringify(disclosureArray);
    const disclosureB64 = Buffer.from(disclosureString).toString('base64url');
    
    // Create hash for the claim
    const digest = createHash("sha256").update(disclosureB64).digest("base64url");
    saltedClaims[key] = digest;

    disclosures.push({ 
      salt, 
      claimName: key, 
      claimValue: value,
      disclosure: disclosureB64 // Add the actual disclosure string
    });
  }

  // Add some always-visible claims
  const visibleClaims = {
    id: "did:example:holder456",
    employeeId: "EMP-2024-001"
  };

  const vc = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "EmployeeCredential"],
    issuer: "did:example:issuer123",
    issuanceDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    credentialSubject: {
      ...visibleClaims,
      ...saltedClaims
    }
  };

  const { privateKey, publicKey } = await generateKeyPair();
  const sdJwt = await signJWT(vc, privateKey);

  console.log("📋 Generated SD-JWT VC with selective disclosures");
  console.log("🔐 Selectively disclosed claims:", Object.keys(saltedClaims));
  console.log("👁️ Always visible claims:", Object.keys(visibleClaims));

  return { sdJwt, disclosures, publicKey };
}
