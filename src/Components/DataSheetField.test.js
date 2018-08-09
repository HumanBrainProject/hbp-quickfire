import React from "react";
import axios from "axios";
import SingleField from "./SingleField";

// describe what we are testing
describe("DataSheet Component", () => {
  // make our assertion and what we expect to happen 
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField 
        type="DataSheet"
        label="label"
        headers={[{label:"Column",key:"column"}]}/>
    );
    expect(mountPoint.find('.quickfire-data-sheet-container').length).toBe(1);
  });
 });