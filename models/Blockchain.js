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
  signTransaction: function(tx, privateKey) {
    return BigchainDB.Transaction.signTransaction(tx, privateKey);
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
  }
};
