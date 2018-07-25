import React from "react";
import View from "./_View";
import { Alert } from "hbp-quickfire";
import { Col, Row, Button } from "react-bootstrap";
import injectStyles from "react-jss";

import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";

const properties = [
  [`show`, `boolean`, `false`, `Flag determining if the alert box has to be shown or not`],
  [`message`, `string`, `""`, `The main message to display in the alert box`],
  [`dismissLabel`, `string`, `"OK"`, `"Dismiss" button label`],
  [`onDismiss`, `function`, `undefined`, `A callback function to be executed when the user dismisses the alert`]
];

export default class AlertView extends View {
  constructor(props){
    super(props);
    this.state = {alertShow: false, dismissed:0};
  }

  handleDismiss = () => {
    this.setState({
      alertShow: false, 
      dismissed:this.state.dismissed + 1
    })
  }

  handleUserAction = () => {
    this.setState({
      alertShow: true
    })
  }

  render() {
    return (
      <div>
        <h2>Alert</h2>
        <p>An alert box based on React-Bootstrap modal. Allows application to alert the user upon a specific action.</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties} />

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <Row>
          <Col xs={12} sm={6}>
            <p>
              <Button onClick={this.handleUserAction}>User action</Button>
            </p>
            <p>
              Dismissed counter: {this.state.dismissed}
            </p>
            <Alert 
              show={this.state.alertShow} 
              message={"You've been alerted !"}
              onDismiss={this.handleDismiss}/>
          </Col>
          <Col xs={12} sm={6}>
            <SyntaxHighlighter
              language="jsx"
              style={darcula}
            >
            {stripIndent`
            <Alert 
              show={this.state.alertShow} 
              message={"You've been alerted !"}
              onDismiss={this.handleDismiss.bind(this, true)}/>`}
            </SyntaxHighlighter>
            <SyntaxHighlighter
              language="jsx"
              style={darcula}
            >
            {stripIndent`
                handleDismiss = () => {
                  this.setState({
                    alertShow: false, 
                    dismissed:this.state.dismissed + 1
                  })
                }
              
                handleUserAction = () => {
                  this.setState({
                    alertShow: true
                  })
                }`}
            </SyntaxHighlighter>
          </Col>
        </Row>
      </div>
    );
  }
}
