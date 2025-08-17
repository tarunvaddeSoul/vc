import * as jose from "jose";
import { webcrypto } from "crypto";

// Polyfill for Node.js
if (!globalThis.crypto) {
    globalThis.crypto = webcrypto as any;
}

// Generate a key pair for signing
export async function generateKeyPair() {
    // console.log('GENERATED KEY PAIR')
    return await jose.generateKeyPair("ES256");
}

export async function signJWT(payload: jose.JWTPayload, privateKey: jose.CryptoKey) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "ES256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(privateKey);
}

export async function verifyJWT(token: string, publicKey: jose.CryptoKey) {
    const { payload } = await jose.jwtVerify(token, publicKey);
    // console.log(payload)
    return payload;
}
