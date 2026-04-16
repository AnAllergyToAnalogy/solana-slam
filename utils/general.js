"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameKey = void 0;
exports.sleep = sleep;
exports.pdaExists = pdaExists;
exports.getPDA = getPDA;
exports.getPDAWithBumps = getPDAWithBumps;
exports.logAddress = logAddress;
exports.cleanKey = cleanKey;
const bn_js_1 = require("bn.js");
const web3_js_1 = require("@solana/web3.js");
const typeFunctions_1 = require("./typeFunctions");
function sleep(ms) {
    // Wait for ms milliseconds
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function pdaExists(accountFunc, address) {
    // Returns true if account exists for given account fetching func and address
    try {
        let acct = await accountFunc(address);
        return Boolean(acct);
    }
    catch (e) {
        return false;
    }
}
function getPDA(seeds = [], programId) {
    // returns just PDA address for given a seeds and programID
    return getPDAWithBumps(seeds, programId)[0];
}
//Generates a PDA key from seeds, can passs pubkeys and strings
function getPDAWithBumps(seeds = [], programId) {
    // Seeds can be a mixed array of publicKeys and strings
    //   Returns the public key of the PDA, and the bumps
    const _seeds = []; //Encode the human readable stuff
    seeds.map(seed => {
        if (Buffer.isBuffer(seed)) {
            _seeds.push(seed);
        }
        else if (Array.isArray(seed)) {
            _seeds.push((0, typeFunctions_1.integerToByteArray)(seed[0], seed[1]));
        }
        else {
            switch (typeof seed) {
                case "number":
                case "bigint":
                    //TODO: 9 might be for u64 only, might be number of bytes
                    _seeds.push(new bn_js_1.BN(seed.toString()).toArrayLike(Buffer, "le", 8));
                    break;
                case "string":
                    //It was a string
                    _seeds.push((0, typeFunctions_1.stringToByteArray)(seed));
                    break;
                default:
                    //Assume it was a key
                    _seeds.push(seed.toBuffer());
                    break;
            }
        }
    });
    const [thisPDA, bumps] = web3_js_1.PublicKey.findProgramAddressSync(_seeds, programId);
    return [thisPDA, bumps];
}
function logAddress(signer) {
    // Logs the address of given signer
    console.log(signer.publicKey.toString());
}
const isSameKey = (key0, key1) => {
    // returns true if key0 == key1
    return cleanKey(key0) === cleanKey(key1);
};
exports.isSameKey = isSameKey;
function cleanKey(publicKey) {
    // return public key, cast to string, lowercased
    return publicKey.toString().toLowerCase();
}
