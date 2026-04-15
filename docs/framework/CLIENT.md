# Client and Environment

> [Main Readme](../../README.md) > Client and Environment

### Init Environment

```typescript
async function initEnvironment(liteSVMClient: LiteSVM, extraSigners: Keypair[] = [], extraPrograms: ExtraProgram[] = [], initalBalance: bigint = 100_000n * BigInt(LAMPORTS_PER_SOL)): Promise<Keypair>
 ```

Initialises the full LiteSVM environment, fund signer accounts, etc. `liteSVMClient` is the client returned from the function `fromWorkspace` in `anchor-litesvm`. If you want to reset the environment, call `fromWorkspace` and get a new client. It returns the keypair of a signer that gets created during instantiation.

`extraSigners` is an array of keypairs that you want funded.

`initialBalance` is the amount of SOL you want the the initial signer and any extra signers to have.

#### Extra Programs

`extraPrograms` is an array of extra programs to load into the environment. The `ExtraProgram` type is as follows:

```typescript
type ExtraProgram = {
    name: String,
    programId: PublicKey
}
```

Extra programs must also be included in your tests by configuring your Anchor.toml file. Ie,
```toml
# In your Anchor.toml

[[test.genesis]]
address = "YOUR_PROGRAM_ID"
program = "path/to/program.so"
upgradeable = false 
```


_example:_
Assuming you loaded `someProgram.so` in and its programId is `someProgramId`, and `someOtherProgram.so` with id `someOtherProgram.so`
```typescript
const extraPrograms = [
    {
        name: 'someProgram',
        programId: new PublicKey('someProgramId'),
    },
    {
        name: 'someOtherProgram',
        programId: new PublicKey('someOtherProgramId'),
    },

]
initEnvironment(liteSVMClient, [], extraPrograms);
```

As mentioned in the [Time Manipulation docs](../framework/TIME.md), only forward time travel is possible. So if you want to test mutually exclusive behaviours, its suggested that for each test you create a new LiteSVM client, then re-call `initEnvironment`.

### Get SOL balance of account

```typescript
function getBalance(address: PublicKey): BigInt
```
Just wraps around the LiteSVM `getBalance` function, but means you dont have toreference the client explicitly each time, and will return `0n` in cases where the account doesn't exist rather than `null`.


### Get Client
```typescript
function getClient(): LiteSVM
```
Just returns the current client. Mostly internally useful.

### Get Provider
```typescript
function getProvider(): LiteSVMProvider
```
Just returns the provider current liteSVM client. Mostly internally useful.
