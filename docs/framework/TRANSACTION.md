# Transactions

> [Main Readme](../../README.md) > Transactions

The framework provides a function for sending a tx with any `@solana/web3.js` instructions, not just those from programs. It will be signed by the current signer and any additional signers you have provided. 

### Send Transaction

```typescript
async function sendTransaction(instructions: any[] )
```
