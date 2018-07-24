import React from "react";
import View from "./_View";

import injectStyles from "react-jss";

import {stripIndent} from "common-tags";

import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/prism-light";
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import json from 'react-syntax-highlighter/languages/prism/json';
import darcula from 'react-syntax-highlighter/styles/prism/darcula';

registerLanguage('jsx', jsx);
registerLanguage('json', json);


let styles = {
  title:{
    fontSize:"1.5em",
    textAlign:"center",
  },
  logo:{
    maxWidth:"200px",
    marginTop:"40px"
  },
  npm:{
    minWidth:"150px",
    marginBottom:"40px"
  }
}

@injectStyles(styles)
export default class Introduction extends View{
  render(){
    let {classes} = {...this.props};
    return (
      <div>
        <div className={classes.title}>
          <img className={classes.logo} src="/assets/logo.svg"/>
          <h2>HBP QuickFire</h2>
          <a href="https://www.npmjs.com/package/hbp-quickfire">
            <img target="_blank" className={classes.npm} src="https://badge.fury.io/js/hbp-quickfire.svg"/>
          </a>
          <p>
            HBP QuickFire is a React components library built on top of MobX and React-Bootstrap.
          </p>
          <p>
            Its goal is to provide a set of useful react components that let you build a consistent user interface with very little boilerplate code. 
          </p>
          <p>
            The main focus of the framework is to provide a simple but powerful entry forms management for React applications.
          </p>
          <p>
            The source code is available on GitHub at this address :&nbsp;
            <a href="https://github.com/HumanBrainProject/hbp-quickfire" target="_blank">
              https://github.com/HumanBrainProject/hbp-quickfire
            </a>
          </p>
        </div>

        <h3>Installation:</h3>
        <pre>
          npm i -s hbp-quickfire
        </pre>
        <hr/>

        <h3>Peer dependencies</h3>

        <p>In order to use hbp-quickfire in an application, the following peer dependencies need to be installed:</p>
        <ul>
          <li>mobx >=4.0</li>
          <li>mobx-react >=5.0</li>
          <li>react >=15.4.0</li>
          <li>react-dom >=15.4.0</li>
          <li>react-bootstrap >=0.32</li>
        </ul>
        <hr/>

        <h3>Getting started</h3>

        <p>HBP-QuickFire form mechanism is based on a declarative configuration of the form structure as a Javascript (or JSON) Object, like so :</p>

        <SyntaxHighlighter language="json" style={darcula}>
          {stripIndent`
          {
            fields:{
                username: {
                    type: "InputText",
                    label: "Your username"
                },
                age: {
                  type: "InputText",
                  label: "Your age",
                  inputType: "number"
                },
                preferedColor: {
                  type: "InputText",
                  label: "Your prefered color",
                  inputType: "color",
                  value: "#FF0000"
                }
            }
          }`}
        </SyntaxHighlighter>

        <p>
          Once this object matching your form data structure this object is provided to a <code>FormStore</code>
          instance provided by this library, you can use this store object and provide it to the <code>{`<Form/>`}</code>
          component. HBP-QuickFire lets you decide how you want to layout your form, or you can use one of the
          provided automatic layout <em>(feature coming soon...)</em>. Check the example below:
        </p>

        <SyntaxHighlighter language="jsx" style={darcula}>
          {stripIndent`
            import React from "react";
            import { observer } from "mobx-react";
            import { Row, Grid, Col } from "react-bootstrap";
            import { Form, FormStore, Field } from "hbp-quickfire";

            let peopleFormStructure = {...}; //See example definition above

            @observer
            export default class PeopleForm extends React.Component {
              constructor(props) {
                super(props);

                this.formStore = new FormStore(peopleFormStructure);
              }

              render() {
                return (
                  <Form store={this.formStore}>
                    <Grid>
                      <h2>People Form</h2>
                      <Row>
                        <Col xs={4}>
                          <Field name="username" />
                        </Col>
                        <Col xs={4}>
                          <Field name="preferedColor" />
                        </Col>
                        <Col xs={4}>
                          <Field name="age" />
                        </Col>
                      </Row>

                      <h2>Result</h2>
                      <Row>
                        <Col xs={12}>
                          <pre>{JSON.stringify(this.FormStore.getValues(), null, 4)}</pre>
                        </Col>
                      </Row>
                    </Grid>
                  </Form>
                );
              }
            }`}
        </SyntaxHighlighter>

        <p><a target="_blank" href="https://codesandbox.io/s/5yv58z58rx">See this example live on CodeSandbox</a></p>

        <h4>Getting the form data</h4>

        <p>
          At any time the <code>getValues()</code> method of the FormStore
          object return the processed values from the form in a structured object matching
          the definition.
        </p>
        <hr/>

        <p>
          You can find a more detailed descriptions of the individual components,
          including information on how to use them by using the navigation on the left
        </p>
      </div>
    );
  }
}