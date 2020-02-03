const MLModel = artifacts.require("MLModel");


module.exports = function(deployer) {
  const description = 'Imagenet image classifier model by Google';
  const version = '1_0.25_224';
  const previousVersion = '1_0.25_223';
  const pricePerUsage = 5000000;
  const modelUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
  deployer.deploy(MLModel, description, modelUrl, version, previousVersion, pricePerUsage);
};
