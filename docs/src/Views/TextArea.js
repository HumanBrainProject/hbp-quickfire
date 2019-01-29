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
  [`value`, `string`, `""`, `The current value of the field`],
  [`defaultValue`, `string`, `""`, `The defaultValue of the field`],
  [`emptyToNull`, `boolean`, `true`, `Flag that determines if empty values are transformed to null in the value function of the formStore`],
  [`disabled`, `boolean`, `false`, `Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`, `boolean`, `false`, `Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`],
  [`autosize`,`boolean`,`false`,`If true, the textarea resizes automatically`],
  [`rows`,`number`,`false`,`How many rows are displayed by default. Represents the min value`],
  [`maxRows`,`number`,`false`,`How many rows are displayed at most before the field does not grow anymore (only possible if autosize is enabled)`],
  [`resizable`,`boolean`,`false`,`If true, the textarea is horizontally resizable by the user`]
];

export default class TextArea extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return (
      <div>
        <h2>TextArea</h2>
        <p>A simple text area</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          label:"Simple text area",
          type:"TextArea"
        }}/>
        <hr/>

        <h4>Set an initial value</h4>
        <View.ShowField definition={{
          type:"TextArea",
          label:"TextArea with initial value",
          value:"Initial value"
        }}/>
        <hr/>

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"Some uneditable value",
          value: "Initial value",
          disabled: true
        }}/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"Some uneditable value",
          value: "Initial value",
          readOnly: true
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"Field in read mode",
          value: "Some value\non multiple\nlines",
          readMode: true
        }}/>

        <h4>Autosize</h4>
        <p>By default the textarea resizes automatically to fit the content. If you don't want this behaviour, set the autosize prop to false</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"No Autoresize",
          value: "Some value\non multiple\nlines",
          autosize: false
        }}/>

        <h4>Minimum Height</h4>
        <p>You can define the minimum height via the rows property</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"min 5 rows ",
          value: "Some value\non multiple\nlines",
          rows: 5
        }}/>

        <h4>Maximum Height</h4>
        <p>You can also define a maximum height. If the field exceeds this height it won't grow anymore but rather put the content in a scroll area.</p>
        <p>To define the maximum height set the maxRows prop</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"Max 5 Rows",
          value: "1\n2\n3\n4\n5",
          maxRows: 5
        }}/>


        <p>To enable vertical resizing by the user. Set the resizable prop to true.</p>
        <View.ShowField definition={{
          type:"TextArea",
          label:"This is resizible by the user",
          value: "Some value\non multiple\nlines",
          resizable: true
        }}/>


      </div>
    );
  }
}


