/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { Alert } from "react-bootstrap";
import InputRange from "react-input-range";
import injectStyles from "react-jss";
import { isObject, isFunction } from "lodash";
import { getPrecision, lowerPrecision } from "../Helpers";

import FieldLabel from "./FieldLabel";

const sliderColor = "#007bff";
const backgroundColor = "#a9a9a9";

const styles = {
  "@global": {
    ".quickfire-field-slider": `
      margin-bottom: 15px;
    `,
    ".input-range__slider": `
      appearance: none;
      background: ${sliderColor};
      border: 1px solid ${sliderColor};
      border-radius: 100%;
      cursor: pointer;
      display: block;
      height: 1.5rem;
      width: 1.5rem;
      margin-left: -0.5rem;
      margin-top: -0.9rem;
      outline: none;
      position: absolute;
      top: 50%;
      transition: transform 0.3s ease-out, box-shadow 0.3s ease-out; `,

    ".input-range__slider:active": `
      transform: scale(1.3); `,

    ".input-range__slider:focus" : `
      box-shadow: 0 0 0 5px rgba(63, 81, 181, 0.2); `,

    "input-range--disabled .input-range__slider": `
      background: #cccccc;
      border: 1px solid #cccccc;
      box-shadow: none;
      transform: none; `,

    ".input-range__slider-container": `
      transition: left 0.3s ease-out; `,

    ".input-range__label": `
      transform: translateZ(0);
      white-space: nowrap;`,

    ".input-range__label--min,.input-range__label--max": `
      bottom: -1.4rem;
      position: absolute; `,

    ".input-range__label--min" : `
      left: 0; `,

    ".input-range__label--max": `
      right: 0; `,

    ".input-range__label--value": `
      position: absolute;
      top: -3rem;
      left: +0.3rem `,

    ".input-range__label-container": `
      left: -50%;
      position: relative;`,

    ".input-range__label--max .input-range__label-container": `
        left: 0; `,

    ".input-range__label--min .input-range__label-container": `
        left: 0; `,

    ".input-range__track": `
      background: ${backgroundColor};
      border-radius: 0.3rem;
      cursor: pointer;
      display: block;
      height: 0.3rem;
      position: relative;
      transition: left 0.3s ease-out, width 0.3s ease-out; `,

    ".input-range--disabled .input-range__track": `
        background: ${backgroundColor}; `,

    ".input-range__track--background" : `
      left: 0;
      margin-top: -0.15rem;
      position: absolute;
      right: 0;
      top: 50%; `,

    ".input-range__track--active" : `
      background: ${sliderColor}; `,

    ".input-range": `
      height: 4rem;
      position: relative;
      margin: 0;
      width: 100%; `
  },
  slider: {
    "padding": "10px 0 10px 0"
  },
  readMode:{
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    },
    "& .quickfire-readmode-value-min:after":{
      content: "',\\00a0'"
    }
  }
};

/**
 * Slider input field
 * @class Slider
 * @memberof FormFields
 */

@inject("formStore")
@injectStyles(styles)
@observer
export default class Slider extends React.Component {

  formatValue(value) {
    // to handle floating point values
    // the issue is with floating point precision
    // for instance adding a 0.1 step to 0.2 produces 0.30000000000000004
    // this method formats the the value to the precision defined by the step value
    const precision = getPrecision(this.props.field.step);
    if (isObject(value)) {
      value.min = lowerPrecision(value.min, precision);
      value.max = lowerPrecision(value.max, precision);
    } else {
      value = lowerPrecision(value, precision);
    }
    return value;
  }

  handleChange = value => {
    let field = this.props.field;
    if(!field.disabled && !field.readOnly){
      value = this.formatValue(value);
      this.beforeSetValue(value);
      this.dispatchChangeEvent(value);
    }
  };

  dispatchChangeEvent(value) {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
      .call(this.hiddenInputRef, JSON.stringify(value));
    var event = new Event("change", { bubbles: true });
    this.hiddenInputRef.dispatchEvent(event);
  }

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue(value);}, this.props.field, value);
    } else {
      this.props.field.setValue(value);
    }
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { value, min, max, formatLabel, step, disabled, readOnly, validationErrors } = this.props.field;
    let { classes } = this.props;
    if (value == null) {
      value = toJS(min);
    }
    return (
      <div className={`quickfire-field-slider ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        <FieldLabel field={this.props.field}/>
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
        <div className={`quickfire-slider ${classes.slider}`}>
          <InputRange
            minValue={min}
            maxValue={max}
            value={value}
            onChange={this.handleChange}
            formatLabel={formatLabel}
            step={step}
            disabled={disabled || readOnly}/>
        </div>
        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}
      </div>
    );
  }

  renderReadMode(){
    let {
      value,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-slider quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        <FieldLabel field={this.props.field}/>
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          isObject(value)?
            <span className={"quickfire-readmode-value"}>
              <span className={"quickfire-readmode-value-min"}>min: {value.min}</span>
              <span className={"quickfire-readmode-value-max"}>max: {value.max}</span>
            </span>
            :
            <span className={"quickfire-readmode-value"}>
              {value}
            </span>
        }
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
      </div>
    );
  }
}
