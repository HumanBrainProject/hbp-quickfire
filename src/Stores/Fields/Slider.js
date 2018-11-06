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
 * @memberof FormFields.Slider
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} type "Slider"
 * @param {number|Range} value null - The current value. If only a number is provided, a single slider will get rendered. If a range object {min:x, max:y} is provided, two sliders will get rendered.
 * @param {number|Range} defaultValue null - The defaultValue of the field
 * @param {string} path "" - Field path
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 * @param {number} min null (required) - minimum value. You cannot drag your slider under this value.
 * @param {number} max null (required) - maximum value. You cannot drag your slider beyond this value.
 * @param {number} step 1 - The default increment/decrement is 1. You can change that by setting a different number to this property.
 * @param {(value: number, type: string): string} formatLabel value => value - By default, value labels are displayed as plain numbers. If you want to change the display, you can do so by passing in a function
 */

export default class Slider extends DefaultField{
  @observable min = null;
  @observable max = null;
  @observable step = 1;
  @observable formatLabel = value => value;

  static get properties(){
    return union(super.properties,["min", "max", "step", "formatLabel"]);
  }
}