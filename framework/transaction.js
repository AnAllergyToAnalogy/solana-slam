"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = sendTransaction;
const web3_js_1 = require("@solana/web3.js");
const signers_1 = require("./signers");
const client_1 = require("./client");
async function sendTransaction(instructions) {
    const tx = new web3_js_1.Transaction();
    let latestBlockhash = (0, client_1.getClient)().latestBlockhash();
    tx.recentBlockhash = latestBlockhash;
    tx.add(...instructions);
    tx.feePayer = (0, signers_1.getSigner)().publicKey;
    tx.sign((0, signers_1.getSigner)(), ...(0, signers_1.getAdditionalSigners)());
    const txResult = (0, client_1.getClient)().sendTransaction(tx);
    //@ts-ignore
    if (txResult.err) {
        //@ts-ignore
        const meta = txResult.meta();
        const logs = meta.logs();
        throw new Error(logs.toString());
    }
    else {
    }
    return txResult;
}
