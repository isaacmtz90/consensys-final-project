# Test Driven Development
Contract development using the red-green-refactor methodology to ensure that every behavior was the expected one.

# Fail Early, Fail Loud
The contract makes extensive use of modifiers to verify that the requirements are met before further execution of code. Reverts will happen early.

# Access restriction
Only the contract owner can execute some functions like pausing the contract and retrieving funds.

# Circuit Breaker
The contract can be paused so that no new requests are accepted and no funds can be received and the state is frozen.

## KISS
We kept the contract as simple as possible for the required functionality.

# Future considerations:

## Factory model

We want to allow for the deployment of multiple ML models to the chain. the current contract only allows for the deployment of one model, but in the future we would want to deploy a copy of that contract for each model, which would require a factory model that keeps track of these sub-models

## Pull payments

 Right now users have to pay to use a model, but in future implementations we want to allow users to be paid to "train" a model. In that scenario, the users would have to "pull" their payments once the model training is done.

 ## IPFS

  We are currently storing a md5 hash of the data provided. In the future, that hash could be an IPFS one so the data is also retrievable.