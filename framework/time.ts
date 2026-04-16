import { getClient } from "./client";

export function getCurrentTime(): bigint{
    const currentClock = getClient().getClock();
    return BigInt(currentClock.unixTimestamp);
}

export function advanceSeconds(seconds: bigint){
    const currentClock = getClient().getClock();

    currentClock.unixTimestamp += seconds;
    getClient().setClock(currentClock);

};
export function advanceMinutes(minutes){
    advanceSeconds(BigInt(minutes) * 60n );
}
export function advanceHours(hours){
    advanceSeconds(BigInt(hours) * 60n );
}
export function advanceDays(days){
    advanceSeconds(BigInt(days) * 24n );
}