/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";

let properties = [
  [`label`,`string`, `""`,`The field label`],
  [`labelTooltip`, `string`, `null`, `The field label tooltip message`],
  [`labelTooltipPlacement`, `string`, `"top"`, `The field label tooltip placement`],
  [`value`,`string`, `false`,`The current value of the field`],
  [`defaultValue`,`string`, `false`,`The defaultValue of the field`],
  [`disabled`, `boolean`, `false`, `Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`, `boolean`, `false`, `Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

export default class CheckBox extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>CheckBox</h2>
        <p>A simple checkbox field</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"CheckBox",
          label:"Do you accept this simple checkbox ?"
        }}/>
        <hr/>

        <h4>With the box already ticked</h4>
        <View.ShowField definition={{
          type:"CheckBox",
          label:"Checked by default",
          value:true
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"CheckBox",
          label:"Some uneditable checkbox",
          value: false,
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"CheckBox",
          label:"Some uneditable checkbox",
          value: true,
          readOnly: true
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"CheckBox",
          label:"Field in read mode",
          value: true,
          readMode: true
        }}/>

      </div>
    );
  }
}


