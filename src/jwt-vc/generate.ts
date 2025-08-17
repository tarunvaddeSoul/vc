import { VerifiableCredential } from "../types/vc.js";
import { generateKeyPair, signJWT } from "../utils/crypto.js";

export async function generateJwtVc() {
  const vc: VerifiableCredential = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential", "EmployeeID"],
    issuer: "did:example:issuer123",
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: "did:example:holder456",
      name: "Alice",
      role: "Developer"
    }
  };

  const { privateKey, publicKey } = await generateKeyPair();
  const jwtPayload = {
    vc,
    iss: vc.issuer,
    sub: vc.credentialSubject.id,
    iat: Math.floor(Date.now() / 1000),
  };
  const jwtVc = await signJWT(jwtPayload, privateKey);

  return { jwtVc, publicKey };
}
