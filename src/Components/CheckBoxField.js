/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { FormGroup, ControlLabel, Checkbox, Alert } from "react-bootstrap";
import { isFunction } from "lodash";

const styles = {
  readMode:{
    "& .quickfire-label:after":{
      content:"':\\00a0'"
    }
  }
};

/**
 * A simple checkbox
 * @class CheckBoxField
 * @memberof FormFields
 * @namespace CheckBoxField
 */
@injectStyles(styles)
@inject("formStore")
@observer
export default class CheckBoxField extends React.Component {

  handleChange = () => {
    let field = this.props.field;
    if(!field.disabled && !field.readOnly){
      this.beforeSetValue(!field.value);
    }
  };

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue(value);}, this.props.field, value);
    } else {
      this.props.field.setValue(value);
    }
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { label, value, disabled, readOnly, validationErrors, validationState } = this.props.field;
    return (
      <FormGroup
        className={`quickfire-field-checkbox  ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}
        validationState={validationState}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        <Checkbox disabled={disabled} readOnly={readOnly} onChange={this.handleChange} checked={value}/>
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
      readOnly,
      disabled
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-checkbox quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <span>&nbsp;<input className={"quickfire-readmode-checkbox"} type="checkbox" readOnly={true} checked={value}/></span>
        }
      </div>
    );
  }
}
