import React from "react";
import { observer } from "mobx-react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { Button, Glyphicon } from "react-bootstrap";
import injectStyles from "react-jss";

import { registerLanguage } from "react-syntax-highlighter/prism-light";
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';

import Sidebar from "./Layout/Sidebar";
import * as Views from "./Views";

registerLanguage('jsx', jsx);
registerLanguage('json', json);

let styles = {
  container:{
    display:"grid",
    width:"100vw",
    height:"100vh",
    overflow:"hidden",
    gridTemplateColumns: "250px 1fr",
    gridTemplateAreas: `"sidebar body"`,
    "@media screen and (max-width:1024px)":{
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto auto",
      gridTemplateAreas: `"sidebar" "body"`,
    }
  },
  body:{
    gridArea: "body",
    height:"100vh",
    overflow:"auto",
    "-webkit-overflow-scrolling": "touch",
    padding: "0 20px 20px",
    background: "#ecf0f1",
    "& hr":{
      borderTop: "1px solid #cacaca"
    },
    "@media screen and (max-width:1024px)":{
      height:"calc(100vh - 90px)",
      fontSize:"1.2em"
    }
  },
  sidebar:{
    position:"relative",
    gridArea: "sidebar",
    padding: "0 20px 20px",
    height:"100vh",
    overflow:"auto",
    "-webkit-overflow-scrolling": "touch",
    background:"#34495e",
    color:"white",
    transition:"height 0.5s ease",
    "@media screen and (max-width:1024px)":{
      overflow:"hidden",
      height:"90px"
    }
  },
  mobileMenuButton:{
    position:"absolute",
    top:"25px",
    right:"30px",
    display:"none",
    backgroundColor: "#34495e",
    border:"1px solid #ecf0f1",
    color:"#ecf0f1",
    "@media screen and (max-width:1024px)":{
      display:"block"
    },
    "&:active:hover, &:active, &:hover, &:focus":{
      backgroundColor: "#34495e",
      border:"1px solid #ecf0f1",
      color:"#ecf0f1",
    }
  },
  "@media screen and (max-width:1024px)":{
    "@global body":{
      overflow:"hidden"
    }
  },
  menuExpanded:{
    "& $sidebar":{
      height:"100vh",
      overflow:"auto",
      "-webkit-overflow-scrolling": "touch",
    }
  }
};


@injectStyles(styles)
@observer
export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {menuExpanded: false};
  }

  expandSidebar = () => {
    this.setState({menuExpanded: !this.state.menuExpanded});
  }

  componentDidMount(){
    document.addEventListener("click", (e) => {
      if(e.target.className.match(/navlink/gi)){
        this.setState({menuExpanded: false});
        document.querySelector("#contentNav").scrollTo(0, 0);
      }
    });
  }

  render() {
    const { classes } = { ...this.props };

    return (
      <Router>
        <div className={[classes.container, this.state.menuExpanded? classes.menuExpanded: ""].join(" ")}>
            <div className={classes.sidebar} id="contentNav">
              <Sidebar/>
              <Button className={classes.mobileMenuButton} onClick={this.expandSidebar}><Glyphicon glyph="menu-hamburger"/></Button>
            </div>
            <div id="contentBody" className={classes.body}>
              <Route exact path="/" component={Views.Introduction}/>
              <Route exact path="/InputText" component={Views.InputText}/>
              <Route exact path="/CheckBox" component={Views.CheckBox}/>
              <Route exact path="/DataSheet" component={Views.DataSheet}/>
              <Route exact path="/DropdownSelect" component={Views.DropdownSelect}/>
              <Route exact path="/GroupSelect" component={Views.GroupSelect}/>
              <Route exact path="/InputTextMultiple" component={Views.InputTextMultiple}/>
              <Route exact path="/TextArea" component={Views.TextArea}/>
              <Route exact path="/Select" component={Views.Select}/>
              <Route exact path="/TreeSelect" component={Views.TreeSelect}/>
              <Route exact path="/Nested" component={Views.Nested}/>
              <Route exact path="/GenericList" component={Views.GenericListView}/>
              <Route exact path="/Validation" component={Views.Validation}/>
              <Route exact path="/Form" component={Views.Form}/>
              <Route exact path="/Slider" component={Views.Slider}/>
              <Route exact path="/Field" component={Views.Field}/>
              <Route exact path="/SingleField" component={Views.SingleField}/>
              <Route exact path="/FormStore" component={Views.FormStore}/>
              <Route exact path="/ClipboardStore" component={Views.ClipboardStore}/>
              <Route exact path="/License" component={Views.License}/>
              <Route exact path="/Confirm" component={Views.Confirm}/>
              <Route exact path="/Alert" component={Views.Alert}/>
            </div>
        </div>
      </Router>
    );
  }
}
