require("./config/global.js");
var Blockchain = require("./models/Blockchain.js");

const nTokens = 1000000000000000;
let tokensLeft;

let createTxId;
function tokenLaunch() {
  // Construct a transaction payload
  const tx = BigchainDB.Transaction.makeCreateTransaction(
    {
      token: "Uprose Token",
      number_tokens: nTokens
    },
    // Metadata field, contains information about the transaction itself
    // (can be `null` if not needed)
    {
      datetime: new Date().toString()
    },
    // Output: Divisible asset, include nTokens as parameter
    [
      BigchainDB.Transaction.makeOutput(
        BigchainDB.Transaction.makeEd25519Condition(tokenCreator.publicKey),
        nTokens.toString()
      )
    ],
    tokenCreator.publicKey
  );

  // Sign the transaction with the private key of the token creator
  const txSigned = Blockchain.signTransaction();

  // Send the transaction off to BigchainDB
  conn.postTransactionCommit(txSigned).then(res => {
    console.log(res);
    createTxId = res.id;
    tokensLeft = nTokens;
  });
}

Blockchain.createUser();
