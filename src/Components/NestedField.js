/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { Provider, inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { Button, ControlLabel } from "react-bootstrap";
import { isFunction } from "lodash";
import FormStore from "../Stores/FormStore";

/**
 * Allows the implementation of a nested field structure
 * @class NestedField
 * @memberof FormFields
 * @namespace NestedField
 */

let styles = {
  buttonArea:{
    marginBottom: "1em"
  }
};

@inject("formStore")
@injectStyles(styles)
@observer
export default class NestedField extends React.Component {
  //The only way to trigger an onChange event in React is to do the following
  //Basically changing the field value, bypassing the react setter and dispatching an "input"
  // event on a proper html input node
  //See for example the discussion here : https://stackoverflow.com/a/46012210/9429503
  triggerOnChange = () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
      .call(this.hiddenInputRef, JSON.stringify(this.props.field.getValue(false)));
    var event = new Event("input", { bubbles: true });
    this.hiddenInputRef.dispatchEvent(event);
  }

  handleAdd = () => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(field.value.length < field.max){
      if(isFunction(this.props.onBeforeAddInstance)){
        this.props.onBeforeAddInstance(() => { field.addInstance(); }, field);
      } else {
        field.addInstance();
      }
      this.triggerOnChange();
    }
  }

  handleRemove = (index) => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(field.value.length > field.min){
      if(isFunction(this.props.onBeforeRemoveInstance)){
        this.props.onBeforeRemoveInstance(() => { field.removeInstance(index); }, field, field.value[index]);
      } else {
        field.removeInstance(index);
      }
      this.triggerOnChange();
    }
  }

  handleMoveUp = (index) => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(isFunction(this.props.onBeforeMoveUpInstance)){
      this.props.onBeforeMoveUpInstance(() => { field.moveInstance(index, index - 1); }, field, field.value[index]);
    } else {
      field.moveInstance(index, index - 1);
    }
    this.triggerOnChange();
  }

  handleMoveDown = (index) => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(isFunction(this.props.onBeforeMoveDownInstance)){
      this.props.onBeforeMoveDownInstance(() => { field.moveInstance(index, index + 1); }, field, field.value[index]);
    } else {
      field.moveInstance(index, index + 1);
    }
    this.triggerOnChange();
  }

  handleDuplicate = (index) => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(field.value.length < field.max){
      if(isFunction(this.props.onBeforeDuplicateInstance)){
        this.props.onBeforeDuplicateInstance(() => { field.duplicateInstance(index); }, field, field.value[index]);
      } else {
        field.duplicateInstance(index);
      }
      this.triggerOnChange();
    }
  }

  render() {
    let { classes, children } = this.props;
    let { label, path, disabled, readOnly, readMode, min, max, value, buttonLabel, topAddButton, bottomAddButton } = this.props.field;
    let childrenStructure = [];
    let numberOfChildInstances = value
      ? value.length
      : 0;
    for (let i = 0; i < numberOfChildInstances; i++) {
      childrenStructure.push(
        React.cloneElement(<div>{children}</div>)
      );
    }
    const addButton = (
      <div className={`quickfire-nested-add ${classes.buttonArea}`}>
        <Button bsStyle={"primary"}
          bsSize={"xsmall"}
          disabled={disabled || value.length >= max}
          readOnly={readOnly}
          onClick={this.handleAdd}
          className={disabled || readOnly?"disabled":""}>{buttonLabel}</Button>
      </div>
    );

    //No button will show at all if the nested fields have a min and max === 1
    const showButton = !this.props.formStore.readMode && !readMode && (min !== 1 || max !== 1);

    return (
      <div className={`quickfire-field-nested ${this.props.formStore.readMode || readMode?" quickfire-readmode":""} ${!numberOfChildInstances? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {showButton && topAddButton && addButton}
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
        <div>
          {childrenStructure.map((child, index) => {
            return (
              <Provider
                key={this.props.formStore.getGeneratedKey(value[index], "quickfire-nested-child")}
                parentPath={path + FormStore.getPathNodeSeparator() + index}
                nestedField={this.props.field}
                nestedFieldIndex={index}
                onRemove={this.handleRemove}
                onMoveUp={this.handleMoveUp}
                onMoveDown={this.handleMoveDown}
                onDuplicate={this.handleDuplicate}
                suppressChangedStoreWarning={true}
              >
                {child}
              </Provider>
            );
          })}
        </div>
        {showButton && bottomAddButton && (value.length !== 0 || !topAddButton) && addButton}
      </div>
    );
  }
}
