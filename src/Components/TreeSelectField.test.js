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

let fakeTree = {
  "value": "HBP_MEM:0000000",
  "name": "Method",
  "children": [
    {
      "value": "HBP_MEM:0000119",
      "name": "Endogenous genes manipulation",
      "children": [
        {
          "value": "HBP_MEM:0000125",
          "name": "Dominant-negative inhibition"
        },
        {
          "value": "HBP_MEM:0000124",
          "name": "Morpholino"
        },
        {
          "value": "HBP_MEM:0000121",
          "name": "Knockin"
        },
        {
          "value": "HBP_MEM:0000120",
          "name": "Knockout"
        },
        {
          "value": "HBP_MEM:0000122",
          "name": "Conditional knockout"
        },
        {
          "value": "HBP_MEM:0000123",
          "name": "RNA interference"
        }
      ]
    }
  ]
};

let mock = new MockAdapter(axios);
 
mock.onGet("/getfaketree").reply(200, fakeTree);

describe("TreeSelect Component", () => {

  it("should mount without throwing any error", () => {
    let mountPoint = mount(
      <SingleField type="TreeSelect" data={fakeTree}/>
    );
    expect(mountPoint.find('.form-group.quickfire-field-tree-select').length).toBe(1);
    expect(mountPoint.instance().field.data.value).toBe("HBP_MEM:0000000");
  });

  it("should mount in read mode without throwing any error", () => {
    let mountPoint = mount(
      <SingleField type="TreeSelect" data={fakeTree} readMode={true} label={"Test"}/>
    );
    mountPoint.instance().field.injectValue(["HBP_MEM:0000119"]);
    expect(mountPoint.find('.quickfire-field-tree-select.quickfire-readmode').length).toBe(1);
  });

  it("should be able to receive tree datas by fetching them", async () => {
    let mountPoint = mount(
      <SingleField type="TreeSelect" dataUrl={"/getfaketree"}/>
    );
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mountPoint.instance().field.data.value).toBe("HBP_MEM:0000000");
  });

  it("should trigger onChange event when value is added", () => {
    let counter = 0;
    let increment = () => { counter++; }
    let mountPoint = mount(
      <SingleField label="label" type="TreeSelect" data={fakeTree} onChange={ increment }/>
    );
    
    mountPoint.find('input').first().simulate("change");
    expect(counter).toBe(1);
  });


  it("should show a modal with tree node selection but not if it's disabled or we have reached the max values", () => {
    let mountPoint = mount(
      <SingleField label="label" type="TreeSelect" max={2} data={fakeTree} disabled={true}/>
    );
    
    //Open modal (disabled)
    mountPoint.find('label').first().simulate('click');
    expect(mountPoint.find('a.quickfire-tree-node-selector').length).toBe(0);
    mountPoint.instance().field.disabled = false;
    mountPoint.instance().field.injectValue(["HBP_MEM:0000000","HBP_MEM:0000119"]);
    //Open modal (max reached)
    mountPoint.find('label').first().simulate('click');
    expect(mountPoint.find('a.quickfire-tree-node-selector').length).toBe(0);

    mountPoint.instance().field.injectValue(["HBP_MEM:0000000"]);
    mountPoint.instance().field.max = 1;
    //Open modal (max=1 reached)
    mountPoint.find('label').first().simulate('click');
    expect(mountPoint.find('a.quickfire-tree-node-selector').length).toBeGreaterThan(0);

  });

  it("should be able to add (not twice the same and not more than max) and remove values but not if disabled", () => {
    let mountPoint = mount(
      <SingleField label="label" type="TreeSelect" max={2} data={fakeTree}/>
    );
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);

    mountPoint.instance().field.disabled = true;
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);

    mountPoint.instance().field.disabled = false;
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(0);

    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    //Click value tag button
    mountPoint.find('.value-tag').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);

    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Expand first node
    mountPoint.find('button.quickfire-tree-node-expand').first().simulate('click');
    //Expand second node
    mountPoint.find('button.quickfire-tree-node-expand').at(1).simulate('click');
    //Click second node
    mountPoint.find('a.quickfire-tree-node-selector').at(1).simulate('click');
    //Click third node
    mountPoint.find('a.quickfire-tree-node-selector').at(2).simulate('click');

    mountPoint.instance().field.disabled = true;
    mountPoint.find('.quickfire-value-tag .quickfire-remove').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(2);

    mountPoint.instance().field.disabled = false;
    mountPoint.find('.quickfire-value-tag .quickfire-remove').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should behave differently if max = 1", () => {
    let mountPoint = mount(
      <SingleField label="label" max={1} type="TreeSelect" data={fakeTree}/>
    );
    
    mountPoint.find('label').first().simulate('click');
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
    
    mountPoint.find('label').first().simulate('click');
    mountPoint.find('button.quickfire-tree-node-expand').at(0).simulate('click');
    mountPoint.find('a.quickfire-tree-node-selector').at(1).simulate('click');

    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should be able to remove a tag by focusing and pressing backspace unless it's disabled", () => {
    let mountPoint = mount(
      <SingleField label="label" type="TreeSelect" data={fakeTree} expandToSelectedNodes={true}/>
    );
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);

    mountPoint.find('.quickfire-value-tag .quickfire-remove').at(0).simulate('keydown', { keyCode: 1 });
    expect(mountPoint.instance().value.length).toBe(1);

    mountPoint.instance().field.disabled = true;
    mountPoint.find('.quickfire-value-tag .quickfire-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value.length).toBe(1);

    mountPoint.instance().field.disabled = false;
    mountPoint.find('.quickfire-value-tag .quickfire-remove').at(1).simulate('keydown', { keyCode: 8 });
    expect(mountPoint.instance().value.length).toBe(0);
  });

  it("should offer a hook before adding a value", () => {
    let addCount = 0;
    let mountPoint = mount(
      <SingleField 
        label="label" 
        type="TreeSelect" 
        data={fakeTree} 
        onBeforeAddValue={proceed => {addCount===0 && proceed();addCount++;}}/>
    );
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(0);
  });

  it("should offer a hook before removing a value", () => {
    let removeCount = 0;
    let mountPoint = mount(
      <SingleField 
        label="label" 
        type="TreeSelect" 
        data={fakeTree} 
        onBeforeRemoveValue={proceed => {removeCount===0 && proceed();removeCount++;}}/>
    );
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(0);
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value.length).toBe(1);
  });

  it("should offer a hook before setting a value", () => {
    let setCount = 0;
    let mountPoint = mount(
      <SingleField 
        label="label" 
        type="TreeSelect" 
        data={fakeTree} 
        value={["HBP_MEM:0000120"]}
        max={1}
        onBeforeSetValue={proceed => {setCount===0 && proceed();setCount++;}}/>
    );
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value[0].value).toBe("HBP_MEM:0000000");
    mountPoint.instance().field.injectValue(["HBP_MEM:0000120"]);
    expect(mountPoint.instance().value[0].value).toBe("HBP_MEM:0000120");
    //Open modal
    mountPoint.find('label').first().simulate('click');
    //Click first node
    mountPoint.find('a.quickfire-tree-node-selector').first().simulate('click');
    expect(mountPoint.instance().value[0].value).toBe("HBP_MEM:0000120");
  });

  it("should offer a hook on the click of a value", () => {
    let clickedValue = "";
    let mountPoint = mount(
      <SingleField 
        label="label" 
        type="TreeSelect" 
        data={fakeTree} 
        value={["HBP_MEM:0000120"]}
        onValueClick={(field, value) => {clickedValue = value.value;}}
        />
    );
    mountPoint.find('.quickfire-value-tag').at(0).simulate('click');
    expect(clickedValue).toBe("HBP_MEM:0000120");
  });

  it("should be able to handle drag&drop but not if it's disabled", () => {
    let mountPoint = mount(
      <SingleField 
        label="label" 
        type="TreeSelect" 
        data={fakeTree} 
        value={["HBP_MEM:0000120","HBP_MEM:0000121","HBP_MEM:0000122"]}
        />
    );
    expect(mountPoint.instance().field.value[0].value).toBe("HBP_MEM:0000120");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragEnd");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragStart");
    mountPoint.find('.quickfire-value-tag').at(0).simulate("drop");
    expect(mountPoint.instance().field.value[0].value).toBe("HBP_MEM:0000121");
    mountPoint.instance().field.disabled = true;
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragOver");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragEnd");
    mountPoint.find('.quickfire-value-tag').at(1).simulate("dragStart");
    mountPoint.find('.quickfire-value-tag').at(0).simulate("drop");
    expect(mountPoint.instance().field.value[0].value).toBe("HBP_MEM:0000121");
  });

 });