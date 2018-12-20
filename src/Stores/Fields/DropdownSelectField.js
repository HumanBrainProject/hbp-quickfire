/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observable, action } from "mobx";
import { isString, isNumber, find, union } from "lodash";
import DefaultField from "./DefaultField";
import optionsStore from "../OptionsStore";

/**
 * @memberof FormFields.DropdownSelectField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} labelTooltip "" - The field label tooltip message
 * @param {string} type "DropdownSelect"
 * @param {array} value [] - The current value of the field
 * @param {array} defaultValue [] - The defaultValue of the field
 * @param {array} options  [] - The options of the dropdown, must be an array of objects
 * @param {string} optionsUrl null - url to fetch the select options from
 * @param {string} cacheOptionsUrl false - whether to cache optionsUrl fetching response
 * @param {string} path "" - Field path
 * @param {boolean} allowCustomValues  false - if the field should try to accept user inputed values
 * @param {string | array} mappingValue "value" - The name(s) of the option object field(s) related to the option value, used to match passed in values to actual options
 * @param {string} mappingLabel "label" - the name of the option object field related to the option label
 * @param {string} mappingReturn null - the property of the option object used to return the value(s) - null will return the whole object
 * @param {boolean} returnSingle boolean - wether or not to return the first value or an array of values
 * @param {number} max Infinity - Maximum values that the field can have
 * @param {boolean} emptyToNull false - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {string} listPosition "bottom" - Can be "top" or "bottom", whether to display the dropdown list above or below the field
 * @param {boolean} closeDropdownAfterInteraction false - Whether the dropdown should close after adding, removing a value or stay open
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class DropdownSelectField extends DefaultField{
  @observable value = [];
  @observable defaultValue = [];
  @observable options = [];
  @observable optionsUrl = null;
  @observable cacheOptionsUrl = false;
  @observable allowCustomValues =  false;
  @observable mappingValue = "value";
  @observable mappingLabel = "label";
  @observable mappingReturn = null;
  @observable returnSingle = false;
  @observable max = Infinity;
  @observable listPosition = "bottom";
  @observable closeDropdownAfterInteraction = false;

  __emptyValue = () => [];

  static get properties(){
    return union(super.properties,["value", "defaultValue", "options", "optionsUrl", "cacheOptionsUrl", "allowCustomValues",
      "mappingValue", "mappingLabel", "mappingReturn", "returnSingle", "max", "listPosition", "closeDropdownAfterInteraction"]);
  }

  constructor(fieldData, store, path){
    super(fieldData, store, path);
    //Try to checked if cached options already exist
    if(this.cacheOptionsUrl && this.optionsUrl){
      let options = optionsStore.getOptions(this.optionsUrl);
      if(options !== undefined){
        this.optionsUrl = null;
        this.options = options;
      }
    }
    this.injectValue(this.value);
  }

  @action
  injectValue(value){
    if(value !== undefined){
      this.registerProvidedValue(value, true);
    }
    this.value = this.__emptyValue();

    let providedValue = this.getProvidedValue();

    providedValue.forEach(value => {
      if(!value || this.value.length >= this.max){
        return;
      }
      let match;

      //Below are the tests to find matches in the options array for each provided value
      //If the provided value is scalar then we check against the mappingValue property(ies) of each
      //option (and stop at the first match). Each mappingValue property has to match the scalar value (edge case)
      //If the provided value is an object then we check against the mappingValue property(ies) of each
      //option (and stop at the first match). Each mappingValue property has to match its respective counterpart in the option object
      if(isString(value) || isNumber(value)){
        match = find(this.options, option =>
          isString(this.mappingValue) || isNumber(this.mappingValue)
            ? option[this.mappingValue] === value
            : this.mappingValue.every(prop => option[prop] === value)
        );
      } else if(value != null){
        match = find(this.options, option =>
          isString(this.mappingValue) || isNumber(this.mappingValue)
            ? option[this.mappingValue] === value[this.mappingValue]
            : this.mappingValue.every(prop => option[prop] && value[prop] && option[prop] === value[prop])
        );
      }
      if(match){
        this.addValue(match);
      }
    });
  }

  @action updateOptions(options){
    this.options = options;
    this.injectValue();
  }
}