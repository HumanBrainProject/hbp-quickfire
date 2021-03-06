/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";

let properties = [
  [`label`, `string`, `""`, `The field label`],
  [`labelTooltip`, `string`, `null`, `The field label tooltip message`],
  [`labelTooltipPlacement`, `string`, `"top"`, `The field label tooltip placement`],
  [`value`, `array`, `[]`, `The current value of the field`],
  [`defaultValue`, `array`, `[]`, `The defaultValue of the field`],
  [`options`, `array`, `[]`, `The options of the dropdown, must be an array of objects`],
  [`optionsUrl`, `string`, `null`, `url to fetch the select options from`],
  [`cacheOptionsUrl`, `boolean`, `false`, `whether to cache optionsUrl fetched response`],
  [`mappingValue`, `string | array`, `"value"`, `The name(s) of the option object field(s) related to the option value, used to match passed in values to actual options`],
  [`mappingLabel`, `string`, `"label"`, `the name of the option object field related to the option label`],
  [`mappingReturn`, `string | array`, `null`, `the property/properties of the option object used to return the value(s) - null will return the whole object`],
  [`returnSingle`, `boolean`, `boolean`, `wether or not to return the first value or an array of values`],
  [`max`, `number`, `Infinity`, `Maximum values that the field can have`],
  [`emptyToNull`, `boolean`, `false`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`displayInline`, `boolean`, `false`, `Display choices in line, default is display as a list`],
  [`disabled`,`boolean`,`false`,`Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`,`boolean`,`false`,`Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

let countryList = [
  { "value": "fr", "label": "France" }, 
  { "value": "de", "label": "Germany" }, 
  { "value": "uk", "label": "UK" }, 
  { "value": "ch", "label": "Switzerland" }, 
  { "value": "es", "label": "Spain" }, 
  { "value": "pt", "label": "Portugal" }, 
  { "value": "it", "label": "Italy" }, 
  { "value": "be", "label": "Belgium" }
];

export default class GroupSelect extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>GroupSelect</h2>
        <p>Form component allowing to select on/multiple values from a group of checkboxes/radioboxes</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a country",
          options:countryList
        }}/>
        <hr/>

        <h4>Maximum number of values</h4>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a maximum of 3 countries",
          options:countryList,
          max:3
        }}/>
        <hr/>

        <h4>Mapping the returned value and return a value instead of an array</h4>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a country",
          options:countryList,
          max:1,
          mappingReturn:"value",
          returnSingle: true
        }}/>
        <hr/>

        <h4>Use an URL to populate the options and select initial values</h4>
        <p>During the field initialization, provided values are used to perform a loose comparison to find matches on the <code>mappingValue</code> field</p>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a country",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:["fr", {value:"us"}, "uk"]
        }}/>
        
        <p><code>mappingValue</code> can also be an array or property names to use to match the actual options</p>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a country",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          mappingValue:["value", "label"],
          value:[{value:"fr", label:"France"}, {value:"it", label:"France"}, {value:"es", label:"Spain"}]
        }}/>
        <hr/>

        <h4>Inline display</h4>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Select a country",
          displayInline: true,
          options:countryList
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Some uneditable value",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:["fr", {value:"us"}, "uk"],
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Some uneditable value",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:["fr"],
          max:1,
          readOnly: true
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"GroupSelect",
          label:"Field in read mode",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:["fr", {value:"us"}, "uk"],
          readMode: true
        }}/>
        
      </div>
    );
  }
}


