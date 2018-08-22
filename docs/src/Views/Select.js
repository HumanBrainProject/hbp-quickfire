import React from "react";
import View from "./_View";

let properties = [
  [`label`, `string`, `""`, `The field label`],
  [`value`, `string`, `""`, `The current value of the field`],
  [`defaultValue`, `string`, `""`, `The defaultValue of the field`],
  [`options`, `array`, `[]`, `An array of strings or objects with value and label defined by the mapping`],
  [`optionsUrl`, `string`, `null`, `URL to fetch the select options from`],
  [`cacheOptionsUrl`, `boolean`, `false`, `whether to cache optionsUrl fetched response`],
  [`mappingValue`, `string | array`, `"value"`, `The name(s) of the option object field(s) related to the option value, used to match passed in values to actual options`],
  [`mappingLabel`, `string`, `"label"`, `The name of the option object field related to the option label`],
  [`defaultLabel`, `string`, `"null"`, `The label to be displayed as a default value when set`],
  [`emptyToNull`, `boolean`, `true`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
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

export default class Select extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>Select</h2>
        <p>A simple select input field.</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"Select",
          label:"Select a country",
          options:countryList
        }}/>
        <hr/>

        <h4>Add an empty default value</h4>
        <View.ShowField definition={{
          type:"Select",
          label:"Select a country",
          options:countryList,
          defaultLabel:"Choose in this list..."
        }}/>
        <hr/>

        <h4>Use an URL to populate the options and select initial values</h4>
        <p>During the field initialization, provided values are used to perform a loose comparison to find matches on the <code>mappingValue</code> field</p>
        <View.ShowField definition={{
          type:"Select",
          label:"Select a country",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:"pt"
        }}/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"Select",
          label:"Some uneditable value",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:"fr",
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"Select",
          label:"Some uneditable value",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:"uk",
          readOnly: true
        }}/>          
        
        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"Select",
          label:"Field in read mode",
          optionsUrl:"/assets/XHRMockupData/Countries.json",
          cacheOptionsUrl:true,
          value:"fr",
          readMode: true
        }}/>
      </div>
    );
  }
}


