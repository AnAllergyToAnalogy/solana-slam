# Random

> [Main Readme](../../README.md) > [Utils](../utils/UTILS.md) > Random

A few functions for making things easier with randomness.

### RBInt
```typescript
function RBInt(min: any,max: any ): bigint
```
Returns a random BigInt between the values `min` and `max`, inclusive of `min` but not `max`. 

### RArray
```typescript
function RArray(array: any[]): any
```
Returns a random element from the array passed.

### Chance
```typescript
function Chance(pr: number): boolean
``` 
Randomly returns `true` or `false` with probability of `true` being `pr` ( a number between 0 and 1).