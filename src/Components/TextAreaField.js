/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
