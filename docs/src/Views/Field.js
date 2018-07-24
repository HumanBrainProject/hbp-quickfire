import React from "react";
import View from "./_View";
import { Row, Col, Panel, ButtonGroup, Button } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import jsx from "react-syntax-highlighter/languages/prism/jsx";
import json from "react-syntax-highlighter/languages/prism/json";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";
import { Field, FormStore, Form, Alert } from "hbp-quickfire";
import { isFunction } from "lodash";
import { SingleField } from "../../../lib";

let properties = [
  [`name`,`string`,`""`,`The field name - needs to be the same as in the field definition`],
];

export let commonPropertiesWithSingle = [
  [`on[EventName]`,`function`,`undefined`,`Normal React SyntheticEvent binding, but the field object will be passed as a second parameter. [EventName] can be one of the following: KeyDown, KeyPress, KeyUp, Focus, Blur, Change, Input, Invalid, Submit, Click, ContextMenu, DoubleClick, Drag, DragEnd, DragEnter, DragExit, DragLeave, DragOver, DragStart, Drop, Error, Load, MouseDown, MouseEnter, MouseLeave, MouseMove, MouseOut, MouseOver, MouseUp, TouchCancel, TouchEnd, TouchMove, TouchStart, Scroll, Wheel.`],
  [`onBeforeSetValue`,`function`,`undefined`,`Special hook called before a value is set after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal setValue operation, the concerned field object as a second parameter and the value to be set as a third parameter. Applicable to all field types.`],
  [`onBeforeAddValue`,`function`,`undefined`,`Special hook called before a value is added, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal addValue operation, the concerned field object as a second parameter and the value to be added as a third parameter. Applicable only to DropdownSelect, GroupSelect, InputTextMultiple and TreeSelect field types.`],
  [`onBeforeRemoveValue`,`function`,`undefined`,`Special hook called before a value is removed, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal removeValue operation, the concerned field object as a second parameter and the value to be removed as a third parameter. Applicable only to DropdownSelect, GroupSelect, InputTextMultiple and TreeSelect field types.`],
  [`onBeforeAddInstance`,`function`,`undefined`,`Special hook called before a new instance is added to a Nested field, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal addInstance operation, the concerned field object as a second parameter. Applicable only to Nested field type.`],
  [`onBeforeRemoveInstance`,`function`,`undefined`,`Special hook called before a Nested field instance is removed, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal removeInstance operation, the concerned field object as a second parameter and the instance to be removed as a third parameter. Applicable only to Nested field type.`],
  [`onBeforeMoveUpInstance`,`function`,`undefined`,`Special hook called before a Nested field instance is moved up, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal moveInstance operation, the concerned field object as a second parameter and the instance to be moved as a third parameter. Applicable only to Nested field type.`],
  [`onBeforeMoveDownInstance`,`function`,`undefined`,`Special hook called before a Nested field instance is moved down, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal moveInstance operation, the concerned field object as a second parameter and the instance to be moved as a third parameter. Applicable only to Nested field type.`],
  [`onBeforeDuplicateInstance`,`function`,`undefined`,`Special hook called before a Nested field instance is duplicated, after a user interaction. Receives a callback function as a first parameter that is to be called to perform the normal duplicateInstance operation, the concerned field object as a second parameter and the instance to be moved as a third parameter. Applicable only to Nested field type.`],
  [`onValue[EventName]`,`function`,`undefined`,`Special hook called when a value tag/button is clicked. Applicable only to DropdownSelect, InputTextMultiple and TreeSelect. [EventName] can be one of the following: Click, MouseOver, MouseOut, MouseEnter, MouseLeave, Focus, Blur`],
  [`readModeRendering`,`function`,`undefined`,`Allows the application level to provide its own rendering for a field in readMode`],
  [`valueLabelRendering`,`function`,`undefined`,`Allows the application level to provide its own rendering for a label used in selected value tags. Receives as parameter the field and the value. Applicable only to DropdownSelect, InputTextMultiple and TreeSelect field types.`]
];

properties = properties.concat(commonPropertiesWithSingle);

const form = {
  fields:{
    nested:{
      min:0,
      max:10,
      label:"Nested field with hooks on instances interactions",
      type:"Nested",
      fields:{
        tree:{
          type:"TreeSelect",
          label:"TreeSelect field with hooks on values interaction",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069"],
          max:1
        },
        dropdown:{
          type:"DropdownSelect",
          label:"DropdownSelect field with hooks on values interaction",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
        },
        inputMultiple:{
          type:"InputTextMultiple",
          label:"InputTextMultiple field with hooks on values interaction"
        }
      }
    }
  }
};

export default class FieldDoc extends View {
  constructor(props){
    super(props);
    this.formStore = new FormStore(form);
    this.state = {
      showAlert:false,
      messageAlert:"",
      doProcess:""
    }
  }

