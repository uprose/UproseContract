global.Config = require("./config.js");
global.BigchainDB = require("bigchaindb-driver");
global.nacl = require("tweetnacl");
global.base58 = require("bs58");
global.API_PATH = "https://bigchain.wohlig.in/api/v1/";
global.conn = new BigchainDB.Connection(API_PATH);
