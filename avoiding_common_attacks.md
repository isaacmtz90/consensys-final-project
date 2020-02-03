# Integer Overflow and Underflow

The contract uses Open Zeppelin's SafeMath Library to prevent integer overflow and underflow when adding or substracting amounts amounts.

# Denial of Service 

To prevent a Denial of service, the contract uses the Pull over Push Payments so  only the attacker is denied.
In this case, only the owner can pull funds, but in future implementations we also want to pay people for training the algorithm, and they would have to pull the funds to their accounts once the training of the model is done.

# Tool Verification 
We verifyed our contracts through the MythX tool, wihich only complained about the floating pragma of the Open Zepellin library that we used.

# Reentrancy Avoidance
To prevent a reentrancy attack, we used Check-Effect-Interaction Scheme throught the contract.


# Circuit Breaker Pattern
We implemented a circuit breaker pattern with our own "Pausable" flag implementation. In the future, it's a good candidate for implementing the Open Zepellin version.
