module.exports = {
  createUser: function() {
    const tokenCreator = nacl.sign.keyPair();
    tokenCreator.publicKey = base58.encode(new Buffer(tokenCreator.publicKey));
    tokenCreator.privateKey = base58.encode(
      new Buffer(tokenCreator.secretKey.slice(0, 32))
    );
    delete tokenCreator.secretKey;
    return tokenCreator;
  },
  signTransaction: function(tx, tokenCreator) {
    return BigchainDB.Transaction.signTransaction(tx, tokenCreator.privateKey);
  },
  postTransaction: function(txSigned, callback) {
    conn
      .postTransactionCommit(txSigned)
      .then(function(res) {
        callback(null, res);
      })
      .catch(function(err) {
        callback(err);
      });
  },
  uproseTokenTransaction: function(tokenCreator) {
    console.log(Config.tokenName);
    return BigchainDB.Transaction.makeCreateTransaction(
      {
        token: Config.tokenName,
        number_tokens: Config.nTokens
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
  }
};
