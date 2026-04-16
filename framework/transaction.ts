import {
    Transaction,
} from "@solana/web3.js";

import { getAdditionalSigners, getSigner } from "./signers";
import { getClient } from "./client";


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
        const meta = txResult.meta();
        const logs = meta.logs();

        throw new Error(logs.toString());

    }else{

    }

    return txResult;
}
