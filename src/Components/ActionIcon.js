/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { Glyphicon } from "react-bootstrap";

/**
 * ActionIcon component
 * @class ActionIcon
 * @property {string} icon required - glyphicon to display {@link https://getbootstrap.com/docs/3.3/components/#glyphicons}
 * @property {function} onClick optional - callback for when action is clicked
 */

export default class ActionIcon extends React.Component {
  static defaultProps = {
    icon: "warning-sign",
  };

  render() {
    let { icon, ...rest } = this.props;
    return (
      <Glyphicon {...rest} glyph={icon} />
    );
  }
}
