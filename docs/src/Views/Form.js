import React from "react";
import View from "./_View";
import { observer } from "mobx-react";
import { FormStore, Field, Form } from "hbp-quickfire";
import { Row, Col, Panel, ButtonGroup, Button } from "react-bootstrap";
import { cloneDeep } from "lodash";

import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";

let properties = [
  [`store`,`object`,`undefined`,`A FormStore instance`]
];

let formStruct = {
  fields:{
    groupName:{
      type: "InputText",
      label: "Group name"
    },
    groupDescription:{
      type: "TextArea",
      label: "Group description"
    },
    groupKeywords:{
      type: "InputTextMultiple",
      label: "Group keywords"
    },
    groupCountry:{
      type:"Select",
      label:"Country in a native select",
      optionsUrl:"/assets/XHRMockupData/Countries.json",
      value:"fr"
    },
    people:{
      type:"Nested",
      label:"People",
      buttonLabel:"Add a person",
      topAddButton:false,
      min:1,
      max:5,
      value:[{
        firstname:"John",
        country:"FR",
        children:[
          {
            firstname:"Albert",
            country:"FR",
            childPets:[
              {
                name:"Rex"
              },
              {
                name:"Medor"
              }
            ]
          }
        ]
      }],
      fields:{
        firstname:{
          type:"InputText",
          label:"Firstname"
        },
        birthdate:{
          type:"InputText",
          label:"Birth Date",
          inputType:"date"
        },
        country:{
          type:"DropdownSelect",
          label:"Country",
          optionsUrl:"https://restcountries.eu/rest/v2/all",
          cacheOptionsUrl:true,
          max:1,
          mappingLabel:"name",
          mappingValue:"alpha2Code",
          mappingReturn:"alpha2Code",
          returnSingle:true,
          value:"AL"
        },
        children:{
          type:"Nested",
          label:"Children",
          buttonLabel:"Add a child",
          topAddButton:false,
          fields:{
            firstname:{
              type:"InputText",
              label:"Child firstname"
            },
            country:{
              type:"DropdownSelect",
              label:"Country",
              optionsUrl:"https://restcountries.eu/rest/v2/all",
              cacheOptionsUrl:true,
              max:1,
              mappingLabel:"name",
              mappingValue:"alpha2Code",
              mappingReturn:"alpha2Code",
              returnSingle:true,
              value:"FR"
            },
            childPets:{
              type:"Nested",
              label:"Child Pets",
              buttonLabel:"Add a pet",
              max:2,
              min:0,
              fields:{
                name:{
                  type:"InputText",
                  label:"Pet name"
                }
              }
            }
          },
          min:0,
          max:Infinity
        }
      }
    }
  }
}

@observer
export default class FormView extends View{
  constructor(props){
    super(props);

    this.state = {};
    this.save = {};

    this.formStore = new FormStore(cloneDeep(formStruct));
  }

