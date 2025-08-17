import { generateJwtVc } from "./jwt-vc/generate.js";
import { verifyJwtVc } from "./jwt-vc/verify.js";
import { generateSdJwtVc } from "./sd-jwt-vc/generate.js";
import { verifySdJwtVc } from "./sd-jwt-vc/verify.js";
import { generateKeyPair, signJWT } from "./utils/crypto.js";

export async function runAdvancedTests() {
  console.log("🧪 Running Advanced VC Verification Tests\n");

  // Test 1: Valid JWT VC
  console.log("=== Test 1: Valid JWT VC ===");
  try {
    const { jwtVc, publicKey } = await generateJwtVc();
    await verifyJwtVc(jwtVc, publicKey);
    console.log("✅ Test 1 passed\n");
  } catch (error) {
    console.error("❌ Test 1 failed:", error);
  }

  // Test 2: Expired JWT VC
  console.log("=== Test 2: Expired JWT VC ===");
  try {
    const { privateKey, publicKey } = await generateKeyPair();
    const expiredVc = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      issuer: "did:example:issuer",
      issuanceDate: "2020-01-01T00:00:00Z",
      expirationDate: "2020-12-31T23:59:59Z", // Expired
      credentialSubject: { id: "did:example:subject" }
    };
    
    const expiredJwt = await signJWT(expiredVc, privateKey);
    await verifyJwtVc(expiredJwt, publicKey);
    console.log("❌ Test 2 should have failed but didn't\n");
  } catch (error) {
    console.log("✅ Test 2 passed - correctly caught expired VC\n");
  }

  // Test 3: Invalid VC structure
  console.log("=== Test 3: Invalid VC Structure ===");
  try {
    const { privateKey, publicKey } = await generateKeyPair();
    const invalidVc = {
      // Missing @context
      type: ["VerifiableCredential"],
      issuer: "did:example:issuer",
      credentialSubject: { id: "did:example:subject" }
    };
    
    const invalidJwt = await signJWT(invalidVc, privateKey);
    await verifyJwtVc(invalidJwt, publicKey);
    console.log("❌ Test 3 should have failed but didn't\n");
  } catch (error) {
    console.log("✅ Test 3 passed - correctly caught invalid structure\n");
  }

  // Test 4: Wrong signature
  console.log("=== Test 4: Wrong Signature ===");
  try {
    const { jwtVc } = await generateJwtVc();
    const { publicKey: wrongKey } = await generateKeyPair();
    await verifyJwtVc(jwtVc, wrongKey);
    console.log("❌ Test 4 should have failed but didn't\n");
  } catch (error) {
    console.log("✅ Test 4 passed - correctly caught wrong signature\n");
  }

  // Test 5: Valid SD-JWT VC
  console.log("=== Test 5: Valid SD-JWT VC ===");
  try {
    const { sdJwt, disclosures, publicKey } = await generateSdJwtVc();
    const result = await verifySdJwtVc(sdJwt, publicKey, disclosures);
    console.log("✅ Test 5 passed\n");
  } catch (error) {
    console.error("❌ Test 5 failed:", error);
  }

  // Test 6: Partial disclosure verification
  console.log("=== Test 6: Partial Disclosure ===");
  try {
    const { sdJwt, disclosures, publicKey } = await generateSdJwtVc();
    // Only verify first two disclosures
    const partialDisclosures = disclosures.slice(0, 2);
    const result = await verifySdJwtVc(sdJwt, publicKey, partialDisclosures);
    console.log("✅ Test 6 passed - partial disclosure works\n");
  } catch (error) {
    console.error("❌ Test 6 failed:", error);
  }

  // Test 7: Tampered disclosure
  console.log("=== Test 7: Tampered Disclosure ===");
  try {
    const { sdJwt, disclosures, publicKey } = await generateSdJwtVc();
    // Tamper with a disclosure
    const tamperedDisclosures = [...disclosures];
    tamperedDisclosures[0].claimValue = "Tampered Value";
    
    const result = await verifySdJwtVc(sdJwt, publicKey, tamperedDisclosures);
    if (result.failedDisclosures.length > 0) {
      console.log("✅ Test 7 passed - correctly detected tampering\n");
    } else {
      console.log("❌ Test 7 failed - should have detected tampering\n");
    }
  } catch (error) {
    console.error("❌ Test 7 failed:", error);
  }

  console.log("🏁 Advanced tests completed!");
}