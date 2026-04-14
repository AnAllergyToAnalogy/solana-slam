# General Utils

> [Main Readme](../../README.md) > [Utils](../utils/UTILS.md) > General

General functions that dont fit in any other category but are useful for Solana tests. Some of them more than others.

### Sleep
```typescript
function sleep(ms: number): Promise<void>
```
Returns a promise that resolves after the defined number of milliseconds

### PDA Exists
```typescript
async function pdaExists(accountFunc: Function, address): Promise<Boolean>
```
`accountFunc` is a function that fetches an account for a given address, or fails if the account doesnt exist. `address` is the address passed to `accountFunc`. 

### Get PDA
```typescript
function getPDA(seeds: any[] = [], programId): PublicKey
```
Returns the PDA for a given programId and array of seeds.

### Get PDA With Bumps
```typescript
function getPDAWithBumps(seeds: any[] = [],programId): [PublicKey, number]
```
The same as above, except it returns the bumps as well

### Log Address
```typescript
function logAddress(signer: Keypair)
```
Just console.log the address of a given signer. This has some use when debugging if you dont wanna have to write out `someSigner.publicKey.toString()` a billion times.

### Is Same key
```typescript
function isSameKey(key0: PublicKey, key1: PublicKey): boolean
```
Returns `true` if both keys match.

### Clean Key
```typescript
function cleanKey(publicKey: PublicKey): string
```
Takes an address, converts it to a lowercase string. Useful for comparisons.
