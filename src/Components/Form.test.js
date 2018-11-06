/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Form from "./Form";
import FormStore from "../Stores/FormStore";

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterAll(() => {
  console.error.mockRestore();
});

describe("Form Component", () => {
  it("should render without throwing an error", () => {
    let def = {
      fields:{
        test:{
          type:"InputText",
          value:"abc"
        }
      }
    }; 
    let formStore = new FormStore(def);
    let mountPoint = mount(
      <Form store={ formStore }/>
    );
    expect(mountPoint.instance().values.test).toBe("abc");
  });

  it("should throw if no store is passed", () => {
    expect(()=>{mount(<Form/>)}).toThrow();
  });
});