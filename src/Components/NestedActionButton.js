/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject } from "mobx-react";
import { Button, Glyphicon } from "react-bootstrap";
import { isFunction } from "lodash";

export default class NestedActionButton extends React.Component {
  static defaultProps = {
    bsStyle: "primary",
    bsSize: "xsmall",
    className: ""
  };

  handleClick = () => {
    if(isFunction(this.props[this.actionCbName])){
      this.props[this.actionCbName](this.props.nestedFieldIndex);
    }
  }

  isDisabled = () => {
    throw "isDisabled Method of NestedActionButton should be redefined by inheritance";
  }

  render() {
    if(this.props.formStore.readMode || this.props.nestedField.readMode){
      return null;
    }

    return (
      <Button
        disabled={this.isDisabled()}
        className={`${this.className} ${this.props.className}`}
        bsStyle={this.props.bsStyle}
        bsSize={this.props.bsSize}
        onClick={this.handleClick}>
        {this.props.children || <Glyphicon glyph={this.defaultIcon}/>}
      </Button>
    );
  }
}

/**
 * Action button to remove a nested instance,
 * has to be called by the app with <Field.Remove/> component
 * @memberof FormFields.NestedField
 * @class NestedRemoveButton
 */

@inject("formStore", "nestedField", "nestedFieldIndex", "onRemove")
class NestedRemoveButton extends NestedActionButton {
  constructor(props){
    super(props);
    this.defaultIcon = "remove";
    this.actionCbName = "onRemove";
    this.className = "quickfire-nested-remove";
  }

  isDisabled = () => {
    return this.props.nestedField.disabled || this.props.nestedField.readOnly || this.props.nestedField.value.length <= this.props.nestedField.min;
  }
}

NestedActionButton.Remove = NestedRemoveButton;

/**
 * Action button to move up a nested instance in the list,
 * has to be called by the app with <Field.MoveUp/> component
 * @memberof FormFields.NestedField
 * @class NestedMoveUpButton
 */

@inject("formStore", "nestedField", "nestedFieldIndex", "onMoveUp")
class NestedMoveUpButton extends NestedActionButton {
  constructor(props){
    super(props);
    this.defaultIcon = "arrow-up";
    this.actionCbName = "onMoveUp";
    this.className = "quickfire-nested-moveup";
  }

  isDisabled = () => {
    return this.props.nestedField.disabled || this.props.nestedField.readOnly || this.props.nestedFieldIndex === 0;
  }
}

NestedActionButton.MoveUp = NestedMoveUpButton;

/**
 * Action button to move down a nested instance in the list,
 * has to be called by the app with <Field.MoveDown/> component
 * @memberof FormFields.NestedField
 * @class NestedMoveDownButton
 */

@inject("formStore", "nestedField", "nestedFieldIndex", "onMoveDown")
class NestedMoveDownButton extends NestedActionButton {
  constructor(props){
    super(props);
    this.defaultIcon = "arrow-down";
    this.actionCbName = "onMoveDown";
    this.className = "quickfire-nested-movedown";
  }

  isDisabled = () => {
    return this.props.nestedField.disabled || this.props.nestedField.readOnly || this.props.nestedFieldIndex >= this.props.nestedField.value.length - 1;
  }
}

NestedActionButton.MoveDown = NestedMoveDownButton;

/**
 * Action button to duplicate a nested instance in the list,
 * has to be called by the app with <Field.Duplicate/> component
 * @memberof FormFields.NestedField
 * @class NestedDuplicateButton
 */

@inject("formStore", "nestedField", "nestedFieldIndex", "onDuplicate")
class NestedDuplicateButton extends NestedActionButton {
  constructor(props){
    super(props);
    this.defaultIcon = "duplicate";
    this.actionCbName = "onDuplicate";
    this.className = "quickfire-nested-duplicate";
  }

  isDisabled = () => {
    return this.props.nestedField.disabled || this.props.nestedField.readOnly || this.props.nestedField.value.length >= this.props.nestedField.max;
  }
}

NestedActionButton.Duplicate = NestedDuplicateButton;

