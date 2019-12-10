/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { FormGroup, FormControl, InputGroup, Button, Glyphicon, Alert } from "react-bootstrap";
import autosize from "autosize";
import getLineHeight from "line-height";
import { isFunction, isString } from "lodash";

import FieldLabel from "./FieldLabel";
import clipboard from "../Stores/ClipboardStore";

const styles = {
  readMode:{
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    }
  }
};

@injectStyles(styles)
@inject("formStore")
@observer
/**
 * A simple text input
 * @class InputTextField
 * @memberof FormFields
 * @namespace InputTextField
 */
export default class InputTextField extends React.Component {
  static defaultProps = {
    componentClass: undefined
  };

  handleAutosize() {
    if (!this.props.field.autosize) {
      return;
    }
    if (this.inputRef) {
      if (this.inputRef != this.autosizedRef) { // the input ref may change over time. For instance when readmode is toggled. Therefore we might have to autosize the input multiple times over the component lifecycle.
        autosize(this.inputRef);
        this.autosizedRef = this.inputRef;
        this.lineHeight = getLineHeight(this.inputRef);
      } else {
        autosize.update(this.inputRef);
      }
    }
  }

  componentDidMount() {
    this.handleAutosize();
  }

  componentDidUpdate() {
    this.handleAutosize();
  }

  handleChange = e => {
    let field = this.props.field;
    //This shouldn't be necessary although some inputType don't behave well with readOnly => see inputType color
    if(!field.disabled && !field.readOnly){
      this.beforeSetValue(e.target.value);
    }
  };

  //The only way to trigger an onChange event in React is to do the following
  //Basically changing the field value, bypassing the react setter and dispatching an "input"
  // event on a proper html input node
  //See for example the discussion here : https://stackoverflow.com/a/46012210/9429503
  triggerOnChange = () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
      .call(this.inputRef, this.props.field.value);
    var event = new Event("input", { bubbles: true });
    this.inputRef.dispatchEvent(event);
  }

  handlePaste = () => {
    this.beforeSetValue(clipboard.selection);
    this.triggerOnChange();
  }

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue(value);}, this.props.field, value);
    } else {
      this.props.field.setValue(value);
    }
  }

  getStyle = () => {
    let { style = {} } = this.props;
    let { maxRows, resizable } = this.props.field;

    const maxHeight = maxRows && this.lineHeight ? this.lineHeight * (maxRows + 1) : null;
    const resize = resizable ? null : "none";

    style = {
      ...style,
      ...(maxHeight ? {maxHeight} : {}),
      ...(resize ? {resize} : {})
    };

    return style;
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let {
      value,
      inputType,
      autoComplete,
      useVirtualClipboard,
      disabled,
      readOnly,
      validationErrors,
      validationState,
      placeholder,
      rows
    } = this.props.field;

    const style = this.getStyle();

    const formControl = () => (
      <FormControl
        value={value}
        type={inputType}
        className={"quickfire-user-input"}
        componentClass={this.props.componentClass}
        onChange={this.handleChange}
        inputRef={ref=>this.inputRef = ref}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        style={style}
        rows={rows}
        autoComplete={autoComplete?"on":"off"}
      />
    );

    return (
      <FormGroup className={`quickfire-field-input-text ${!value? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`} validationState={validationState}>
        <FieldLabel field={this.props.field}/>
        {useVirtualClipboard?
          <InputGroup>
            {formControl()}
            <InputGroup.Button>
              <Button className={"quickfire-paste-button"} onClick={this.handlePaste}>
                <Glyphicon glyph="paste"/>
              </Button>
            </InputGroup.Button>
          </InputGroup>
          :
          formControl()
        }
        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}
      </FormGroup>
    );
  }

  renderReadMode(){
    let {
      value,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-input-text ${!value? "quickfire-empty-field": ""} quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        <FieldLabel field={this.props.field}/>
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          : this.props.componentClass === "textarea"?
            <div className="quickfire-readmode-value quickfire-readmode-textarea-value">
              {isString(value) && value.split("\n").map((line, index) => {
                return(
                  <p key={line+(""+index)}>{line}</p>
                );
              })}
            </div>
            :
            <span className="quickfire-readmode-value">&nbsp;{value}</span>
        }
      </div>
    );
  }
}