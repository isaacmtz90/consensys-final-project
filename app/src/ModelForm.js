import React, { Component } from 'react'
import { Card, Box, Button, Heading, Text, Image, Flex } from "rimble-ui";
import {loadModel, predict, hashData } from './utils/tensorService'

export default class ModelForm extends Component {
  deployedModel = null;
  myRef = null;
  constructor(props) {
    super(props);  
    this.initializeModel(); 
    this.loadUserPredictions(); 
    this.myRef = React.createRef();
    this.state = { 
      imgsource: 'https://loremflickr.com/224/224/dog?random='+Date.now(),
      modelLoaded: false,
      userPredictions: {count:0, totalSpent:0},

    };
  };

  async initializeModel(){
    console.log('Loading model...');
    this.setState({modelLoaded: false});
    const modelInfo = await this.props.chainModel.methods.readModel().call();
    if(this.state.modelUrl !== modelInfo.modelUrl){
      await this.loadTensorflowModel(modelInfo.modelUrl);
    }
    
    this.setState({
      description: modelInfo.description,
      version: modelInfo.version,
      previousVersion: modelInfo.previousVersion,
      pricePerUsage: modelInfo.pricePerUsage,
      usedTimes: modelInfo.predictions,
      modelUrl: modelInfo.modelUrl,
      modelLoaded: true,
    });
  };
  async loadTensorflowModel(modelUrl){
    this.deployedModel = await loadModel(modelUrl);
  }

  async loadUserPredictions(){
    const {chainModel, account} = this.props;
    const userPredictions = await chainModel.methods.getUserPredictionsOverview(account).call();
    const userLastPrediction = await chainModel.methods.getLatestUserPrediction(account).call();
    this.setState({
      userPredictions,
      userLastPrediction
    });
    return userPredictions;
  }

  async classify() { 
    const {chainModel} = this.props;
    const imageElement  = this.myRef.current;
    var results= await predict(imageElement, this.deployedModel);
    var imgHash = await hashData(imageElement);
    await chainModel.methods.savePrediction.cacheSend(        
        imgHash,
        JSON.stringify(results),      
      {
        from: this.props.drizzleState.account,
        value: this.state.pricePerUsage.toString()
      }
    );
    await this.loadUserPredictions();
   }    

  changeImage(){
    this.setState({ imgsource: 'https://loremflickr.com/224/224/dog?random='+Date.now()});
  };
  
    render() {
    const {imgsource, version, previousVersion, description, pricePerUsage, userPredictions , userLastPrediction, usedTimes} = this.state;
    const parseLastPrediction = userLastPrediction ? JSON.parse(userLastPrediction.predictionResult) : [];
    return (
      <div>
      <Flex>
        <Card  width={"600px"} maxWidth={"600px"} mx={"auto"} my={5} p={0}>
        
        <Box>        
          <Box>
            <Heading>Imagenet model</Heading>
            <Text>{description} - version: {version}</Text>
            <Text>Last Version:{previousVersion} </Text>
            <Text>Used {usedTimes} times | Price: {pricePerUsage} wei</Text>
            <Image
              ref={this.myRef}
              crossOrigin = "Anonymous" 
              alt="random image"
              borderRadius={8}
              height="auto"
              src= {imgsource}
            />     
          </Box> 
          <br/>          
          <Flex px={[3, 3, 4]} height={3} borderTop={1} borderColor={"#E8E8E8"}>
            <Button  mr={3}  mt={3} mb={3} height={"auto"} onClick = {() => this.changeImage()}>New Image</Button>
            <Button  mt= {3} mb={3} height={"auto"} onClick = {() => this.classify()} variant="success">
              Record result to the blockchain
            </Button>
          </Flex>
        </Box>
        </Card>
        <Card  width={"600px"} maxWidth={"600px"} mx={"auto"} my={5} p={0} px={[3, 3, 4]}>
        <Box alignItems={"left"}>
          <Heading>Your model usage:</Heading>
          {userPredictions && (
            <Text>Total preditions: {userPredictions.count} | spent: {this.props.drizzle.web3.utils.fromWei(
              userPredictions.totalSpent.toString(),
              "ether"
            ) } ETH </Text>
          )}          
          <Heading> Latest Prediction:</Heading>
          {
            userLastPrediction ? (
              <Box >
                <Text textAlign="left" >MODEL VERSION version: {userLastPrediction.modelVersion}</Text>
                <Text textAlign="left">IMAGE HASH: {userLastPrediction.dataHash}</Text>
                <Heading as={"h3"} textAlign="left">Model results:</Heading>
                <ul>
                { parseLastPrediction.map((p)=> (<Text.p textAlign="left"> - {p.className} : {p.probability}</Text.p>)) }
                </ul>              
              </Box>
            ): <Text>Nothing found. Go ahead and make a prediction</Text>
          }
        </Box>  
          
        </Card>
        </Flex> 
      </div>
    )
  }
}
