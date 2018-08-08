import { observable, action, toJS } from "mobx";
import { union, remove } from "lodash";
import DefaultField from "./DefaultField";

/**
 * @memberof FormFields.DataSheetField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} type "DataSheet"
 * @param {array} value [] - The current value of the field
 * @param {array} defaultValue [] - The defaultValue of the field
 * @param {array} headers  [] - The headers of the datasheet, must be an array of objects dscribing at least a "label" and a "key" property
 * @param {string} path "" - Field path
 * @param {number} min 0 - Minimum rows that the field can have
 * @param {number} max Infinity - Maximum rows that the field can have
 * @param {boolean} emptyToNull false - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class DataSheetField extends DefaultField{
  @observable value = [];
  @observable defaultValue = [];
  @observable headers = [];
  @observable min = 0;
  @observable max = Infinity;
  @observable rowControlRemove = true;
  @observable rowControlMove = true;
  @observable rowControlDuplicate = true;
  @observable rowControlAdd = true;

  __emptyValue = () => [];

  static get properties(){
    return union(super.properties, ["value", "defaultValue", "headers", "min", "max", "rowControlRemove",
      "rowControlMove", "rowControlDuplicate", "rowControlAdd"]);
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
      let newRow = {};
      this.headers.forEach(header => {
        if(value[header.key] !== undefined){
          newRow[header.key] = value[header.key];
        } else {
          newRow[header.key] = header.defaultValue !== undefined? header.defaultValue: "";
        }
      });
      this.value.push(newRow);
    });
  }

  @action
  applyChanges(changes, outOfScopeChanges){
    changes.forEach(change => {
      change.cell.row[change.cell.key] = change.value;
    });
    outOfScopeChanges.forEach(change => {
      if(change.row > this.value.length - 1 && this.value.length < this.max){
        this.addRow();
      }
      let colValue = this.headers.filter(header => header.show !== false)[change.col];
      if(colValue !== undefined && colValue.key !== undefined && colValue.readOnly !== true && change.row < this.value.length){
        this.value[change.row][colValue.key] = change.value;
      }
    });
  }

  @action
  addRow(index){
    let newRow = {};
    this.headers.forEach(header => {
      newRow[header.key] = header.defaultValue !== undefined? header.defaultValue: "";
    });
    if(index === undefined){
      this.value.push(newRow);
    } else {
      this.value.splice(index, 0, newRow);
    }
  }

  @action
  removeRow(row){
    remove(this.value, value =>{ return value === row;});
  }

  @action
  moveRow(index, newIndex) {
    if(newIndex < index){
      let removedRow = this.value.splice(index, 1);
      this.value.splice(newIndex, 0, removedRow[0]);
    } else if(newIndex > index){
      this.value.splice(newIndex + 1, 0, this.value[index]);
      this.value.splice(index, 1);
    }
  }

  @action
  duplicateRow(index) {
    let newRow = toJS(this.value[index]);
    this.headers.forEach(header => {
      if(header.duplicatedValue !== undefined){
        newRow[header.key] = header.duplicatedValue;
      }
    });
    this.value.splice(index + 1, 0, newRow);
  }
}