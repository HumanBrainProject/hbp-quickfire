/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observable, action } from "mobx";
import { union, find, isString, isNumber, uniqueId } from "lodash";
import DefaultField from "./DefaultField";
import optionsStore from "../OptionsStore";

/**
 * @memberof FormFields.SelectField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} labelTooltip "" - The field label tooltip message
 * @param {string} type "Select"
 * @param {string} value "" - The current value of the field
 * @param {string} defaultValue "" - The defaultValue of the field
 * @param {array} options [] - an array of strings or objects with value and label defined by the mapping
 * @param {string} optionsUrl null - url to fetch the select options from
 * @param {string} cacheOptionsUrl false - whether to cache optionsUrl fetching response
 * @param {string} path "" - Field path
 * @param {string | array} mappingValue "value" - The name(s) of the option object field(s) related to the option value, used to match passed in values to actual options
 * @param {string} mappingLabel "label" - the name of the option object field related to the option label
 * @param {string} defaultLabel "null" - The label to be displayed as a default value when set
 * @param {boolean} emptyToNull true - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class SelectField extends DefaultField{
  @observable value = null;
  @observable defaultValue = null;
  @observable options = [];
  @observable optionsUrl = null;
  @observable cacheOptionsUrl = false;
  @observable mappingValue = "value";
  @observable mappingLabel = "label";
  @observable mappingReturn = null;
  @observable defaultLabel = null;
  @observable emptyToNull = true;

  @observable optionsMap;

  __emptyValue = () => null;

  static get properties(){
    return union(super.properties,["value", "defaultValue", "options", "optionsUrl", "cacheOptionsUrl",
      "mappingValue", "mappingLabel", "mappingReturn", "defaultLabel", "emptyToNull"]);
  }

  constructor(fieldData, store, path){
    super(fieldData, store, path);
    if(fieldData.mappingReturn === undefined){
      this.mappingReturn = this.mappingValue;
    }
    //Try to checked if cached options already exist
    if(this.cacheOptionsUrl && this.optionsUrl){
      let options = optionsStore.getOptions(this.optionsUrl);
      if(options !== undefined){
        this.optionsUrl = null;
        this.options = options;
      }
    }
    this.mapOptions();
    this.injectValue(this.value);
  }

  @action
  injectValue(value){
    if(value !== undefined){
      this.registerProvidedValue(value, false);
    }
    this.value = this.__emptyValue();

    let providedValue = this.getProvidedValue();

    //Below are the tests to find matches in the options array for each provided value
    //If the provided value is scalar then we check against the mappingValue property(ies) of each
    //option (and stop at the first match). Each mappingValue property has to match the scalar value (edge case)
    //If the provided value is an object then we check against the mappingValue property(ies) of each
    //option (and stop at the first match). Each mappingValue property has to match its respective counterpart in the option object
    let match;
    if(isString(providedValue) || isNumber(providedValue)){
      match = find(this.options, option => {
        if(isString(option) || isNumber(option)){
          return option === providedValue;
        } else {
          return isString(this.mappingValue) || isNumber(this.mappingValue)
            ? option[this.mappingValue] === providedValue
            : this.mappingValue.every(prop => option[prop] === providedValue);
        }
      });
    } else if(providedValue != null){
      match = find(this.options, option =>
        isString(this.mappingValue) || isNumber(this.mappingValue)
          ? option[this.mappingValue] === providedValue[this.mappingValue]
          : this.mappingValue.every(prop => option[prop] && providedValue[prop] && option[prop] === providedValue[prop])
      );
    }
    if(match){
      this.setValue(match);
    }
    this.valueFallback();
  }

  @action
  valueFallback(){
    if(!this.value && !this.defaultLabel && this.options.length > 0){
      this.value = this.options[0];
    }
  }

  @action updateOptions(options){
    this.options = options;
    this.mapOptions();
    this.injectValue();
  }

  @action
  mapOptions(){
    this.optionsMap = new Map();
    this.options.forEach(option => {
      let optionUniqueId = uniqueId("SelectField_Option_");
      this.optionsMap.set(optionUniqueId, option);
      this.optionsMap.set(option, optionUniqueId);
    });
  }
}