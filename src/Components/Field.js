import React from "react";
import { inject } from "mobx-react";
import { pick } from "lodash";

import InputTextField from "./InputTextField";
import InputTextMultipleField from "./InputTextMultipleField";
import TextAreaField from "./TextAreaField";
import NestedField from "./NestedField";
import SelectField from "./SelectField";
import DropdownSelectField from "./DropdownSelectField";
import TreeSelectField from "./TreeSelectField";
import CheckBoxField from "./CheckBoxField.js";
import GroupSelectField from "./GroupSelectField.js";
import Slider from "./Slider.js";

import NestedActionButton from "./NestedActionButton";

export let components = {
  InputText: InputTextField,
  InputTextMultiple: InputTextMultipleField,
  TextArea: TextAreaField,
  Nested: NestedField,
  Select: SelectField,
  DropdownSelect: DropdownSelectField,
  TreeSelect: TreeSelectField,
  CheckBox: CheckBoxField,
  GroupSelect: GroupSelectField,
  Slider: Slider
};

export const catchedEvents = [
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",
  "onFocus",
  "onBlur",
  "onChange",
  "onInput",
  "onInvalid",
  "onSubmit",
  "onClick",
  "onContextMenu",
  "onDoubleClick",
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop",
  "onError",
  "onLoad",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",
  "onTouchCancel",
  "onTouchEnd",
  "onTouchMove",
  "onTouchStart",
  "onScroll",
  "onWheel"
];

export const validatedEvents = [
  "onBlur",
  "onChange"
];

export const passedDownPropsName = [
  "onAddCustomValue",
  "onBeforeAddValue",
  "onBeforeRemoveValue",
  "onBeforeSetValue",
  "onBeforeAddInstance",
  "onBeforeRemoveInstance",
  "onBeforeMoveUpInstance",
  "onBeforeMoveDownInstance",
  "onBeforeDuplicateInstance",
  "onValueClick",
  "onValueFocus",
  "onValueBlur",
  "onValueMouseOver",
  "onValueMouseOut",
  "onValueMouseEnter",
  "onValueMouseLeave",
  "readModeRendering",
  "valueLabelRendering"
];

/**
 * Field is a generic react component that supports all kinds of different input types
 * @class Field
 * @namespace FormFields
 * @property {string} name required - Name of the field as defined in the definition object passed to the FormStore
 * @property {function} onChange Event handler triggered when changes occur to the underlying field value
 */

@inject("formStore", "parentPath")
export default class Field extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.fieldRef !== undefined) {
      this.props.fieldRef(this);
    }
    this.field = this.props.formStore.getField(
      this.props.parentPath + "/" + this.props.name
    );
    if (!this.field) {
      throw "Field `" + this.props.name + "` has not been defined";
    }
  }

  render() {
    const FieldComponent = components[this.field.type] || (() => null);
    const parentEvHandlers = pick(this.props, catchedEvents);
    const parentProps = pick(this.props, ["className"]);
    const passedDownProps = pick(this.props, passedDownPropsName);

    Object.keys(parentEvHandlers).forEach(event => {
      let handler = parentEvHandlers[event];
      parentEvHandlers[event] = e => {
        handler(e, this.field, this.props.formStore);
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
      <div {...parentEvHandlers} {...parentProps}>
        <FieldComponent name={this.props.name} field={this.field} {...passedDownProps}>
          {this.props.children}
        </FieldComponent>
      </div>
    );
  }

  get value() {
    return this.field.getValue();
  }
}

Field.Remove = NestedActionButton.Remove;
Field.MoveUp = NestedActionButton.MoveUp;
Field.MoveDown = NestedActionButton.MoveDown;
Field.Duplicate = NestedActionButton.Duplicate;