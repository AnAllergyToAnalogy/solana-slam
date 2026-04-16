"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manuallyAddedAccounts = void 0;
exports.addAccounts = addAccounts;
exports.clearAddedAccounts = clearAddedAccounts;
exports.getAddedAccounts = getAddedAccounts;
exports.manuallyAddedAccounts = {};
function addAccounts(accts = {}) {
    for (let a in accts) {
        exports.manuallyAddedAccounts[a] = accts[a];
    }
}
function clearAddedAccounts() {
    exports.manuallyAddedAccounts = {};
}
function getAddedAccounts() {
    return exports.manuallyAddedAccounts;
}
