import { fromWorkspace, LiteSVMProvider} from "anchor-litesvm";
import {
    PublicKey,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL
  
  } from "@solana/web3.js";
import { setAdditionalSigners, setSigner } from "./signers";

type LiteSVM = ReturnType<typeof fromWorkspace>

let client: LiteSVM;
let provider : LiteSVMProvider;

export function getClient(): LiteSVM{
    if(!client) throw new Error("Client not found.");
    return client;
}
export function getProvider(): LiteSVMProvider{
    if(!provider) throw new Error("Provider not found.");
    return provider;
}

export type ExtraProgram = {
    name: String,
    programId: PublicKey
}

export function getBalance(address){
    return getClient().getBalance(address);
}



export async function initEnvironment(liteSVMClient: LiteSVM, extraSigners: Keypair[] = [], extraPrograms: ExtraProgram[] = [], initalBalance: bigint = 100_000n * BigInt(LAMPORTS_PER_SOL)): Promise<Keypair>{

    client = liteSVMClient;

    extraPrograms.forEach(program =>{
        client.addProgramFromFile(program.programId,`tests/fixtures/${program.name}.so`);    
    })
    
    provider  = new LiteSVMProvider(client);

    let payer  = new Keypair();

    // Fund Main Acccount
    client.airdrop(payer.publicKey, initalBalance);

    // Fund Extra Signers
    extraSigners.forEach(signer =>{
        client.airdrop(signer.publicKey, initalBalance);
    })

    setSigner(payer);
    setAdditionalSigners([])

    return payer;
}

