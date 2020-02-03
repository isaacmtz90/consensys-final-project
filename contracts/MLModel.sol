pragma solidity 0.5.0;

/* 
    * @title MLModel.
    * @author Isaac Martinez - @isaacmtz90.
 */

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

contract MLModel {

    using SafeMath for uint;
    

    /*
    * MODIFIERS
    */
    modifier  isOwner() {require(msg.sender == owner, "Sender must be the owner"); _;}
    modifier isRequestOwner(address requestedId) 
        {require(msg.sender == requestedId, "Sender must be the owner of the requested result"); _;}
    modifier userHasPredictions(address requestedId) 
        {require(myModel.userPredictions[requestedId].userCount > 0 , "Sender must have activity recorded"); _;}
    modifier hasFundsForPrediction() 
        {require( msg.value >= myModel.pricePerUsage , "Not enough funds to log a prediction"); _;}
    modifier refundSurplusFunds() {
        _;
        msg.sender.transfer(msg.value - myModel.pricePerUsage);
    }
    modifier pauseOnEmergency() {require(!paused, "Contract is paused"); _;}

    /*
    * Events
    */
    event LogCashOut(address purchaser, uint balance);
    event LogPrediction(address requester, string predictionResult, string modelVersion);
    event LogPauseStatusChanged(address owner, bool paused);
    
    Model internal myModel;
    address payable public owner;
    bool public paused = false; 

    struct Model {
        string description;
        string modelUrl;
        string version;
        string previousVersion;
        uint pricePerUsage;
        uint predictionsCount;
        mapping( address => UserPredictions) userPredictions;
    }

    struct UserPredictions {        
        uint userCount;
        uint userTotalSpent;
        mapping( uint => ModelPrediction) predictions;
    }

    struct ModelPrediction {        
        string modelVersion;
        string dataHash;
        string predictionResult;
    }

     constructor(
        string memory _description, 
        string memory _url, 
        string memory _version, 
        string memory _previousVersion,
        uint  _price) public {
        owner = msg.sender;
        myModel = Model({
            description: _description, 
            modelUrl: _url,
            version: _version,
            previousVersion: _previousVersion,
            pricePerUsage: _price,
            predictionsCount: 0
        }); 
    } 

    function readModel() public view 
     returns (
      string memory description,
      string memory modelUrl,
      string memory version,
      string memory previousVersion,
      uint pricePerUsage,
      uint predictions){
        return (
        myModel.description,
        myModel.modelUrl,
        myModel.version,
        myModel.previousVersion,
        myModel.pricePerUsage,
        myModel.predictionsCount);
    }

    function getUserPredictionsOverview(address requestedId) public view isRequestOwner(requestedId)
     returns (      
      uint count,
      uint totalSpent   
      ){
        UserPredictions storage userPredictions = myModel.userPredictions[requestedId];
        return (
        userPredictions.userCount,
        userPredictions.userTotalSpent);
    }

    function getLatestUserPrediction(address requestedId) public view 
     isRequestOwner(requestedId)
     userHasPredictions(requestedId)
     returns (
      uint id,      
      string memory modelVersion,
      string memory dataHash,
      string memory predictionResult   
      ){
        UserPredictions storage userPredictions = myModel.userPredictions[requestedId];
        uint latestId = userPredictions.userCount;
        return (
        latestId,
        userPredictions.predictions[latestId].modelVersion,
        userPredictions.predictions[latestId].dataHash,
        userPredictions.predictions[latestId].predictionResult);
    }

    function savePrediction(
        string memory _dataHash, 
        string memory _predictionResult
    )
    public
    payable
    refundSurplusFunds
    hasFundsForPrediction  
    pauseOnEmergency  
    {
        ModelPrediction memory newPrediction = ModelPrediction({
            modelVersion: myModel.version,
            dataHash: _dataHash,
            predictionResult: _predictionResult
        });
        myModel.userPredictions[msg.sender].userCount = myModel.userPredictions[msg.sender].userCount.add(1); 
        uint currentId = myModel.userPredictions[msg.sender].userCount;
        uint currentSpent = myModel.userPredictions[msg.sender].userTotalSpent;
        myModel.userPredictions[msg.sender].predictions[currentId] = newPrediction;
        myModel.userPredictions[msg.sender].userTotalSpent = currentSpent.add(myModel.pricePerUsage);
        myModel.predictionsCount = myModel.predictionsCount.add(1);
        emit LogPrediction(msg.sender, _predictionResult, myModel.version);
    }

    function cashOut()
    public
    isOwner
    {
        uint balance = address(this).balance;
        msg.sender.transfer(balance);
        emit LogCashOut(msg.sender, balance);
    }

    function togglePause()
    public
    isOwner
    {
        paused = !paused;
        emit LogPauseStatusChanged(msg.sender, paused);
    }
    
}