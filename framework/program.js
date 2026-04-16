"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = createProgram;
const anchor_1 = require("@coral-xyz/anchor");
const anchorErrors_json_1 = __importDefault(require("../errors/anchorErrors.json"));
const bn_js_1 = require("bn.js");
const general_1 = require("../utils/general");
const client_1 = require("./client");
const accounts_1 = require("./accounts");
const transaction_1 = require("./transaction");
const typeFunctions_1 = require("../utils/typeFunctions");
const signers_1 = require("./signers");
function createProgram(idl) {
    const program = initProgram(idl);
    return ProgramHelper(program);
}
function initProgram(idl) {
    return new anchor_1.Program(idl, (0, client_1.getProvider)());
}
//Returns an object with all the program methods as methods that also send the tx with the current signer
function ProgramHelper(program) {
    // const program = initProgram<ProgramType>(idl);
    const helper = {
        account: {},
        id: '',
        ix: {},
        tx: {},
        pda: () => { },
        program: null,
    };
    const account = {};
    let ix = {};
    let tx = {};
    const id = program._programId;
    const pda = function (seeds) {
        return (0, general_1.getPDA)(seeds, id);
    };
    // Accounts
    if (program._idl.accounts) {
        for (let i = 0; i < program._idl.accounts.length; i++) {
            const acc = program._idl.accounts[i];
            const name = acc.name;
            // Look through "types" to find account struct to better map types
            let struct = null;
            for (let str of program._idl.types) {
                if (str.name.toLowerCase() === name.toLowerCase()) {
                    // This is the struct
                    struct = str;
                }
            }
            if (!struct) {
                throw new Error(`Unable to find struct for account: ${name}`);
            }
            account[name] = async function (seedsOrPublicKey) {
                let publicKey;
                if (Array.isArray(seedsOrPublicKey)) {
                    //They passed seeds
                    publicKey = (0, general_1.getPDA)(seedsOrPublicKey, program._programId);
                }
                else {
                    publicKey = seedsOrPublicKey;
                }
                let val;
                try {
                    val = await program.account[name].fetch(publicKey);
                }
                catch (e) {
                    if (e.toString().includes(`Could not find ${publicKey.toString()}`)) {
                        // Return null if account doesnt exist
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
                function getFieldType(name) {
                    if (!struct) {
                        throw new Error(`Unable to find struct for account: ${name}`);
                    }
                    for (let field of struct.type.fields) {
                        if (field.name === name) {
                            return field.type;
                        }
                    }
                    return null;
                }
                for (let v in val) {
                    if ((0, bn_js_1.isBN)(val[v]) || ((0, typeFunctions_1.isIntergerType)(getFieldType(v)))) {
                        val[v] = BigInt(val[v].toString());
                    }
                    else if (Array.isArray(val[v])) {
                        for (let u = 0; u < val[v].length; u++) {
                            if ((0, bn_js_1.isBN)(val[v][u])) {
                                val[v][u] = BigInt(val[v][u].toString());
                            }
                        }
                    }
                }
                return val;
            };
        }
    }
    for (let i = 0; i < program._idl.instructions.length; i++) {
        const ins = program._idl.instructions[i];
        const name = ins.name;
        const accounts = ins.accounts;
        const args = ins.args;
        const namedArgs = {};
        for (let j = 0; j < args.length; j++) {
            namedArgs[args[j].name] = j;
        }
        // TX
        tx[name] =
            helper[name] = async function () {
                const parsedArgs = [...arguments];
                const integerTypes = [
                    "u8", "u16", "u32", "u64", "u128",
                    "i8", "i16", "i32", "i64", "i128",
                ];
                for (let j = 0; j < args.length; j++) {
                    const arg = args[j];
                    if (typeof arg.type === "object" &&
                        arg.type.hasOwnProperty('array')) {
                        let t = arg.type.array;
                        // It is an array
                        //arg.type.array == [type, length]
                        let parg = [];
                        if (integerTypes.includes(t[0])) {
                            for (let k = 0; k < t[1]; k++) {
                                parg[k] = new bn_js_1.BN(parsedArgs[j][k]);
                            }
                            parsedArgs[j] = parg;
                        }
                    }
                    else if (integerTypes.includes(arg.type)) {
                        parsedArgs[j] = new bn_js_1.BN(parsedArgs[j]);
                    }
                }
                const addedAccounts = {};
                for (let a in accounts_1.manuallyAddedAccounts) {
                    addedAccounts[a] = accounts_1.manuallyAddedAccounts[a];
                }
                let accounts_sorted = [];
                let included = {};
                let held = [];
                accounts.map(acct => {
                    if (acct.pda) {
                        let isBasedOnAccount = false;
                        let required = {};
                        acct.pda.seeds.map(seed => {
                            if (seed.kind === "account") {
                                isBasedOnAccount = true;
                                required[seed.path] = true;
                            }
                        });
                        if (isBasedOnAccount) {
                            //@ts-ignore
                            held.push({
                                account: acct,
                                required
                            });
                        }
                        else {
                            //@ts-ignore
                            accounts_sorted.push(acct);
                            included[acct.name] = true;
                        }
                    }
                    else {
                        //@ts-ignore
                        accounts_sorted.unshift(acct);
                        included[acct.name] = true;
                    }
                });
                let held_cleaned = [];
                for (let acct of held) {
                    //@ts-ignore
                    if (addedAccounts[acct.account.name]) {
                        //
                    }
                    else {
                        held_cleaned.push(acct);
                    }
                }
                held = held_cleaned;
                let infiniteLoop = 100000n;
                while (held.length > 0) {
                    for (let k = 0; k < held.length; k++) {
                        let toAdd = true;
                        const h = held[k];
                        //@ts-ignore
                        for (let req in h.required) {
                            //req: name of required account
                            if (!included[req]) {
                                toAdd = false;
                                break;
                            }
                        }
                        if (toAdd) {
                            //@ts-ignore
                            accounts_sorted.push(h.account);
                            //@ts-ignore
                            included[h.account.name] = true;
                            held.splice(k, 1); // remove it from there
                        }
                    }
                    infiniteLoop--;
                    if (infiniteLoop <= 0n) {
                        throw new Error("Helper Error: Infinite loop while trying to resolve interdependant account seeds.");
                    }
                }
                accounts_sorted.map(acct => {
                    //@ts-ignore
                    if (acct.pda) {
                        //Don't do it if they have manually added account
                        //@ts-ignore
                        if (!accounts_1.manuallyAddedAccounts[acct.name]) {
                            //@ts-ignore
                            const seeds = acct.pda.seeds.map(seed => {
                                switch (seed.kind) {
                                    case "const":
                                        return Buffer.from(seed.value);
                                    case "arg":
                                        const argName = seed.path;
                                        const argIndex = namedArgs[seed.path];
                                        const argType = args[argIndex].type;
                                        const val = parsedArgs[argIndex];
                                        switch (argType) {
                                            case "string":
                                                return val;
                                            case "pubkey":
                                                //Todo may need to cast it so it gets picked up as pubkey
                                                return val;
                                            default:
                                                //assume integer
                                                const size = (0, typeFunctions_1.integerTypeToSize)(argType);
                                                return [val, size];
                                        }
                                    case "account":
                                        return addedAccounts[seed.path];
                                }
                            });
                            //@ts-ignore
                            addedAccounts[acct.name] = (0, general_1.getPDA)(seeds, program._programId);
                        }
                    }
                    else {
                        //@ts-ignore
                        if (acct.signer) {
                            //@ts-ignore
                            addedAccounts[acct.name] = (0, signers_1.getSigner)().publicKey;
                            //@ts-ignore
                        }
                        else if (acct.address) {
                            //@ts-ignore
                            addedAccounts[acct.name] = acct.address;
                        }
                    }
                });
                let ix;
                if (Object.keys(addedAccounts).length > 0) {
                    if (parsedArgs.length > 0) {
                        ix = await program.instruction[ins.name](...parsedArgs, {
                            accounts: addedAccounts
                        });
                    }
                    else {
                        ix = await program.instruction[ins.name]({
                            accounts: addedAccounts
                        });
                    }
                }
                else {
                    ix = await program.methods[ins.name](...parsedArgs).instruction();
                }
                let result;
                try {
                    result = await (0, transaction_1.sendTransaction)([ix]);
                }
                catch (e) {
                    const errors = program._idl.errors;
                    const err = e.toString();
                    const indicator = "custom program error: ";
                    if (err.includes(indicator)) {
                        const elements = err.split(indicator);
                        const code = elements[elements.length - 1];
                        if (anchorErrors_json_1.default && anchorErrors_json_1.default[code]) {
                            throw new Error(anchorErrors_json_1.default[code].label);
                        }
                        if (errors) {
                            for (let i = 0; i < errors.length; i++) {
                                const error = errors[i];
                                if (error.code === Number(code)) {
                                    throw new Error(error.msg);
                                }
                            }
                        }
                        throw new Error(e.toString());
                    }
                    else {
                        throw new Error(e.toString());
                    }
                }
                return result;
            };
        // IX
        ix[name] = async function () {
            const parsedArgs = [...arguments];
            const integerTypes = [
                "u8", "u16", "u32", "u64", "u128",
                "i8", "i16", "i32", "i64", "i128",
            ];
            for (let j = 0; j < args.length; j++) {
                const arg = args[j];
                if (typeof arg.type === "object" &&
                    arg.type.hasOwnProperty('array')) {
                    let t = arg.type.array;
                    // It is an array
                    //arg.type.array == [type, length]
                    let parg = [];
                    if (integerTypes.includes(t[0])) {
                        for (let k = 0; k < t[1]; k++) {
                            //@ts-ignore
                            parg[k] = new bn_js_1.BN(parsedArgs[j][k]);
                        }
                        parsedArgs[j] = parg;
                    }
                }
                else if (integerTypes.includes(arg.type)) {
                    parsedArgs[j] = new bn_js_1.BN(parsedArgs[j]);
                }
            }
            const addedAccounts = {};
            for (let a in accounts_1.manuallyAddedAccounts) {
                addedAccounts[a] = accounts_1.manuallyAddedAccounts[a];
            }
            let accounts_sorted = [];
            let included = {};
            let held = [];
            accounts.map(acct => {
                if (acct.pda) {
                    let isBasedOnAccount = false;
                    let required = {};
                    acct.pda.seeds.map(seed => {
                        if (seed.kind === "account") {
                            isBasedOnAccount = true;
                            required[seed.path] = true;
                        }
                    });
                    if (isBasedOnAccount) {
                        //@ts-ignore
                        held.push({
                            account: acct,
                            required
                        });
                    }
                    else {
                        //@ts-ignore
                        accounts_sorted.push(acct);
                        included[acct.name] = true;
                    }
                }
                else {
                    //@ts-ignore
                    accounts_sorted.unshift(acct);
                    included[acct.name] = true;
                }
            });
            let held_cleaned = [];
            for (let acct of held) {
                //@ts-ignore
                if (addedAccounts[acct.account.name]) {
                    //
                }
                else {
                    held_cleaned.push(acct);
                }
            }
            held = held_cleaned;
            let infiniteLoop = 100000n;
            while (held.length > 0) {
                for (let k = 0; k < held.length; k++) {
                    let toAdd = true;
                    const h = held[k];
                    //@ts-ignore
                    for (let req in h.required) {
                        //req: name of required account
                        if (!included[req]) {
                            toAdd = false;
                            break;
                        }
                    }
                    if (toAdd) {
                        //@ts-ignore
                        accounts_sorted.push(h.account);
                        //@ts-ignore
                        included[h.account.name] = true;
                        held.splice(k, 1); // remove it from there
                    }
                }
                infiniteLoop--;
                if (infiniteLoop <= 0n) {
                    throw new Error("Helper Error: Infinite loop while trying to resolve interdependant account seeds.");
                }
            }
            accounts_sorted.map(acct => {
                //@ts-ignore
                if (acct.pda) {
                    //Don't do it if they have manually added account
                    //@ts-ignore
                    if (!accounts_1.manuallyAddedAccounts[acct.name]) {
                        //@ts-ignore
                        const seeds = acct.pda.seeds.map(seed => {
                            switch (seed.kind) {
                                case "const":
                                    return Buffer.from(seed.value);
                                case "arg":
                                    const argName = seed.path;
                                    const argIndex = namedArgs[seed.path];
                                    const argType = args[argIndex].type;
                                    const val = parsedArgs[argIndex];
                                    switch (argType) {
                                        case "string":
                                            return val;
                                        case "pubkey":
                                            //Todo may need to cast it so it gets picked up as pubkey
                                            return val;
                                        default:
                                            //assume integer
                                            const size = (0, typeFunctions_1.integerTypeToSize)(argType);
                                            return [val, size];
                                    }
                                case "account":
                                    return addedAccounts[seed.path];
                            }
                        });
                        //@ts-ignore
                        addedAccounts[acct.name] = (0, general_1.getPDA)(seeds, program._programId);
                    }
                }
                else {
                    //@ts-ignore
                    if (acct.signer) {
                        //@ts-ignore
                        addedAccounts[acct.name] = (0, signers_1.getSigner)().publicKey;
                        //@ts-ignore
                    }
                    else if (acct.address) {
                        //@ts-ignore
                        addedAccounts[acct.name] = acct.address;
                    }
                }
            });
            let ix;
            if (Object.keys(addedAccounts).length > 0) {
                if (parsedArgs.length > 0) {
                    ix = await program.instruction[ins.name](...parsedArgs, {
                        accounts: addedAccounts
                    });
                }
                else {
                    ix = await program.instruction[ins.name]({
                        accounts: addedAccounts
                    });
                }
            }
            else {
                ix = await program.methods[ins.name](...parsedArgs).instruction();
            }
            return ix;
        };
    }
    //Set properties at the end in case they would have been overwritten by tx func name
    //@ts-ignore
    helper.ix = ix;
    helper.account = account;
    helper.id = id;
    helper.tx = tx;
    helper.pda = pda;
    helper.program = program;
    return helper;
}
