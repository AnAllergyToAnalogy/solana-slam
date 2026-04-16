"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValues = exports.assertValue = exports.assertDifferences = exports.assertDifference = exports.succeeds = exports.failsCorrectly = exports.failsWithCode = exports.fails = void 0;
exports.todo = todo;
const chai_1 = require("chai");
const anchorErrors_json_1 = __importDefault(require("../errors/anchorErrors.json"));
const fails = async (attempt, message = "") => {
    // Causes test to fail if given function does not fail.
    //  With message as failure message
    if (typeof message === "object") {
        message = JSON.stringify(message);
    }
    let success;
    try {
        await attempt();
        success = true;
    }
    catch (e) {
        success = false;
    }
    chai_1.assert.equal(success, false, message);
};
exports.fails = fails;
function getCodeFromErrorLabel(label) {
    for (let code in anchorErrors_json_1.default) {
        if (label.includes(anchorErrors_json_1.default[code].label)) {
            return code;
        }
    }
    return null;
}
const failsWithCode = async (attempt, reason) => {
    // Causes test to fail if given function does not fail with the specific error code (Anchor error, hex)
    reason = reason.trim();
    let success;
    let correctMsg;
    let code;
    try {
        await attempt();
        success = true;
    }
    catch (e) {
        code = getCodeFromErrorLabel(e.toString());
        correctMsg = code === reason;
        success = false;
    }
    chai_1.assert.equal(success, false, "Did not fail");
    chai_1.assert.equal(correctMsg, true, "NOT CODE: " + reason + " | " + code);
};
exports.failsWithCode = failsWithCode;
const failsCorrectly = async (attempt, reason) => {
    // Causes test to fail if given function does not fail with the program-defined error
    reason = reason.trim();
    let success;
    let correctMsg;
    let msg;
    try {
        await attempt();
        success = true;
    }
    catch (e) {
        let _msg = e.toString();
        _msg = _msg.split("Error: ");
        msg = _msg[_msg.length - 1].trim();
        correctMsg = msg === reason;
        success = false;
    }
    chai_1.assert.equal(success, false, "Did not fail");
    chai_1.assert.equal(correctMsg, true, "NOT MSG: " + reason + " | " + msg);
};
exports.failsCorrectly = failsCorrectly;
const succeeds = async (attempt, showError = false, message = "") => {
    // Causes test to fail if the given funciton fails, will only log the error if showError is true. Fails with error message `message`
    if (typeof message === "object") {
        message = JSON.stringify(message);
    }
    try {
        await attempt();
        chai_1.assert.equal(true, true, message);
    }
    catch (e) {
        if (showError)
            console.log(e);
        chai_1.assert.equal(false, true, message);
    }
};
exports.succeeds = succeeds;
const assertDifference = (before, after, property, difference) => {
    // Fails if 
    chai_1.assert.notEqual(after[property], before[property], "not equal: " + property);
    chai_1.assert.equal(after[property], before[property] + difference, "equal: " + property);
};
exports.assertDifference = assertDifference;
const assertDifferences = (before, after, differences) => {
    for (let property in differences) {
        (0, exports.assertDifference)(before, after, property, differences[property]);
    }
};
exports.assertDifferences = assertDifferences;
const assertValue = (before, after, property, value) => {
    chai_1.assert.notEqual(after[property], before[property], "not equal: " + property);
    chai_1.assert.equal(after[property], value, "equal: " + property);
};
exports.assertValue = assertValue;
const assertValues = (before, after, values) => {
    for (let property in values) {
        (0, exports.assertValue)(before, after, property, values[property]);
    }
};
exports.assertValues = assertValues;
function todo() {
    // fails with message TODO
    chai_1.assert.fail("TODO");
}
