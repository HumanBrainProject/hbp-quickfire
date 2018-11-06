/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import SingleField from "./SingleField";

let fakeOptions = [{ "value": "fr", "label": "France" }, { "value": "de", "label": "Germany" }, { "value": "uk", "label": "UK" }];

let mock = new MockAdapter(axios);
 
mock.onGet("/getfakeoptions").reply(200, fakeOptions);

// describe what we are testing
describe("DropdownSelect Component", () => {
  // make our assertion and what we expect to happen 
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr"]}/>
    );
    expect(mountPoint.find('.quickfire-user-input').length).toBe(1);
  });

  it("should render in readMode without throwing an error", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        readMode={true}
        value={["fr"]}/>
    );
    expect(mountPoint.find('.quickfire-readmode').length).toBe(1);
  });
  
  it("should be able to take url as options", async () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"  
        optionsUrl={"/getfakeoptions"}/>
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.options.length).toBe(3);
  });

  it("should be able to provide a way for users to enter custom values", () => {
    let customValue = "";
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        allowCustomValues={true}
        onAddCustomValue={value => customValue = value}
        />
    );
    mountPoint.find('.quickfire-user-input').simulate("keyDown",{target:{value:"test"}, keyCode:13});
    expect(customValue).toBe("test");
  });

  it("should be able to handle drag&drop", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr","de"]}
        />
    );
    expect(mountPoint.instance().field.value[0].value).toBe("fr");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragEnd");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragStart");
    mountPoint.find('.quickfire-value-tag').at(0).simulate("drop");
    expect(mountPoint.instance().field.value[0].value).toBe("de");
  });

  it("shouldn't modify value of a disabled field", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr","de"]}
        disabled={true}
        />
    );
    expect(mountPoint.instance().field.value.length).toBe(2);
    mountPoint.find('.quickfire-user-input').simulate("keyDown",{target:{value:""}, keyCode:8});
    expect(mountPoint.instance().field.value.length).toBe(2);
  });

  it("should remove values when pressing backspace but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr","de"]}
        />
    );
    expect(mountPoint.instance().field.value.length).toBe(2);

    mountPoint.find('.quickfire-user-input').simulate("keyDown",{target:{value:""}, keyCode:0});
    expect(mountPoint.instance().field.value.length).toBe(2);

    mountPoint.find('.quickfire-user-input').simulate("keyDown",{target:{value:""}, keyCode:8});
    expect(mountPoint.instance().field.value.length).toBe(1);
    mountPoint.instance().field.disabled = true;

    mountPoint.find('.quickfire-value-tag').at(0).simulate("keyDown",{keyCode:8});
    expect(mountPoint.instance().field.value.length).toBe(1);
    mountPoint.instance().field.disabled = false;

    mountPoint.find('.quickfire-value-tag').at(0).simulate("keyDown",{keyCode:9});
    expect(mountPoint.instance().field.value.length).toBe(1);

    mountPoint.find('.quickfire-value-tag').at(0).simulate("keyDown",{keyCode:8});
    expect(mountPoint.instance().field.value.length).toBe(0);
  });

  it("should offer arrow keys navigation in the options", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr","de"]}
        />
    );
    mountPoint.find('.quickfire-user-input').simulate("click");
    mountPoint.find('.quickfire-user-input').simulate("keyDown", {keyCode:40});
    expect(mountPoint.find(".option").at(0).getDOMNode()).toBe(document.activeElement);
    mountPoint.find('.quickfire-user-input').simulate("keyDown", {keyCode:38});
    expect(mountPoint.find(".option").at(mountPoint.find(".option").length-1).getDOMNode()).toBe(document.activeElement);
  });

  it("should remove values when clicking the remove icon on a value-tag but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        value={["fr","de"]}
        />
    );
    expect(mountPoint.instance().field.value.length).toBe(2);
    expect(mountPoint.instance().field.value[0].value).toBe("fr");
    mountPoint.find('.quickfire-value-tag .quickfire-remove').at(0).simulate("click");
    expect(mountPoint.instance().field.value.length).toBe(1);
    expect(mountPoint.instance().field.value[0].value).toBe("de");
    mountPoint.instance().field.disabled = true;
    mountPoint.find('.quickfire-value-tag .quickfire-remove').at(0).simulate("click");
    expect(mountPoint.instance().field.value.length).toBe(1);
    expect(mountPoint.instance().field.value[0].value).toBe("de");
  });

  it("should provide a search through the options but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="DropdownSelect"
        label="label"
        options={fakeOptions}
        disabled={true}
        />
    );

    mountPoint.find('.quickfire-user-input').at(0).simulate("click");
    mountPoint.find('.quickfire-user-input').at(0).simulate("change", {target:{value:"France"}});
    expect(mountPoint.find(".option").length).toBe(0);
    mountPoint.instance().field.disabled = false;
    mountPoint.find('.quickfire-user-input').at(0).simulate("click");
    expect(mountPoint.find(".option").length).toBe(3);
    mountPoint.find('.quickfire-user-input').at(0).simulate("change", {target:{value:"France"}});
    expect(mountPoint.find(".option").length).toBe(1);
    mountPoint.find(".option").at(0).simulate("click");
    expect(mountPoint.instance().value[0].value).toBe("fr");
  });
 });