/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import SingleField from "./SingleField";

describe("InputTextField Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="InputText"/>
    );
    expect(mountPoint.find('input[type="text"]').length).toBe(1);
  });

  it("should support virtual clipboard and native clipboard pasting", () => {
    let mountPoint = mount(
      <SingleField type="InputText" useVirtualClipboard={ true }/>
    );
    document.getSelection = function(){ return {value:"abc", toString: function(){return this.value;}} }
    document.dispatchEvent(new Event("selectionchange"));

    mountPoint.find(".quickfire-paste-button").first().simulate("click");
    expect(mountPoint.instance().value).toBe("abc");
  });

  it("should modify the value as it changes in the input element but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField type="InputText"/>
    );
    mountPoint.find('input.quickfire-user-input').first().simulate('change', { target: { value: "abcd" } });
    expect(mountPoint.instance().value).toBe("abcd");

    mountPoint.instance().field.disabled = true;

    mountPoint.find('input.quickfire-user-input').first().simulate('change', { target: { value: "test" } });
    expect(mountPoint.instance().value).toBe("abcd");
  });

  it("it should validate correctly", () => {
    let mountPoint = mount(
      <SingleField type="InputText" validationRules="email"/>
    );
    const incorrectEmail = "not.a.correct.email"
    mountPoint.find("input").first().simulate("change", {target: {value: incorrectEmail}});
    expect(mountPoint.instance().field.validationState).toBe(null); // validation only triggered in onBlur
    mountPoint.find("input").first().simulate("blur");
    expect(mountPoint.instance().value).toBe(incorrectEmail);
    expect(mountPoint.instance().field.validationState).toBe("error");

    const correctEmail = "this.is.a.correct@email.com"
    mountPoint.find("input").first().simulate("change", {target: {value: correctEmail}});
    mountPoint.find("input").first().simulate("blur");
    expect(mountPoint.instance().value).toBe(correctEmail);
    expect(mountPoint.instance().field.validationState).toBe("success");
  });

  it("it should validate in onChange event when configured that way", () => {
    let mountPoint = mount(
      <SingleField
        type="InputText"
        validationOptions={{
          onBlur: false,
          onChange: true
        }}
        validationRules="email"
      />
    );
    const incorrectEmail = "not.a.correct.email"
    mountPoint.find("input").first().simulate("change", {target: {value: incorrectEmail}});
    expect(mountPoint.instance().value).toBe(incorrectEmail);
    expect(mountPoint.instance().field.validationState).toBe("error");

    const correctEmail = "this.is.a.correct@email.com"
    mountPoint.find("input").first().simulate("change", {target: {value: correctEmail}});
    expect(mountPoint.instance().value).toBe(correctEmail);
    expect(mountPoint.instance().field.validationState).toBe("success");
  });


  it("it should validate using custom rule", async () => {
    const errorMessage = "Only names starting with A are allowed";
    let mountPoint = mount(
      <SingleField
        type="InputText"
        validationOptions={{
          onBlur: false,
          onChange: true
        }}
        customValidationFunctions =  {{
          "name_starts_with_a": {
            func: (value, attribute, formStore) => value.startsWith("A"),
            message: errorMessage,
          }}
        }
        validationRules="name_starts_with_a"
      />
    );
    let value = "Ben"
    mountPoint.find("input").first().simulate("change", {target: {value: value}});
    expect(mountPoint.instance().value).toBe(value);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.validationState).toBe("error");
    expect(mountPoint.instance().field.validationErrors[0]).toBe(errorMessage);

    value = "Amy"
    mountPoint.find("input").first().simulate("change", {target: {value: value}});
    expect(mountPoint.instance().value).toBe(value);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.validationState).toBe("success");
  });

  it("should render in read mode without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="InputText" readMode={true} value="test"/>
    );
    expect(mountPoint.find('.quickfire-field-input-text .quickfire-readmode').length).toBe(1);
    mountPoint.instance().field.injectValue(null);
  });

  it("should give back a numeric variable if type is number", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="InputText" inputType={"number"} value="23.2"/>
    );
    expect(mountPoint.instance().value).toBe(23.2);
    mountPoint.instance().field.injectValue("")
    expect(mountPoint.instance().value).toBe(null);
  });

  it("should offer a hook just before setting the value", async () => {
    let setCount = 0;
    let mountPoint = mount(
      <SingleField
        type="InputText"
        onBeforeSetValue={(proceed)=>{setCount === 0 && proceed(); setCount++;}}/>
    );
    expect(mountPoint.instance().field.getValue()).toBe("");
    mountPoint.find("input").first().simulate("change", {target: {value: "test"}});
    expect(mountPoint.instance().field.getValue()).toBe("test");
    mountPoint.find("input").first().simulate("change", {target: {value: "abcd"}});
    expect(mountPoint.instance().field.getValue()).toBe("test");
  });
});