import React, { Component } from "react";
import { Nav, NavItem,  Button } from "reactstrap";
import { Blockie, EthAddress } from "rimble-ui";

class Header extends Component {
  constructor(props, context) {    
    super(props);    
    const { accounts } = props.drizzleState;
    this.state = {
      account: accounts[0],
      hasBalance: false,
      balance: 0
    };
  }

  componentDidMount() { 
    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.reload();
    })  
    this.checkOwner();
   
  }

  async checkOwner() {
    const { MLModel } = this.props.drizzle.contracts;
    const owner = await MLModel.methods.owner().call();
    console.log("owner", owner);
    var isOwner = owner === this.state.account ? true : false;
    this.setState({ isOwner });
  }

  async cashOut(){
    const { MLModel } = this.props.drizzle.contracts;
    console.log("cash out")
    await MLModel.methods.cashOut.cacheSend(    
    {
      from: this.state.account,
    }
  );
  }

  render() {
    const {isOwner, account} = this.state;
    return (
      
      <Nav>   
        <NavItem >
        <Blockie opts={{
          seed: account,
          color: "#dfa",
          bgcolor: "#a71",
          size: 10,
          scale: 5,
          spotcolor: "#000"
        }}/>
        </NavItem>        
        <NavItem >
          <EthAddress address={account} />
        </NavItem>       
        {isOwner && (
          <NavItem >
            <Button mr={3}  mt={3} mb={3} height={"auto"} onClick= {()=> this.cashOut()}>
              Cash Out
            </Button>
          </NavItem>
        )}
      </Nav>
    );
  }
}

export default Header;