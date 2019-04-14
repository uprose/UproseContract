require("./config/global.js");

const nTokens = 1000000000000000;
let tokensLeft;

var seed = bip39.mnemonicToSeedSync("basket actual").slice(0, 32);
const tokenCreator = nacl.sign.keyPair.fromSeed(seed);

tokenCreator.publicKey = base58.encode(new Buffer(tokenCreator.publicKey));

tokenCreator.privateKey = base58.encode(
  new Buffer(tokenCreator.secretKey.slice(0, 32))
);
delete tokenCreator.secretKey;
console.log("privateKey", tokenCreator);

let createTxId;
function tokenLaunch() {
  // Construct a transaction payload
  const tx = BigchainDB.Transaction.makeCreateTransaction(
    {
      token: "TT (Tutorial Tokens)",
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
  const txSigned = BigchainDB.Transaction.signTransaction(
    tx,
    tokenCreator.privateKey
  );

  // Send the transaction off to BigchainDB
  conn.postTransactionCommit(txSigned).then(res => {
    console.log(res);
    createTxId = res.id;
    tokensLeft = nTokens;
    // document.body.innerHTML = "<h3>Transaction created</h3>";
    // // txSigned.id corresponds to the asset id of the tokens
    // document.body.innerHTML += txSigned.id;
  });
}

tokenLaunch();
