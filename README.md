# SLAM Test Framework

### **S**olana, **L**iteSVM, **A**nchor, **M**ocha

An extremely opinionated test framework for writing tests in Anchor using LiteSVM and Mocha. I developed this for my own use, but have decided to publish it as the Solan dev ecosystem is generally pretty abysmal and apparently people have issues writing tests with the existing tools, and nobody benefits from poorly tested programs except for blackhats. 

The test framework uses `@solana/web3.js` in stead of `@solana/kit` even though the former is deprecated because this is what is used out of the box with Anchor. 

Haven't tested this with Anchor `1.0.0`, it was developed for `0.32.1` and earlier. 


## Integer types

Despite internally using `@solana/web3.js` and therefore `bn.js` for larger integers, the framework is designed so you should never have to use them. Any function, including program instructions, accept and return BigInts for integer types.


## Environment Setup

To initialise the full SVM environment, fund signer accounts, etc, simply create a LiteSVM client and pass it to the following function:

```typescript
initEnvironment(yourLiteSVMClient);
```

For a completely clean slate for each test, this can and should be called before each.

Full detail available in the [Client section of the docs](./docs/framework/CLIENT.ts) incuding funding additional signers and adding extra programs to the environment.

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

//TODO: integer type link here

// Read the value of an account that the program owns
//    You can either pass the address if you already know it,
const accountData = await myProgram.account.myAccountType(address);

//    Or you can pass the seeds like in the PDA function
const accountData = await myProgram.account.myAccountType(["seeds","for","another","pda"]);

```

Full details available in the [Program section of the docs](./docs/framework/PROGRAM.ts)



## SPL Tokens



## Contents


### [Program](./docs/framework/PROGRAM.md)
Full detail on program helper/interface.

### [Utils](./docs/utils/UTILS.md)
Various utilities that aid tests but mostly don't do anything Solana / SVM specific.
