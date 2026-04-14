export function RBInt(min,max): bigint{
    // Random bigInt between min and max

    min = BigInt(min);
    max = BigInt(max); 

    function randomDigit(){
        return BigInt(Math.floor(Math.random()*10));
    }

    const dif = BigInt(max - min);

    const digits = dif.toString().length;
    let val = 0n;
    for(let i = 0; i < digits; i++){
        val += randomDigit() * (10n ** BigInt(i));
    }
    if(val > dif){
        val %= dif;
    }

    return val + min;
}



export function RArray(array: any[]): any{
    // Returns a random element from array
    return array[Math.floor(Math.random() * array.length)];
}
export function Chance(pr: number): boolean{
    // Randomly returns true with probability of true being pr
    return Math.random() < pr;
}
