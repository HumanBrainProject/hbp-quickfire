/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";

let properties = [
  [`label`,`string`,`""`,`The field label`],
  [`inputType`,`string`,`"text"`,`The input type of the field (e.g. text, password, email)`],
  [`value`,`string`,`""`,`The current value of the field`],
  [`defaultValue`,`string`,`""`,`The defaultValue of the field`],
  [`useVirtualClipboard`,`boolean`,`false`,`Flag if virtual clipboard feature is enabled for this field`],
  [`emptyToNull`,`boolean`,`true`,`Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`disabled`,`boolean`,`false`,`Is the field disabled or not, a disabled field won't be editable or returned/processed by FormStore.getValues()`],
  [`readOnly`,`boolean`,`false`,`Is the field readOnly or not, a readOnly field won't be editable but will be returned/processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`],
  [`autoComplete`,`boolean`,`false`,`Sets the autocomplete attribute of the input element`]
];

export default class InputText extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return (
      <div>
        <h2>InputText</h2>
        <p>A simple text input, that can be of any type browsers offer natively.</p>
        <p>
          See <a target="_blank" href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input#Attributs">complete list of possible type attributes.</a>
        </p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"InputText",
          label:"Simple input"
        }}/>
        <hr/>

        <h4>Using a different native input type</h4>
        <View.ShowField definition={{
          type:"InputText",
          label:"Password input",
          inputType:"password"
        }}/>
        <View.ShowField definition={{
          type:"InputText",
          label:"Number input",
          inputType:"number"
        }}/>
        <View.ShowField definition={{
          type:"InputText",
          label:"Date input",
          inputType:"date"
        }}/>
        <View.ShowField definition={{
          type:"InputText",
          label:"Color input",
          inputType:"color"
        }}/>
        <hr/>

        <h4>Set an initial value</h4>
        <View.ShowField definition={{
          type:"InputText",
          label:"Input with initial value",
          value:"Initial value",
          autoComplete:true
        }}/>
        <hr/>

        <h4>Use the virtual clipboard</h4>
        <p>The virtual clipboard allows the user to highlight any text on the current page and use it as the input value</p>
        <View.ShowField definition={{
          type:"InputText",
          label:"Pastable input",
          useVirtualClipboard: true
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"InputText",
          label:"Some uneditable value",
          value: "Initial value",
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"InputText",
          label:"Some uneditable value",
          value: "Initial value",
          readOnly: true
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"InputText",
          label:"Field in read mode",
          value: "Some value",
          readMode: true
        }}/>

      </div>
    );
  }
}


