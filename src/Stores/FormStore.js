/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as mobx from "mobx";
import { observable, action } from "mobx";
import { cloneDeep, has, isString, uniqueId, isFunction } from "lodash";
import Validator from "validatorjs";
import React from "react";

import axios from "axios";

import * as Fields from "./Fields";
import optionsStore from "./OptionsStore";

import {components} from "../Components/Field";

const typesMapping = {
  "CheckBox": Fields.CheckBoxField,
  "Toggle": Fields.ToggleField,
  "DropdownSelect": Fields.DropdownSelectField,
  "GroupSelect": Fields.GroupSelectField,
  "InputText": Fields.InputTextField,
  "InputTextMultiple": Fields.InputTextMultipleField,
  "Nested": Fields.NestedField,
  "Select": Fields.SelectField,
  "TextArea": Fields.TextAreaField,
  "TreeSelect": Fields.TreeSelectField,
  "Slider": Fields.Slider,
  "DataSheet": Fields.DataSheetField,
  "Default": Fields.DefaultField
};

let pathNodeSeparator = "/";

/**
 * Mobx store to manage the Form React Component
 * @class FormStore
 * @memberof Stores
 * @namespace FormStore
 * @param {json} structure the underlying form definition
 */
export default class FormStore {
  @observable structure;
  @observable readMode = false;

  fieldsInternalData = new WeakMap();
  generatedKeys = new WeakMap();
  axiosInstance = axios;

  constructor(providedStructure) {
    let structure = cloneDeep(providedStructure);
    this.mapFields(structure.fields);
    this.structure = structure;
  }

  mapFields(fieldsData, basePath = ""){
    Object.keys(fieldsData).forEach(key => {
      let FieldClass = typesMapping[fieldsData[key].type] || Fields.DefaultField;
      fieldsData[key] = new FieldClass(fieldsData[key], this, basePath+pathNodeSeparator+key);
    });
  }

  remapPaths(fieldsData, basePath = ""){
    Object.keys(fieldsData).forEach(key => {
      fieldsData[key].setPath(basePath+pathNodeSeparator+key);
    });
  }

  setFieldInternalData (field, key, value){
    if(this.fieldsInternalData.has(field)){
      this.fieldsInternalData.get(field)[key] = value;
    } else {
      this.fieldsInternalData.set(field, {[key]: value});
    }
  }

  getFieldInternalData (field, key){
    if(this.fieldsInternalData.has(field)){
      return this.fieldsInternalData.get(field)[key];
    }
    return undefined;
  }

  getGeneratedKey (item, namespace){
    if(this.generatedKeys.has(item)){
      if(this.generatedKeys.get(item)[namespace] === undefined){
        this.generatedKeys.get(item)[namespace] = uniqueId(namespace);
      }
    } else {
      this.generatedKeys.set(item, {[namespace]: uniqueId(namespace)});
    }
    return this.generatedKeys.get(item)[namespace];
  }

  /**
   * Get the form field values
   * @memberof Stores.FormStore
   * @return {object} a structured object of the form field values
   */
  getValues(fields, applyMapping = true) {
    if(fields === undefined){
      fields = this.structure.fields;
    }
    let result = {};

    Object.keys(fields).forEach(fieldKey => {
      // We ignore disabled fields
      if(fields[fieldKey].disabled){
        return;
      }

      result[fieldKey] = fields[fieldKey].getValue(applyMapping);
    });

    return result;
  }

  /**
   * Syntaxic shortcut accessor that calls getValues
   * @memberof Stores.FormStore
   */
  get values(){
    return this.getValues();
  }

  @action
  /**
   * Inject values into form fields, must be input the same format as `values`method output
   * @memberof Stores.FormStore
   * @param {object} values structured object of the form field values
   * @param {boolean} merge whether or not to reset the whole form or merge with the passed in values
   * @param {string} path base path for change
   */
  injectValues(values, merge = false, fields){
    if(isString(fields)){
      fields = this.getField(fields);
    } else if(fields === undefined){
      fields = this.structure.fields;
    }
    if( !merge ){
      this.reset( fields );
    }
    Object.keys(values).forEach(fieldKey => {
      let field = fields[fieldKey];
      if(!field){
        return;
      }
      field.injectValue(values[fieldKey]);
    });
  }

