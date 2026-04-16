"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integerTypeToSize = integerTypeToSize;
exports.isIntergerType = isIntergerType;
exports.integerToByteArray = integerToByteArray;
exports.stringToByteArray = stringToByteArray;
const bn_js_1 = require("bn.js");
function integerTypeToSize(type) {
    // Returns number of bits for provided integer type string
    return type.substring(1);
}
function isIntergerType(type) {
    if (!type)
        return false;
    // Boolean, returns true if type is an integer type
    const types = ["isize", "usize"];
    for (let i = 0; i < 8; i++) {
        const s = 8 * (2 ** i);
        types.push("u" + s);
        types.push("i" + s);
    }
    return types.includes(type);
}
function integerToByteArray(value, size) {
    // converts given value and size (in bits) into byte array
    value = BigInt(value);
    size = Number(size);
    if (value < 0n) {
        value = (2n ** BigInt(size)) + value;
    }
    return new bn_js_1.BN(value.toString()).toArrayLike(Buffer, "le", size / 8);
}
function stringToByteArray(str) {
    // converts string into byte array
    return Buffer.from(str);
}
