# Program

> [Main Readme](../../README.md) > Program

### Create Program

```typescript
const myProgram = createProgram<YourProgramType>(yourProgramIdl)
```

Initialises a `@solana/web3.js` program and build a program interface/helper.


### Helper

The helper is an object with the following properties

- [`instruction name`]: every instruction also has a dedicated property for just sending a tx with that instruction. ([see Transactions section](#transactions))
- `tx`: an object that also has a property for each instruction to send as a tx. This is for the rare occassions when one 
- `ix`: an object whose properties are functions for creating instructions, with the instruction names as keys ([see Instructions section](#instructions))
- `account`: an object whose properties are functions for retreving each account, with the account name as keys ([see Account section of this page](#account))
- `id`: the programId as a string
- `pda`: a function for getting PDA addresses for this program ([see PDA section of this page](#PDAs))
- `program`: the `@solana/web3.js` program object, in case you need to do stuff closer to the metal.
of your program's instructions has the same name as one of the properties of the helper object.

### Transactions
If you just want to send a tx with a program instruction, it can be done directly with the tx's property, ie
```typescript
await myProgram.myFunction(someParam, someOtherParam);
```

Or the exact same thing as a sub-property of the `tx` property:
```typescript
await myProgram.tx.myFunction(someParam, someOtherParam);
```

Where possible, the program will infer account addresses fromthe IDL. But in cases where it can not be inferred, or you want to overwrite any inferred account addresses, use `addAccounts()`.

For info on how to add accounts to txs, see the [Account docs](./ACCOUNTS.md). For info on how to change signers, and add additional signers to your tx, see the [Signers docs](./SIGNERS.md).


### Instructions
Sometimes you want to bundle a bunch of ix's into a single tx. It can be done using sub-properties of the `ix` property. ie:
```typescript
const ix0 = await myProgram.ix.myFunction(someParam, someOtherParam);
const ix1 = await myProgram.ix.anotherFunction(aThirdParam);

await sendTransaction([ix0,ix1]);
```

The instruction will process any [added accounts](./ACCOUNTS.md) at the point of funtion invocation, not when the tx is sent. 

For info on the `sendTransaction` function, see the [Transaction docs](./TRANSACTION.md).




### Account
Every account has a sub-property of `account` that can be used for fetching accounts of that type.
If you know the account address, you can fetch it as follows:

```typescript
const accountData = await myProgram.account.myAccountType(addressAsPublicKey);
```
or you can pass an array and it will assume it is seeds for a PDA:
```typescript
const accountData = await myProgram.account.myAccountType(["seeds","for","another","pda"]);
```

It will return an object with the account data if the account exists, or `null` if it doesn't. All integers in the returned object are BigInts, not BNs.

[See the PDA section](#PDAs) of this page for info on passing different types of seeds.



### PDAs

You can get PDAs of the program by using the `pda` function and passing seeds. Atm it can accept strings, public keys, and integers as seeds.



For seeds that are strings, simply pass a string.

If a public key is required as a seed, then just using a `@solana/web3.js` `PublicKey` type is accepted.

For integer types, they follow the [integer pattern](../INTEGERS.md) of `[value, size]`, which is needed so the PDA calcs know how to pack the data.

_example:_


```typescript
// A string
const myString = "someString";

// The public key of the current signer
const myPublicKey = getSigner().publicKey;

// A u32 with the value of 1234
const myInteger = [1234n, 32n];

// Get a PDA that uses all of them as seeds
const theAddress = await myProgram.pda([myString, myPublicKey, myInteger]);
```
