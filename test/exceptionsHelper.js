// Taken from the event tickets excercise at https://github.com/ConsenSys-Academy/event-ticket-exercise
const errorString = 'VM Exception while processing transaction: ';

async function tryCatch(promise, reason) {
  try {
    await promise;
    throw null;
  } catch (error) {
    assert(error, 'Expected a VM exception but did not get one');
    assert(
      error.message.search(errorString + reason) >= 0,
      `Expected an error containing '${errorString}${reason}' but got '${error.message}' instead`,
    );
  }
}

module.exports = {
  async catchRevert(promise) {
    await tryCatch(promise, 'revert');
  },
  async catchOutOfGas(promise) {
    await tryCatch(promise, 'out of gas');
  },
  async catchInvalidJump(promise) {
    await tryCatch(promise, 'invalid JUMP');
  },
  async catchInvalidOpcode(promise) {
    await tryCatch(promise, 'invalid opcode');
  },
  async catchStackOverflow(promise) {
    await tryCatch(promise, 'stack overflow');
  },
  async catchStackUnderflow(promise) {
    await tryCatch(promise, 'stack underflow');
  },
  async catchStaticStateChange(promise) {
    await tryCatch(promise, 'static state change');
  },
};
