/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { isFunction } from "lodash";
import injectStyle from "react-jss";

let styles = {
  confirmModal:{
    zIndex:"10050",
    top:"50%",
    transform:"translateY(-25%)"
  },
  confirmBackdrop:{
    zIndex:"10040"
  }
};

@injectStyle(styles)
export default class Alert extends React.Component{
  render(){
    const {classes} = this.props;

    return(
      <Modal className={`${classes.confirmModal} quickfire-alert`} backdropClassName={classes.confirmBackdrop} show={this.props.show}>
        <Modal.Body>
          <div className={"quickfire-alert-message"}>
            {this.props.message || ""}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsClass={"quickfire-alert-action-dismiss btn btn-success"} onClick={this.dismiss}>{this.props.dismissLabel || "OK"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  dismiss = () => {
    if(isFunction(this.props.onDismiss)){
      this.props.onDismiss();
    }
  }
}