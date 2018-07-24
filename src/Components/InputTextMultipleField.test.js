import React from "react";
import SingleField from "./SingleField";

let fakeOptions = ["France","Germany","United Kingdom"];

describe("InputTextMultiple Component", () => {
  it("should render without throwing an error", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple" label={"label"}/>
    );
    expect(mountPoint.find('div.quickfire-field-input-text-multiple').length).toBe(1)
    expect(mountPoint.find('input.quickfire-user-input').length).toBe(1)
  });

  it("should render in read mode without throwing an error", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple" label={"label"} emptyToNull={true} readMode={true}/>
    );
    mountPoint.instance().field.injectValue(null);
    mountPoint.instance().field.addValue("test");
    expect(mountPoint.find('.quickfire-field-input-text-multiple.quickfire-readmode').length).toBe(1);
  });

  it("should be able to contain multiple text values but not twice the same", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple"/>
    );
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "a" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "b" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "c" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "b" } });

    expect(mountPoint.instance().value.length).toBe(3);
  });

  it("should not let change event bubble from the user input but only when the field value change", async () => {
    let counter = 0;
    let increment = () => { counter++; }
    let mountPoint = mount(
      <SingleField type="InputTextMultiple" onChange={ increment }/>
    );

    mountPoint.find('input.quickfire-user-input').first().simulate('change');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(counter).toBe(0);
    mountPoint.find('input').at(1).simulate('change');
    mountPoint.find('input').at(1).simulate('change');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(counter).toBe(2);
  });

  it("should support virtual clipboard and native clipboard pasting", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple" useVirtualClipboard={ true }/>
    );
    document.getSelection = function(){ return {value:"a\nb\nc", toString: function(){return this.value;}} }
    document.dispatchEvent(new Event("selectionchange"));

    mountPoint.find(".quickfire-paste-button").first().simulate("click");
    expect(mountPoint.instance().value[0]).toBe("a");
    expect(mountPoint.instance().value.length).toBe(3);

    mountPoint.find(".quickfire-user-input").first().simulate("paste", {clipboardData:{getData: (format) => {return "d\ne\nf"}}});
    expect(mountPoint.instance().value[4]).toBe("e");
    expect(mountPoint.instance().value.length).toBe(6);
  });

  it("should be able to delete last entry by pressing backspace but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple"/>
    );
    
    //Another key
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 1, target: { value: "a" } });
    expect(mountPoint.instance().value.length).toBe(0);

    //Pressing enter
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "a" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "b" } });
    expect(mountPoint.instance().value.length).toBe(2);
    
    //Pressing backspace
    mountPoint.instance().field.disabled = true;
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 8, target: { value: "" } });
    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.instance().field.disabled = false;
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 8, target: { value: "" } });
    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should be able to delete any entry by clicking delete button or backspace but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple"/>
    );
    //Pressing enter
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "a" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "b" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "c" } });
    mountPoint.instance().field.disabled = true;
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "d" } });
    expect(mountPoint.instance().value.length).toBe(3);
    
    //Clicking the cross button
    mountPoint.find(".value-tag .glyphicon-remove").at(0).simulate('click');
    expect(mountPoint.instance().value.length).toBe(3);
    mountPoint.instance().field.disabled = false;
    mountPoint.find(".value-tag .glyphicon-remove").at(0).simulate('click');
    expect(mountPoint.instance().value.length).toBe(2);

    //Pressing the backspace will delete the value, other keys are ignored
    mountPoint.find('.value-tag .glyphicon-remove').at(1).simulate('keydown', { keyCode: 1 });
    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.instance().field.disabled = true;
    mountPoint.find('.value-tag .glyphicon-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value[1]).toBe("c");
    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.instance().field.disabled = false;
    mountPoint.find('.value-tag .glyphicon-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value[0]).toBe("b");
    expect(mountPoint.instance().value.length).toBe(1);
  });
  
  it("should be able to edit an entry by clicking on its button", () => {
    let mountPoint = mount(
      <SingleField type="InputTextMultiple"/>
    );
    //Pressing enter
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "a" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "b" } });
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "c" } });
    expect(mountPoint.instance().value.length).toBe(3);
    
    //Clicking the cross button
    mountPoint.find(".value-tag").at(1).simulate('click');
    expect(mountPoint.instance().value.length).toBe(2);
    expect(mountPoint.find(".quickfire-user-input").at(0).getDOMNode().value).toBe("b");
  });

  it("should be able to handle drag&drop but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="InputTextMultiple"
        label="label"
        value={["a","b","c"]}
        />
    );
    expect(mountPoint.instance().field.value[0]).toBe("a");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragEnd");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragStart");
    mountPoint.find('.quickfire-value-tag').at(0).simulate("drop");
    expect(mountPoint.instance().field.value[0]).toBe("b");
    mountPoint.instance().field.disabled = true;
    mountPoint.find('.quickfire-user-input').at(0).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragEnd");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragStart");
    mountPoint.find('.quickfire-value-tag').at(0).simulate("drop");
    expect(mountPoint.instance().field.value[0]).toBe("b");
  });

  it("should add a value when blurring the user input if it's not empty or disabled", () => {
    let mountPoint = mount(
      <SingleField 
        type="InputTextMultiple"
        label="label"
        value={["a","b","c"]}
        />
    );
    expect(mountPoint.instance().field.value.length).toBe(3);
    mountPoint.find('input.quickfire-user-input').first().simulate('blur', { target: { value: "d" } });
    expect(mountPoint.instance().field.value.length).toBe(4);
    mountPoint.instance().field.disabled = true;
    mountPoint.find('input.quickfire-user-input').first().simulate('blur', { target: { value: "e" } });
    expect(mountPoint.instance().field.value.length).toBe(4);
  });

  it("should offer a hook before adding a value", () => {
    let addCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="InputTextMultiple"  
        label="label"
        value={["a","b","c"]}
        onBeforeAddValue={proceed => {addCount === 0 && proceed(); addCount++;}}
        />
    );
    expect(mountPoint.instance().value.length).toBe(3);
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "d" } });
    expect(mountPoint.instance().value.length).toBe(4);
    mountPoint.find('input.quickfire-user-input').first().simulate('keydown', { keyCode: 13, target: { value: "e" } });
    expect(mountPoint.instance().value.length).toBe(4);
  });

  it("should offer a hook before removing a value", () => {
    let removeCount = 0;
    let mountPoint = mount(
      <SingleField 
        type="InputTextMultiple"  
        label="label"
        value={["a","b","c"]}
        onBeforeRemoveValue={proceed => {removeCount === 0 && proceed(); removeCount++;}}
        />
    );
    expect(mountPoint.instance().value.length).toBe(3);
    mountPoint.find('.value-tag .glyphicon-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value.length).toBe(2);
    mountPoint.find('.value-tag .glyphicon-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value.length).toBe(2);
  });

  it("should offer a hook on the click of a value", () => {
    let clickedValue = "";
    let mountPoint = mount(
      <SingleField 
        type="InputTextMultiple"  
        label="label"
        value={["a","b","c"]}
        onValueClick={(field, value) => {clickedValue = value;}}
        />
    );
    mountPoint.find('.value-tag').at(1).simulate('click');
    expect(clickedValue).toBe("b");
  });

 });