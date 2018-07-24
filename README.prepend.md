![](docs/assets/favicon.png)

# HBP-QuickFire [![npm version](https://badge.fury.io/js/hbp-quickfire.svg)](https://badge.fury.io/js/hbp-quickfire)

HBP-QuickFire is a React components library built on top of MobX and React-Bootstrap.

Its goal is to provide a set of useful react components that let you build a consistent user interface with very little boilerplate code. The main focus of the framework is to provide a simple but powerful entry forms management for React applications.

A documentation application is available here : [https://hbp-quickfire.apps.hbp.eu/](https://hbp-quickfire.apps.hbp.eu/)

The source code is available here : [https://github.com/HumanBrainProject/hbp-quickfire](https://github.com/HumanBrainProject/hbp-quickfire)

## Installation:

```
npm i -s hbp-quickfire
```

## Peer dependencies

In order to use hbp-quickfire in an application, the following peer dependencies need to be installed:

- mobx >=4.0
- mobx-react >=5.0
- react >=15.4.0
- react-dom" >=15.4.0
- react-bootstrap >=0.32

## Getting started

HBP-QuickFire form mechanism is based on a declarative configuration of the form structure as a Javascript (or JSON) Object, like so:

```JavaScript
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
}
```

Once this object matching your form data structure this object is provided to a `FormStore` instance provided by this library, you can use this store object and provide it to the `<Form/>` component. HBP-QuickFire lets you decide how you want to layout your form, or you can use one of the provided automatic layout (feature coming soon...). Check the example below:

```JSX
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
              <pre>{JSON.stringify(this.formStore.getValues(), null, 4)}</pre>
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

```

[See this example live](https://codesandbox.io/s/5yv58z58rx)

### Getting the form data

At any time (e.g. when submitting the form), the `getValues()` method of the FormStore object returns the processed field values in a structured object matching the definition.

## Documentation

To get a more detailed documentation with plenty of examples open a console in the package root and run:

```
npm install
```

Then change your current directory to `./docs/` and run :

```
npm install
npm run start
```

### API Documentation

You can also find the API documentation below:
