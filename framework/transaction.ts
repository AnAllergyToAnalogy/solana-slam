import {
    Transaction,
} from "@solana/web3.js";

import { getAdditionalSigners, getSigner } from "./signers.js";
import { getClient } from "./client.js";


export async function sendTransaction(instructions: any[] ) {
    const tx = new Transaction();

    let latestBlockhash = getClient().latestBlockhash();

    tx.recentBlockhash = latestBlockhash;

    tx.add(...instructions);
    tx.feePayer = getSigner().publicKey;

    tx.sign(getSigner(), ...getAdditionalSigners());

    const txResult = getClient().sendTransaction(tx);


    //@ts-ignore
    if(txResult.err){
        
        //@ts-ignore
        const logs = txResult.meta().logs();
        throw new Error(logs.toString());

    }else{

    }

    return txResult;
}
