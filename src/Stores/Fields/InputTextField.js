import { observable } from "mobx";
import { union } from "lodash";
import DefaultField from "./DefaultField";

/**
 * @memberof FormFields.InputTextField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} type "InputText"
 * @param {string} value "" - The current value of the field
 * @param {string} defaultValue  "" - The defaultValue of the field
 * @param {string} inputType "text" - The input type of the field (e.g. text, password, email)
 * @param {boolean} autoComplete false - Sets the autocomplete attribute of the input element
 * @param {string} placeholder "" - A placeholder that is displayed when the field is empty
 * @param {string} path "" - Field path
 * @param {boolean} useVirtualClipboard false - Flag if virtual clipboard feature is enabled for this field
 * @param {boolean} emptyToNull true - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 * @param {array} validationRules [] - A list of validation rules
 * @param {object} customErrorMessages {} - Definition for custom error messages in the form: {rule: errorMessage}
 * @param {object} validationOptions {onBlur: true, onChange: false} - Validation options to define when validation is executed
 */

export default class InputTextField extends DefaultField{
  @observable value = "";
  @observable defaultValue = "";
  @observable inputType = "text";
  @observable autoComplete = false;
  @observable useVirtualClipboard = false;
  @observable emptyToNull = true;

  __emptyValue = () => "";

  static get properties(){
    return union(super.properties,["value", "defaultValue", "inputType", "useVirtualClipboard", "emptyToNull", "autoComplete"]);
  }

  getValue(applyMapping){
    let value = this.value;
    if (this.inputType === "number") {
      if (value !== "") {
        value = parseFloat(value);
      } else {
        value = null;
      }
    }
    return applyMapping? this.mapReturnValue(value): value;
  }

}