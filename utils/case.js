"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.pascalToCamel = pascalToCamel;
exports.camelToPascal = camelToPascal;
exports.snakeToPascal = snakeToPascal;
exports.pascalToSnake = pascalToSnake;
function camelToSnake(name) {
    // converts camelCase string to snake_case
    let snaked = "";
    for (let i = 0; i < name.length; i++) {
        const s = name[i];
        const l = name[i].toLowerCase();
        if (s === l) {
            snaked += s;
        }
        else {
            snaked += "_" + l;
        }
    }
    return snaked;
}
function snakeToCamel(name) {
    // converts snake_case string to camelCase
    const params = name.split("_");
    for (let i = 1; i < params.length; i++) {
        const p = params[i];
        params[i] = p.substr(0, 1).toUpperCase() + p.substr(1);
    }
    return params.join("");
}
function pascalToCamel(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
function camelToPascal(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}
function snakeToPascal(name) {
    return camelToPascal(snakeToCamel(name));
}
function pascalToSnake(name) {
    return camelToSnake(pascalToCamel(name));
}
