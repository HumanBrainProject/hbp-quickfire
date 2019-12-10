/*
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
describe("GroupSelect Component", () => {
  // make our assertion and what we expect to happen 
  it("should render without throwing an error", () => {
    expect(mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}/>
    ).find('input[type="checkbox"]').length).toBe(3)
  });

  it("should render in read mode without throwing an error", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        readMode={true}
        max={2}/>
    );
    expect(mountPoint.find('.quickfire-field-group-select.quickfire-readmode').length).toBe(1);
    mountPoint.instance().field.injectValue(["fr",{ "value": "de", "label": "Germany" }, "uk"]);
    expect(mountPoint.find('.quickfire-readmode-list').getDOMNode().textContent).toBe("FranceGermany");
  });

  it("should handle a maximum number of values", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        max={2}/>
    );
    mountPoint.instance().field.injectValue(["fr",{ "value": "de", "label": "Germany" }, "uk"]);
    expect(mountPoint.instance().field.value.length).toBe(2);
  });

  it("should support matching injected values on multiple option properties", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        mappingValue={["value","label"]}
        />
    );
    mountPoint.instance().field.injectValue(["fr",{ "value": "de", "label": "Germany" }, { "value": "uk", "label": "France" }, null]);
    expect(mountPoint.instance().field.value.length).toBe(1);
  });

  it("should generate radio boxes if max prop equals 1", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        options={fakeOptions}
        max={1}
        returnSingle={true}
        mappingReturn="value"/>
    );
    expect(mountPoint.find('input[type="radio"]').length).toBe(3);
    mountPoint.find('input[type="radio"]').first().simulate('change', { target: { checked: true } });
    mountPoint.find('input[type="radio"]').at(1).simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value).toBe("de");
  });

  it("should contain checked values but shouldn't change if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        options={fakeOptions}
        mappingReturn="value"/>
    );
    mountPoint.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true } });
    mountPoint.find('input[type="checkbox"]').at(1).simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value.length).toBe(2);
    expect(mountPoint.instance().value[0]).toBe("fr");
    mountPoint.find('input[type="checkbox"]').first().simulate('change', { target: { checked: false } });
    expect(mountPoint.instance().value[0]).toBe("de");
    mountPoint.instance().field.disabled = true;
    mountPoint.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value[0]).toBe("de");
  });

  it("should be able to take url as options", async () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        optionsUrl={"/getfakeoptions"}/>
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.options.length).toBe(3);
  });

  it("should offer a hook before adding a value", () => {
    let addCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        onBeforeAddValue={proceed => {addCount === 0 && proceed(); addCount++;}}
        />
    );
    mountPoint.find('input[type="checkbox"]').first().simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('input[type="checkbox"]').at(1).simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should offer a hook before removing a value", () => {
    let removeCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        onBeforeRemoveValue={proceed => {removeCount === 0 && proceed(); removeCount++;}}
        value={["fr", "de"]}
        />
    );
    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.find('input[type="checkbox"]').first().simulate('change', { target: { checked: false } });
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('input[type="checkbox"]').at(1).simulate('change', { target: { checked: false } });
    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should offer a hook before setting a value", () => {
    let setCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        label="label"
        options={fakeOptions}
        onBeforeSetValue={proceed => {setCount === 0 && proceed(); setCount++;}}
        max={1}
        />
    );
    expect(mountPoint.instance().value.length).toBe(0);
    mountPoint.find('input[type="radio"]').first().simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value[0].value).toBe("fr");
    mountPoint.find('input[type="radio"]').at(1).simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value[0].value).toBe("fr");
  });

  it("should return only value when mappingReturn is string", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        options={fakeOptions}
        max={1}
        returnSingle={true}
        mappingReturn="value"/>
    );
    mountPoint.find('input[type="radio"]').first().simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value).toBe("fr");
  });

  it("should return object when mappingReturn is an array of keys", () => {
    let mountPoint = mount(
      <SingleField 
        type="GroupSelect"  
        options={fakeOptions}
        max={1}
        returnSingle={true}
        mappingReturn={["value"]}/>
    );
    mountPoint.find('input[type="radio"]').first().simulate('change', { target: { checked: true } });
    expect(mountPoint.instance().value).toEqual({value: "fr"});
  });

 });