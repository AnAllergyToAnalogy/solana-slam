# SPL Tokens

> [Main Readme](../../README.md) > SPL Tokens

The framework makes use of the SPL programs being included in LiteSVM and provides an easy helper/interface for creating tokens and allocating them to minting them to accounts. It's useful if the programs you are testing use SPL tokens.


### Create Token Interface
```typescript
function createTokenInterface(options = {
    mint:       null,
    token2022:  false,
    decimals:   6n,
    supply:     1_000_000_000n,
  }): TokenInterface
```

Creates a token interface. Ie, initialises an SPL Token in your LiteSVM environment and provides a helper for interacting with it. 

#### `mint`
The address of the token mint, if one is not provided, it will be randomly generated.

#### `token2022`
Boolean, `true` if you want the token to use the newer Token2022 program. Defaults to `false`, which uses the old SPL token program.

#### `decimals`
The number of decimals for the token to have. Ie, if it's set to `3`, then a balance of `1000` means you have 1 full token. Defaults to `6`.

#### `supply`
The initial value for the token's supply.



### Token Interface
The tokenInterface returned by `createTokenInterface` has the following type:
```typescript
type TokenInterface = {
  mint: PublicKey,
  tokenProgram: PublicKey,
  
  initAccount: Function,

  getAccount: Function,
  getBalance: Function,
  getBalanceOfUser: Function,
  getBalanceOfSigner: Function,
}
```

It's properties are defined as follows:

#### `mint`
The address of the token mint

#### `tokenProgram`
The address of the token program used (ie, depends on whether you optsed to use the Token2022 program).

#### `initAccount`
```typescript
function initAccount(owner: PublicKey,amount: number = 0 ): PublicKey
```
Initialises the Associated Token Account for `owner`, and allocates them `amount` tokens. Returns the address of the newly created ATA.


#### Get Account
```typescript
function getAccount(ownerAddress: PublicKey): PublicKey
```
Get the address of ATA associated with `ownerAddress`. 


#### Get Balance
```typescript
function getBalance(tokenAccount: PublicKey): bigint
```
Get the current balance of the ATA `tokenAccount`.

#### Get Balance of User
```typescript
function getBalanceOfUser(userAccount: PublicKey): bigint
```
Get the current balance of the ATA associated with `userAccount`. Note `userAccount` can be any public key, including a PDA.


#### Get Balance of Signer
```typescript
function getBalanceOfSigner(signer: Keypair): bigint
```
Get the current balance of the ATA associated with `signer`. Can be any keypair, doesn't have to be the current signer.



## Other Token Functions
There are a handful of token functions that you can use independantly of the token interface.

### Get Token Account
```typescript
function getTokenAccount( userAccount: PublicKey, mint: PublicKey, isPda: boolean = false, programId = TOKEN_PROGRAM_ID): PublicKey
```
Returns the ATA associated with `userAccount` for a token whose mint is `mint`, using the token program at `programId`.


### Get Token Balance
```typescript
function getTokenBalance( tokenAccount: PublicKey): bigint
```
Fetch the token balance of the provided ATA.

### Get Token Balance of User
```typescript
function getTokenBalanceOfUser( userAccount: PublicKey, mint: PublicKey, isPda: boolean = false, programId = TOKEN_PROGRAM_ID): bigint
```
Fetch the token balanec of the ATA associated with `userAccount` for a token whose mint is `mint`, using the token program at `programId`.
