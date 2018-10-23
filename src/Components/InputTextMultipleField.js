import React from "react";
import { inject, observer } from "mobx-react";
import { FormGroup, ControlLabel, Button, Glyphicon, Alert } from "react-bootstrap";
import injectStyles from "react-jss";
import {isFunction} from "lodash";

import clipboard from "../Stores/ClipboardStore";

const styles = {
  values:{
    height:"auto",
    paddingBottom:"3px",
    "& .btn.value-tag":{
      marginRight:"3px",
      marginBottom:"3px"
    },
    "&.withVirtualClipboard":{
      paddingRight:"36px"
    },
    "& :disabled":{
      pointerEvents:"none"
    },
    "& [readonly] .quickfire-remove":{
      pointerEvents:"none"
    },
    "&[readonly] .quickfire-user-input, &[disabled] .quickfire-user-input":{
      display:"none"
    }
  },
  valueDisplay:{
    display:"inline-block",
    maxWidth:"200px",
    overflow:"hidden",
    textOverflow:"ellipsis",
    whiteSpace:"nowrap",
    verticalAlign:"bottom"
  },
  remove:{
    fontSize:"0.8em",
    opacity:0.5,
    marginLeft:"3px",
    "&:hover":{
      opacity:1
    }
  },
  pasteButton:{
    position:"absolute",
    top:0,
    right:0,
    height:"100%",
    margin:"0",
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
    borderRight:"none",
    borderTop:"none",
    borderBottom:"none"
  },
  userInput:{
    background:"transparent",
    border:"none",
    color:"currentColor",
    outline:"none",
    width:"200px",
    maxWidth:"33%",
    marginBottom:"3px",
    "&:disabled":{
      cursor: "not-allowed"
    }
  },
  readMode:{
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    },
    "& .quickfire-readmode-item:not(:last-child):after":{
      content: "',\\00a0'"
    }
  }
};

/**
 * Allows the input of multiple values
 * @class InputTextMultipleField
 * @memberof FormFields
 * @namespace InputTextMultipleField
 */

@inject("formStore")
@injectStyles(styles)
@observer
export default class InputTextMultipleField extends React.Component {

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

  handleChange = e => {
    e.stopPropagation();
  }

  handlePaste = () => {
    (""+clipboard.selection).split("\n").forEach(value => {
      this.beforeAddValue(value.trim());
    });
    this.triggerOnChange();
  }

  handleNativePaste = (e) => {
    e.preventDefault();
    (e.clipboardData.getData("text")).split("\n").forEach(value => {
      this.beforeAddValue(value.trim());
    });
    this.triggerOnChange();
  }

  handleKeyStrokes = e => {
    let field = this.props.field;
    if (field.disabled || field.readOnly){
      return;
    }
    if(field.value.length < field.max && e.keyCode === 13){
      //User pressed "Enter" while focus on input and we have not reached the maximum number of values
      this.beforeAddValue(e.target.value.trim());
      e.target.value = "";
      this.triggerOnChange();
    } else if(!e.target.value && field.value.length > 0 && e.keyCode === 8){
      // User pressed "Backspace" while focus on input, and input is empty, and values have been entered
      e.preventDefault();
      let valueToRemove = e.target.value = field.value[field.value.length-1];
      this.beforeRemoveValue(valueToRemove);
    }
  };

  handleBlur = e => {
    const { field } = this.props;
    let { value } = e.target;
    if (!field.disabled && !field.readOnly && value) {
      this.beforeAddValue(e.target.value.trim());
      e.target.value = "";
      this.triggerOnChange();
    }
  };

  handleFocus = () => {
    this.inputRef.focus();
  };

  handleRemove(value, e){
    let field = this.props.field;
    e.stopPropagation();
    if(field.disabled || field.readOnly){
      return;
    }
    this.beforeRemoveValue(value);
    this.triggerOnChange();
  }

  handleRemoveBackspace(value, e){
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    //User pressed "Backspace" while focus on a value
    if(e.keyCode === 8){
      this.beforeRemoveValue(value);
      this.handleFocus();
      this.triggerOnChange();
    }
  }

  handleValueTagInteraction(interaction, value, event){
    if(isFunction(this.props[`onValue${interaction}`])){
      this.props[`onValue${interaction}`](this.props.field, value, event);
    } else if(interaction === "Click"){
      this.handleRemove(value, event);
      this.inputRef.value = value;
      this.handleFocus();
      this.triggerOnChange();
    }
  }

