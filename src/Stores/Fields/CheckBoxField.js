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
 * @memberof FormFields.CheckBoxField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} labelTooltip "" - The field label tooltip message
 * @param {string} type "CheckBox"
 * @param {string} value false - The current value of the field
 * @param {string} defaultValue false - The defaultValue of the field
 * @param {string} path "" - Field path
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class CheckBoxField extends DefaultField{
  @observable value = false;
  @observable defaultValue = false;

  __emptyValue = () => false;

  static get properties(){
    return union(super.properties,["value", "defaultValue"]);
  }
}