  /**
   * Syntaxic shortcut accessor that calls injectValues
   * @memberof Stores.FormStore
   * @param {object} values structured object of the form field values
   */
  set values(values){
    this.injectValues(values);
  }

  @action
  /**
   * @memberof Stores.FormStore
   * @param {string} basePath - optional, base path to reset from
   * Resets the form to their default values from the base path or completely if no path is provided
   */
  reset(fields){
    if(isString(fields)){
      fields = this.getField(fields);
    } else if(fields === undefined){
      fields = this.structure.fields;
    }

    Object.keys(fields).forEach(fieldKey => {
      let field = fields[fieldKey];

      if(!field || field.defaultValue === undefined){
        return;
      }

      field.reset();
    });
  }

  getField(path = "") {
    let pathParts = path.match(new RegExp(`[^${pathNodeSeparator}]+`,"gi")) || [];
    let field = this.structure.fields;

    pathParts.forEach((part, index) => {
      field = field[part];
      if (index < pathParts.length - 1 && field.type === "Nested") {
        field = field.value;
      }
    });

    return field;
  }

  @action
  /**
   * updates the underlying field definition
   * @memberof Stores.FormStore
   * @param {string} path the field path
   * @param {object} updated the updated field definition
   */
  update(path, updated) {
    let field = this.getField(path);
    mobx.set(field, updated);
  }

  /**
   * returns the parent path for a field
   * @memberof Stores.FormStore
   * @param {(string|field)} field can be either be a field path or a field object
   */
  parentPath(field) {
    // this accepts both a path or a field
    // a field has a path property
    let path;
    if (has(field, "path")) {
      path = field.path;
    } else {
      path = field;
    }
    return path.substr(0, path.lastIndexOf(FormStore.getPathNodeSeparator()));
  }

  /**
   * @memberof Stores.FormStore
   * @param {(string|field)} field can be either a field path or a field object
   * @param {string} name name of the sibling
   */
  genSiblingPath(field, name) {
    return this.parentPath(field) + FormStore.getPathNodeSeparator() + name;
  }

  isURL(str) {
    var pattern = new RegExp("^(https?:\\/\\/)?"+ // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|"+ // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))"+ // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+ // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?"+ // query string
    "(\\#[-a-z\\d_]*)?$","i"); // fragment locator
    return pattern.test(str);
  }

  async resolveURL(url, cacheResult = false) {
    //If cacheResult is true then we enter a mode where we try to request a URL only once
    //So if the data is already stored, we just return it
    //Else, if the data is currently fetching, we return the promise that has been created just before starting to fetch
    //That promise gets resolved once the data is actually fetched (optionsStore.pendingPromises.get(url).resolve(data))
    //Else, we create the promise and we try to fetch the data.
    //The promise is shared by all the concurrent requesters after the first one.
    if(cacheResult){
      if(optionsStore.optionsCache.has(url)){
        return optionsStore.optionsCache.get(url);
      } else if(optionsStore.pendingPromises.has(url)) {
        return optionsStore.pendingPromises.get(url).promise;
      } else {
        let storedResolve;
        let storedPromise = new Promise(resolve => {
          storedResolve = resolve;
        });
        optionsStore.pendingPromises.set(url, {promise:storedPromise, resolve: storedResolve});
      }
    }
    try {
      let { data } = await this.axiosInstance.get(url);
      if( cacheResult ){
        optionsStore.optionsCache.set(url, data);
        optionsStore.pendingPromises.get(url).resolve(data);
        optionsStore.pendingPromises.delete(url);
      }
      return data;
    } catch (e) {
      //console.error("error during resolveURL", e);
    }
  }

