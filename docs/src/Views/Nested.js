/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";

import {Panel, Col, Row, ButtonGroup} from "react-bootstrap";

import {Field} from "hbp-quickfire";

let properties = [
  [`label`, `string`, `""`, `The field label`],
  [`labelTooltip`, `string`, `null`, `The field label tooltip message`],
  [`buttonLabel`, `string`, `"Add an item"`, `The label used for adding an item to the repeatable fields`],
  [`min`, `number`, `1`, `min of nested children the field can have`],
  [`max`, `number`, `1`, `max of nested children the field can have`],
  [`fields`, `object`, `{}`, `The nested fields definitions`],
  [`value`, `string`, `[]`, `The value of the field`],
  [`defaultValue`, `array`, `[]`, `The defaultValue of the field`],
  [`topAddButton`, `string`, `true`, `Whether or not to display the Add button before the fields`],
  [`bottomAddButton`, `string`, `true`, `Whether or not to display the Add button after the fields`],
  [`emptyToNull`, `boolean`, `false`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`disabled`,`boolean`,`false`,`Is the field disabled or not, a disabled field won't be editable or returned/processed by FormStore.getValues()`],
  [`readOnly`,`boolean`,`false`,`Is the field readOnly or not, a readOnly field won't be editable but will be returned/processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

export default class InputText extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>Nested fields</h2>
        <p>A type of form component that allows to declare more complex nested data structures, with repeatable/sortable elements</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"Nested",
          label:"People",
          fields:{
            firstname:{
              type:"InputText",
              label:"Firstname"
            },
            lastname:{
              type:"InputText",
              label:"Lastname"
            }
          }
        }}>
          <Panel>
            <Panel.Body>
              <Row>
                <Col xs={6}>
                  <Field name={"firstname"}/>
                </Col>
                <Col xs={6}>
                  <Field name={"lastname"}/>
                </Col>
              </Row>
            </Panel.Body>
          </Panel>
        </View.ShowField>
        <hr/>

        <h4>Repeatable instances</h4>
        <p>Nested fields can be repeatable and have a dynamic number of items.</p>
        <p>Also action buttons can be added to the provided layout to handle removing/moving/duplicating an instance.</p>
        <View.ShowField 
          definition={{
            type:"Nested",
            label:"People",
            min:2,
            max:5,
            buttonLabel:"Add a person",
            fields:{
              firstname:{
                type:"InputText",
                label:"Firstname"
              },
              lastname:{
                type:"InputText",
                label:"Lastname"
              }
            }
          }}
          additionalCode={[
            `
            <Field name="myNestedField">
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
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Field name={"firstname"}/>
                    </Col>
                    <Col xs={6}>
                      <Field name={"lastname"}/>
                    </Col>
                  </Row>
                </Panel.Body>
              </Panel>
            </Field>`
          ]}
        >
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
              </Row>
              <Row>
                <Col xs={6}>
                  <Field name={"firstname"}/>
                </Col>
                <Col xs={6}>
                  <Field name={"lastname"}/>
                </Col>
              </Row>
            </Panel.Body>
          </Panel>
        </View.ShowField>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField 
          definition={{
            type:"Nested",
            label:"People",
            disabled:true,
            min:1,
            max:5,
            buttonLabel:"Add a person",
            fields:{
              name:{
                type:"InputText",
                label:"Name"
              }
            }
          }}>
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
              </Row>
              <Row>
                <Col xs={12}>
                  <Field name={"name"}/>
                </Col>
              </Row>
            </Panel.Body>
          </Panel>
        </View.ShowField>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField 
          definition={{
            type:"Nested",
            label:"People",
            readOnly:true,
            min:1,
            max:5,
            buttonLabel:"Add a person",
            fields:{
              name:{
                type:"InputText",
                label:"Name"
              }
            }
          }}>
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
              </Row>
              <Row>
                <Col xs={12}>
                  <Field name={"name"}/>
                </Col>
              </Row>
            </Panel.Body>
          </Panel>
        </View.ShowField>

      </div>
    );
  }
}


