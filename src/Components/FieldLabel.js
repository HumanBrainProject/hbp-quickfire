/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import { ControlLabel, OverlayTrigger, Tooltip, Glyphicon } from "react-bootstrap";

@inject("formStore")
@observer
/**
 * Label for all fields
 * @class FieldLabel
 * @memberof FormFields
 */
export default class FieldLabel extends React.Component {
  render() {
    let {
      label,
      labelTooltip
    } = this.props.field;

    if(!label){
      return null;
    } else if(labelTooltip){
      return (
        <ControlLabel className={"quickfire-label"}>
          {label}&nbsp;
          <OverlayTrigger placement="top" overlay={<Tooltip id={this.props.formStore.getGeneratedKey(this.props.field, "label-tooltip")}>{labelTooltip}</Tooltip>}>
            <Glyphicon glyph={"question-sign"}/>
          </OverlayTrigger>
        </ControlLabel>
      );
    } else {
      return (
        <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>
      );
    }

  }
}