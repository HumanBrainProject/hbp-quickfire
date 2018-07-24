import React from "react";
import { inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { FormGroup, ControlLabel, Checkbox, Radio, Alert } from "react-bootstrap";
import { find, isFunction } from "lodash";

const styles = {
  readMode: {
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    },
    "& .quickfire-readmode-item:not(:last-child):after":{
      content: "',\\00a0'"
    }
  }
};

/**
 * Form component allowing to select on/multiple values from a group of checkboxes/radioboxes
 * @class GroupSelectField
 * @memberof FormFields
 * @namespace GroupSelectField
 */
@injectStyles(styles)
@inject("formStore")
@observer
export default class GroupSelectField extends React.Component {
  constructor(props){
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
    var event = new Event("load", { bubbles: true });
    this.hiddenInputRef.dispatchEvent(event);
  }

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

  handleChange(option, e){
    let field = this.props.field;
    e.stopPropagation();
    if(field.disabled || field.readOnly){
      return;
    }
    //Case of radio group
    if(field.max === 1){
      this.beforeSetValue(option);
    } else if(find(field.value, option)){
      this.beforeRemoveValue(option);
    } else {
      this.beforeAddValue(option);
    }
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

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue([value]);}, this.props.field, value);
    } else {
      this.props.field.setValue([value]);
    }
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { label, options, value: values, max, mappingLabel, disabled, readOnly, validationErrors, validationState } = this.props.field;

    const FieldComponent = max === 1? Radio: Checkbox;

    return (
      <FormGroup className={`quickfire-field-group-select ${!values.length? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`} validationState={validationState}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
        <div>
          { options.map(option => {
            let isChecked = !!find(values, option);
            return(
              <FieldComponent
                checked={isChecked}
                disabled={disabled || (max > 1 && !isChecked && values.length >= max)}
                readOnly={readOnly}
                name={max === 1? this.props.field.path: undefined}
                key={this.props.formStore.getGeneratedKey(option, "quickfire-groupselect-option")}
                onChange={this.handleChange.bind(this, option)}
                inline={this.props.field.displayInline}>
                {option[mappingLabel]}
              </FieldComponent>
            );
          }) }
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
      mappingLabel,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-group-select ${!value.length? "quickfire-empty-field": ""} quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <span className={"quickfire-readmode-list"}>
            {value.map(value => {
              return (
                <span key={this.props.formStore.getGeneratedKey(value, "dropdown-read-item")} className={"quickfire-readmode-item"}>
                  {value[mappingLabel]}
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
