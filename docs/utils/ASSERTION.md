# Assertion

> [Main Readme](../../README.md) > [Utils](../utils/UTILS.md) > Assertion

Various functions that make checking for tx success and specific failure easier, and for checking differences in object properties (useful for data returned from accounts).


### Succeeds

```typescript
 async function succeeds(attempt: Function,showError: boolean = false, message: string | object = "")
 ```

 Will cause a test to if the `attempt` function throws an error. `attempt` can be async. If `showError` is true, it will log the error. `message` is the error message that will show with the failed test.

 ### Fails
 ```typescript
async function fails(attempt: Function,message: string | object = "")
 ```

 Will cause test to fail if `attempt` function does not throw an error. `attempt` can be async. `message` is the error message that will show with the failed test.


 ### Fails With Code
 ```typescript
async function failsWithCode(attempt: Function, reason: string)
 ```
 Will cause test to fail if `attempt` function does not fail due to the specific Anchor error code. `attempt` can be async. `reason` is anchor error code as hex.

 ### Fails Correctly
```typescript
async function failsCorrectly(attempt: Function, reason: string)
```
 Will cause test to fail if `attempt` function does not fail due to the specific program-defined error string passed as `reason`. `attempt` can be async. 
 

 ### Assert Difference

 ```typescript
 function assertDifference (before, after, property: string,difference) 
```
 Assert that a given property of two specified objects has the difference of the amount `difference`.

`before` and `after` are both objects with property `property`. Property be a numeric type.


### Assert Differences

```typescript
function assertDifferences(before, after, differences)
```

The same as the above, except `differences` is an object, whose keys are also keys of `before` and `after`, and whose values are the difference between `before` and `after`.


### Assert Value

 ```typescript
 function assertValue (before, after, property: string, value) 
```

 Assert that a given property of two specified objects is different, and that the value of this property on `after` is equal to `value`.

`before` and `after` are both objects with property `property`.

### Assert Values
```typescript
 function assertValues (efore, after, values) 
```

The same as the above, except `differences` is an object, whose keys are also keys of `before` and `after`, and whose values are the values of `after`.


### Todo

```typescript
function todo()
```

Always causes a test to fail with the error message 'TODO'. Handy when sketching out tests before writing them, to make sure they fail before being written.