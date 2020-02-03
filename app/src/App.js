import React, { Component } from "react";

import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";
import "./App.css";
import "./utils/imagenet_classes.js"
import EventNotifier from './middleware'

import drizzleOptions from "./drizzleOptions";
import MLContainer from "./MLContainer";

const drizzleStore = generateStore({drizzleOptions,appMiddlewares: [EventNotifier] });
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider  drizzle={drizzle}>        
          <MLContainer />
      </DrizzleContext.Provider>
    );
  }
}

export default App;
