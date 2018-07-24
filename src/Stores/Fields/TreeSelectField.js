import { observable, toJS, action } from "mobx";
import { isString, isNumber, find, union } from "lodash";
import DefaultField from "./DefaultField";

/**
 * @memberof FormFields.TreeSelectField
 * @name Options
 * @param {string} label "" - The field label
 * @param {string} type "TreeSelect"
 * @param {array} value [] - The current value of the field
 * @param {array} defaultValue [] - The defaultValue of the field
 * @param {array} data {} - The tree structure to select from, must be an object with eventually an array of children
 * @param {array} dataUrl null - url to fetch the tree structure from
 * @param {string} cacheDataUrl false - whether to cache dataUrl fetching response
 * @param {string} path "" - Field path
 * @param {string | array} mappingValue "value" - The name(s) of the node object field(s) related to the node value, used to match passed in values to actual tree nodes
 * @param {string} mappingLabel "label" - the name of the node object field related to the node label
 * @param {string} mappingChildren "children" - the name of the node object field related to the node children
 * @param {string} mappingReturn null - the property of the option object used to return the value(s) - null will return the whole object
 * @param {boolean} returnSingle boolean - wether or not to return the first value or an array of values
 * @param {number} max Infinity - Maximum values that the field can have
 * @param {boolean} selectOnlyLeaf false - If enabled, only leaves can be selected and not the intermediary nodes
 * @param {boolean} expandToSelectedNodes false - If enabled, tree selection modal will recursively expand to all the already selected values
 * @param {array} defaultExpanded [] - an array of arrays describing a path of nodes expanded by default (tested on node labels, path parts are considered as RegExp)
 * @param {boolean} showOnlySearchedNodes false - Flag that determines if nodes that doesn't match the text search should be hidden
 * @param {boolean} emptyToNull false - Flag that determines if empty values are transformed to null in the value function of the formStore
 * @param {boolean} disabled false - Is the field disabled or not, a disabled field won't be editable or processed by FormStore.getValues()
 * @param {boolean} readOnly false - Is the field readOnly or not, a readOnly field won't be editable but will be processed by FormStore.getValues()
 * @param {boolean} readMode false - If true, displays the field as label and value without the actual form input
 */

export default class TreeSelectField extends DefaultField{
  @observable value = [];
  @observable defaultValue = [];
  @observable data = null;
  @observable dataUrl = null;
  @observable cacheDataUrl = false;
  @observable mappingValue = "value";
  @observable mappingLabel = "label";
  @observable mappingChildren = "children";
  @observable mappingReturn = null;
  @observable returnSingle = false;
  @observable max = Infinity;
  @observable selectOnlyLeaf = false;
  @observable expandToSelectedNodes = false;
  @observable defaultExpanded = [];
  @observable showOnlySearchedNodes = false;
  @observable valueLabelTransform = {
    search: "",
    replace: ""
  }

  nodeParents = new Map();

  __emptyValue = () => [];

  static get properties(){
    return union(super.properties,[
      "value", "defaultValue", "data", "dataUrl", "cacheDataUrl", "mappingValue", "mappingLabel", "mappingChildren",
      "mappingReturn", "returnSingle", "max", "selectOnlyLeaf", "expandToSelectedNodes","defaultExpanded",
      "showOnlySearchedNodes", "valueLabelTransform"
    ]);
  }

  constructor(fieldData, store, path){
    super(fieldData, store, path);
    //If no data are provided, we make it an empty object
    //Cannot set this as default value for property since it's an observable
    //We need mobx to consider making the whole provided object to an observable
    //That's why it's initialized no null
    if(!this.data){
      this.data = {};
    } else {
      this.updateNodeParentsMap();
    }
    this.injectValue(this.value);
  }

  getValue(applyMapping){
    let result = this.value.map(node => {
      let nodeClone = toJS(node);
      if(nodeClone.children !== undefined){
        delete nodeClone.children;
      }
      return nodeClone;
    });
    return applyMapping? this.mapReturnValue(result): result;
  }

  //Looks for a match recursively, stops at the first match
  rfind(nodes, testCb) {
    let foundNode = find(nodes, testCb);

    if(!foundNode){
      find(nodes, node => {
        if(node[this.mappingChildren] && node[this.mappingChildren].length){
          foundNode = this.rfind(node[this.mappingChildren], testCb, this.mappingChildren);
        }
        return !!foundNode;
      });
    }
    return foundNode;
  }

  transformedValueLabel(node){
    if(this.valueLabelTransform.search){
      let label = this.getNodePathOf(node).map((parentNode) => parentNode[this.mappingLabel]).join(" > ");
      return label.replace(new RegExp(this.valueLabelTransform.search, "gi"), this.valueLabelTransform.replace);
    }
    return node[this.mappingLabel];
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
      let match;

      //Below are the tests to find matches in the tree structure for each provided value
      //If the provided value is scalar then we check against the mappingValue property(ies) of each
      //node (and stop at the first match). Each mappingValue property has to match the scalar value (edge case)
      //If the provided value is an object then we check against the mappingValue property(ies) of each
      //node (and stop at the first match). Each mappingValue property has to match its respective counterpart in the node object
      if(isString(value) || isNumber(value)){
        match = this.rfind([this.data], node =>
          isString(this.mappingValue) || isNumber(this.mappingValue)
            ? node[this.mappingValue] === value
            : this.mappingValue.every(prop => node[prop] === value)

          , this.mappingChildren);
      } else if(value != null){
        match = this.rfind([this.data], node =>
          isString(this.mappingValue) || isNumber(this.mappingValue)
            ? node[this.mappingValue] === value[this.mappingValue]
            : this.mappingValue.every(prop => node[prop] && value[prop] && node[prop] === value[prop])

          , this.mappingChildren);
      }
      if(match){
        this.addValue(match);
      }
    });
  }

  @action updateData(data){
    this.data = data;
    this.updateNodeParentsMap();
    this.injectValue();
  }

  @action updateNodeParentsMap(){
    this.nodeParents = new Map();
    let mapNodesToParent = parentNode => {
      if(parentNode.children){
        parentNode.children.forEach(childNode => {
          this.nodeParents.set(childNode, parentNode);
          mapNodesToParent(childNode);
        });
      }
    };
    mapNodesToParent(this.data);
  }

  @action getNodeParentOf(node){
    if(this.nodeParents.has(node)){
      return this.nodeParents.get(node);
    } else {
      return null;
    }
  }

  @action getNodePathOf(node){
    let path = [node];
    let parentNode = node;
    while((parentNode = this.getNodeParentOf(parentNode)) !== null){
      path.unshift(parentNode);
    }
    return path;
  }
}