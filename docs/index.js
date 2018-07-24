import React from "react";
import { render } from "react-dom";
import injectStyles from "react-jss";

import Layout from "./src/Layout";

let styles = {
  container:{
    fontFamily:"Lato, sans-serif"
  }
};

@injectStyles(styles)
class App extends React.Component{
  render(){
    let {classes} = {...this.props};
    return(
      <div className={classes.container}>
        <Layout />
      </div>
    );
  }
};

render(<App />, document.getElementById("root"));
