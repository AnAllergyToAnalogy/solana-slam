import { BN } from "bn.js";
import {
    Keypair,
    PublicKey,
  } from "@solana/web3.js";
import { integerToByteArray, stringToByteArray } from "./typeFunctions";


export function sleep(ms: number): Promise<void> {
    // Wait for ms milliseconds
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function pdaExists(accountFunc: Function, address): Promise<Boolean>{
    // Returns true if account exists for given account fetching func and address
    try{
        let acct = await accountFunc(address);
        return Boolean(acct);
    }catch(e){
        return false;
    }
}



export function getPDA(seeds: any[] = [], programId): PublicKey{
    // returns just PDA address for given a seeds and programID
    return getPDAWithBumps(seeds,programId)[0];
}

//Generates a PDA key from seeds, can passs pubkeys and strings
export function getPDAWithBumps(seeds: any[] = [],programId): [PublicKey, number]{
    // Seeds can be a mixed array of publicKeys and strings
    //   Returns the public key of the PDA, and the bumps

    const _seeds: Buffer[] = []; //Encode the human readable stuff
    seeds.map(seed => {
        if(Buffer.isBuffer(seed)){
            _seeds.push(seed);
        }else if(Array.isArray(seed)){
            _seeds.push(integerToByteArray(seed[0],seed[1]))
        }else{
            switch(typeof seed){
                case "number":
                case "bigint":

                //TODO: 9 might be for u64 only, might be number of bytes
                    _seeds.push(new BN(seed.toString()).toArrayLike(Buffer, "le", 8));
                    break;
                case "string":
                    //It was a string
                    _seeds.push(stringToByteArray(seed));
                    break;
                default:
                    //Assume it was a key
                    _seeds.push(seed.toBuffer());
                    break;

            }
        }
    })
    
    const [thisPDA, bumps] = PublicKey.findProgramAddressSync(
        _seeds,
        programId,
    )

    return [thisPDA, bumps];
}



export function logAddress(signer: Keypair){
    // Logs the address of given signer
    console.log( signer.publicKey.toString() );
}


export const isSameKey = (key0: PublicKey,key1: PublicKey): boolean => {
    // returns true if key0 == key1
    return cleanKey(key0) === cleanKey(key1);
}


export function cleanKey(publicKey: PublicKey): string{
    // return public key, cast to string, lowercased
    return publicKey.toString().toLowerCase();
}

