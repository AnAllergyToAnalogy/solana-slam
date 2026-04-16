"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTime = getCurrentTime;
exports.advanceSeconds = advanceSeconds;
exports.advanceMinutes = advanceMinutes;
exports.advanceHours = advanceHours;
exports.advanceDays = advanceDays;
const client_1 = require("./client");
function getCurrentTime() {
    const currentClock = (0, client_1.getClient)().getClock();
    return BigInt(currentClock.unixTimestamp);
}
function advanceSeconds(seconds) {
    const currentClock = (0, client_1.getClient)().getClock();
    currentClock.unixTimestamp += seconds;
    (0, client_1.getClient)().setClock(currentClock);
}
;
function advanceMinutes(minutes) {
    advanceSeconds(BigInt(minutes) * 60n);
}
function advanceHours(hours) {
    advanceSeconds(BigInt(hours) * 60n);
}
function advanceDays(days) {
    advanceSeconds(BigInt(days) * 24n);
}
