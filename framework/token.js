"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenAccount = getTokenAccount;
exports.getTokenBalanceOfUser = getTokenBalanceOfUser;
exports.getTokenBalance = getTokenBalance;
exports.createTokenInterface = createTokenInterface;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const client_1 = require("./client");
function getTokenAccount(userAccount, mint, isPda = false, programId = spl_token_1.TOKEN_PROGRAM_ID) {
    const tokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, userAccount, isPda, programId);
    return tokenAccount;
}
function getTokenBalanceOfUser(userAccount, mint, isPda = false, programId = spl_token_1.TOKEN_PROGRAM_ID) {
    const tokenAccount = getTokenAccount(userAccount, mint, isPda, programId);
    return getTokenBalance(tokenAccount);
}
function getTokenBalance(tokenAccount) {
    try {
        const acct = (0, client_1.getClient)().getAccount(tokenAccount);
        if (!acct)
            return 0n;
        const info = spl_token_1.AccountLayout.decode(acct.data, 0);
        const amount = BigInt(info.amount);
        return amount;
    }
    catch (e) {
        return 0n;
    }
}
function createTokenInterface(options = {
    mint: null,
    token2022: false,
    decimals: 6n,
    supply: 1000000000n,
}) {
    if (!options.token2022)
        options.token2022 = false;
    if (typeof options.decimals === "undefined")
        options.decimals = 6n;
    if (typeof options.supply === "undefined")
        options.supply = 1000000000n;
    let TOKEN_PROGRAM = options.token2022 ? spl_token_1.TOKEN_2022_PROGRAM_ID : spl_token_1.TOKEN_PROGRAM_ID;
    // if mint is null, create a random one
    let mint;
    if (!options.mint) {
        mint = web3_js_1.PublicKey.unique();
    }
    else {
        mint = options.mint;
    }
    function initMint(mint, owner = TOKEN_PROGRAM) {
        const mintData = Buffer.alloc(spl_token_1.MINT_SIZE);
        spl_token_1.MintLayout.encode({
            mintAuthority: web3_js_1.PublicKey.default,
            mintAuthorityOption: 0,
            supply: BigInt(options.supply * 10n ** options.decimals),
            decimals: Number(options.decimals),
            isInitialized: true,
            freezeAuthority: web3_js_1.PublicKey.default,
            freezeAuthorityOption: 0,
        }, mintData);
        (0, client_1.getClient)().setAccount(mint, {
            data: mintData,
            executable: false,
            lamports: web3_js_1.LAMPORTS_PER_SOL,
            owner,
        });
    }
    function initAta(owner, amount = 0) {
        const ataData = Buffer.alloc(spl_token_1.ACCOUNT_SIZE);
        spl_token_1.AccountLayout.encode({
            amount: BigInt(amount),
            closeAuthority: owner,
            closeAuthorityOption: 1,
            delegate: web3_js_1.PublicKey.default,
            delegatedAmount: 0n,
            delegateOption: 0,
            isNative: 0n,
            isNativeOption: 0,
            mint,
            owner,
            state: 1,
        }, ataData);
        //@ts-ignore
        const tokenProgram = (0, client_1.getClient)().getAccount(mint).owner;
        const ata = (0, spl_token_1.getAssociatedTokenAddressSync)(mint, owner, !web3_js_1.PublicKey.isOnCurve(owner), tokenProgram);
        (0, client_1.getClient)().setAccount(ata, {
            data: ataData,
            executable: false,
            lamports: web3_js_1.LAMPORTS_PER_SOL,
            owner: tokenProgram,
        });
        return ata;
    }
    initMint(mint, TOKEN_PROGRAM);
    const getAccount = (ownerAddress) => {
        const isPda = !web3_js_1.PublicKey.isOnCurve(ownerAddress);
        return getTokenAccount(ownerAddress, mint, isPda, TOKEN_PROGRAM);
    };
    const getBalanceOfUser = (userAccount) => {
        const isPda = !web3_js_1.PublicKey.isOnCurve(userAccount);
        return getTokenBalanceOfUser(userAccount, mint, isPda, TOKEN_PROGRAM);
    };
    const getBalanceOfSigner = (signer) => {
        const userAccount = signer.publicKey;
        return getTokenBalanceOfUser(userAccount, mint, false, TOKEN_PROGRAM);
    };
    const getBalance = (tokenAccount) => {
        return getTokenBalance(tokenAccount);
    };
    return {
        mint,
        tokenProgram: TOKEN_PROGRAM,
        initAccount: initAta,
        getAccount,
        getBalance,
        getBalanceOfUser,
        getBalanceOfSigner,
    };
}
