import {
    PublicKey,
    LAMPORTS_PER_SOL
  } from "@solana/web3.js";

import { ACCOUNT_SIZE, AccountLayout, 
    getAssociatedTokenAddressSync, MINT_SIZE, MintLayout, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getClient } from "./client";

export function getTokenAccount( userAccount: PublicKey, mint: PublicKey, isPda: boolean = false, programId = TOKEN_PROGRAM_ID){
    const tokenAccount = getAssociatedTokenAddressSync(
      mint,
      userAccount,
      isPda,
      programId,
    );
    return tokenAccount;
}
export function getTokenBalanceOfUser( userAccount: PublicKey, mint: PublicKey, isPda: boolean = false, programId = TOKEN_PROGRAM_ID){
    const tokenAccount = getTokenAccount(userAccount, mint, isPda, programId);
    return getTokenBalance(tokenAccount);
}
export function getTokenBalance( tokenAccount: PublicKey) {
    try{
        const acct = getClient().getAccount(tokenAccount);
        if(!acct) return 0n;
        const info =  AccountLayout.decode(acct.data, 0);
        const amount = BigInt(info.amount);

        return amount;
    }catch(e){
        return 0n;
    }
}


type TokenInterface = {
  mint: PublicKey,
  tokenProgram: PublicKey,
  
  initAccount: Function,

  getAccount: Function,
  getBalance: Function,
  getBalanceOfUser: Function,
  getBalanceOfSigner: Function,

}

export function createTokenInterface(options = {
    mint:       null,
    token2022:  false,
    decimals:   6n,
    supply:     1_000_000_000n,
  }): TokenInterface{

    if(!options.token2022) options.token2022 = false;
    if(typeof options.decimals === "undefined") options.decimals = 6n;
    if(typeof options.supply === "undefined") options.supply = 1_000_000_000n;


    let TOKEN_PROGRAM = options.token2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

    // if mint is null, create a random one
    let mint: PublicKey;
    if(!options.mint){
        mint = PublicKey.unique();
    }else{
        mint = options.mint;
    }

    function initMint(
        mint: PublicKey,
        owner: PublicKey = TOKEN_PROGRAM
      ) {
        const mintData = Buffer.alloc(MINT_SIZE);
      
        MintLayout.encode(
          {
            mintAuthority: PublicKey.default,
            mintAuthorityOption: 0,
            supply: BigInt(options.supply * 10n ** options.decimals),
            decimals: Number(options.decimals),
            isInitialized: true,
            freezeAuthority: PublicKey.default,
            freezeAuthorityOption: 0,
          },
          mintData
        );
      
        getClient().setAccount(mint, {
          data: mintData,
          executable: false,
          lamports: LAMPORTS_PER_SOL,
          owner,
        });
    }

    function initAta(
        owner: PublicKey,
        amount: number = 0
      ) {
        const ataData = Buffer.alloc(ACCOUNT_SIZE);
      
        AccountLayout.encode(
          {
            amount: BigInt(amount),
            closeAuthority: owner,
            closeAuthorityOption: 1,
            delegate: PublicKey.default,
            delegatedAmount: 0n,
            delegateOption: 0,
            isNative: 0n,
            isNativeOption: 0,
            mint,
            owner,
            state: 1,
          },
          ataData
        );
      
        //@ts-ignore
        const tokenProgram = getClient().getAccount(mint).owner;

      
        const ata = getAssociatedTokenAddressSync(
          mint,
          owner,
          !PublicKey.isOnCurve(owner),
          tokenProgram
        );
      
        getClient().setAccount(ata, {
          data: ataData,
          executable: false,
          lamports: LAMPORTS_PER_SOL,
          owner: tokenProgram,
        });

        return ata;
      }



    initMint(mint,TOKEN_PROGRAM);    

    const getAccount = (userAccount: PublicKey)=>{
        const isPda = !PublicKey.isOnCurve(userAccount)
        return getTokenAccount(userAccount,mint, isPda, TOKEN_PROGRAM);
    }
    const getBalanceOfUser = (userAccount: PublicKey) =>{
        const isPda = !PublicKey.isOnCurve(userAccount);
        return getTokenBalanceOfUser( userAccount, mint, isPda, TOKEN_PROGRAM);
    }
    const getBalanceOfSigner = (signer)=>{
        const userAccount = signer.publicKey;
        return getTokenBalanceOfUser( userAccount, mint, false, TOKEN_PROGRAM);
    }
    const getBalance = ( tokenAccount: PublicKey) =>{
        return getTokenBalance(tokenAccount);
    } 

    return {
        mint,
        tokenProgram: TOKEN_PROGRAM,

        initAccount: initAta,

        getAccount,
        getBalance,
        getBalanceOfUser,
        getBalanceOfSigner,
    }

}


