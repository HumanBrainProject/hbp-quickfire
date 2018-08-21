import { observable, action, isObservableArray } from "mobx";
import { union } from "lodash";
import DefaultField from "./DefaultField";
import { isArray } from "lodash";

/**
* @memberof FormFields.InputTextMultipleField
* @name Options
* @param {string} label "" - The field label
* @param {string} type "InputTextMultiple"
* @param {array} value [] - The current value of the field
* @param {array} defaultValue  [] - The defaultValue of the field
* @param {string} path "" - Field path
* @param {number} max Infinity - Maximum values that the field can have
* @param {boolean} useVirtualClipboard false - Flag if virtual clipboard feature is enabled for this field
* @param {boolean} emptyToNull false - Flag that determines if empty values are transformed to null in the value function of the formStore
* @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
* @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
* @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
*/

export default class InputTextMultipleField extends DefaultField{
  @observable value = [];
  @observable defaultValue = [];
  @observable max = Infinity;
  @observable useVirtualClipboard = false;

  __emptyValue = () => [];

  static get properties(){
    return union(super.properties, ["value", "defaultValue", "useVirtualClipboard", "max"]);
  }

  constructor(fieldData, store, path){
    super(fieldData, store, path);
    this.injectValue(this.value);
  }

  @action
  injectValue(value){
    if((this.emptyToNull && value === null) || !value){
      this.value = this.__emptyValue();
    } else if(!isObservableArray(value) && !isArray(value)){
      this.value = [value];
    } else {
      this.value = value;
    }
  }
}