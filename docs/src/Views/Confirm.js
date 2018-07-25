import React from "react";
import View from "./_View";
import { Confirm } from "hbp-quickfire";
import { Col, Row, Button } from "react-bootstrap";
import injectStyles from "react-jss";

import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";

const properties = [
  [`show`, `boolean`, `false`, `Flag determining if the confirm box has to be shown or not`],
  [`message`, `string`, `"Do you confirm this action ?"`, `The main message to display in the confirm box`],
  [`confirmLabel`, `string`, `"Confirm"`, `"Confirm" button label`],
  [`cancelLabel`, `string`, `"Cancel"`, `"Cancel" button label`],
  [`onConfirm`, `function`, `undefined`, `A callback function to be executed when the user confirms the action`],
  [`onCancel`, `function`, `undefined`, `A callback function to be executed when the user cancels the action`]
];

let styles = {

};

@injectStyles(styles)
export default class ConfirmView extends View {
  constructor(props){
    super(props);
    this.state = {confirmShow: false, confirmed:0, canceled:0};
  }

  handleConfirmAnswer = (answer) => {
    this.setState({
      confirmShow: false, 
      confirmed:answer? this.state.confirmed + 1:this.state.confirmed, 
      canceled:!answer? this.state.canceled + 1:this.state.canceled
    })
  }

  handleUserAction = () => {
    this.setState({
      confirmShow: true
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h2>Confirm</h2>
        <p>A confirm box based on React-Bootstrap modal. Allows application to prompt the user to confirm a specified action.</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties} />

        <h3>Examples:</h3>

        <h4 className={classes.h4}>Basic usage</h4>
        <Row>
          <Col xs={12} sm={6}>
            <p>
              <Button onClick={this.handleUserAction}>User action</Button>
            </p>
            <p>
              Confirmed counter: {this.state.confirmed}
            </p>
            <p>
              Canceled counter: {this.state.canceled}
            </p>
            <Confirm 
              show={this.state.confirmShow} 
              message={"Do you confirm that you clicked on a button ?"}
              onConfirm={this.handleConfirmAnswer.bind(this, true)}
              onCancel={this.handleConfirmAnswer.bind(this, false)}/>
          </Col>
          <Col xs={12} sm={6}>
            <SyntaxHighlighter
              language="jsx"
              style={darcula}
            >
            {stripIndent`
            <Confirm 
              show={this.state.confirmShow} 
              message={"Do you confirm that you clicked on a button ?"}
              onConfirm={this.handleConfirmAnswer.bind(this, true)}
              onCancel={this.handleConfirmAnswer.bind(this, false)}/>`}
            </SyntaxHighlighter>
            <SyntaxHighlighter
              language="jsx"
              style={darcula}
            >
            {stripIndent`
              handleConfirmAnswer = (answer) => {
                this.setState({
                  confirmShow: false, 
                  confirmed:answer? this.state.confirmed + 1:this.state.confirmed, 
                  canceled:!answer? this.state.canceled + 1:this.state.canceled
                })
              }
            
              handleUserAction = () => {
                this.setState({
                  confirmShow: true
                })
              }`}
            </SyntaxHighlighter>
          </Col>
        </Row>
      </div>
    );
  }
}
