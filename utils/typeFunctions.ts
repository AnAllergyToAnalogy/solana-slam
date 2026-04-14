import { BN  } from "bn.js";

export function integerTypeToSize(type: string): string{
    // Returns number of bits for provided integer type string
    return type.substring(1);
}
export function isIntergerType(type): boolean{
    // Boolean, returns true if type is an integer type
    const types = ["isize","usize"];
    for(let i = 0; i < 8; i++){
        const s = 8 * (2 ** i);
        types.push("u"+s);
        types.push("i"+s);
    }
    return types.includes(type);
}

export function integerToByteArray(value,size){
    // converts given value and size (in bits) into byte array
    
    value = BigInt(value);
    size = Number(size);

    if(value < 0n){
        value = (2n ** BigInt(size)) + value;
    }

    return new BN(value.toString()).toArrayLike(Buffer, "le", size/8);
}

export function stringToByteArray(str){
    // converts string into byte array
    return Buffer.from(str);
}