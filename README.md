# Verifiable Credentials Explained Like You're 10! 🎓

Imagine you have a **magic school ID card** that proves you're a student. But this isn't just any card - it's a **super smart digital card** that can't be faked!

## What's a Verifiable Credential? 🆔

Think of it like a **digital certificate** - just like how you get a certificate for completing a course, but this one lives on computers and is **impossible to fake**.

### Real-world examples:
- Your driver's license (proves you can drive)
- Your diploma (proves you graduated)
- Your employee badge (proves you work somewhere)

## The Magic Ingredients 🧪

Every verifiable credential has these parts:

### 1. **The Context** (`@context`)
```
Think of this like: "Hey, I'm speaking the language of school certificates!"
```
It tells computers how to understand what this certificate means.

### 2. **The Type** (`type`)
```
"I am a VerifiableCredential AND I'm specifically a StudentID"
```
Like saying "I'm a certificate, and specifically I'm a student ID card"

### 3. **The Issuer** (`issuer`)
```
"This certificate was made by Springfield Elementary School"
```
Who created and signed this certificate

### 4. **Issue Date** (`issuanceDate`)
```
"This was created on January 15, 2024"
```
When the certificate was made

### 5. **The Subject** (`credentialSubject`)
```
"This certificate is about Alice, she's in 5th grade, her student ID is 12345"
```
The actual information about the person

## Two Types of Magic Cards 🎭

### Type 1: JWT VC (Regular Magic Card)
This is like a **transparent plastic card** - everyone can see all the information on it.

```typescript
// Like a clear student ID card
{
  name: "Alice",
  grade: "5th",
  studentId: "12345",
  school: "Springfield Elementary"
}
```

**Good:** Simple and easy to read  
**Bad:** Everyone sees everything (no privacy)

### Type 2: SD-JWT VC (Secret Magic Card)
This is like a **scratch-off lottery ticket** - some information is hidden until you choose to reveal it!

```typescript
// The card shows scrambled codes instead of real info
{
  name: "abc123def456...",     // Hidden! (scrambled)
  grade: "ghi789jkl012...",    // Hidden! (scrambled)  
  studentId: "12345"           // Visible to everyone
}

// But Alice has secret "scratch-off" codes that can reveal:
// "abc123def456..." actually means "Alice"
// "ghi789jkl012..." actually means "5th grade"
```

## How the Secret Scratch-Off Works 🎫

### Step 1: Making the Secret (Generation)
```typescript
// Take Alice's real name
const realName = "Alice";

// Add some random salt (like a secret password)
const salt = "xyz789";

// Mix them together and scramble (hash)
const scrambled = scramble(salt + realName); // Results in "abc123def456..."

// Store the scrambled version on the card
// Keep the salt and real name as a "scratch-off ticket"
```

### Step 2: Revealing the Secret (Verification)
```typescript
// Someone gives you the scratch-off ticket
const scratchOff = {
  salt: "xyz789",
  realValue: "Alice"
};

// You scramble it the same way
const testScrambled = scramble("xyz789" + "Alice");

// If it matches what's on the card, it's real!
if (testScrambled === "abc123def456...") {
  console.log("✅ This really is Alice!");
} else {
  console.log("❌ Someone tried to fake this!");
}
```

## The Digital Signature Magic 🖋️

Every certificate has a **digital signature** - like a magic seal that proves it's real.

### How it works:
1. **School creates two magic keys:**
   - 🔐 **Private key** (secret, only school has it)
   - 🔓 **Public key** (everyone can have a copy)

2. **School signs the certificate:**
   ```
   School uses private key + certificate = Magic signature
   ```

3. **Anyone can verify it's real:**
   ```
   Public key + certificate + signature = ✅ or ❌
   ```

It's like the school's **unforgeable signature** that proves they really made this certificate.

## Why This is Super Cool 🌟

### For Regular Cards (JWT VC):
- **Fast to check** - like looking at a clear ID card
- **Simple** - everyone understands what they see
- **No privacy** - everyone sees all your info

