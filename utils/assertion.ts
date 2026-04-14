import { assert } from "chai";

import anchorErrors from "../errors/anchorErrors.json";

export const fails = async (attempt: Function,message: string | object = "") => {
    // Causes test to fail if given function does not fail.
    //  With message as failure message

    if(typeof message === "object"){
        message = JSON.stringify(message);
    }
    let success;
    try{
        await attempt();
        success = true;
    }catch(e){
        success = false;
    }

    assert.equal(success,false,message);
}

function getCodeFromErrorLabel(label){
    for(let code in anchorErrors){
        if(label.includes(anchorErrors[code].label)){
            return code;
        }
    }
    return null;
}

export const failsWithCode = async(attempt: Function,reason: string) => {
    // Causes test to fail if given function does not fail with the specific error code (Anchor error, hex)

    reason = reason.trim();

    let success;

    let correctMsg;
    let code;
    try{
        await attempt();
        success = true;
    }catch(e){

        code = getCodeFromErrorLabel(e.toString());
        correctMsg = code === reason;

        success = false;
    }

    assert.equal(success,false,"Did not fail");
    assert.equal(correctMsg,true,"NOT CODE: "+reason+" | "+code);
}
export const failsCorrectly = async (attempt: Function,reason: string) => {
    // Causes test to fail if given function does not fail with the program-defined error

    reason = reason.trim();

    let success;

    let correctMsg;
    let msg;
    try{
        await attempt();
        success = true;
    }catch(e){

        let _msg = e.toString();
        _msg = _msg.split("Error: ");
        msg = _msg[_msg.length - 1].trim();

        correctMsg = msg === reason;

        success = false;
    }

    assert.equal(success,false,"Did not fail");
    assert.equal(correctMsg,true,"NOT MSG: "+reason+" | "+msg);
}
export const succeeds = async(attempt: Function,showError: boolean = false, message: string | object = "") =>{
    // Causes test to fail if the given funciton fails, will only log the error if showError is true. Fails with error message `message`

    if(typeof message === "object"){
        message = JSON.stringify(message);
    }

    try{
        await attempt();
        assert.equal(true,true,message);
    }catch(e){
        if(showError) console.log(e);
        assert.equal(false,true,message);
    }
}



export const assertDifference = (before, after, property: string,difference) => {
    // Fails if 
    assert.notEqual(after[property],  before[property],  "not equal: "+property);
    assert.equal(   after[property],  before[property] + difference, "equal: "+property);
}
export const assertDifferences = (before, after, differences) => {
    for(let property in differences){
        assertDifference(before,after, property, differences[property]);
    }
}
export const assertValue = (before,after,property,value) => {
        assert.notEqual(after[property],  before[property],  "not equal: "+property);
        assert.equal(   after[property],  value, "equal: "+property);
}
export const assertValues = (before, after, values) =>{
    for(let property in values){
        assertValue(before, after, property, values[property]);
    }
}

export function todo(){
    // fails with message TODO
    assert.fail("TODO");
}