/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { action, observable, toJS, isObservableArray } from "mobx";
import { merge, isArray, remove, isObject } from "lodash";
import Validator from "validatorjs";

export default class DefaultField{
  @observable type = "Default";
  @observable label = null;
  @observable labelTooltip = null;
  @observable value = null;
  @observable placeholder = null;
  @observable defaultValue = null;
  @observable path = "";
  @observable emptyToNull = false;
  @observable disabled = false;
  @observable readOnly = false;
  @observable readAndDeleteOnly = false;
  @observable readMode = false;
  @observable validationState = null;
  @observable validationErrors = null;
  @observable validationRules = null;
  @observable customErrorMessages = {};
  @observable validationOptions = {
    onBlur: true,
    onChange: false
  };
  @observable customValidationFunctions = null;


  //This function is used to know what is the actual empty value of a field
  //Note that it's a function so we get a new object and not the same reference again and again
  //Also it's different from the defaultValue as the defaultValue can be changed by the application
  __emptyValue = () => null;

  //Properties are used to know what's part of a field definition
  static get properties(){
    return ["type", "label", "labelTooltip", "value", "defaultValue", "emptyToNull", "disabled", "readOnly", "readAndDeleteOnly", "readMode", "validationRules", "customErrorMessages", "validationOptions", "customValidationFunctions", "placeholder"];
  }

  constructor(fieldData, store, path){
    merge(this, fieldData);
    //We just store a function that gives back the store owning the field
    //That way we don't create circular references between store and fields
    this._store = () => store;
    if(fieldData.value === undefined){
      this.value = toJS(this.defaultValue);
    }
    this.path = path;
    const {customValidationFunctions: custFuncs} = this;
    if (custFuncs) {
      Object.keys(custFuncs).forEach(key => store.registerCustomValidationFunction(key, custFuncs[key].func, custFuncs[key].message));
    }
  }

  get store(){
    return this._store();
  }

  @action
  injectValue(value){
    if(this.emptyToNull && value === null){
      this.value = this.__emptyValue();
    } else {
      this.value = value;
    }
  }

  getValue(applyMapping = true){
    return applyMapping? this.mapReturnValue(toJS(this.value)): toJS(this.value);
  }

  @action
  reset(){
    this.injectValue(this.defaultValue);
    this.validationState = null;
    this.validationErrors = null;
  }

  setPath(path){
    this.path = path;
  }

  registerProvidedValue(value, forceArray = false){
    let providedValue = toJS(value);
    if(forceArray && !isArray(providedValue)){
      providedValue = [providedValue];
    }
    this.store.setFieldInternalData(this, "provided_value", providedValue);
  }

  getProvidedValue(){
    return this.store.getFieldInternalData(this, "provided_value");
  }

  @action
  setValue(value) {
    this.value = value;
  }

  @action
  addValue(value, index) {
    if(value && this.value.length !== undefined && this.value.indexOf(value) === -1){
      if(index !== undefined && index !== -1){
        this.value.splice(index, 0, value);
      } else {
        this.value.push(value);
      }
    }
  }

  @action
  removeValue(value) {
    if(this.value.length !== undefined){
      remove(this.value, val=>val === value);
    }
  }

  mapReturnValue(value){
    if(this.mappingReturn){
      if(isArray(value)){
        value = value.map( obj => obj[this.mappingReturn]);
      } else if(isObject(value)){
        value = value[this.mappingReturn];
      }
    }
    if(this.returnSingle && isArray(value)){
      value = value.length > 0? value[0]: null;
    }
    if (this.emptyToNull && (value === "" || (value != null && value.length === 0))) {
      value = null;
    }
    return value;
  }

  shouldValidateOnEvent(eventType) {
    return this.validationOptions[eventType] ? true : false;
  }

  @action
  async validate() {
    let { validationRules } = this;
    if (!validationRules) { return true; }
    if (isObservableArray(validationRules)) {
      validationRules = toJS(validationRules); // validation framework can't handle ObservableArrays => transform to regular array
    }
    let resolveFunc;
    let validationPromise = new Promise(resolve => {resolveFunc = resolve;});
    let validation = new Validator({[this.label]: this.getValue()}, {[this.label]: validationRules}, this.customErrorMessages);
    validation.passes(() => {
      this.validationState = "success";
      this.validationErrors = null;
      resolveFunc(true);
    });

    validation.fails(() => {
      this.validationState = "error";
      this.validationErrors = validation.errors.get(this.label);
      resolveFunc(false);
    });

    return validationPromise;
  }

  @action
  invalidate(errorMessage) {
    this.validationState = "error";
    this.validationErrors = [errorMessage];
  }

}