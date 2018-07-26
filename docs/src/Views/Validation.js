import React from "react";
import View from "./_View";
import { Form, Field, FormStore, SingleField } from "hbp-quickfire";
import { Col, Row, Panel, Button } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";
import { cloneDeep } from "lodash";

const properties = [
  [`validationRules`, `array`, `[]`, `A list of validation rules`],
  [`customErrorMessages`, `object`, `{}`, `Definition for custom error messages in the form: {rule: errorMessage}`],
  [`validationOptions`, `object`, `{onBlur: true, onChange: false}`, `Validation options to define when validation is executed`],
  [`customValidationFunctions`, `object`, `null`, `A way to define custom validation functions for more details best check the examples below`],
];

const resolveAfterXSeconds  = (returnVal, resolveAfter) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(returnVal);
    }, resolveAfter*1000);
  });
}

let formStruct = {
  fields:{
    groupName:{
      type: "InputText",
      label: "Group name",
      validationRules: "required"
    },
    people:{
      type:"Nested",
      label:"People",
      buttonLabel:"Add a person",
      topAddButton:false,
      max:1,
      fields:{
        firstName:{
          type:"InputText",
          label:"First Name",
          value:"Peter",
          customValidationFunctions: {
            "different_from_last_name": {
              func: (value, attribute, formStore) => value !== formStore.getValues().people[0].lastName,
              message: "First name has to be different from last name",
            }
          },
          validationRules: "required|different_from_last_name",
        },
        lastName:{
          type:"InputText",
          label:"Last Name",
          value:"Peter",
          validationRules: "required"
        },
        birthDate:{
          type:"InputText",
          label:"Birth Date",
          validationRules: "required"
        }
      }
    }
  }
}

export default class Validation extends View {
  constructor(props) {
    super(props);
    this.formStore = new FormStore(cloneDeep(formStruct));
  }

  onValidate() {
    this.formStore.validate();
  }

  onReset() {
    this.formStore.reset();
  }

