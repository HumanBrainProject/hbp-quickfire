/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import injectStyles from "react-jss";
import { FormGroup, Alert } from "react-bootstrap";
import { isFunction, uniqueId } from "lodash";

import FieldLabel from "./FieldLabel";

const styles = {
  readMode:{
    "& .quickfire-label:after":{
      content:"':\\00a0'"
    }
  },
  formGroup: {
    "&.inline": {
      display: "flex",
      alignItems: "center",
      "& .quickfire-label": {
        marginBottom: "0px"
      }
    }
  },
  react_switch_checkbox: {
    height: 0,
    width: 0,
    visibility: "hidden",
    "&:checked + label span": {
      left: "calc(100% - 2px)",
      transform: "translateX(-100%)"
    }
  },
  react_switch_label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    position: "relative",
    transition: "background-color .2s",
    marginBottom: "0px",
    "&.disabled": {
      cursor: "not-allowed"
    },
    "&.readonly": {
      cursor: "default"
    },
    "&.inline": {
      marginLeft: "10px"
    },
    "&.large": {
      width: "70px",
      height: "34px",
      borderRadius: "70px",
    },
    "&.medium": {
      width: "50px",
      height: "24px",
      borderRadius: "50px",
    },
    "&.small": {
      width: "30px",
      height: "15px",
      borderRadius: "30px",
    }
  },
  react_switch_button: {
    content: "",
    position: "absolute",
    top: "2px",
    left: "3px",
    borderRadius: "100%",
    background: "#fff",
    transition: "0.2s",
    boxShadow: "0 0 2px 0 rgba(10, 10, 10, 0.29)",
    "&.large": {
      width: "30px",
      height: "30px",
    },
    "&.medium": {
      width: "20px",
      height: "20px",
    },
    "&.small": {
      width: "11px",
      height: "11px",
      left: "2px",
    }
  },
  switch_label_txt: {
    marginRight: "7px",
    cursor: "pointer"
  }
};

/**
 * A simple toggle
 * @class ToggleField
 * @memberof FormFields
 * @namespace ToggleField
 */
@injectStyles(styles)
@inject("formStore")
@observer
export default class ToggleField extends React.Component {
  constructor(props){
    super(props);
    this.state = {htmlId: null};
  }

  componentDidMount() {
    // generate random id
    this.setState({htmlId: uniqueId('toggle-')});
  }

  handleChange = () => {
    let field = this.props.field;
    if(!field.disabled && !field.readOnly && !(this.props.formStore.readMode || this.props.field.readMode)){
      this.beforeSetValue(!field.value);
    }
  };

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue(value);}, this.props.field, value);
    } else {
      this.props.field.setValue(value);
    }
  }

  render() {
    let { classes } = this.props;
    let { value, disabled, readOnly, onColor="#06D6A0", offColor="#808080", size="medium", inline=false, validationErrors, validationState } = this.props.field;

    // force readOnly mode for readMode
    if(this.props.formStore.readMode || this.props.field.readMode){
      readOnly = true;
    }

    const bgColor = value ? onColor : offColor;

    return (
      <FormGroup
        className={`${classes.formGroup} ${disabled ? "quickfire-field-disabled" : ""} ${readOnly ? "quickfire-field-readonly" : ""} ${inline ? "inline" : ""}`}
        validationState={validationState}>
        <FieldLabel field={this.props.field}/>
        <input
          disabled={disabled}
          readOnly={readOnly}
          onChange={this.handleChange}
          checked={value}
          className={classes.react_switch_checkbox}
          id={this.state.htmlId}
          type="checkbox"
        />
        <label
          style={{ background: bgColor }}
          className={`${classes.react_switch_label} ${size} ${disabled?"disabled":""} ${readOnly?"readonly":""} ${inline?"inline":""}`}
          htmlFor={this.state.htmlId}
        >
          <span className={`${classes.react_switch_button} ${size}`} />
        </label>
        {validationErrors &&
          <Alert bsStyle="danger">
            {validationErrors.map(error => <p key={error}>{error}</p>)}
          </Alert>
        }
      </FormGroup>
    );
  }
}
