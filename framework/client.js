"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = getClient;
exports.getProvider = getProvider;
exports.getBalance = getBalance;
exports.initEnvironment = initEnvironment;
const anchor_litesvm_1 = require("anchor-litesvm");
const web3_js_1 = require("@solana/web3.js");
const signers_1 = require("./signers");
let client;
let provider;
function getClient() {
    if (!client)
        throw new Error("Client not found.");
    return client;
}
function getProvider() {
    if (!provider)
        throw new Error("Provider not found.");
    return provider;
}
function getBalance(address) {
    const balance = getClient().getBalance(address);
    if (!balance)
        return 0n;
    return balance;
}
async function initEnvironment(liteSVMClient, extraSigners = [], extraPrograms = [], initalBalance = 100000n * BigInt(web3_js_1.LAMPORTS_PER_SOL)) {
    client = liteSVMClient;
    extraPrograms.forEach(program => {
        client.addProgramFromFile(program.programId, `tests/fixtures/${program.name}.so`);
    });
    provider = new anchor_litesvm_1.LiteSVMProvider(client);
    let payer = new web3_js_1.Keypair();
    // Fund Main Acccount
    client.airdrop(payer.publicKey, initalBalance);
    // Fund Extra Signers
    extraSigners.forEach(signer => {
        client.airdrop(signer.publicKey, initalBalance);
    });
    (0, signers_1.setSigner)(payer);
    (0, signers_1.setAdditionalSigners)([]);
    return payer;
}
