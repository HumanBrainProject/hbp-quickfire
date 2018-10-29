import { observable, action, toJS } from "mobx";
import { union } from "lodash";
import DefaultField from "./DefaultField";
import FormStore from "../FormStore";

/**
 * @name Options
 * @memberof FormFields.NestedField
 * @param {string} label "" - The field label
 * @param {string} buttonLabel "Add an item" - The label used for adding an item to the repeatable fields
 * @param {string} type "Nested"
 * @param {number} min 1 - min of nested children the field can have
 * @param {number} max 1 - max of nested children the field can have
 * @param {object} fields {} - The nested fields definitions
 * @param {string} value [] - The value of the field
 * @param {array} defaultValue [] - The defaultValue of the field
 * @param {string} path "" - Field path
 * @param {string} topAddButton true - Whether or not to display the Add button before the fields
 * @param {string} bottomAddButton true - Whether or not to display the Add button after the fields
 * @param {boolean} emptyToNull false - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class NestedField extends DefaultField{
  @observable value = [];
  @observable defaultValue = [];
  @observable buttonLabel = "Add an item";
  @observable min = 1;
  @observable max = 1;
  @observable fields = {};
  @observable topAddButton = true;
  @observable bottomAddButton = true;

  __emptyValue = () => [];

  static get properties(){
    return union(super.properties,["value", "defaultValue", "buttonLabel", "min", "max", "fields", "topAddButton", "bottomAddButton"]);
  }

  constructor(fieldData, store, path){
    super(fieldData, store, path);
    this.injectValue(this.value);
  }

  @action
  injectValue(value){
    if(value !== undefined){
      this.registerProvidedValue(value, true);
    }
    this.value = this.__emptyValue();
    let providedValue = this.getProvidedValue();
    providedValue.forEach(value => {
      if(!value || this.value.length >= this.max){
        return;
      }
      this.addInstance();
      this.store.injectValues(value, true, this.value[this.value.length - 1]);
    });

    while(this.min !== Infinity && this.value.length < this.min){
      this.addInstance();
    }
  }

  setPath(path){
    this.path = path;
    this.value.map((fields, index) => {
      this.store.remapPaths(fields, this.path + FormStore.getPathNodeSeparator() + index);
    });
  }

  getValue(applyMapping){
    let value = [];
    this.value.forEach(subfields => {
      value.push(this.store.getValues(subfields, applyMapping));
    });
    return applyMapping? this.mapReturnValue(value): value;
  }

  @action
  /**
   * add a new instance to a nested field
   * @memberof FormFields.NestedField
   */
  addInstance() {
    let instance = toJS(this.fields);
    this.store.mapFields(instance, this.path + FormStore.getPathNodeSeparator() + this.value.length);
    this.value.push(instance);
  }

  @action
  /**
   * duplicates a nested instance at a given index
   * @param {integer} index the instance to duplicate index
   * @memberof FormFields.NestedField
   */
  duplicateInstance(index) {
    let instance = toJS(this.fields);
    this.store.mapFields(instance, this.path + FormStore.getPathNodeSeparator() + (index + 1));
    this.value.splice(index + 1, 0, instance);
    this.store.injectValues(this.store.getValues(this.value[index], false), true, this.path + FormStore.getPathNodeSeparator() + (index + 1));
    this.setPath(this.path);
  }

  @action
  /**
   * move a nested instance at a given index to a new given index
   * @param {integer} index the instance to move
   * @param {integer} newIndex the index that instance will have
   * @memberof FormFields.NestedField
   */
  moveInstance(index, newIndex) {
    if(newIndex < index){
      let removedInstance = this.value.splice(index, 1);
      this.value.splice(newIndex, 0, removedInstance[0]);
    } else if(newIndex > index){
      this.value.splice(newIndex + 1, 0, this.value[index]);
      this.value.splice(index, 1);
    }
    this.setPath(this.path);
  }

  @action
  /**
   * removes a nested instance at a given index
   * @param {integer} index the instance to remove index
   * @memberof FormFields.NestedField
   */
  removeInstance(index) {
    this.value.splice(index, 1);
    this.setPath(this.path);
  }

  @action
  async validate(validateChildren=false) {
    if (!validateChildren) {
      return true;
    }
    let children = this.value;
    let success = true;
    for (let child of children) {
      for (let fieldKey in child) {
        let fieldStatus;
        fieldStatus = await child[fieldKey].validate(validateChildren);
        success = fieldStatus && success;
      }
    }
    return success;
  }
}