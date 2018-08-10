import React from "react";
import { render } from "react-dom";
import injectStyles from "react-jss";

import Layout from "./src/Layout";
import { FormStore } from "hbp-quickfire";

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

//Render the app once we have prefetched all the different options
FormStore.prefetchOptions(["/assets/XHRMockupData/Countries.json", "/assets/XHRMockupData/HBP_MEM_0000000.json"]).then(() => {
  render(<App />, document.getElementById("root"));
});

//Alternative syntax
/*(async () => {
  await FormStore.prefetchOptions(["/assets/XHRMockupData/Countries.json", "/assets/XHRMockupData/HBP_MEM_0000000.json"]);
  render(<App />, document.getElementById("root"));
})();*/