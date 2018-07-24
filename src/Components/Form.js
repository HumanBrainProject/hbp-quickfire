import React from "react";
import { observer, Provider } from "mobx-react";

/**
 * Form component that wraps the underlying Fields
 * @class Form
 * @property {object} store required - An instance of the FormStore class
 */

@observer
export default class Form extends React.Component {
  constructor(props) {
    super(props);
    if (!props.store) {
      throw "Form Component must receive a FormStore instance";
    }
  }

  render() {
    return (
      <Provider formStore={this.props.store} parentPath="">
        <form className={"quickfire-form"}>{this.props.children}</form>
      </Provider>
    );
  }

  /**
   * Get the form field values
   * @return {object} a structured object of the form field values
   */
  get values() {
    return this.props.store.getValues();
  }
}
