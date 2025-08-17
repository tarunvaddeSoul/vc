import { createHash } from "crypto";
import { verifyJWT } from "../utils/crypto.js";
import { SDDisclosure } from "../types/vc.js";

export async function verifySdJwtVc(
  token: string,
  publicKey: any,
  disclosures: SDDisclosure[]
) {
  try {
    const payload = await verifyJWT(token, publicKey);
    console.log("📋 Base VC payload verified");

    // Type assertion for the JWT payload structure
    const vcPayload = payload as { credentialSubject: Record<string, any> };
    const verifiedClaims: Record<string, any> = {};
    const failedDisclosures: string[] = [];

    // Verify each disclosure
    for (const disc of disclosures) {
      if (!disc.salt || disc.claimValue === undefined) {
        console.warn(`⚠️ Missing salt or claim value for claim: ${disc.claimName}`);
        continue;
      }

      // Recreate the disclosure array from the provided values
      const disclosureArray = [disc.salt, disc.claimName, disc.claimValue];
      const disclosureString = JSON.stringify(disclosureArray);
      const recreatedDisclosure = Buffer.from(disclosureString).toString('base64url');
      
      // Hash the recreated disclosure
      const digest = createHash("sha256")
        .update(recreatedDisclosure)
        .digest("base64url");

      // Check if the hash matches what's in the VC
      if (vcPayload.credentialSubject[disc.claimName] === digest) {
        verifiedClaims[disc.claimName] = disc.claimValue;
        console.log(`✅ Verified claim: ${disc.claimName}`);
      } else {
        failedDisclosures.push(disc.claimName);
        console.log(`❌ Failed to verify claim: ${disc.claimName}`);
        console.log(`   Expected: ${vcPayload.credentialSubject[disc.claimName]}`);
        console.log(`   Got: ${digest}`);
      }
    }

    // Show always-visible claims
    const alwaysVisible: Record<string, any> = {};
    for (const [key, value] of Object.entries(vcPayload.credentialSubject)) {
      if (!disclosures.find(d => d.claimName === key)) {
        alwaysVisible[key] = value;
      }
    }

    console.log("👁️ Always visible claims:", alwaysVisible);
    console.log("🔐 Selectively disclosed claims:", verifiedClaims);

    if (failedDisclosures.length > 0) {
      console.warn("⚠️ Some disclosures failed verification:", failedDisclosures);
    }

    return {
      verifiedClaims,
      alwaysVisible,
      failedDisclosures
    };
  } catch (error) {
    console.error("❌ SD-JWT VC verification failed:", error);
    throw error;
  }
}
