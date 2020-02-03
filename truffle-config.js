require("dotenv").config();

const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = process.env.MNENOMIC;
const rinkebyApiUrl =  process.env.RINKEBY_URL;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" 
    },    
    rinkeby:{
      host: "localhost",
      provider() {
        return new HDWalletProvider( mnemonic, rinkebyApiUrl);
      },
      network_id:4,
      gas : 6700000,
      gasPrice : 10000000000
    },
    docker: {
      host: "ganache-node",
      port: 8545,
      network_id: "9999" 
    }
  },
  plugins: [ "truffle-security" ],
  compilers: {
    solc: {
        version: "0.5.0",
    }
}
};