  render(){ 
    return (
      <div>
        <h2>Form</h2>
        <p>
          The <code>Form</code> component is the wrapper around the form structure mechanism.
        </p>
        <p>
          It needs a <code>FormStore</code> instance as a property and you can pass a children structure that will be used
          as the form layout. You can also use an automatic form layout (feature coming soon...).
        </p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>

        <Row>
          <Col xs={12}>
            <SyntaxHighlighter language="json" style={darcula}>
              {JSON.stringify(formStruct, null, 2)}
            </SyntaxHighlighter>
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
            formStore = new FormStore(formStruct);
            
            ...

            <Form store={this.formStore}>
              <Row>
                <Col xs={12}><Field name="groupName"/></Col>
                <Col xs={12}><Field name="groupDescription"/></Col>
                <Col xs={12}><Field name="groupKeywords"/></Col>
                <Col xs={12}><Field name="groupCountry"/></Col>
                <Col xs={12}>
                  <Field name="people"> 
                    <Panel>
                      <Panel.Body>
                        <Row>
                          <Col xs={12}>
                            <ButtonGroup>
                              <Field.Remove />
                              <Field.MoveUp />
                              <Field.MoveDown />
                              <Field.Duplicate />
                            </ButtonGroup>
                          </Col>
                          <Col xs={4}><Field name="firstname"/></Col>
                          <Col xs={4}><Field name="birthdate"/></Col>
                          <Col xs={4}><Field name="country"/></Col>
                          <Col xs={12}>
                            <Field name="children">
                              <Row>
                                <Col xs={6}><Field name="firstname"/></Col>
                                <Col xs={4}><Field name="country"/></Col>
                                <Col xs={2} style={{marginTop:"26px"}}><Field.Remove bsSize={"small"} bsStyle="default"/></Col>
                                <Col xs={12}>
                                  <Field name="childPets">
                                    <Row>
                                      <Col xs={10}><Field name="name"/></Col>
                                      <Col xs={2} style={{marginTop:"26px"}}><Field.Remove bsSize={"small"} bsStyle="default"/></Col>
                                    </Row>
                                  </Field>
                                </Col>
                              </Row>
                            </Field>
                          </Col>
                        </Row>
                      </Panel.Body>
                    </Panel>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Button bsStyle={"success"} onClick={this.handleSave}>Save</Button>{" "}
                  <Button bsStyle={"warning"} onClick={this.handleReset}>Reset</Button>{" "}
                  <Button bsStyle={"primary"} onClick={this.handleRestore}>Restore</Button>
                </Col>
              </Row>
            </Form>
            `}</SyntaxHighlighter>
          </Col>
        </Row>

        <hr/>

        <Row>
          <Col xs={12} md={6}>
            <Form store={this.formStore}>
              <Row>
                <Col xs={12}><Field name="groupName"/></Col>
                <Col xs={12}><Field name="groupDescription"/></Col>
                <Col xs={12}><Field name="groupKeywords"/></Col>
                <Col xs={12}><Field name="groupCountry"/></Col>
                <Col xs={12}>
                  <Field name="people"> 
                    <Panel>
                      <Panel.Body>
                        <Row>
                          <Col xs={12}>
                            <ButtonGroup>
                              <Field.Remove />
                              <Field.MoveUp />
                              <Field.MoveDown />
                              <Field.Duplicate />
                            </ButtonGroup>
                          </Col>
                          <Col xs={4}><Field name="firstname"/></Col>
                          <Col xs={4}><Field name="birthdate"/></Col>
                          <Col xs={4}><Field name="country"/></Col>
                          <Col xs={12}>
                            <Field name="children">
                              <Row>
                                <Col xs={6}><Field name="firstname"/></Col>
                                <Col xs={4}><Field name="country"/></Col>
                                <Col xs={2} style={{marginTop:"26px"}}><Field.Remove bsSize={"small"} bsStyle="default"/></Col>
                                <Col xs={12}>
                                  <Field name="childPets">
                                    <Row>
                                      <Col xs={10}><Field name="name"/></Col>
                                      <Col xs={2} style={{marginTop:"26px"}}><Field.Remove bsSize={"small"} bsStyle="default"/></Col>
                                    </Row>
                                  </Field>
                                </Col>
                              </Row>
                            </Field>
                          </Col>
                        </Row>
                      </Panel.Body>
                    </Panel>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Button bsStyle={"success"} onClick={this.handleSave}>Save</Button>{" "}
                  <Button bsStyle={"warning"} onClick={this.handleReset}>Reset</Button>{" "}
                  <Button bsStyle={"primary"} onClick={this.handleRestore}>Restore</Button>{" "}
                  <Button bsStyle={"default"} onClick={this.toggleReadMode}>Toggle Read Mode</Button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col xs={12} md={6}>
            <SyntaxHighlighter language="json" style={darcula}>
              {JSON.stringify(this.formStore.getValues(), null, 2)}
            </SyntaxHighlighter>
          </Col>
        </Row>
      </div>
    );
  }
  
  handleSave = () => {
    this.save = this.formStore.values;
  }

  handleReset = () => {
    this.formStore.reset();
  }

  handleRestore = () => {
    this.formStore.values = this.save;
  }

  toggleReadMode = () => {
    this.formStore.toggleReadMode();
  }
}


