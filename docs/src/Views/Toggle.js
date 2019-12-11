/*
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
  [`onColor`,`string`, `#06D6A0`,`The color when the toggle is on`],
  [`offColor`,`string`, `#808080`,`The color when the toggle is off`],
  [`size`,`string`, `medium`,`The size of the toggle`],
  [`inline`,`boolean`, `false`,`Whether the toggle should be displayed inline or not`],
  [`disabled`, `boolean`, `false`, `Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`, `boolean`, `false`, `Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

export default class Toggle extends View {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        <h2>Toggle</h2>
        <p>A simple toggle</p>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples:</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          type:"Toggle",
          label:"Please toggle me"
        }}/>
        <hr/>

        <h4>Custom color</h4>
        <View.ShowField definition={{
          type:"Toggle",
          label:"If you click me, you'll discover an amazing color",
          onColor:"#ffd400",
          offColor:"#26e09f"
        }}/>
        <hr/>

        <h4>Custom size</h4>
        <View.ShowField definition={{
          type:"Toggle",
          onColor:"#001D96",
          offColor:"#000000",
          label:"Large",
          size:"large"
        }}/>
        <View.ShowField definition={{
          type:"Toggle",
          onColor:"#FFFFFF",
          offColor:"#DD0000",
          label:"Medium"
        }}/>
        <View.ShowField definition={{
          type:"Toggle",
          onColor:"#ED2436",
          offColor:"#FFCE00",
          label:"Small",
          size:"small"
        }}/>
        <hr/>

        <h4>Inline</h4>
        <View.ShowField definition={{
          type:"Toggle",
          label:"My toggle sits right next to me",
          inline:true
        }}/>
        <hr/>   

        <h4>Disabled / ReadOnly</h4>
        <p>The disabled state makes the input impossible to edit, and the value WON'T BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"Toggle",
          label:"Some uneditable toggle",
          value: false,
          disabled: true
        }}/>
        <hr/>

        <p>The readOnly state makes the input impossible to edit, and the value WILL BE processed and returned by the <code>FormStore.getValues()</code> method</p>
        <View.ShowField definition={{
          type:"Toggle",
          label:"Some uneditable toggle",
          value: true,
          readOnly: true
        }}/>
        <hr/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"Toggle",
          label:"Field in read mode",
          value: true,
          readMode: true
        }}/>

      </div>
    );
  }
}


