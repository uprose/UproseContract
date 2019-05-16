require("./config/global.js");

var Blockchain = require("./models/Blockchain.js");

var tokenCreator = Blockchain.createUser();
console.log("User Creds: ", JSON.stringify(tokenCreator));
function createToken() {
  // Construct a transaction payload
  var tx = Blockchain.uproseTokenTransaction(tokenCreator);

  // Sign the transaction with the private key of the token creator
  var txSigned = Blockchain.signTransaction(tx, tokenCreator);

  // Send the transaction off to BigchainDB
  Blockchain.postTransaction(txSigned, function(err, data) {
    console.log(JSON.stringify(data));
  });
}

createToken();
