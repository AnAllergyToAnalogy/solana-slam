# Type Functions

> [Main Readme](../../README.md) > [Utils](../utils/UTILS.md) > Type Functions

Some functions for dealing with @solana/web3.js types. You probably won't use them they're more internally useful in the framework.

### Integer Type To Size
```typescript
function integerTypeToSize(type: string): string
```
Takes an integer type string (`u8`,`u16`,`i8`, etc.) and returns the number of bits in that type.


### Is Integer Type
```typescript
function isIntergerType(type: string | null): boolean
```
Takes a string and returns `true` if its an integer type string (`u8`,`u16`,`i8`, etc.).

### Integer To Byte Array
```typescript
function integerToByteArray(value: any,size: any): Buffer
```
Takes a value, and an integer type size and converts it into a buffer array as though the `value` was an integer of `size` size.

### String To Byte Array
```typescript
function stringToByteArray(str): Buffer
```
Takes a string and converts it to a byte array.