  render() {
    return (
      <div>
        <h2>Field</h2>
        <p>The field component is at the center of the form component. It lets you define the individual fields you want to use inside a form. The field component can only be used inside the form component. For a more detailed documentation on how to use form and field together see the <a href="/Form">form docs</a></p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>
        <p>The field component expects you to pass the field name as a prop. This is used to reference the underlying field definition.</p>
        <Col xs={12}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                <Field name="groupName"/>
                <Field name="groupDescription"/>
            `}</SyntaxHighlighter>
          </Col>
        <p>The field definition is defined in a structure that you need pass to a form via an form store instance.</p>

        <h3>Example Field definition:</h3>
        <Col xs={12}>
            <SyntaxHighlighter language="json" style={darcula}>{stripIndent`
                groupName: {
                    type: "InputText",
                    label: "Group name"
                },
                groupDescription: {
                    type: "TextArea",
                    label: "Group description"
                }
            `}</SyntaxHighlighter>
          </Col>
        <p>There are many different types of fields. To get a better idea what kind of fields are supported with instructions on how to use them check the documentation of the individual field types.</p>

        <h3>Special hooks</h3>
        <Row>
          <Col xs={6}>
            <Form store={this.formStore}>
              <Field name="nested"
                onBeforeAddInstance={this.handleInstanceInteraction.bind(this, "adding an instance to:")}
                onBeforeRemoveInstance={this.handleInstanceInteraction.bind(this, "removing an instance from:")}
                onBeforeMoveUpInstance={this.handleInstanceInteraction.bind(this, "moving up an instance of:")}
                onBeforeMoveDownInstance={this.handleInstanceInteraction.bind(this, "moving down an instance of:")}
                onBeforeDuplicateInstance={this.handleInstanceInteraction.bind(this, "duplicating an instance of:")}
                >
                <Panel>
                  <Panel.Body>
                    <ButtonGroup>
                      <Field.Remove/>
                      <Field.MoveUp/>
                      <Field.MoveDown/>
                      <Field.Duplicate/>
                    </ButtonGroup>
                    <Field name={"tree"} 
                      onBeforeSetValue={this.handleValueInteraction.bind(this, "setting the value to:")}
                      onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                      onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                      onValueClick={this.handleValueClick.bind(this)}
                      onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                      onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                      onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                      onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                      onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                      onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                    />
                    <Field name={"dropdown"} 
                      onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                      onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                      onValueClick={this.handleValueClick.bind(this)}
                      onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                      onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                      onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                      onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                      onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                      onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                    />
                    <Field name={"inputMultiple"} 
                      onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                      onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                      onValueClick={this.handleValueClick.bind(this)}
                      onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                      onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                      onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                      onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                      onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                      onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                    />
                  </Panel.Body>
                </Panel>
              </Field>
            </Form>

            <Alert show={this.state.showAlert} message={this.state.messageAlert} onDismiss={this.handleDismiss}/>
          </Col>
          <Col xs={12} sm={6}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
              <Form store={this.formStore}>
                <Field name="nested"
                  onBeforeAddInstance={this.handleInstanceInteraction.bind(this, "adding an instance to:")}
                  onBeforeRemoveInstance={this.handleInstanceInteraction.bind(this, "removing an instance from:")}
                  onBeforeMoveUpInstance={this.handleInstanceInteraction.bind(this, "moving up an instance of:")}
                  onBeforeMoveDownInstance={this.handleInstanceInteraction.bind(this, "moving down an instance of:")}
                  onBeforeDuplicateInstance={this.handleInstanceInteraction.bind(this, "duplicating an instance of:")}
                  >
                  <Panel>
                    <Panel.Body>
                      <ButtonGroup>
                        <Field.Remove/>
                        <Field.MoveUp/>
                        <Field.MoveDown/>
                        <Field.Duplicate/>
                      </ButtonGroup>
                      <Field name={"tree"} 
                        onBeforeSetValue={this.handleValueInteraction.bind(this, "setting the value to:")}
                        onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                        onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                        onValueClick={this.handleValueClick.bind(this)}
                        onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                        onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                        onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                        onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                        onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                        onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                      />
                      <Field name={"dropdown"} 
                        onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                        onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                        onValueClick={this.handleValueClick.bind(this)}
                        onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                        onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                        onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                        onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                        onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                        onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                      />
                      <Field name={"inputMultiple"} 
                        onBeforeAddValue={this.handleValueInteraction.bind(this, "adding the value:")}
                        onBeforeRemoveValue={this.handleValueInteraction.bind(this, "removing the value:")}
                        onValueClick={this.handleValueClick.bind(this)}
                        onValueFocus={this.handleValueTagInteraction.bind(this, "Focus")}
                        onValueBlur={this.handleValueTagInteraction.bind(this, "Blur")}
                        onValueMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver")}
                        onValueMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut")}
                        onValueMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter")}
                        onValueMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave")}
                      />
                    </Panel.Body>
                  </Panel>
                </Field>
              </Form>

              <Alert show={this.state.showAlert} message={this.state.messageAlert} onDismiss={this.handleDismiss}/>
            `}</SyntaxHighlighter>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                handleInstanceInteraction(interaction, doProcess, field, instance){
                  this.setState({showAlert:true, messageAlert:\`This will happen just before \${interaction} field \${field.label}\`, doProcess:doProcess});
                }
              
                handleValueInteraction(interaction, doProcess, field, value){
                  this.setState({showAlert:true, messageAlert:\`This will happen just before \${interaction} \${value[field.mappingLabel]}\`, doProcess:doProcess});
                }

                handleValueTagInteraction(interaction, field, value){
                  console.log(interaction, field, value);
                }
              
                handleValueClick(field, value){
                  this.setState({showAlert:true, messageAlert:\`You clicked on \${value[field.mappingLabel]}\`, doProcess:null});
                }
              
                handleDismiss = () => {
                  if(isFunction(this.state.doProcess)){
                    this.state.doProcess();
                  }
                  this.setState({showAlert:false, messageAlert:"", doProcess:null});
                }
            `}</SyntaxHighlighter>
          </Col>
        </Row>

        <hr/>

        <h3>Read Mode custom formatting</h3>
        <p>The <code>readModeRendering</code> prop allows to provide a function to customize the rendering of the component in read mode.</p>
        <p>In this exemple, the text will be truncated in read mode at the end of the word after the 128th character.</p>
        <Row>
          <Col xs={12} md={6}>
            <SingleField
              type="TextArea"
              ref={ref => this.customReadField = ref}
              readModeRendering={this.customTextAreaRendering}
              label="TextArea field with custom read mode"
            />
            <Button onClick={this.handleToggleReadMode}>Toggle Read Mode</Button>
          </Col>
          <Col xs={12} md={6}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                <SingleField
                  type="TextArea"
                  ref={ref => this.customReadField = ref}
                  readModeRendering={this.customTextAreaRendering}
                  label="TextArea field with custom read mode"
                />
              `}</SyntaxHighlighter>
              <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                  customTextAreaRendering = (field) => {
                    return(
                      <div>
                        {field.getValue().replace(/^([\s\S]{128})(.*?) ([\s\S]*)$/gi,"$1$2...").split("\n").map((line, index) => {
                          return(
                            <p key={line+(""+index)}>{line}</p>
                          );
                        })}
                      </div>
                    );
                  }
                `}</SyntaxHighlighter>
          </Col>
        </Row>

        <hr/>

        <h3>Value tag label custom rendering</h3>
        <p>
          The <code>valueLabelRendering</code> prop allows to provide a function to customize the rendering of the 
          label used in the selected value tags on the TreeSelect, DropdownSelect and InputTextMultiple field types
        </p>
        <Row>
          <Col xs={12} md={6}>
            <SingleField
              type="TreeSelect"
              label="TreeSelect with custom value display"
              dataUrl={"/assets/XHRMockupData/HBP_MEM_0000000.json"}
              mappingLabel={"name"}
              valueLabelRendering={(field, value) => `Value : ${value[field.mappingLabel]}`}
            />
          </Col>
          <Col xs={12} md={6}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                <SingleField
                  type="TreeSelect"
                  label="TreeSelect with custom value display"
                  dataUrl={"/assets/XHRMockupData/HBP_MEM_0000000.json"}
                  mappingLabel={"name"}
                  valueLabelRendering={(field, value) => \`Value : \${value[field.mappingLabel]}\`}
                />
              `}</SyntaxHighlighter>
          </Col>
        </Row>
      </div>
    );
  }

