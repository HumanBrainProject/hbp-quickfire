/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Confirm from "./Confirm";

describe("CheckBoxField Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <Confirm show={true}/>
    );
    expect(mountPoint.find('.modal').length).toBe(1);
  });

  it("should not show any modal if show is false", () => {
    let mountPoint = mount(
      <Confirm show={false}/>
    );
    expect(mountPoint.find('.modal').length).toBe(0);
  });

  it("should not do anything if confirm and cancel hooks are not defined", () => {
    let mountPoint = mount(
      <Confirm show={true}/>
    );
    expect(mountPoint.find('.modal').length).toBe(1);
    mountPoint.find(".quickfire-confirm-action-confirm").simulate("click");
    mountPoint.find(".quickfire-confirm-action-cancel").simulate("click");
    expect(mountPoint.find('.modal').length).toBe(1);
  });

  it("should offer confirm and cancel hooks", () => {
    let countConfirm = 0;
    let countCancel = 0;
    let mountPoint = mount(
      <Confirm show={true} onConfirm={()=>{countConfirm++;}} onCancel={()=>{countCancel++;}}/>
    );
    mountPoint.find(".quickfire-confirm-action-confirm").simulate("click");
    expect(countConfirm).toBe(1);
    expect(countCancel).toBe(0);
    mountPoint.find(".quickfire-confirm-action-cancel").simulate("click");
    expect(countCancel).toBe(1);
  });
});