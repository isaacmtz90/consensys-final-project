# Description

As machine learning models are more present in our day to day life, there's one common issue that arises from time to time: Accountability.
When a model predicts you are not fit for a mortgage, or you do not qualify for renting a place, the prediction might change if you come back with the same information a couple of months later.

This project is a small proof of concept for a larger concept, aimed to provide the tools to give a POE to model outputs, and keep versioning of machine learning models inmutable.

This proof of concept uses one specific version of a deployed model ( google's image net) where users will be able to pay a small fee to use the model, and keep track of their predictions in the blockchain.

## Getting Started

Clone the project on your local machine for development and testing purposes.

### Prerequisites

You need truffle, ganache, openzeppelin-solidity and tensorflowjs in order to run the project

```
npm install -g truffle
npm install -g ganache-cli
npm install
cd app
npm install
```

### Installing and Testing

Run ganache application or the ganache-cli in order to start testing

```
ganache-cli -p 8545
```
Make sure to copy the mnemonic to import it to your wallet provider. the first accoutn will be the owner of the contract.

Then, compile the project

```
truffle compile 
```

If you want to run the tests, use the following command:

```
truffle test 
```

If you want to run MythX audits, get your API key from mythx.io and run:

```
truffle run verify --apiKey {YOUR API KEY}
```

## Deployment

With ganache runing,  migrate the contracts to the development network:

```
truffle migrate --network dev
``` 
if no errors happened, you are good to go to start the client.

## Starting the client

With ganache-cli running you just need to start the client and start using the app with metamask in your browser. Run the following command:

```
cd app & npm run start
``` 
## Authors

* **Isaac Martinez** - *imtz90b@gmail.com* - [isaacmtz90](https://github.com/isaacmtz90)
