/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { PanelGroup } from "react-bootstrap";
import { uniqueId, isNumber, isString } from "lodash";
import { observer } from "mobx-react";
import GenericListItem from "./GenericListItem";

/**
 * Generic List component that renders a list of items using Bootstrap Panels
 * @class GenericList
 * @property {array} items required - an array of items to be displayed in the list. Can be an array of primitives or objects
 * @property {boolean} expanded optional - if the panel is expanded by default
 * @property {object} itemTitle optional - react component to render the title for individual items. Gets passed the item to be rendered as a prop. Default value: ({ item }) => item
 * @property {boolean} itemBody optional - react component to render the body for individual items. Gets passed the item to be rendered as a prop. Only necessary if you want a body to be displayed
 * @property {array} actions required - an array of actions. An actions can be any react components that get rendered in the top right corner of the panel. For callback, implement the onClick which gets called with the selected item.
 */

@observer
export default class GenericList extends React.Component {
  static defaultProps = {
    itemTitle: ({ item }) => item,
    actions: [],
    items: [],
    expanded: false
  };

  constructor(props) {
    super(props);
    this.itemsMap = new Map();
  }

  getItemKey(item) {
    if (isNumber(item) || isString(item)) {
      return uniqueId("item_");
    }
    if (!this.itemsMap.get(item)) {
      const key = uniqueId("item_");
      this.itemsMap.set(item, key);
      return key;
    }
    return this.itemsMap.get(item);
  }

  render() {
    return (
      <PanelGroup id="list" className={"quickfire-generic-list"}>
        {this.props.items.map(item => {
          const key = this.getItemKey(item);
          return <GenericListItem {...this.props} key={key} item={item} />;
        })}
      </PanelGroup>
    );
  }
}
