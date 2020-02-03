const MLModel = artifacts.require('MLModel');
const { catchRevert } = require('./exceptionsHelper.js');

const { BN } = web3.utils;

contract('Model', (accounts) => {
  const firstAccount = accounts[0];
  const requesterAddress = accounts[1];
  const thirdAccount = accounts[2];

  const dataHash = 'QmVtYjNij3GeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCXu';

  const description = 'ML Model description';
  const version = '1.0';
  const previousVersion = '0.9';
  const pricePerUsage = 1000;
  const modelUrl = 'http://somemodel.com';

  let instance;

  beforeEach(async () => {
    instance = await MLModel.new(description, modelUrl, version, previousVersion, pricePerUsage);
  });

  describe('Setup', async () => {
    it('OWNER should be set to the deploying address', async () => {
      const owner = await instance.owner();
      assert.equal(owner, firstAccount, 'the deploying address should be the owner');
    });

    it('The model should have 0 trainings when it is deployed', async () => {
      const modelDetails = await instance.readModel();
      assert.equal(modelDetails.predictions, 0, 'the model should start with 0 predictions');
    });
  });

  describe('Functions', () => {
    describe('Reading a deployed model details', () => {
      it('readModel() should return the current state of the model', async () => {
        const model = await instance.readModel();
        assert.equal(model.description, description, 'the model descriptions should match');
        assert.equal(model.version, version, 'the model version should match');
        assert.equal(
          model.previousVersion,
          previousVersion,
          'the model previousVersion should match',
        );
      });
    });

    describe('Excecuting a model prediction', () => {
      beforeEach(async () => {
        instance = await MLModel.new(
          description,
          modelUrl,
          version,
          previousVersion,
          pricePerUsage,
        );
      });

      it('Add up to the total predictions count', async () => {
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: requesterAddress,
          value: 1000,
        });
        const model = await instance.readModel();
        assert.equal(
          model.predictions,
          1,
          'The model should add one to the number of predictions excecuted',
        );
      });
      it('Should add up to the individuals prediction count', async () => {
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: requesterAddress,
          value: 1000,
        });
        const userPredictions = await instance.getUserPredictionsOverview(requesterAddress, {
          from: requesterAddress,
        });
        assert.equal(
          userPredictions.count,
          1,
          'The model should add one to the number of predictions excecuted for that user',
        );
        assert.equal(
          userPredictions.totalSpent,
          1000,
          'The total spent of the user should be reflected',
        );
      });
      it('Should be able to get the latest prediction of a specific user', async () => {
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: requesterAddress,
          value: 1000,
        });
        const userPrediction = await instance.getLatestUserPrediction(requesterAddress, {
          from: requesterAddress,
        });
        assert.equal(userPrediction.modelVersion, 1, 'The model version should match');
        assert.equal(userPrediction.dataHash, dataHash, 'The data hash should match');
        assert.equal(
          userPrediction.predictionResult,
          '{cat: 0.6, dog: 0.4}',
          'The prediction result should match',
        );
      });
      it('should revert if not enought funds are sent', async () => {
        await catchRevert(
          instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
            from: requesterAddress,
            value: 30, // not enough
          }),
        );
      });
      it('should refund any extra funds to the requester', async () => {
        const preSaleFunds = await web3.eth.getBalance(requesterAddress);
        const predictionReceipt = await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: requesterAddress,
          value: 3000, // more than required
        });
        const postSaleFunds = await web3.eth.getBalance(requesterAddress);
        const predictionTx = await web3.eth.getTransaction(predictionReceipt.tx);
        const predictionTxValue = Number(predictionTx.gasPrice) * predictionReceipt.receipt.gasUsed;
        assert.equal(
          postSaleFunds,
          new BN(preSaleFunds)
            .sub(new BN(pricePerUsage))
            .sub(new BN(predictionTxValue))
            .toString(),
          'overpayment should be refunded',
        );
      });
      it('should emit an event detailing the resuult of the prediction', async () => {
        const predResult = '{cat: 0.6, dog: 0.4}';
        const predictionReceipt = await instance.savePrediction(dataHash, predResult, {
          from: requesterAddress,
          value: 1000, // more than required
        });
        const prediction = predictionReceipt.logs[0].args['1'].toString();
        assert.equal(prediction, predResult, 'Prediction result should be emited on the logs');
      });
    });
    describe('Cashing out the balance', () => {
      it('should allow the owner to cash out the model payments', async () => {
        const preSaleFunds = await web3.eth.getBalance(firstAccount);
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: requesterAddress,
          value: 1000,
        });
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: thirdAccount,
          value: 1000,
        });
        const cashOutReceipt = await instance.cashOut({
          from: firstAccount,
        });
        const postSaleFunds = await web3.eth.getBalance(firstAccount);
        const predictionTx = await web3.eth.getTransaction(cashOutReceipt.tx);
        const cashOutTxValue = Number(predictionTx.gasPrice) * cashOutReceipt.receipt.gasUsed;
        assert.equal(
          postSaleFunds,
          new BN(preSaleFunds)
            .add(new BN(pricePerUsage * 2))
            .sub(new BN(cashOutTxValue))
            .toString(),
          'Owner should be able to cash out',
        );
      });

      it('Should revert when a not owner tries to cash out', async () => {
        await instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: thirdAccount,
          value: 1000,
        });
        await catchRevert(
          instance.cashOut({
            from: thirdAccount,
          }),
        );
      });
    });
  });
  describe('Security measures', () => {
    it('revert on prediction if the owner paused the contract', async () => {
      await instance.togglePause({ from: firstAccount });
      await catchRevert(
        instance.savePrediction(dataHash, '{cat: 0.6, dog: 0.4}', {
          from: thirdAccount,
          value: 1000,
        }),
      );
    });
    it('revert if a non owner tries to pause the contract', async () => {
      await instance.togglePause({ from: firstAccount });
      await catchRevert(
        instance.togglePause({
          from: thirdAccount,          
        }),
      );
    });
  });
});
  