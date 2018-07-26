import React from "react";
import View from "./_View";
import { Row, Col } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";
import { SingleField } from "hbp-quickfire";
import { commonPropertiesWithSingle } from "./Field.js";

let properties = [
  [`type`,`string`,`undefined`,`(Required) The field type`]
];

properties = properties.concat(commonPropertiesWithSingle);

export default class SingleFieldDoc extends View {

  render() {
    return (
      <div>
        <h2>SingleField</h2>
        <p>
          The SingleField component gives you all the functionality the <a href="/Field"><code>Field</code> component </a> 
          gives with the flexibility of being able to use it outside of a <a href="/Form"><code>Form</code> component </a>
        </p>
        <p>Therefore the <code>SingleField</code> is great in cases where you only want a few fields without having to define an entire form.</p>
        <View.ShowInfoProperties properties={properties}/>
        <h3>Example</h3>
        <Row>
          <Col xs={6}>
            <SingleField label="Test" type="InputText" placeholder="¯\_(ツ)_/¯"/>
          </Col>
          <Col xs={6}>
            <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
                <SingleField label="Test" type="InputText" placeholder="¯\_(ツ)_/¯"/>
            `}</SyntaxHighlighter>
          </Col>
        </Row>
        <p>The only required prop is the type. The other props are defined by the individual field type.</p>
        <p>
          There are many different types of fields. To get a better idea what kind of fields are supported with 
          instructions on how to use them check the documentation of the individual field types.
        </p>
      </div>
    );
  }
}


