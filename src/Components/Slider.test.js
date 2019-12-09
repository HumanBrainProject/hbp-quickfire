/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import SingleField from "./SingleField";

describe("Slider Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="Test" min={0} max={10} type="Slider"/>
    );
    expect(mountPoint.find(".input-range").length).toBe(1);
  });

  it("should render when value is a range", () => {
    let mountPoint = mount(
      <SingleField label="Test" min={0} max={10} defaultValue={{min:1, max:8}} type="Slider"/>
    );
    expect(mountPoint.find(".input-range").length).toBe(1);
  });

  it("should render in read mode", () => {
    let mountPoint = mount(
      <SingleField label="Test" min={0} max={10} readMode={true} type="Slider"/>
    );
    expect(mountPoint.find(".quickfire-field-slider.quickfire-readmode").length).toBe(1);
  });

  it("should change value when interacting but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField label="Test" min={0} max={10} type="Slider"/>
    );
    mountPoint.find("InputRange").prop("onChange")(5);
    expect(mountPoint.instance().field.value).toBe(5);

    mountPoint = mount(
      <SingleField label="Test" min={0} max={10} step={0.1} defaultValue={{min:0, max:10}} type="Slider"/>
    );

    mountPoint.instance().field.disabled = true;
    mountPoint.find("InputRange").prop("onChange")({min:2.2, max:8});
    expect(mountPoint.instance().field.value.min).toBe(0);
    expect(mountPoint.instance().field.value.max).toBe(10);
    mountPoint.instance().field.disabled = false;
    mountPoint.find("InputRange").prop("onChange")({min:2.2, max:8});
    expect(mountPoint.instance().field.value.min).toBe(2.2);
    expect(mountPoint.instance().field.value.max).toBe(8);
  });
});