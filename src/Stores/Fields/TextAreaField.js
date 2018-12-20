/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { observable } from "mobx";
import { union } from "lodash";
import DefaultField from "./DefaultField";

/**
 * @memberof FormFields.TextAreaField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} labelTooltip "" - The field label tooltip message
 * @param {string} type "InputText"
 * @param {string} value "" - The current value of the field
 * @param {string} defaultValue  "" - The defaultValue of the field
 * @param {string} path "" - Field path
 * @param {boolean} emptyToNull true - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 * @param {boolean} autosize true - If true, the textarea resizes automatically
 * @param {number} rows 1 - How many rows are displayed by default. Represents the min value
 * @param {number} maxRows null - How many rows are displayed at most before the field does not grow anymore (only possible if autosize is enabled)
 * @param {boolean} resizable false - If true, the textarea is horizontally resizable by the user
 */

export default class TextAreaField extends DefaultField{
  @observable value = "";
  @observable defaultValue = "";
  @observable autosize = true;
  @observable rows = 1;
  @observable maxRows = null;
  @observable resizable = false;

  __emptyValue = () => "";

  static get properties(){
    return union(super.properties,["value", "defaultValue", "autosize", "rows", "maxRows", "resizable"]);
  }
}