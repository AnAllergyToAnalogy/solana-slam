"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSigner = setSigner;
exports.setAdditionalSigners = setAdditionalSigners;
exports.getSigner = getSigner;
exports.getAdditionalSigners = getAdditionalSigners;
exports.generateSignerKeypairs = generateSignerKeypairs;
const web3_js_1 = require("@solana/web3.js");
let activeSigner;
let additionalSigners = [];
function setSigner(signer) {
    activeSigner = signer;
}
function setAdditionalSigners(_additionalSigners = []) {
    additionalSigners = _additionalSigners;
}
function getSigner() {
    return activeSigner;
}
function getAdditionalSigners() {
    return additionalSigners;
}
function generateSignerKeypairs(signerCount = 10) {
    let signers = [];
    for (let i = 0; i < signerCount; i++) {
        let _signer = web3_js_1.Keypair.generate();
        signers.push(_signer);
    }
    return signers;
}
