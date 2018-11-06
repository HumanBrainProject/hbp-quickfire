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
export default class Confirm extends React.Component{
  render(){
    const {classes} = this.props;

    return(
      <Modal className={`${classes.confirmModal} quickfire-confirm`} backdropClassName={classes.confirmBackdrop} show={this.props.show}>
        <Modal.Body>
          <div className={"quickfire-confirm-message"}>
            {this.props.message || "Do you confirm this action ?"}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsClass={"quickfire-confirm-action-confirm btn btn-success"} onClick={this.confirm}>{this.props.confirmLabel || "Confirm"}</Button>
          <Button bsClass={"quickfire-confirm-action-cancel btn btn-default"} onClick={this.cancel}>{this.props.cancelLabel || "Cancel"}</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  cancel = () => {
    if(isFunction(this.props.onCancel)){
      this.props.onCancel();
    }
  }

  confirm = () => {
    if(isFunction(this.props.onConfirm)){
      this.props.onConfirm();
    }
  }
}