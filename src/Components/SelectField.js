import React from "react";
import { inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { FormGroup, ControlLabel, FormControl, Alert } from "react-bootstrap";
import { isString, isNumber, isFunction } from "lodash";

let style = {
  readMode:{
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    }
  }
};

/**
 * A simple select input field
 * @class SelectField
 * @memberof FormFields
 * @namespace SelectField
 */
@injectStyles(style)
@inject("formStore")
@observer
export default class SelectField extends React.Component {

  constructor(props) {
    super(props);
    this.initField();
  }

  async initField() {
    const { field, formStore } = this.props;
    let { optionsUrl, cacheOptionsUrl } = field;
    if (optionsUrl) {
      field.updateOptions(await formStore.resolveURL(optionsUrl, cacheOptionsUrl));
      this.triggerOnLoad();
    }
  }

  triggerOnLoad = () => {
    if(this.inputRef && this.inputRef.parentNode){
      var event = new Event("load", { bubbles: true });
      this.inputRef.dispatchEvent(event);
    }
  }

  handleChange = e => {
    let field = this.props.field;
    if(!field.disabled && !field.readOnly){
      if(!e.target.value){
        this.beforeSetValue(null);
      } else {
        this.beforeSetValue(field.optionsMap.get(e.target.value));
      }
    }
  };

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue(value);}, this.props.field, value);
    } else {
      this.props.field.setValue(value);
    }
  }

  renderOptions(field) {
    let { options, mappingLabel, defaultLabel, optionsMap } = field;

    const renderedOptions = options.map(option => {
      let label;
      if (isString(option) || isNumber(option)) {
        label = option;
      } else {
        label = option[mappingLabel];
        if (label == null) {
          throw `Option mapping not defined correctly for field: ${this.props.name}
          Mapping is defined as mappingLabel: ${mappingLabel}
          option defined as: ${JSON.stringify(option)}`;
        }
      }

      return <option key={optionsMap.get(option)} value={optionsMap.get(option)}>{label}</option>;
    });

    if(defaultLabel){
      renderedOptions.unshift(
        <option key={"SelectField_defaultValueKey"} value={""}>{defaultLabel}</option>
      );
    }

    return(renderedOptions);
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { label, disabled, readOnly, value, optionsMap, validationErrors, validationState } = this.props.field;
    //We need to read that value to update the component on value changes
    //TODO: Maybe find a proper solution for that to be more explicit
    value;

    return (
      <FormGroup className={`quickfire-field-select ${!value? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`} validationState={validationState}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl
          disabled={disabled} readOnly={readOnly}
          onChange={this.handleChange}
          inputRef={ref => this.inputRef = ref}
          value={value === null? "": optionsMap.get(value)}
          componentClass="select">
          {this.renderOptions(this.props.field)}
        </FormControl>
        <FormControl.Feedback />
        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}
      </FormGroup>
    );
  }

  renderReadMode(){
    let {
      label,
      value:valueLabel,
      mappingLabel,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    if(valueLabel && !isString(valueLabel) && !isNumber(valueLabel)){
      valueLabel = valueLabel[mappingLabel];
    }

    return (
      <div className={`quickfire-field-select ${!valueLabel? "quickfire-empty-field": ""} quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <span className={"quickfire-readmode-value"}>{valueLabel}</span>
        }
        <input style={{display:"none"}} type="text" ref={ref=>this.inputRef = ref}/>
      </div>
    );
  }
}
