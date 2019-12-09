/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Alert from "./Alert";

describe("CheckBoxField Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <Alert show={true}/>
    );
    expect(mountPoint.find('.modal').length).toBe(1);
  });

  it("should not show any modal if show is false", () => {
    let mountPoint = mount(
      <Alert show={false}/>
    );
    expect(mountPoint.find('.modal').length).toBe(0);
  });

  it("should not do anything if dismiss action is not defined", () => {
    let mountPoint = mount(
      <Alert show={true}/>
    );
    expect(mountPoint.find('.modal').length).toBe(1);
    mountPoint.find(".quickfire-alert-action-dismiss").simulate("click");
    expect(mountPoint.find('.modal').length).toBe(1);
  });

  it("should offer dismiss action", () => {
    let countDismiss = 0;
    let mountPoint = mount(
      <Alert show={true} onDismiss={()=>{countDismiss++;}}/>
    );
    mountPoint.find(".quickfire-alert-action-dismiss").simulate("click");
    expect(countDismiss).toBe(1);
  });
});