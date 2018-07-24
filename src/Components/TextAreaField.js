import React from "react";
import InputTextField from "./InputTextField";

/**
 * Textarea input field.
 * Field options are the same as for the InputTextField
 * @class TextAreaField
 * @memberof FormFields
 * @namespace TextAreaField
 */

const TextAreaField = props => {
  return <InputTextField {...props} componentClass="textarea" />;
};

export default TextAreaField;