  handleInstanceInteraction(interaction, doProcess, field, instance){
    this.setState({showAlert:true, messageAlert:`This will happen just before ${interaction} ${field.label}`, doProcess:doProcess});
  }

  handleValueInteraction(interaction, doProcess, field, value){
    this.setState({showAlert:true, messageAlert:`This will happen just before ${interaction} ${value[field.mappingLabel] || value}`, doProcess:doProcess});
  }

  handleValueTagInteraction(interaction, field, value){
    console.log(interaction, field, value);
  }

  handleValueClick(field, value, event){
    console.log("here");
    event.stopPropagation();
    this.setState({showAlert:true, messageAlert:`You clicked on ${value[field.mappingLabel] || value}`, doProcess:null});
  }

  handleDismiss = () => {
    if(isFunction(this.state.doProcess)){
      this.state.doProcess();
    }
    this.setState({showAlert:false, messageAlert:"", doProcess:null});
  }

  customTextAreaRendering = (field) => {
    return(
      <div>
        {field.getValue().replace(/^([\s\S]{128})(.*?) ([\s\S]*)$/gi,"$1$2...").split("\n").map((line, index) => {
          return(
            <p key={line+(""+index)}>{line}</p>
          );
        })}
      </div>
    );
  }

  handleToggleReadMode = () => {
    this.customReadField.field.readMode = !this.customReadField.field.readMode;
  }
}


