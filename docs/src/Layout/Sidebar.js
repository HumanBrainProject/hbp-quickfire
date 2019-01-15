/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { NavLink } from "react-router-dom";
import injectStyles from "react-jss";

const styles = {
  container: {
    "& h1":{
      fontSize:"1.5em",
      textAlign:"center"
    },
    "& h2":{
      fontSize:"1.25em"
    },
    "& h3":{
      fontSize:"1.1em"
    },
    "& hr":{
      opacity:"0.25"
    },
    "& ul":{
      listStyle:"none",
      paddingLeft:0
    },
    "& a":{
      color:"white",
      opacity:0.60,
      fontWeight:"300",
      "&.active":{
        opacity:1,
        fontWeight:"normal"
      }
    },
    "@media screen and (max-width:1024px)":{
      textAlign:"center",
      fontSize:"1.2em",
      "& h1":{
        fontSize:"1.5em",
        marginLeft:"-20px"
      },
      "& ul":{
        lineHeight:"1.6",
        fontSize:"1.3em",
      }
    }
  },
  logo:{
    width:"50px",
    marginRight:"15px",
    "& + span":{
      display:"block",
      marginTop:"20px"
    },
    "@media screen and (max-width:1024px)":{
      "& h1":{
        display:"inline",
        marginTop:"0"
      }
    }
  }
}

@injectStyles(styles)
export default class Sidebar extends React.Component{
  render(){
    let {classes} = this.props;

    return(
      <div className={classes.container}>
        <h1>
          <img className={classes.logo} alt="HBP-QuickFire logo" src="/assets/logo.svg"/>
          <span>HBP QuickFire</span>
        </h1>
        <hr/>

        <h2>Getting started</h2>
        <ul>
          <li><NavLink className={"navlink"} exact={true} activeClassName="active" to="/">Introduction</NavLink></li>
          <li><NavLink className={"navlink"} exact={true} activeClassName="active" to="/License">License</NavLink></li>
        </ul>
        <hr/>

        <h2>Forms</h2>
        <ul>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Form">Form</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Field">Field</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/SingleField">SingleField</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Validation">Validation</NavLink></li>
        </ul>


        <h3>Field types :</h3>
        <ul>
          <li><NavLink className={"navlink"} activeClassName="active" to="/CheckBox">CheckBox</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/DataSheet">DataSheet</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/DropdownSelect">DropdownSelect</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/GroupSelect">GroupSelect</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/InputText">InputText</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/InputTextMultiple">InputTextMultiple</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Nested">Nested</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Select">Select</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/TextArea">TextArea</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/TreeSelect">TreeSelect</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Slider">Slider</NavLink></li>
          <li>&nbsp;</li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/CustomField">Custom field</NavLink></li>
        </ul>
        <hr/>

        <h2>Stores</h2>
        <ul>
          <li><NavLink className={"navlink"} activeClassName="active" to="/FormStore">FormStore</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/ClipboardStore">ClipboardStore</NavLink></li>
        </ul>

        <h2>Other components</h2>
        <ul>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Alert">Alert</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/Confirm">Confirm</NavLink></li>
          <li><NavLink className={"navlink"} activeClassName="active" to="/GenericList">GenericList</NavLink></li>
          {/* <li><NavLink className={"navlink"} activeClassName="active" to="/Tree">Tree</NavLink></li> */}
        </ul>
      </div>
    );
  }
}