### For Secret Cards (SD-JWT VC):
- **Privacy-friendly** - you choose what to reveal
- **Still trustworthy** - the hidden parts are still verified
- **Flexible** - show your name to one person, your grade to another

## Real-World Example 🏫

**Alice applies for a library card:**

**With regular card (JWT VC):**
```
Librarian sees: "Alice, 5th grade, student ID 12345, Springfield Elementary"
```

**With secret card (SD-JWT VC):**
```
Alice shows: "I'm a student at Springfield Elementary" 
Alice hides: Her name, grade, and student ID (librarian doesn't need those!)
```

## The Code We Built 💻

Our project creates both types of magic cards and teaches the computer how to:

1. **Make certificates** (like a certificate printer)
2. **Check if they're real** (like a certificate detector)
3. **Handle secrets** (like managing scratch-off tickets)
4. **Catch fakes** (like a security guard)

### Project Structure
```
src/
├── jwt-vc/
│   ├── generate.ts     # Creates regular magic cards
│   └── verify.ts       # Checks regular magic cards
├── sd-jwt-vc/
│   ├── generate.ts     # Creates secret magic cards
│   └── verify.ts       # Checks secret magic cards
├── utils/
│   ├── crypto.ts       # Digital signature magic
│   └── jwt-parser.ts   # Card reading tools
├── types/
│   └── vc.ts          # Defines what cards look like
├── test-scenarios.ts   # Practice tests
└── index.ts           # Main demo
```

## Test Scenarios We Practice 🧪

1. **Valid certificate** - "This looks good!"
2. **Expired certificate** - "This is too old!"
3. **Wrong signature** - "This is fake!"
4. **Missing information** - "This is incomplete!"
5. **Tampered secrets** - "Someone changed this!"

It's like training to be a **super detective** who can spot fake certificates instantly!

## How to Run 🚀

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
npm install
```

### Run the Demo
```bash
# Basic demo showing both JWT VC and SD-JWT VC
npm run dev

# Run advanced test scenarios
npm run dev -- --test
```

### What You'll See

**Basic Demo:**
- Creates a JWT VC (regular magic card)
- Verifies it's authentic
- Creates an SD-JWT VC (secret magic card)
- Verifies selective disclosures

**Test Scenarios:**
- Tests valid credentials
- Tests expired credentials
- Tests invalid structures
- Tests wrong signatures
- Tests tampered disclosures

## Technical Details (For the Grown-ups) 🤓

### JWT VC Implementation
- Uses **ES256** (ECDSA with P-256 curve) for signatures
- Follows **W3C Verifiable Credentials Data Model**
- Implements proper **JWT structure validation**
- Handles **expiration checking**

### SD-JWT VC Implementation
- Uses **SHA-256** for selective disclosure hashing
- Implements **base64url encoding** for disclosures
- Supports **partial disclosure verification**
- Detects **tampering attempts**

### Cryptographic Features
- **Key pair generation** using Web Crypto API
- **Digital signatures** with JOSE library
- **Hash-based commitments** for selective disclosure
- **Secure random salt generation**

## Why This Matters for Interviews 🎯

You're learning to be a **digital certificate expert** who can:
- Build systems that create trustworthy certificates
- Verify certificates are real and not fake
- Protect people's privacy with selective disclosure
- Handle all the tricky edge cases

The interviewers will be impressed that you understand both the **simple version** (JWT VC) and the **privacy-protecting version** (SD-JWT VC)!

## Key Concepts Mastered 📚

### Core VC Concepts
- **W3C VC Data Model** compliance
- **Issuer-Holder-Verifier** triangle
- **Cryptographic proof** mechanisms
- **Selective disclosure** privacy

### Technical Skills
- **JWT structure** and validation
- **Digital signatures** with ES256
- **Hash-based commitments**
- **Base64url encoding/decoding**
- **Error handling** and edge cases

### Security Considerations
- **Signature verification**
- **Expiration checking**
- **Tampering detection**
- **Privacy preservation**

**You're basically becoming a digital certificate superhero!** 🦸‍♀️

---

## Contributing
Feel free to add more test scenarios or improve the implementations. This project is designed for learning and interview preparation.

## License
MIT License - Feel free to use this for your learning !