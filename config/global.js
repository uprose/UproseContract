global.BigchainDB = require("bigchaindb-driver");
global.nacl = require("tweetnacl");
global.base58 = require("bs58");
global.API_PATH = "https://test.bigchaindb.com/api/v1/";
global.conn = new BigchainDB.Connection(API_PATH);
