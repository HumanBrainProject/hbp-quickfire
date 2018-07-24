import React from "react";
import SingleField from "./SingleField";
import Field from "./Field";
import NestedActionButton from "./NestedActionButton";

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterAll(() => {
  console.error.mockRestore();
});

describe("NestedActionButton Component", () => {
  it("shouldn't be instanciated without being inherited", () => {
    expect(()=>{
      mount(<NestedActionButton/>);
    }).toThrow();
  });
});

describe("NestedRemoveButton Component", () => {
  it("should mount without error and remove an instance of Nested field when clicked", () => {
    
    let mountPoint = mount(
      <SingleField label="InputTest" type="Nested" min="0" max="5" fields={{
        test:{type:"InputText", value:"abc"}
      }}>
        <div className="instance">
          <Field.Remove/>
          <Field name="test"/>
        </div>
      </SingleField>
    );
    
    mountPoint.find('.quickfire-nested-add button').first().simulate("click");
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('.quickfire-nested-remove').first().simulate("click");
    expect(mountPoint.instance().value.length).toBe(0);
  });
});

describe("NestedMoveUpButton Component", () => {
  it("should mount without error and move up an instance of Nested field when clicked", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Nested" min="2" max="5" fields={{
        test:{type:"InputText", value:"abc"}
      }}>
        <div className="instance">
          <Field.MoveUp/>
          <Field name="test"/>
        </div>
      </SingleField>
    );

    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.instance().field.value[1].test.value = "second";
    mountPoint.find('button.quickfire-nested-moveup').at(1).simulate("click");
    expect(mountPoint.instance().value[0].test).toBe("second");
  });
});

describe("NestedMoveDownButton Component", () => {
  it("should mount without error and move down an instance of Nested field when clicked", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Nested" min="2" max="5" fields={{
        test:{type:"InputText", value:"abc"}
      }}>
        <div className="instance">
          <Field.MoveDown/>
          <Field name="test"/>
        </div>
      </SingleField>
    );

    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.instance().field.value[0].test.value = "first";
    mountPoint.find('button.quickfire-nested-movedown').at(0).simulate("click");
    expect(mountPoint.instance().value[1].test).toBe("first");
  });
});

describe("NestedDuplicateButton Component", () => {
  it("should mount without error and duplicate an instance of Nested field when clicked", () => {
    let mountPoint = mount(
      <SingleField label="InputTest" type="Nested" min="1" max="5" fields={{
        test:{type:"InputText", value:"abc"}
      }}>
        <div className="instance">
          <Field.Duplicate/>
          <Field name="test"/>
        </div>
      </SingleField>
    );

    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.instance().field.value[0].test.value = "to-be-duplicated";
    mountPoint.find('button.quickfire-nested-duplicate').at(0).simulate("click");
    expect(mountPoint.instance().value[1].test).toBe("to-be-duplicated");
  });
});