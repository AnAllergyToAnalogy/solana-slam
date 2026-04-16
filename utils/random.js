"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RBInt = RBInt;
exports.RArray = RArray;
exports.Chance = Chance;
function RBInt(min, max) {
    // Random bigInt between min and max
    min = BigInt(min);
    max = BigInt(max);
    function randomDigit() {
        return BigInt(Math.floor(Math.random() * 10));
    }
    const dif = BigInt(max - min);
    const digits = dif.toString().length;
    let val = 0n;
    for (let i = 0; i < digits; i++) {
        val += randomDigit() * (10n ** BigInt(i));
    }
    if (val > dif) {
        val %= dif;
    }
    return val + min;
}
function RArray(array) {
    // Returns a random element from array
    return array[Math.floor(Math.random() * array.length)];
}
function Chance(pr) {
    // Randomly returns true with probability of true being pr
    return Math.random() < pr;
}
