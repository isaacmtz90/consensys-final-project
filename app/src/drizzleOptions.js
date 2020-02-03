import Web3 from "web3";
import MLModel from "./contracts/MLModel.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [MLModel],
  events: {
    MLModel: ["LogPrediction", "LogCashOut", "LogPauseStatusChanged"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
