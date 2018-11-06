/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";

import {cloneDeep, isFunction} from "lodash";

import {Row, Col, Table} from "react-bootstrap";
import {SingleField} from "hbp-quickfire";

import injectStyles from "react-jss";

import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/prism-light";
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';
import darcula from 'react-syntax-highlighter/styles/prism/darcula';
import { stripIndent } from "common-tags";

export default class View extends React.Component{
  componentDidMount() {
    document.querySelector("#contentBody").scrollTo(0, 0);
  }
}

let showFieldStyles = {
  container:{
    marginBottom:"30px"
  },
  rendering:{
    marginTop:"10px",
  }
}

@injectStyles(showFieldStyles)
class ShowField extends React.Component{
  constructor(props){
    super(props);
    this.state = {output:null};
    this.definition = props.definition;
  }

  componentDidMount(){
    this.setState({output: this.inputRef.value});
  }

  handleChange = (e, field) => {
    this.setState({output: this.inputRef.value});
    if(isFunction(this.props.onChange)){
      this.props.onChange(e, field);
    }
  }

  render(){
    let displayDefinition = cloneDeep(this.definition);

    let {classes} =  {...this.props};

    if(displayDefinition.options !== undefined){
      displayDefinition.options = "[...]";
    }
    if(displayDefinition.data !== undefined){
      displayDefinition.data = "[...]";
    }

    return(
      <Row  className={classes.container}>
        <Col xs={12} md={6} lg={5} className={classes.rendering}>
          <SingleField 
            { ...this.definition }
            ref={ref=>this.inputRef=ref} 
            onChange={this.handleChange}
            onLoad={this.handleChange}
            onBeforeAddValue={this.props.onBeforeAddValue}
            onBeforeRemoveValue={this.props.onBeforeRemoveValue}
            onBeforeSetValue={this.props.onBeforeSetValue}
            valueLabelRendering={this.props.valueLabelRendering}
          >{this.props.children}</SingleField>
        </Col>
        <Col xs={12} md={3} lg={4}>
          <h5>
            &lt;/&gt;
          </h5>
          <SyntaxHighlighter language={"json"} style={darcula}>
            {"//Field properties\n"+JSON.stringify(displayDefinition, null, 2)}
          </SyntaxHighlighter>
          {this.props.additionalCode && this.props.additionalCode.map((code, index) => {
            return <SyntaxHighlighter key={index} language={"jsx"} style={darcula}>{stripIndent(code)}</SyntaxHighlighter>
          })}
        </Col>
        <Col xs={12} md={3} lg={3}>
          <h5>
            Output value
          </h5>
          <SyntaxHighlighter language={"json"} style={darcula}>{JSON.stringify(this.state.output, null, 2)}</SyntaxHighlighter>
        </Col>
      </Row>
    );
  }
}

View.ShowField = ShowField;

class ShowInfoProperties extends React.Component{
  render(){
    return(
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {this.props.properties.map((prop, index) => {
            return (
              <tr key={index}>
                <td>{prop[0]}</td>
                <td><kbd>{prop[1]}</kbd></td>
                <td><code>{prop[2]}</code></td>
                <td>{prop[3]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

View.ShowInfoProperties = ShowInfoProperties;
