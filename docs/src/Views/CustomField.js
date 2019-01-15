/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import View from "./_View";
import { computed, observable, action } from "mobx";
import { FormStore } from "hbp-quickfire";
import { observer, inject } from "mobx-react";

import SyntaxHighlighter from "react-syntax-highlighter/prism-light";
import darcula from 'react-syntax-highlighter/styles/prism/darcula';

class FibonacciFieldStore extends FormStore.typesMapping.Default{
  @observable value = 1;
  @observable defaultValue = 1;

  @action
  increaseValue(){
    this.value = this.value + this.previousValue;
  }
  
  @action
  decreaseValue(){
    this.value = this.previousValue;
  }

  @computed
  get previousValue(){
    return Math.round(this.value / ((1+Math.sqrt(5))/2));
  }
}

@inject("formStore")
@observer
class FibonacciField extends React.Component{
  handleDecrease = () => {
    this.props.field.decreaseValue();
    this.dispatchChangeEvent();
  }

  handleIncrease = () => {
    this.props.field.increaseValue();
    this.dispatchChangeEvent();
  }

  //This simulates an organic onChange Event to let it bubble up
  dispatchChangeEvent = () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(this.inputRef, this.props.field.value);
    this.inputRef.dispatchEvent(new Event("input", { bubbles: true }));
  }

  render(){
    return(
      <div>
        <button type="button" onClick={this.handleDecrease}>-</button>
        <input ref={ref => this.inputRef = ref} style={{textAlign:"right"}} type="text" readOnly value={this.props.field.value}/>
        <button type="button" onClick={this.handleIncrease}>+</button>
      </div>
    );
  }
}

FormStore.registerCustomField("Fibonacci", FibonacciField, FibonacciFieldStore);

export default class CustomField extends View{
  constructor(props){
    super(props);

    this.state = {};
  }

  render(){
    return (
      <div>
        <h2>Registering a custom field</h2>
        <p>You can register your own field component at the application level, for this you have to provide a class that inherits
          FormStore.typesMapping.Default (or a subclass of it) and a valid React component</p>

        <h3>Example:</h3>

        <h4>1 - Create a store that extends FormStore.typesMapping.Default (or a subclass of it)</h4>
        <p><em>This allows you to override only the necessary logic and take advantage of what is already available, such a the validation mechanism.</em></p>
        <SyntaxHighlighter  language={"javascript"} style={darcula}>
          {`class FibonacciFieldStore extends FormStore.typesMapping.Default{
  @observable value = 1;
  @observable defaultValue = 1;

  @action
  increaseValue(){
    this.value = this.value + this.previousValue;
  }
  
  @action
  decreaseValue(){
    this.value = this.previousValue;
  }

  @computed
  get previousValue(){
    return Math.round(this.value / ((1+Math.sqrt(5))/2));
  }
}`}
        </SyntaxHighlighter>
        <hr/>

        <h4>2 - Create a React component to display the field</h4>
        <SyntaxHighlighter  language={"javascript"} style={darcula}>
          {`@inject("formStore")
@observer
class FibonacciField extends React.Component{
  handleDecrease = () => {
    this.props.field.decreaseValue();
    this.dispatchChangeEvent();
  }

  handleIncrease = () => {
    this.props.field.increaseValue();
    this.dispatchChangeEvent();
  }

  //This simulates an organic onChange Event to let it bubble up
  dispatchChangeEvent = () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(this.inputRef, this.props.field.value);
    this.inputRef.dispatchEvent(new Event("input", { bubbles: true }));
  }

  render(){
    return(
      <div>
        <button type="button" onClick={this.handleDecrease}>-</button>
        <input ref={ref => this.inputRef = ref} style={{textAlign:"right"}} type="text" readOnly value={this.props.field.value}/>
        <button type="button" onClick={this.handleIncrease}>+</button>
      </div>
    );
  }
}`}
        </SyntaxHighlighter>
        <hr/>

        <h4>3 - Register your custom field to the FormStore class</h4>
        <p><em>You don't need to instantiate a FormStore</em></p>
        <SyntaxHighlighter  language={"javascript"} style={darcula}>
          {`FormStore.registerCustomField("Fibonacci", FibonacciField, FibonacciFieldStore);`}
        </SyntaxHighlighter>
        <hr/>

        <h4>4 - Use your custom field in a complex form or as a SingleField:</h4>
        <View.ShowField definition={{
          type:"Fibonacci"
        }}/>
      </div>
    );
  }
}


