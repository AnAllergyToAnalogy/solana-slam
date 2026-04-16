# Signers

> [Main Readme](../../README.md) > Signers

The framework allows you to easily switch which account will be used to sign txs. You can also add additional signers who will also sign txs. These signers are used whenever a program helper tx is invoked, or when `sendTransaction` is used.

### Set Primary Signer
```typescript
function setSigner(signer: Keypair)
```
Changes the current primary signer. This overwrites the previous one.

### Set Additional Signers
```typescript
function setAdditionalSigners(_additionalSigners: Keypair[] = [])
```
Sets the array of additional signers that will be used to sign txs. It overwrites any previously set additional signers.

### Get Primary Signer
```typescript
function getSigner(): Keypair
```
Returns the current primary signer

### Get Additional Signers
```typescript
function getAdditionalSigners(): Keypair[]
```
Returns the current array of additional signers


### Generate Signer Keypairs
```typescript
function generateSignerKeypairs(signerCount = 10): Keypair[]
```
This is just a shorthand way of generating a bunch of keypairs, which can be handy when setting up your test.
