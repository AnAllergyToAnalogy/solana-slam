import {
    PublicKey,
  } from "@solana/web3.js";

export let manuallyAddedAccounts: { [key: string]: PublicKey } = {};
export function addAccounts(accts: { [key: string]: PublicKey } = {}){
    for(let a in accts){
        manuallyAddedAccounts[a] = accts[a];
    }
}
export function clearAddedAccounts(){
    manuallyAddedAccounts = {};
}
export function getAddedAccounts(): { [key: string]: PublicKey }{
    return manuallyAddedAccounts;
}