const {addAccounts, advanceDays, assertValues, clearAddedAccounts, createProgram, fails, failsCorrectly, failsWithCode, generateSignerKeypairs, getCurrentTime, getSigner, initEnvironment, isSameKey, RBInt, setSigner, succeeds} = require("solana-slam");
import { createNewClient } from "../svmClient";



// Import IDL and program types
import { SlamExample } from "../target/types/slam_example";
import { assert } from "chai";
const IDL = require("../target/idl/slam_example.json");

// Create signer keypairs
const signers = generateSignerKeypairs(3);
const [signer0, signer1, signer2] = signers;

let program;

describe("slam-example", () => {

  beforeEach(async()=>{
    // Re-initialise the client object
    const client = createNewClient();

    // Init the SLAM environment
    initEnvironment(client, signers );

    // Initalise the program helper
    //@ts-ignore
    program = createProgram<SlamExample>(IDL);

    // Set current signer to signer0
    setSigner(signer0);

    //Clear any added accouts from previous tests
    clearAddedAccounts();

  })

  describe("createMyAccount", ()=>{

    it("Can createMyAccount", async()=>{
      await succeeds(async()=>{
        await program.createMyAccount();
      })
    });
    it("Can't createMyAccount if account already exists", async()=>{

      // Successfully call to create the account
      await program.createMyAccount();

      // Try again and fail
      await fails(async()=>{
        await program.createMyAccount();
      })
    });

    it("createMyAccount creates the account, and initialises it's values properly", async()=>{

      // Get the address of the account that will be created
      const signerKey = getSigner().publicKey;
      const expectedAddress = program.pda(["me", signerKey]);


      // Get value of account before 
      const before = await program.account.myAccountType(expectedAddress);

      //Create the account
      await program.createMyAccount();

      // Get value of account after
      const after = await program.account.myAccountType(expectedAddress);


      // Assert it was null before
      assert.isNull(before, "already exists");

      // Assert that it has been created
      assert.isNotNull(after, "does not exist");

      // Get current time and compare to account values
      const now = getCurrentTime();
      assert.equal(after.updateTime, now, "updateTime value");

      // Compare addresses with isSameKey
      assert.isTrue(isSameKey(after.somePublicKey, signerKey), "somePublicKey not set");

    });
  });


  describe("updateAccount", ()=>{

    // Some vars that will be useful in these tests
    const newBool = true;
    const newPubKey = signer1.publicKey;
    const newU64 = RBInt(0,(2n**64n) - 1n);

    let account;

    beforeEach(async()=>{
      //Create Account for current signer first
      await program.createMyAccount();

      // Get the PDA address
      account = program.pda(["me", getSigner().publicKey]);

      // Add it to the accounts provided to txs
      addAccounts({
        accountToUpdate: account,
      })

    })

    it("Can updateAccount", async()=>{

      await succeeds(async()=>{
        await program.updateAccount(newBool, newPubKey, newU64);
      })
    });
    describe("Can't updateAccount", ()=>{
      it("if the provided account doesn't exist", async()=>{

        // Get the address of an account that doesn't exist
        const nonExistantAccount = program.pda(["incorrect seeds"]);

        // Add it to the accounts provided to txs, overwriting existing value
        addAccounts({
          accountToUpdate: nonExistantAccount,
        })
        
        const failureCode = "0xbc4"; //The anchor failure code for AccountNotInitialized

        // failsWithCode will cause the test to fail unless the tx fails for this specific reason.
        await failsWithCode(async()=>{
          await program.updateAccount(newBool, newPubKey, newU64);
        },failureCode);

      });

      it("if new_bool is the same as current value of some_bool", async()=>{

        // Bool value that will cause it to fail
        const incorrectBool = false;

        // failsCorrectly will cause the test to fail unless the tx fails with this specific program error.
        await failsCorrectly(async()=>{
          await program.updateAccount(incorrectBool, newPubKey, newU64);
        },"Bool Must Not Match");

      });
    });
    it("Updates account values correctly", async()=>{
      
      const before = await program.account.myAccountType(account);

      // Move forwards in time so that updateTime is different
      advanceDays(10n);

      await program.updateAccount(newBool, newPubKey, newU64);

      const after = await program.account.myAccountType(account);

      const now = getCurrentTime();

      // Use assertValues to assert values have changed and to specify their values.
      assertValues(before, after, {
        updateTime: now,
        someBool: newBool,
        someU64:  newU64
      })

    });
  });

});
