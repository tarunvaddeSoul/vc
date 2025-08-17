import { generateJwtVc } from "./jwt-vc/generate.js";
import { verifyJwtVc } from "./jwt-vc/verify.js";
import { generateSdJwtVc } from "./sd-jwt-vc/generate.js";
import { verifySdJwtVc } from "./sd-jwt-vc/verify.js";
import { runAdvancedTests } from "./test-scenarios.js";

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    await runAdvancedTests();
    return;
  }

  console.log("🚀 VC Verification Demo\n");

  console.log("=== JWT VC Demo ===");
  const { jwtVc, publicKey } = await generateJwtVc();
  await verifyJwtVc(jwtVc, publicKey);

  console.log("\n=== SD-JWT VC Demo ===");
  const { sdJwt, disclosures, publicKey: sdPubKey } = await generateSdJwtVc();
  await verifySdJwtVc(sdJwt, sdPubKey, disclosures);

  console.log("\n💡 Run with --test flag to see advanced test scenarios");
}

main().catch(console.error);
