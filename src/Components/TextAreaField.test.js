import React from "react";
import SingleField from "./SingleField";

describe("TextArea Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField label="testarea" type="TextArea"/>
    );
    expect(mountPoint.find('textarea').length).toBe(1);
  });

  it("should render in read mode without throwing an error", async () => {
    let mountPoint = mount(
      <SingleField label="testarea" type="TextArea" emptyToNull={true} readMode={true}/>
    );
    expect(mountPoint.find('.quickfire-readmode-textarea-value').length).toBe(1);
    mountPoint.instance().field.injectValue("Test1\nTest2\nTest3\nTest4");
    expect(mountPoint.instance().inputRef).toBeUndefined();

    mountPoint.instance().field.readMode = false;
    mountPoint.instance().field.injectValue("Test1\nTest2\nTest3\nTest4\nTest5");
    mountPoint.instance().field.injectValue(null);

    expect(mountPoint.instance().value).toBeNull();

  });

 });