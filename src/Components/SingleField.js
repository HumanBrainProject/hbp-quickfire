/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { Provider } from "mobx-react";
import { pick } from "lodash";

import {components, catchedEvents, validatedEvents, passedDownPropsName} from "./Field";

import NestedActionButton from "./NestedActionButton";

import FormStore from "../Stores/FormStore";

/**
 * SingleField is a generic react component that supports all kinds of different input types without a form component
 * @class SingleField
 * @namespace SingleField
 */

export default class SingleField extends React.Component {
  constructor(props) {
    super(props);
    if(!props.type){
      throw "Single field needs at least a type prop";
    }
    if(FormStore.typesMapping[props.type] === undefined){
      throw "Unable to find this type of field : "+props.type;
    }
    this.name = "_singleField_"+Math.random().toString(36).substr(2, 16);
    let fieldDefinition = pick(props, FormStore.typesMapping[props.type].properties);
    this.formStore = new FormStore({
      fields: {
        [this.name]: fieldDefinition
      }
    });
    this.field = this.formStore.structure.fields[this.name];
  }

  componentWillReceiveProps(newProps){
    if(this.props.type !== newProps.type){
      throw "SingleField type cannot be changed once mounted";
    }
    FormStore.typesMapping[this.props.type].properties.forEach(defProperty => {
      if(this.props[defProperty] !== newProps[defProperty]){
        if(defProperty === "value"){
          this.field.injectValue(newProps[defProperty]);
        } else {
          this.field[defProperty] = newProps[defProperty];
        }
      }
    });
  }

  render() {
    const FieldComponent = components[this.field.type];
    const parentEvHandlers = pick(this.props, catchedEvents);
    const parentProps = pick(this.props, ["className"]);
    const passedDownProps = pick(this.props, passedDownPropsName);

    Object.keys(parentEvHandlers).forEach(event => {
      let handler = parentEvHandlers[event];
      parentEvHandlers[event] = e => {
        handler(e, this.field, this.formStore);
      };
    });

    for (const event of validatedEvents) {
      if (this.field.shouldValidateOnEvent(event)) {
        let existingHandler = parentEvHandlers[event] ? parentEvHandlers[event]: () => {};
        parentEvHandlers[event] = (...args) => {
          existingHandler(...args);
          this.field.validate();
        };
      }
    }

    parentProps.className = parentProps.className? parentProps.className+" quickfire-field quickfire-form-field": "quickfire-field quickfire-form-field";

    return (
      <Provider formStore={this.formStore}>
        <div {...parentEvHandlers} {...parentProps}>
          <FieldComponent name={this.name} field={this.field} {...passedDownProps}>
            {this.props.children}
          </FieldComponent>
        </div>
      </Provider>
    );
  }

  get value() {
    return this.field.getValue();
  }
}

SingleField.Remove = NestedActionButton.Remove;
SingleField.MoveUp = NestedActionButton.MoveUp;
SingleField.MoveDown = NestedActionButton.MoveDown;
SingleField.Duplicate = NestedActionButton.Duplicate;