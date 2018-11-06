/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";
import { GenericList, ActionIcon } from "hbp-quickfire";
import { Col, Row } from "react-bootstrap";
import injectStyles from "react-jss";
import countryInfos from "../MockupData/CountryInfos.json";
import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";
import { stripIndent } from "common-tags";

const properties = [
  [`items`, `array`, `[]`, `Array of items to be displayed`],
  [`expanded`, `boolean`, `false`, `Flag that determines if the panel is expanded by default`],
  [`itemTitle`, `object`, `({ item }) => item`, `React component to render the title for individual items. Gets passed the item to be rendered as a prop`],
  [`itemBody`, `object`, `null`, `react component to render the body for individual items. Gets passed the item to be rendered as a prop. Only necessary if you want a body to be displayed`],
  [`actions`, `array`, `[]`, `An array of actions. An actions can be any react components that get rendered in the top right corner of the panel. For callback, implement the onClick which gets called with the selected item`],
];

let styles = {
  h4: {
    marginTop:"15px",
  }
};


@injectStyles(styles)
export default class GenericListView extends View {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h2>Generic List</h2>
        <p>A flexible generic list components that allows the display of a list of items</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties} />

        <h3>Examples:</h3>

        <h4 className={classes.h4}>Basic usage</h4>
        <Col xs={12}>
          <GenericList items={[1, 2, 3]} />
          <SyntaxHighlighter
            language="jsx"
            style={darcula}
          >{`<GenericList items={[1, 2, 3]} />`}</SyntaxHighlighter>
        </Col>
        <Row/>
        <h4 className={classes.h4}>Complex Example</h4>
        <p>This example shows a list with an item body and actions</p>
        <Col xs={12}>
          <GenericList
            items={countryInfos}
            itemTitle={({ item }) => (
              <div>
                {item.name}
                <br />
                <span style={{ color: "gray", fontStyle: "italic" }}>
                  {`Population: ${item.inhabitants}`}
                </span>
              </div>
            )}
            itemBody={({ item }) => `Country Motto: ${item.motto}`}
            expanded={true}
            actions={[
              <ActionIcon
                icon={"heart-empty"}
                style={{ color: "red" }}
                onClick={item =>
                  alert(`Hi we're ${item.name} our motto is: ${item.motto}`)
                }
              />
            ]}
          />
          <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          <GenericList
            items={countryInfos}
            itemTitle={({ item }) => (
              <div>
                {item.name}
                <br />
                <span style={{ color: "gray", fontStyle: "italic" }}>
                  {\`Population: \${item.inhabitants}\`}
                </span>
              </div>
            )}
            itemBody={({ item }) => \`Country Motto: \${item.motto}\`}
            expanded={true}
            actions={[
              <ActionIcon
                icon={"heart-empty"}
                style={{ color: "red" }}
                onClick={item =>
                  alert(\`Hi we're \${item.name} our motto is: \${item.motto}\`)
                }
              />
            ]}
          />`}</SyntaxHighlighter>
        </Col>
      </div>
    );
  }
}
