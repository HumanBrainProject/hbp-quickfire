import React from "react";
import View from "./_View";
import {Confirm} from "hbp-quickfire";

import mockupTreeData from "../MockupData/HBP_MEM_0000000.json";

let properties = [
  [`label`, `string`, `""`, `The field label`],
  [`value`, `array`, `[]`, `The current value of the field`],
  [`defaultValue`, `array`, `[]`, `The defaultValue of the field`],
  [`data`, `array`, `{}`, `The tree structure to select from, must be an object with eventually an array of children`],
  [`dataUrl`, `array`, `null`, `URL to fetch the tree structure from`],
  [`mappingValue`, `string | array`, `"value"`, `The name(s) of the node object field(s) related to the node value, used to match passed in values to actual tree nodes`],
  [`mappingLabel`, `string`, `"label"`, `The name of the node object field related to the node label`],
  [`mappingChildren`, `string`, `"children"`, `The name of the node object field related to the node children`],
  [`mappingReturn`, `string`, `null`, `The property of the option object used to return the value(s) - null will return the whole object`],
  [`returnSingle`, `boolean`, `boolean`, `Wether or not to return the first value or an array of values`],
  [`max`, `number`, `Infinity`, `Maximum values that the field can have`],
  [`selectOnlyLeaf`, `boolean`, `false`, `If enabled, only leaves can be selected and not the intermediary nodes`],
  [`expandToSelectedNodes`, `boolean`, `false`, `If enabled, tree selection modal will recursively expand to all the already selected values`],
  [`defaultExpanded`, `array`, `[]`, `An array of arrays describing a path of nodes expanded by default (tested on node labels, path parts are considered as RegExp)`],
  [`showOnlySearchedNodes`, `boolean`, `false`, `Flag that determines if nodes that doesn't match the text search should be hidden`],
  [`emptyToNull`, `boolean`, `false`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`disabled`,`boolean`,`false`,`Is the field disabled or not, a disabled field won't be editable or returned/processed by FormStore.getValues()`],
  [`readOnly`,`boolean`,`false`,`Is the field readOnly or not, a readOnly field won't be editable but will be returned/processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`],
  [`valueLabelTransform`,`object`,`{search:"", replace:""}`,`If provided, will perform a regexp replace on the whole path of the displayed value tag labels.`]
];

export default class TreeSelect extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>TreeSelect</h2>
        <p>Form component allowing to select multiple values from a tree structure</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          label: "Tree Selection",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name"
        }}
        />
        <hr/>

        <h4>Selected values can be shown when opening the modal</h4>
        <p>That feature can be performance consuming depending on the tree structure size and depth due to recursive tree scanning</p>
        <View.ShowField definition={{
          label: "Tree Selection",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          expandToSelectedNodes: true,
          value:["HBP_MEM:0000010", "HBP_MEM:0000145"]    
        }}/>
        <hr/>

        <h4>You can describe how the tree should be expanded by default</h4>
        <p>By providing an array of paths. Each path is an array for which each part is treated as a regexp :</p>
        <View.ShowField definition={{
          label: "Tree Selection",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          defaultExpanded: [
            ["Method","^E.*"],
            ["Method","^N.*"],
          ]
        }}/>
        <hr/>

        <h4>Hide parts of the tree that do not match the search</h4>
        <View.ShowField definition={{
          label: "Tree Selection",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          showOnlySearchedNodes: true
        }}/>
        <hr/>

        <h4>Only leaves selection</h4>
        <p>By default all the nodes are selectable, but the <code>selectOnlyLeaf</code> option prevent nodes that are not leaves to be selected</p>
        <View.ShowField definition={{
          label: "Tree Selection",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          expandToSelectedNodes: true,
          selectOnlyLeaf: true    
        }}/>
        <hr/>

        <h4>Maximum number of selections</h4>
        <View.ShowField definition={{
          label: "Please select 3 nodes maximum",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          expandToSelectedNodes: true,
          selectOnlyLeaf: true,
          max: 3
        }}/>

        <p>Returned value(s) can also be transformed via <code>mappingReturn</code> and <code>returnSingle</code> options</p>

        <View.ShowField definition={{
          label: "Please select 1 node maximum",
          type: "TreeSelect",
          data: mockupTreeData,
          mappingLabel: "name",
          mappingReturn: "value",
          returnSingle: true,
          expandToSelectedNodes: true,
          selectOnlyLeaf: true,
          max: 1
        }}/>
        <hr/>

        <h4>Use an URL to populate the options and provide initial values</h4>
        <p>
          By default the field will try to match to actual tree nodes by comparing passed in values using the 
          <code>mappingValue</code> property.
        </p>
        <View.ShowField definition={{
          label: "Data from URL and initial values",
          type: "TreeSelect",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069", "HBP_MEM:0000081", {"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}],
          expandToSelectedNodes: true     
        }}
      />

        <p><code>mappingValue</code> can also be an array, so the match will be done on multiple properties</p>
        <View.ShowField definition={{
          label: "Data from URL and initial values",
          type: "TreeSelect",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          mappingValue: ["value","name"],
          value: [{"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}],
          expandToSelectedNodes: true     
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          label: "Data from URL and initial values",
          type: "TreeSelect",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069", "HBP_MEM:0000081", {"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}],
          expandToSelectedNodes: true ,
          disabled:true 
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          label: "Data from URL and initial values",
          type: "TreeSelect",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069", "HBP_MEM:0000081", {"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}],
          expandToSelectedNodes: true ,
          readOnly:true 
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"TreeSelect",
          label:"Field in read mode",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069", "HBP_MEM:0000081", {"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}],
          readMode: true
        }}/>

        <h4>Confirmation</h4>
        <View.ShowField definition={{
          type:"TreeSelect",
          label:"Field with confirmations",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          value: ["HBP_MEM:0000069", "HBP_MEM:0000081", {"value": "HBP_MEM:0000084", "name": "Fluorescence recovery after photobleaching"}]
        }}
        onBeforeAddValue={this.handleAddValue}
        onBeforeRemoveValue={this.handleRemoveValue}
        />

        <Confirm show={this.state.showConfirm} message={this.state.messageConfirm} onConfirm={this.state.handleConfirm} onCancel={this.resetConfirm}/>

        <h4>RegExp Tranform on displayed value tag</h4>
        <View.ShowField definition={{
          type:"TreeSelect",
          label:"TreeSelect Field",
          dataUrl: "/assets/XHRMockupData/HBP_MEM_0000000.json",
          mappingLabel: "name",
          valueLabelTransform: {
            search:"(^.*?)( > )(.*( > ))*(.*$)",
            replace:"$1 > $5"
          }
        }}
        />
        
      </div>
    );
  }

  handleAddValue = (confirmCB, field, value) => {
    this.setState({
      showConfirm:true,
      messageConfirm:`Are you sure you want to add this value : ${value[field.mappingLabel]} ?`,
      handleConfirm:() => {
        confirmCB();
        this.resetConfirm();
      }
    });
  }

  handleRemoveValue = (confirmCB, field, value) => {
    this.setState({
      showConfirm:true,
      messageConfirm:`Are you sure you want to remove this value : ${value[field.mappingLabel]} ?`,
      handleConfirm:() => {
        confirmCB();
        this.resetConfirm();
      }
    });
  }

  resetConfirm = () => {
    this.setState({showConfirm:false, handleConfirm:null})
  }
}


