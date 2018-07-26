import React from "react";
import View from "./_View";
import { stripIndent } from "common-tags";
import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from "react-syntax-highlighter/styles/prism/darcula";

let properties = [
  [`label`, `string`, `""`, `The field label`],
  [`value`, `number|Range`, `null`, `The current value. If only a number is provided, a single slider will get rendered. If a range object {min:x, max:y} is provided, two sliders will get rendered.`],
  [`defaultValue`, `number|Range`, `null`, `The defaultValue of the field`],
  [`min`, `number`, `null`, `Minimum value. You cannot drag your slider under this value`],
  [`max`, `number`, `null`, `Maximum value. You cannot drag your slider beyond this value.`],
  [`step`, `number`, `1`, `The default increment/decrement is 1. You can change that by setting a different number to this property.`],
  [`formatLabel`, `function`, `value => value`, ` By default, value labels are displayed as plain numbers. If you want to change the display, you can do so by passing in a function`],
  [`disabled`, `boolean`, `false`, `Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()`],
  [`readOnly`, `boolean`, `false`, `Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()`],
  [`readMode`,`boolean`,`false`,`If true, displays the field as label and value without the actual form input`]
];

export default class Slider extends View {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <h2>Slider</h2>

        <h3>Properties:</h3>
        <View.ShowInfoProperties properties={properties}/>

        <h3>Examples</h3>

        <h4>Basic usage</h4>
        <View.ShowField definition={{
          label:"Select number",
          type:"Slider",
          min:0,
          max:10,
          defaultValue:5
        }}/>
        <p>You can also enable range selection by setting the value to an object:</p>
        <View.ShowField definition={{
          label:"Select your weight range",
          type:"Slider",
          min:0,
          max:200,
          step: 5,
          defaultValue:{ min:70, max:90 },
          formatLabel:value => `${value} kg`,
        }}/>
         <p>The slider also supports floating point values</p>
        <View.ShowField definition={{
          label:"Select a range of floats",
          type:"Slider",
          min:0,
          max:1.0,
          defaultValue:{min: 0.3, max: 0.4},
          step: 0.1,
        }}/>
        <h3>Define your own label mapping</h3>
        <p>For example:</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          formatLabel: value => \`\${value} cm\`,
        `}</SyntaxHighlighter>
        <View.ShowField definition={{
          label:"How tall are you?",
          type:"Slider",
          min:150,
          max:210,
          defaultValue:170,
          formatLabel:value => `${value} cm`,
        }}/>
        <p>You can also set the labels independently</p>
        <SyntaxHighlighter language="jsx" style={darcula}>{stripIndent`
          formatLabel: (value, type) => {
            const min = "😫", max  = "😎";
            switch(type) {
              case "value":
                switch (value) {
                  case 0: return min
                  case 1: return "🙁"
                  case 2: return "😐"
                  case 3: return "🙂"
                  case 4: return "😀"
                  case 5: return "😆"
                  case 6: return max
                }
              case "min":
                return min
              case "max":
                return max
            }
          }
        `}</SyntaxHighlighter>
        <View.ShowField definition={{
          label:"How are you?",
          type:"Slider",
          min:0,
          max:6,
          defaultValue:3,
          formatLabel:(value, type) => {
            const min = "😫", max  = "😎";
            switch(type) {
              case "value":
                switch (value) {
                  case 0: return min
                  case 1: return "🙁"
                  case 2: return "😐"
                  case 3: return "🙂"
                  case 4: return "😀"
                  case 5: return "😆"
                  case 6: return max
                }
              case "min":
                return min
              case "max":
                return max
            }
          }
        }}/>

        <h4>ReadMode</h4>
        <p>A field displayed in readMode only displays the value as text, without the actual form input</p>
        <View.ShowField definition={{
          type:"Slider",
          label:"Field in read mode",
          value:{ min:70, max:90 },
          readMode: true
        }}/>
      </div>
    );
  }
}