  handleDrop(droppedVal, e){
    let field = this.props.field;
    if(field.disabled || field.readOnly || field.readAndDeleteOnly){
      return;
    }
    e.preventDefault();
    field.removeValue(this.draggedValue);
    field.addValue(this.draggedValue, field.value.indexOf(droppedVal));
    this.handleFocus();
    this.triggerOnChange();
  }

  beforeAddValue(value){
    if(isFunction(this.props.onBeforeAddValue)){
      this.props.onBeforeAddValue(() => {this.props.field.addValue(value);}, this.props.field, value);
    } else {
      this.props.field.addValue(value);
    }
  }

  beforeRemoveValue(value){
    if(isFunction(this.props.onBeforeRemoveValue)){
      this.props.onBeforeRemoveValue(() => {this.props.field.removeValue(value);}, this.props.field, value);
    } else {
      this.props.field.removeValue(value);
    }
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { classes } = this.props;
    let { label, value, disabled, readOnly, readAndDeleteOnly, useVirtualClipboard, max, validationErrors, validationState } = this.props.field;
    let withVirtualClipboardClass = useVirtualClipboard? "withVirtualClipboard": "";

    return (
      <FormGroup onClick={this.handleFocus} className={`quickfire-field-input-text-multiple ${!value.length? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`} validationState={validationState}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        <div disabled={disabled} readOnly={readOnly} className={`form-control input-group ${classes.values} ${withVirtualClipboardClass}`}>
          {value.map(val => {
            return(
              <div key={val}
                tabIndex={"0"}
                disabled={disabled}
                readOnly={readOnly}
                readAndDeleteOnly={readAndDeleteOnly}
                title={val}
                className={`value-tag quickfire-value-tag btn btn-xs btn-default ${disabled||readOnly? "disabled": ""}`}
                draggable={true}
                onDragEnd={()=>this.draggedValue = null}
                onDragStart={()=>this.draggedValue = val}
                onDragOver={e=>e.preventDefault()}
                onDrop={this.handleDrop.bind(this, val)}
                onKeyDown={this.handleRemoveBackspace.bind(this, val)}

                onClick={this.handleValueTagInteraction.bind(this, "Click", val)}
                onFocus={this.handleValueTagInteraction.bind(this, "Focus", val)}
                onBlur={this.handleValueTagInteraction.bind(this, "Blur", val)}
                onMouseOver={this.handleValueTagInteraction.bind(this, "MouseOver", val)}
                onMouseOut={this.handleValueTagInteraction.bind(this, "MouseOut", val)}
                onMouseEnter={this.handleValueTagInteraction.bind(this, "MouseEnter", val)}
                onMouseLeave={this.handleValueTagInteraction.bind(this, "MouseLeave", val)}
              >
                <span className={classes.valueDisplay}>
                  {isFunction(this.props.valueLabelRendering)?
                    this.props.valueLabelRendering(this.props.field, val):
                    val}
                </span>
                <Glyphicon className={[classes.remove, "quickfire-remove"]} glyph="remove" onClick={this.handleRemove.bind(this, val)}/>
              </div>
            );
          })}
          <input ref={ref=>this.inputRef=ref} type="text" className={`quickfire-user-input ${classes.userInput}`}
            disabled={readOnly || readAndDeleteOnly || disabled || value.length >= max}
            onDrop={this.handleDrop.bind(this, null)}
            onDragOver={e=>e.preventDefault()}
            onKeyDown={this.handleKeyStrokes}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onPaste={this.handleNativePaste}/>

          <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>

          {useVirtualClipboard?
            <Button className={`quickfire-paste-button ${classes.pasteButton}`} onClick={this.handlePaste}><Glyphicon glyph="paste"/></Button>
            :null}
        </div>
        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}
      </FormGroup>
    );
  }

  renderReadMode(){
    let {
      label,
      value,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-input-text-multiple ${!value.length? "quickfire-empty-field": ""} quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <span className={"quickfire-readmode-list"}>
            {value.map(value => {
              return (
                <span key={value} className={"quickfire-readmode-item"}>
                  {isFunction(this.props.valueLabelRendering)?
                    this.props.valueLabelRendering(this.props.field, value):
                    value}
                </span>
              );
            })}
          </span>
        }
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
      </div>
    );
  }
}
