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
  [`max`, `number`, `Infinity`, `Maximum values that the field can have`],
  [`useVirtualClipboard`, `boolean`, `false`, `Flag if virtual clipboard feature is enabled for this field`],
  [`emptyToNull`, `boolean`, `false`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`disabled`, `boolean`, `false`, `Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`, `boolean`, `false`, `Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readAndDeleteOnly`, `boolean`, `false`, `Is the field readAndDeleteOnly or not, a readAndDeleteOnly field will allow deletes but won't be writable for new values, but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

export default class GroupSelect extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){ 
    return (
      <div>
        <h2>InputTextMultiple</h2>
        <p>Allows the input of multiple text values</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Enter your tags"
        }}/>
        <hr/>

        <h4>With provided initial values</h4>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Your hobbies",
          value:["Sport", "Music", "Travels"]
        }}/>
        <hr/>

        <h4>Can have a maximum number of values</h4>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Your preferred dishes (maximum 3)",
          max: 3
        }}/>
        <hr/>

        <h4>Can also use the virtual clipboard</h4>
        <p>It will insert multiple values if they are separated by a new line character. Works also with on native paste event.</p>
        <p>Some sample text below</p>
        <ul>
          <li>Zofia Flatley</li>
          <li>Jon Ritch</li>
          <li>Deeann Chojnacki</li>
          <li>Darius Widner</li>
        </ul>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Enter people names",
          useVirtualClipboard: true
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Some uneditable value",
          value: ["Some", "values", "that can't be", "removed"],
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Some uneditable value",
          value: ["Some", "values", "that can't be", "removed"],
          readOnly: true
        }}/>

        <p>The readAndDeleteOnly state makes it only possible to add values programmatically but deleting values still works, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Some uneditable value",
          value: ["Some", "values", "that can be", "removed", "but not added"],
          readAndDeleteOnly: true
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"InputTextMultiple",
          label:"Field in read mode",
          value: ["Some", "values", "that can only", "be read"],
          readMode: true
        }}/>
        
      </div>
    );
  }
}


