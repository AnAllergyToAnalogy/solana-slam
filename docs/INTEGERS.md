# Integers

> [Main Readme](../../README.md) > Integers

Despite internally using `@solana/web3.js` and therefore `bn.js` for larger integers, the framework is designed so you should never have to use them. Any function, including program instructions, accept and return `bigint`s for integer types.


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