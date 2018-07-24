import React from "react";
import { Provider } from "mobx-react";
import SelectField from "./SelectField";
import FormStore from "../Stores/FormStore";
import Field from "./Field";
import SingleField from "./SingleField";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let fakeOptions = [{ "value": "fr", "label": "France" }, { "value": "de", "label": "Germany" }, { "value": "uk", "label": "UK" }];
let mock = new MockAdapter(axios);
mock.onGet("/getfakeoptions").reply(200, fakeOptions);

function formConfigFromFieldDefinition(fieldName, fieldDef) {
  return {
    fields: {
      [fieldName]: {
        ...fieldDef,
        type: "Select"
      }
    }
  }
}

describe("SelectField", () => {
  // test cases that only test the field component itself
  it("should render without throwing an error", () => {
    let options=["test1", "test2"];
    let wrapper = mount (
      <SingleField type="Select" options={options} label="Test"/>
    );
    expect(wrapper.find("select").children()).toHaveLength(options.length);
  });

  it("should render in read mode without throwing an error", () => {
    let options=[{value:1, label:"label 1"}, {value:2, label:"label 2"}];
    let wrapper = mount (
      <SingleField type="Select" options={options} readMode={true} label="Test"/>
    );
    expect(wrapper.find(".quickfire-field-select.quickfire-readmode").length).toBe(1);
  });

  it("take options from an object with custom mapping", () => {
    let label = "Movie List"
    let options = [{
      id: 1,
      name: "Back to the future"
    },
    {
      id: 2,
      name: "Back from the past"
    }];
    let fieldProps = {label, options, mappingValue: "id", mappingLabel: "name"};

    let wrapper = mount (
      <SingleField type="Select" {...fieldProps}/>
    );

    let selectOptions = wrapper.find("select").children();
    let field = wrapper.instance().field;
    expect(selectOptions).toHaveLength(options.length);
    for (let [index, option] of field.options.entries()) {
      expect(selectOptions.at(index).props().children).toBe(option.name);
      expect(selectOptions.at(index).props().value).toBe(field.optionsMap.get(option));
    }
  });
  // test cases that only test component involve form store
  it("take options from an object with default mapping", () => {
    let options = [{
      value: 1,
      label: "Back to the future"
    },
    {
      value: 2,
      label: "Back from the past"
    }];
    let fieldDef = {
      options: options,
      label: "Movie List"
    };
    let fieldName = "Test";
    let formDef = formConfigFromFieldDefinition(fieldName, fieldDef);
    let formStore = new FormStore(formDef);
    let wrapper = mount (
      <Provider formStore={formStore} parentPath="">
        <Field name={fieldName} />
      </Provider>
    );
    let selectOptions = wrapper.find("select").children();
    expect(selectOptions).toHaveLength(options.length);
    for (let [index, option] of formStore.getField("Test").options.entries()) {
      expect(selectOptions.at(index).props().children).toBe(option.label);
      expect(selectOptions.at(index).props().value).toBe(formStore.getField("Test").optionsMap.get(option));
    }
  });
  // test cases that only test component involve form store
  it("adds a default option when defaultLabel is defined", () => {
    let options = [{
      value: 1,
      label: "Back to the future"
    },
    {
      value: 2,
      label: "Stuck in the Middle Ages...Help"
    }];
    let fieldDef = {
      options: options,
      label: "Movie List",
      defaultLabel: "---"
    };
    let fieldName = "Test";
    let formDef = formConfigFromFieldDefinition(fieldName, fieldDef);
    let formStore = new FormStore(formDef);
    let wrapper = mount (
      <Provider formStore={formStore} parentPath="">
        <Field name={fieldName} />
      </Provider>
    );
    let selectOptions = wrapper.find("select").children();
    expect(selectOptions).toHaveLength(options.length + 1);
    expect(selectOptions.at(0).props().children).toBe("---");
    let values = formStore.getValues();
    expect(values[fieldName]).toBe(null);
  });

  it("should be able to take url as options", async () => {
    let mountPoint = mount(
      <SingleField 
        type="Select"  
        optionsUrl={"/getfakeoptions"}/>
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.options.length).toBe(3);
  });

  it("should be able to change value but not if it's disabled", async () => {
    let mountPoint = mount(
      <SingleField 
        type="Select"  
        options={fakeOptions}/>
    );
    expect(mountPoint.instance().field.getValue()).toBe("fr");

    mountPoint.instance().field.disabled = true;
    mountPoint.find("select").simulate("change", {target:{value:mountPoint.instance().field.optionsMap.get(mountPoint.instance().field.options[1])}});
    expect(mountPoint.instance().field.getValue()).toBe("fr");

    mountPoint.instance().field.disabled = false;
    mountPoint.find("select").simulate("change", {target:{value:mountPoint.instance().field.optionsMap.get(mountPoint.instance().field.options[1])}});
    expect(mountPoint.instance().field.getValue()).toBe("de");
  });

  it("should offer a hook just before setting the value", async () => {
    let setCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="Select"  
        options={fakeOptions}
        defaultLabel="Choose..."
        onBeforeSetValue={(proceed)=>{setCount === 0 && proceed(); setCount++;}}/>
    );
    expect(mountPoint.instance().field.getValue()).toBe(null);
    mountPoint.find("select").simulate("change", {target:{value:mountPoint.instance().field.optionsMap.get(mountPoint.instance().field.options[1])}});
    expect(mountPoint.instance().field.getValue()).toBe("de");
    mountPoint.find("select").simulate("change", {target:{value:""}});
    expect(mountPoint.instance().field.getValue()).toBe("de");
  });
});