  render() {
    return (
      <div>
        <h2>Validation</h2>
        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties} />

        <h3>Examples</h3>

        <h4>Pre-Defined Rules For Validation</h4>
        <p>Validation error messages can be automatically generated for a predefined set of validation rules. For a full list of supported rules <a href="https://github.com/skaterdav85/validatorjs#available-rules">click here</a></p>
        <View.ShowField
          definition={{
            label: "Name",
            type: "InputText",
            validationRules: "required"
          }}
        />
        <p>Validation rules can either be a string separated by pipes or arrays</p>
        <View.ShowField
          definition={{
            label: "Birthday",
            type: "InputText",
            validationRules: ["required", "date"]
          }}
        />
        <View.ShowField
          definition={{
            label: "Email",
            type: "InputText",
            validationRules: "required|email"
          }}
        />
        <p>Validation rules can be regular expressions</p>
        <View.ShowField
          definition={{
            label: "DOI Number",
            type: "InputText",
            defaultValue: "10.1038/nphoton.2011.99",
            validationRules: "required|regex:/^10.\\d{4,9}/[-._;()/:A-Z0-9]+$/i"
          }}
        />

        <h4>Other settings</h4>
        <p>You can also define your own error messages.</p>
        <View.ShowField
          definition={{
            label: "Password",
            type: "InputText",
            validationRules: "required|min:5",
            customErrorMessages: {
              min: "Password is not long enough"
            }
          }}
        />
        <p>Validation can either be executed when leaving the field (onBlur) or when the value changes (onChange). The default is onBlur</p>
        <View.ShowField
          definition={{
            label: "Enter a number",
            type: "InputText",
            validationRules: "required|numeric",
            validationOptions: {
              onBlur: false,
              onChange: true
            }
          }}
        />
        <h4>Validate Form</h4>
        <p>You can also validate an entire form by calling validate on the formStore instance</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
            formStore.validate();
        `}</SyntaxHighlighter>
        <Row>
          <Col xs={12}>
            <Form store={this.formStore}>
              <Row>
                <Col xs={12}><Field name="groupName"/></Col>
                <Col xs={12}>
                  <Field name="people">
                    <Panel>
                      <Panel.Body>
                        <Row>
                          <Col xs={12}>
                          </Col>
                          <Col xs={4}><Field name="firstName"/></Col>
                          <Col xs={4}><Field name="lastName"/></Col>
                          <Col xs={4}><Field name="birthDate"/></Col>
                        </Row>
                      </Panel.Body>
                    </Panel>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Button bsStyle={"success"} onClick={this.onValidate.bind(this)}>Validate</Button>{" "}
                  <Button bsStyle={"danger"} onClick={this.onReset.bind(this)}>Reset</Button>
                </Col>
              </Row>
            </Form>
          </Col>

        </Row>
        <h4>Custom Validation Functions</h4>
        <p>If you can't find an already existing validation rule or you want more flexibility you can also define your own validation functions</p>
        <h4>Basic Syntax:</h4>
        <p>You can define a custom validation rule inside the field definition:</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          customValidationFunctions = {
            "rule_name": {
              func: function_definition,
              message: "error_message",
            }
          },
          validationRules="rule_name"
        `}</SyntaxHighlighter>
        <p>The relevant properties are:</p>
        <ul>
          <li><b>rule_name:</b> The name of the validation rule</li>
          <li><b>function_definition:</b> The definition of the function. Has to return a boolean indicating if the validation was successful. The function parameters are the field value and attribute name</li>
          <li><b>message:</b> The error message in case the validation fails</li>
        </ul>
        <p>You can mix as many pre-defined validation rules with custom rules as you want but make sure to add your custom validation to the validationRules otherwise it won't be triggered.</p>
        <p>Here is a simple example that checks if a given input starts with A:</p>
        <SingleField
          label="Name"
          type="InputText"
          validationOptions={{
            onBlur: false,
            onChange: true
          }}
          customValidationFunctions =  {{
            "name_starts_with_a": {
              func: (value, attribute, formStore) => value.startsWith("A"),
              message: "Only names starting with A are allowed",
            }}
          }
          validationRules="name_starts_with_a"
        />
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          customValidationFunctions: {
            "name_starts_with_a": {
              func: (value, attribute, formStore) => value.startsWith("A"),
              message: "Only names starting with A are allowed",
            }
          },
          validationRules:"name_starts_with_a"
        `}</SyntaxHighlighter>
        <h4>Registering custom functions on the FormStore</h4>
        <p>You also have the possibility to register the custom validation functions on the form store instance (or class) directly by calling</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          formStore.registerCustomValidationFunction(name, func, errorMessage)
        `}</SyntaxHighlighter>
        <p>This makes the validation rule available on all form field. Which makes it ideal for rules shared between multiple Fields</p>
        <p>If you want to validate a field based on the value of a different field, you can use the formStore parameter to access any other field in the form</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          customValidationFunctions: {
            "different_from_last_name": {
              func: (value, attribute, formStore) => value !== formStore.getValues().people[0].lastName,
              message: "First name has to be different from last name",
            }
          },
          validationRules: "required|different_from_last_name",
        `}</SyntaxHighlighter>
        <p>In this example first name has different from last name. You can see this example in action in the people form above.</p>
        <h4>Asynchronous validation</h4>
        <p>Asynchronous validation is also supported. The mechanism to register is the same as with synchronous validation</p>
        <p>You can either use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function">async functions</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">promises</a>. Illustrative examples are shown below</p>
        <SingleField
          label="ID"
          placeholder="(1,2,3 are taken)"
          type="InputText"
          inputType="number"
          validationOptions={{
            onBlur: false,
            onChange: true
          }}
          customValidationFunctions={{
            "id_check": {
              func: async (value, attribute, formStore) => {
                const resolveAfterSeconds = 1;
                const existingIds = await resolveAfterXSeconds([1,2,3], resolveAfterSeconds); // waits for promise to resolve
                return !existingIds.includes(value);
              },
              message: "ID already exists",
            }
          }}
          validationRules= "required|id_check"
        />
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          customValidationFunctions: {
            "id_check": {
              func: async (value, attribute, formStore) => {
                const resolveAfterSeconds = 1;
                const existingIds = await resolveAfterXSeconds([1,2,3], resolveAfterSeconds); // waits for promise to resolve
                return !existingIds.includes(parseInt(value));
              },
              message: "ID already exists",
            }
          },
          validationRules: "required|id_check"
        `}</SyntaxHighlighter>
        <p>Using promises</p>
        <SingleField
          label="Input"
          placeholder="Write test"
          type="InputText"
          validationOptions={{
            onBlur: false,
            onChange: true
          }}
          customValidationFunctions={{
            "check_input": {
              func: (value, attribute, formStore) => {
                const resolveAfterSeconds = 0.5;
                const expectedValue = "test";
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    value === expectedValue ? resolve(true) : reject();
                  }, resolveAfterSeconds*1000);
                });
              },
              message: "Value is expected to be test",
            }
          }}
          validationRules="check_input"
        />
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          customValidationFunctions: {
            "custom": {
              func: (value, attribute, formStore) => {
                const resolveAfterSeconds = 0.5;
                const expectedValue = "test";
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    value === expectedValue ? resolve(true) : reject();
                  }, resolveAfterSeconds*1000);
                });
              },
              message: "Value is expected to be test",
            }
          },
          validationRules: "custom"
        `}</SyntaxHighlighter>
      </div>
    );
  }
}
