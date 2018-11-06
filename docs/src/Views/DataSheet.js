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
  [`value`, `array`, `[]`, `The current value of the field`],
  [`defaultValue`, `array`, `[]`, `The defaultValue of the field`],
  [`headers`, `array`, `[]`, `The headers of the datasheet, must be an array of objects dscribing at least a "label" and a "key" property. See below for more details on headers options`],
  [`min`, `number`, `0`, `Minimum number of values (and thus rows) that the field can have`],
  [`max`, `number`, `Infinity`, `Maximum number of values (and thus rows) that the field can have`],
  [`rowControlRemove`, `boolean`, `true`, `Flag option for specifying if a row delete button should be displayed`],
  [`rowControlMove`, `boolean`, `true`, `Flag option for specifying if row move buttons should be displayed`],
  [`rowControlDuplicate`, `boolean`, `true`, `Flag option for specifying if a row duplicate button should be displayed`],
  [`rowControlAdd`, `boolean`, `true`, `Flag option for specifying if row add buttons should be displayed`],
  [`clipContent`,`boolean`,`false`,`Whether cells content should wrap or clip the text content`],
  [`returnEmptyRows`,`boolean`,`false`,`Whether getValue() method will return empty rows or not`],
  [`emptyToNull`, `boolean`, `false`, `Flag that determines if empty values are transformed to null in the value function of the FormStore`],
  [`disabled`,`boolean`,`false`,`Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`,`boolean`,`false`,`Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

let headerProperties = [
  [`key`, `string`, `""`, `The column key that will be used in the values row for input and output`],
  [`label`, `string`, `""`, `The column label`],
  [`show`, `boolean`, `undefined`, `If false, the column will not be displayed at all`],
  [`readOnly`, `boolean`, `undefined`, `If true, the column will be displayed as read only cells`],
  [`defaultValue`, `string`, `""`, `The default value the column will take when creating a new row`],
  [`duplicatedValue`, `string`, `""`, `The default value the column will take when duplicating an existing row`],
  [`width`, `string`, `undefined`, `The column width (e.g. "50px" or "25%")`],
  [`field`, `object`, `undefined`, `An object describing a field type to use as data editor`]
];

export default class DataSheetView extends View {

  render() {
    return (
      <div>
        <h2>Datasheet</h2>
        <p>Form component allowing to edit a spreadsheet-like data</p>
        <p>It uses the react-datasheet npm package to display to field</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Header properties:</h3>
        <View.ShowInfoProperties properties={headerProperties}/>

        <h3>Examples:</h3>
        <h4>Basic Usage</h4>
        <View.ShowField 
          definition={{
            type:"DataSheet",
            label:"Basic example",
            headers:[{
              key:"col1",
              label:"Col1"
            },{
              key:"col2",
              label:"Col2"
            }],
            value:[
              {col1:"Ipsum", col2:"dolor"},
              {col1:"amet", col2:"consectetur"}
            ]
          }}
        />

        <hr/>

        <h4>With a hidden column and a read only column</h4>
        <View.ShowField 
          definition={{
            type:"DataSheet",
            label:"Datasheet with a hidden column",
            min:5,
            returnEmptyRows:false,
            headers:[{
              key:"id",
              show:false,
              defaultValue:0,
              duplicatedValue:0
            },{
              key:"firstname",
              label:"Firstname"
            },{
              key:"lastname",
              label:"Lastname",
              field:{
                type:"Select",
                options:["Doe","Smith","Martin"]
              }
            },{
              key:"country",
              label:"Country",
              width:"20%",
              field:{
                type:"DropdownSelect",
                optionsUrl:"/assets/XHRMockupData/Countries.json"
              }
            },{
              key:"story",
              label:"Story",
              width:"33%",
              field:{
                type:"TextArea"
              }
            },{
              key:"eyecolor",
              label:"Eye Color",
              readOnly:true,
              defaultValue:"unknown",
              width:"80px"
            }],
            value:[
              {id:1,firstname:"John", lastname:"Doe", eyecolor:"green"},
              {id:2,firstname:"Jane", lastname:"Doe", eyecolor:"blue"}
            ]
          }}
        />

      </div>
    );
  }
}


