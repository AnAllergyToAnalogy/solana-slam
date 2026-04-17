# SLAM Test Framework

### **S**olana, **L**iteSVM, **A**nchor, **M**ocha

An extremely opinionated test framework for writing tests in Anchor using LiteSVM and Mocha. I developed this for my own use, but have decided to publish it as the Solana dev ecosystem is generally pretty abysmal and apparently people have issues writing tests with the existing tools, and nobody benefits from poorly tested programs except for blackhats. 

The test framework uses `@solana/web3.js` in stead of `@solana/kit` even though the former is deprecated because this is what is used out of the box with Anchor. 

Haven't tested this with Anchor `1.0.0`, it was developed for `0.32.1` and earlier. 

I'm skeptical that anyone will actually use this but in the event that they do I will tidy up the TS a little and add any additional functionality that is required.

[Skip to Contents](#contents)

[Skip to Example Tests](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/example/tests/slam-example.ts)

## Environment Setup

To initialise the full LiteSVM environment, fund signer accounts, etc, simply create a LiteSVM client and pass it to the following function:

```typescript
initEnvironment(yourLiteSVMClient);
```

For a completely clean slate for each test, this can and should be called before each.

Full detail available in the [Client section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/CLIENT.md) incuding funding additional signers and adding extra programs to the environment.

## Programs
To create an interface/helper for a program that has been loaded into your anchor tests, use the following:

```typescript
createProgram<YourProgramType>(yourProgramIdl)
```

This program helper has methods that make it easy to
- Send Transactions 
- Create Instructions
- Read accounts, and
- Get PDA addresses

_example:_
```typescript
const myProgram = createProgram<MyProgram>(myProgramIdl);

//Send a myFunction tx
await myProgram.myFunction(someParam, someOtherParam);

//Build a myFunction ix for sending later
const ix = await myProgram.ix.myFunction(someParam, someOtherParam);

// Get the address of a PDA
const address = await myProgram.pda(["seeds","for","the","pda"]);

// Read the value of an account that the program owns
//    You can either pass the address if you already know it,
const accountData = await myProgram.account.myAccountType(address);

//    Or you can pass the seeds like in the PDA function
const accountData = await myProgram.account.myAccountType(["seeds","for","another","pda"]);
```

Full details available in the [Program section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/PROGRAM.md)

## Signers

The framework allows you to switch between signers easily with
```typescript
setSigner(signerKeypair)
```

This will be the signer of all txs until you set it to a different signer.

You can add additional signers with 
```typescript
setAdditionalSigners([additional, signer, keypairs])
```

Full details available in the [Signers section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/SIGNERS.md)

## Accounts

The framework allows you to easily manage accounts included in a program tx. Where possible, program function and IX invocations will infer account addresses from the IDL. But in cases where it isn't possible, or if you want to overwrite the inferred account addresses, you can provide them with `addAccounts`.

```typescript
addAccounts({
    accountName: accountAddress,
    otherAccountName: otherAccountAddress,
})
```

These will be included with any program ix or tx until they are overwritten, or removed with 

```typescript
clearAddedAccounts()
```

Full details available in the [Accounts section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/ACCOUNTS.md)

## SPL Tokens

The framework makes use of the SPL programs being included in LiteSVM and provides an easy helper/interface for creating tokens and allocating them to minting them to accounts. It's useful if the programs you are testing use SPL tokens.

```typescript
//Create a new token and its helper
const aToken = createTokenInterface();

// Allocate 100 tokens to someGuy (assume decimals = 6)
const someGuysTokenAccountAddress = aToken.initAccount(someGuysPublicKey, 100_000_000 );

// Get his balance
const hisBalance = aToken.getBalance(someGuysTokenAccountAddress);

// Get his balance without knowing his token account address
const hisBalance = aToken.getBalanceOfUser(someGuysPublicKey);
```

Full details available in the [Token section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TOKEN.md)

## Integer types

Despite internally using `@solana/web3.js` and therefore `bn.js` for larger integers, the framework is designed so you should never have to use them. Any function, including program instructions, accept and return BigInts for integer types.

### With PDAs
Since PDAs pack data in a very specific way when deriving the address, when adding integers as seeds for PDAs, use the following format:
```typescript
[value, size_in_bits]
```

so a `u16` with the value of `1234` would be passed as
```typescript
[1234n,16n]
```

_example_
```typescript
// Your PDA seeds are "user" and then the index of the user as a u32, 
//  and you want to get user 67
const address = await myProgram.pda(["user",[67n, 32n]]);
```

Full details available in the [Integers section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/INTEGERS.md)


## Time Manipulation

The framework provides a few functions for easily manipulating time.

Get the current Unix timestamp according to your LiteSVM client with:
```typescript
const now = getCurrentTime()
```

And move forwards in time with the following functions
```typescript
advanceSeconds(seconds);
advanceMinutes(minutes);
advanceHours(hours);
advanceDays(days);
```

Note due to limits of LiteSVM, moving backwards in time is not possible. Rather than snapshotting a point in time, I find it easier to just have beforeEach conditions that recreate the same state for each test when needing to test mutually exclusive paths.

LiteSVM is very fast so it will only add a few ms to your test run time.

Full details available in the [Time section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TIME.md)

## Sending Transactions
The framework provides a function for sending a tx with any `@solana/web3.js` instructions, not just those from programs. It will be signed by the current signer and any additional signers you have provided. 


```typescript
sendTransaction([ix1,ix2, ix2])
```

Full details available in the [Transaction section of the docs](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TRANSACTION.md)



## Contents

### [Client and Environment](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/CLIENT.md)
Full details on initialise environment, getting account balance, and retreiving current environment objects.

### [Program](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/PROGRAM.md)
Full detail on program helper/interface.

### [Signers](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/SIGNERS.md)
Full detail on managing which accounts are signing txs

### [Accounts](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/ACCOUNTS.md)
Easily manage which accounts get included in txs

### [SPL Tokens](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TOKEN.md)
Create and manage SPL tokens within your tests.

### [Time Manipulation](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TIME.md)
Move forward in time.

### [Transactions](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/framework/TRANSACTION.md)
Sending txs.

### [Integers](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/INTEGERS.md)
Further detail on dealing with integers

### [Utils](https://github.com/AnAllergyToAnalogy/solana-slam/blob/main/docs/utils/UTILS.md)
Various utilities that aid tests but mostly don't do anything Solana / SVM specific. Includes funcs for easily catching program-specific and Anchor-specific failure states.

### [Example](https://github.com/AnAllergyToAnalogy/solana-slam/tree/main/example)
There is an example Anchor repo in [`/example`](https://github.com/AnAllergyToAnalogy/solana-slam/tree/main/example), with an example program and tests.