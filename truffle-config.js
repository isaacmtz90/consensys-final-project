const path = require("path");

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
