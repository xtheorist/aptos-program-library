import {
  AptosClient,
  AptosAccount,
  FaucetClient,
} from "aptos";

export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";


describe("Hello World", () => {
    it("Greeting", async () => {
        const client = new AptosClient(NODE_URL);
        const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
      
        const alice = new AptosAccount();
        const bob = new AptosAccount();
      
        // Print out account addresses.
        console.log("=== Addresses ===");
        console.log(`Alice: ${alice.address()}`);
        console.log(`Bob: ${bob.address()}`);
        console.log("");
      
        // Fund accounts.
        await faucetClient.fundAccount(alice.address(), 100_000_000);
        await faucetClient.fundAccount(bob.address(), 0);
      
        const moduleAddress = "0x97f265858d0259f458d6ed682994347612a69db475e837ba514a35bdf22a3205"; // module address a.k.a smart contract
      
        const create_candy_machine = {
          type: "entry_function_payload",
          function: moduleAddress + "::message::set_message",
          type_arguments: [],
          arguments: ["Hello world"],
        };
      
        let txnRequest = await client.generateTransaction(
          alice.address(),
          create_candy_machine
        );
      
        let bcsTxn = await AptosClient.generateBCSTransaction(alice, txnRequest);
        const transactionRes = await client.submitSignedBCSTransaction(bcsTxn);
        console.log("txHash :: " + transactionRes.hash);
      
        let getresourceAccount = await client.waitForTransactionWithResult(
          transactionRes.hash
        );
        console.log(
          "Resource Address: " + getresourceAccount["changes"][2]["address"]
        );
    })
})
