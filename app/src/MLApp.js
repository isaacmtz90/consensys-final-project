import React, { Component } from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import ModelForm from './ModelForm'
import Header from './Header'

class MyComponent extends Component {
  constructor (props) {
    super(props);
    console.log(props);
  }
  render() {
    const contract = this.props.drizzle.contracts.MLModel;

    return (
      <div className="App">
      <Header {...this.props}/>
      <ToastContainer />
        <div>         
          <h1>Imagenet onchain example</h1>          
        </div>
        <ModelForm account = {this.props.drizzleState.accounts[0]} chainModel = {contract} drizzleState = {this.props.drizzleState} drizzle = {this.props.drizzle}/> 
      </div>
    )
  }
}

export default MyComponent;