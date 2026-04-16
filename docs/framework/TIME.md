# Time Manipulation

> [Main Readme](../../README.md) > Time Manipulation

The framework provides a few functions for easily manipulating time.

### Get Current Time

```typescript
function getCurrentTime(): bigint
```
Returns the current time according to your LiteSVM client. Note, this is not your system time, and should be manipulated using time-advancing functions. 


### Advance time by seconds
```typescript
function advanceSeconds(seconds: bigint)
```
Adjusts the current unix time of your client by `seconds`. Note, Solana unix timestamp is in seconds, not milliseconds.

### Advance time by Minutes, Hours or Days

The following aliases exist purely for making tests more readable when dealing with time manipulation.
```typescript
function advanceMinutes(minutes)
function advanceHours(hours)
function advanceDays(days);
```

### Reversing Time

Note due to limits of LiteSVM, moving backwards in time is not possible. Rather than snapshotting a point in time, I find it easier to just have beforeEach conditions that recreate the same state for each test when needing to test mutually exclusive paths.

LiteSVM is very fast so it will only add a few ms to your test run time.