  /**
   * @memberof Stores.FormStore
   * @param {array} optionsUrls an array of URLs to fetch and put in cache
   */
  static async prefetchOptions(optionsUrls, axiosInstance){
    //Fetch all the options in parralel
    const responses = await Promise.all(optionsUrls.map(
      optionsUrl => (axiosInstance || axios).get(optionsUrl)
    ));
    //When all promises are resolved, store responses in the optionsStore singleton and return responses
    return responses.map((response, index) => {
      optionsStore.setOptions(optionsUrls[index], response.data);
      return response.data;
    });
  }

  @action
  /**
   * validates all form fields at once
   * @memberof Stores.FormStore
   */
  async validate() {
    let fields = this.structure.fields;
    let isFormValid = true;
    for (const fieldKey in fields) {
      let isFieldValid = await fields[fieldKey].validate(true);
      isFormValid = isFieldValid && isFormValid;
    }
    return isFormValid;
  }

  registerCustomValidationFunction(name, func, errorMessage) {
    this.constructor.registerCustomValidationFunction(name, func, errorMessage, this);
  }

  /**
   * registers a custom validation functions that can be used in all fields
   * @param {string} name - a name to uniquely identify the rule
   * @param {function} func - The definition of the validation function. The function parameters are the field value and attribute name. Can be a sync or async function. Expected return value either boolean or promise, indication if validation was successful.
   * @param {string} errorMessage - The error message in case the validation fails
   * @memberof Stores.FormStore
  */
  static registerCustomValidationFunction(name, func, errorMessage, formStore) {
    if (!func || !isFunction(func)) {
      throw `the second parameter "func" must be a function in ${name}`;
    }
    if (!errorMessage) {
      throw `you didn't provide a error message (third parameter) in ${name}`;
    }
    //func is wrapped to so we can accept both sync and async functions without having to use a different syntax to register them as normally done in the validatorjs plugin
    //https://github.com/skaterdav85/validatorjs#asynchronous-validation
    const callback = async (value, attribute, req, passes) => {
      try {
        const result = await func(value, attribute, formStore);
        // check result in case func returns a boolean
        result ? passes() : passes(false, errorMessage);
      } catch(e) {
        // this is to support functions that return promises as well: if promise was rejected the await expression throws an error
        passes(false, errorMessage);
      }
    };
    Validator.registerAsync(name, callback);
  }

  /**
   * registers a custom axios instance - useful for APIs requiring tokens
   * @param {object} axiosInstance - a valid axios instance
   * @memberof Stores.FormStore
  */
  registerAxiosInstance(axiosInstance){
    this.axiosInstance = axiosInstance;
  }

  @action
  /**
  * toggles or force readMode to display form values as pure text instead of input fields
  * @param {boolean} status - optional, a boolean indicating what the readMode state should be. If none is passed then the state is toggled
  * @memberof Stores.FormStore
  */
  toggleReadMode(status){
    if(status !== undefined){
      this.readMode = !!status;
    } else {
      this.readMode = !this.readMode;
    }
  }

  static setPathNodeSeparator(separator){
    if(separator && isString(separator)){
      pathNodeSeparator = separator;
    } else {
      throw "argument must be a non-empty string";
    }
  }

  static getPathNodeSeparator(){
    return pathNodeSeparator;
  }

  static registerCustomField(fieldName, component, fieldStore){
    if(components[fieldName] !== undefined || typesMapping[fieldName] !== undefined){
      throw "Quickfire:registerCustomField: A field with that name is already registered";
    }
    if(!(component.prototype instanceof React.Component)){
      throw "Quickfire:registerCustomField: component parameter must inherit React.Component";
    }
    if(!(fieldStore.prototype instanceof typesMapping.Default)){
      throw "Quickfire:registerCustomField: fieldStore parameter must inherit Formstore.typesMapping.Default";
    }

    components[fieldName] = component;
    typesMapping[fieldName] = fieldStore;
  }
}

FormStore.typesMapping = typesMapping;