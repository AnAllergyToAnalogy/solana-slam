import {
    Keypair,
  
  } from "@solana/web3.js";

let activeSigner: Keypair;
let additionalSigners: Keypair[] = []


export function setSigner(signer: Keypair){
    activeSigner = signer;
}
export function setAdditionalSigners(_additionalSigners: Keypair[] = []){
    additionalSigners = _additionalSigners;
}
export function getSigner(): Keypair{
    return activeSigner;
}
export function getAdditionalSigners(): Keypair[]{
    return additionalSigners;
}
export function generateSignerKeypairs(signerCount = 10): Keypair[]{
    let signers: Keypair[] = []
    for(let i = 0; i < signerCount; i++){
        let _signer = Keypair.generate();
        signers.push(_signer)
    }
    return signers;
}

