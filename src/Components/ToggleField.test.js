/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import SingleField from "./SingleField";

describe("ToggleField Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle"/>
    );
    expect(mountPoint.find('input[type="checkbox"]').length).toBe(1);
  });

  it("should render readMode without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle" readMode={true}/>
    );
    expect(mountPoint.find('input[type="checkbox"]').length).toBe(1);
  });

  it("should not change value if disabled", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle" value={true} disabled={true}/>
    );
    expect(mountPoint.instance().value).toBe(true);
    mountPoint.find('input[type="checkbox"]').simulate("change", {target:{checked:false}});
    expect(mountPoint.instance().value).toBe(true);
  });

  it("should be able to invert value bound to the checkbox", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle" value={true}/>
    );
    expect(mountPoint.find("input[type='checkbox']").at(0).getDOMNode().checked).toBe(true);
    mountPoint.find('input[type="checkbox"]').simulate("change", {target:{checked:false}});
    expect(mountPoint.instance().value).toBe(false);
    expect(mountPoint.find("input[type='checkbox']").at(0).getDOMNode().checked).toBe(false);
  });

  it("should offer a way to run a hook before the value changes", () => {
    let changeCount = 0;
    const passChangeOnlyOnce = (process) => {
      if(changeCount == 0){process()}; 
      changeCount++;
    };
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle" value={true} onBeforeSetValue={passChangeOnlyOnce}/>
    );
    expect(mountPoint.instance().value).toBe(true);
    mountPoint.find('input[type="checkbox"]').simulate("change", {target:{checked:false}});
    expect(mountPoint.instance().value).toBe(false);
    mountPoint.find('input[type="checkbox"]').simulate("change", {target:{checked:true}});
    expect(mountPoint.instance().value).toBe(false);
  });

  it("should have false as default empty value", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Toggle" value={true} emptyToNull={true}/>
    );
    mountPoint.instance().field.injectValue(null);
    expect(mountPoint.instance().value).toBe(false);
  });
});