export function camelToSnake(name: string): string{
    // converts camelCase string to snake_case
    let snaked = "";
    for(let i = 0; i < name.length; i++){
        const s = name[i];
        const l = name[i].toLowerCase();
        if(s === l){
            snaked += s;
        }else{
            snaked += "_"+l;
        }
    }
    return snaked;
}
export function snakeToCamel(name: string): string{
    // converts snake_case string to camelCase
    const params = name.split("_");
    for(let i = 1; i < params.length; i++){
        const p = params[i];
        params[i] = p.substr(0,1).toUpperCase() + p.substr(1);
    }
    return params.join("");
}