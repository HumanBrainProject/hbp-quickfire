/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import { FormGroup, ControlLabel, Button, Glyphicon, Modal, Alert } from "react-bootstrap";
import { isFunction } from "lodash";
import injectStyles from "react-jss";

import Tree from "./Tree";

const styles = {
  values:{
    display:"block",
    height:"auto",
    minHeight:"36px",
    paddingBottom:"3px",
    paddingRight:"36px",
    "& .btn.value-tag":{
      marginRight:"3px",
      marginBottom:"3px"
    },
    "& input":{
      border:"none",
      outline:"none",
      width:"200px",
      maxWidth:"30%",
      marginBottom:"3px"
    },
    "& :disabled":{
      pointerEvents:"none"
    },
    "& [readonly] .quickfire-remove":{
      pointerEvents:"none"
    },
    "&[readonly] .quickfire-user-input, &[disabled] .quickfire-user-input":{
      display:"none"
    }
  },
  valueDisplay:{
    display:"inline-block",
    maxWidth:"200px",
    overflow:"hidden",
    textOverflow:"ellipsis",
    whiteSpace:"nowrap",
    verticalAlign:"bottom"
  },
  valueGroup:{
    marginBottom:"12px",
    "&:last-of-type":{
      marginBottom:"4px"
    },
    "& legend":{
      fontSize:"1.05em",
      fontWeight:"bold",
      marginBottom:"8px"
    }
  },
  remove:{
    fontSize:"0.8em",
    opacity:0.5,
    marginLeft:"3px",
    "&:hover":{
      opacity:1
    }
  },
  openButton:{
    position:"absolute",
    top:0,
    right:0,
    height:"100%",
    margin:"0",
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
    borderRight:"none",
    borderTop:"none",
    borderBottom:"none"
  },
  readMode:{
    "& .quickfire-label:after":{
      content: "':\\00a0'"
    },
    "& .quickfire-readmode-item:not(:last-child):after":{
      content: "',\\00a0'"
    }
  }
};

/**
 * Form component allowing to select multiple values from a tree structure
 * @class TreeSelectField
 * @memberof FormFields
 * @namespace TreeSelectField
 */
@inject("formStore")
@injectStyles(styles)
@observer
export default class TreeSelectField extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      showTree: false
    };
    this.initField();
  }

  async initField() {
    const { field, formStore } = this.props;
    let { dataUrl, cacheDataUrl } = field;
    if (dataUrl) {
      field.updateData(await formStore.resolveURL(dataUrl, cacheDataUrl));
      this.triggerOnLoad();
    }
  }

  triggerOnLoad = () => {
    if(this.hiddenInputRef && this.hiddenInputRef.parentNode){
      var event = new Event("load", { bubbles: true });
      this.hiddenInputRef.dispatchEvent(event);
    }
  }

  //The only way to trigger an onChange event in React is to do the following
  //Basically changing the field value, bypassing the react setter and dispatching an "input"
  // event on a proper html input node
  //See for example the discussion here : https://stackoverflow.com/a/46012210/9429503
  triggerOnChange = () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set
      .call(this.hiddenInputRef, JSON.stringify(this.props.field.getValue(false)));
    var event = new Event("input", { bubbles: true });
    this.hiddenInputRef.dispatchEvent(event);
  }

  handleRemove(value, e){
    let field = this.props.field;
    e.stopPropagation();
    if(field.disabled || field.readOnly){
      return;
    }
    this.beforeRemoveValue(value);
    this.triggerOnChange();
  }

  handleFocus = () => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(field.value.length < field.max || field.max === 1){
      this.setState({showTree: true});
    }
  }

  handleHideModal = () => {
    this.setState({showTree: false});
  }

  handleRemoveBackspace(value, e){
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    //User pressed "Backspace" while focus on a value
    if(e.keyCode === 8){
      e.preventDefault();
      this.beforeRemoveValue(value);
      this.triggerOnChange();
    }
  }

  handleSelect = (node) => {
    let field = this.props.field;
    if(field.disabled || field.readOnly){
      return;
    }
    if(field.value.length < field.max){
      if(field.value.indexOf(node) !== -1){
        this.beforeRemoveValue(node);
      } else {
        this.beforeAddValue(node);
      }
      this.triggerOnChange();
    } else if(field.max === 1){
      this.beforeSetValue(node);
      this.triggerOnChange();
    }
    if(field.value.length >= field.max){
      this.handleHideModal();
    }
  }

  handleDrop(droppedVal, e){
    let field = this.props.field;
    e.preventDefault();
    if(field.disabled || field.readOnly){
      return;
    }
    field.removeValue(this.draggedValue);
    field.addValue(this.draggedValue, field.value.indexOf(droppedVal));
    this.triggerOnChange();
  }

  handleTagInteraction(interaction, value, event){
    if(isFunction(this.props[`onValue${interaction}`])){
      this.props[`onValue${interaction}`](this.props.field, value, event);
    }
  }

  beforeAddValue(value){
    if(isFunction(this.props.onBeforeAddValue)){
      this.props.onBeforeAddValue(() => {this.props.field.addValue(value);}, this.props.field, value);
    } else {
      this.props.field.addValue(value);
    }
  }

  beforeRemoveValue(value){
    if(isFunction(this.props.onBeforeRemoveValue)){
      this.props.onBeforeRemoveValue(() => {this.props.field.removeValue(value);}, this.props.field, value);
    } else {
      this.props.field.removeValue(value);
    }
  }

  beforeSetValue(value){
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(() => {this.props.field.setValue([value]);}, this.props.field, value);
    } else {
      this.props.field.setValue([value]);
    }
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    let { classes, field } = this.props;
    let { label, value, mappingLabel, path, max, mappingChildren, data, selectOnlyLeaf,
      expandToSelectedNodes, disabled, readOnly, defaultExpanded, showOnlySearchedNodes, validationErrors, validationState } = field;

    let valueTags;
    const makeValueTag = (val) => {
      return(
        <div key={this.props.formStore.getGeneratedKey(val, "quickfire-treeselect-values")}
          tabIndex={"0"}
          disabled={disabled}
          readOnly={readOnly}
          title={val[mappingLabel]}
          className={`value-tag quickfire-value-tag btn btn-xs btn-default ${disabled||readOnly? "disabled": ""}`}
          draggable={true}
          onDragEnd={()=>this.draggedValue = null}
          onDragStart={()=>this.draggedValue = val}
          onDragOver={e=>e.preventDefault()}
          onDrop={this.handleDrop.bind(this, val)}
          onKeyDown={this.handleRemoveBackspace.bind(this, val)}

          onClick={this.handleTagInteraction.bind(this, "Click", val)}
          onFocus={this.handleTagInteraction.bind(this, "Focus", val)}
          onBlur={this.handleTagInteraction.bind(this, "Blur", val)}
          onMouseOver={this.handleTagInteraction.bind(this, "MouseOver", val)}
          onMouseOut={this.handleTagInteraction.bind(this, "MouseOut", val)}
          onMouseEnter={this.handleTagInteraction.bind(this, "MouseEnter", val)}
          onMouseLeave={this.handleTagInteraction.bind(this, "MouseLeave", val)}
        >
          <span className={classes.valueDisplay}>
            {isFunction(this.props.valueLabelRendering)?
              this.props.valueLabelRendering(field, val):
              field.transformedValueLabel(val)}
          </span>
          <Glyphicon className={`${classes.remove} quickfire-remove`} glyph="remove" onClick={this.handleRemove.bind(this, val)}/>
        </div>
      );
    };

    if(field.displayValueAsGrouped){
      valueTags = [];
      field.groupedValues.forEach((values, groupNode) => {
        valueTags.push(
          <fieldset className={classes.valueGroup} key={this.props.formStore.getGeneratedKey(groupNode, "quickfire-treeselect-values")}>
            <legend>{field.groupLabels.get(groupNode) || groupNode[mappingLabel]}</legend>
            {values.map(makeValueTag)}
          </fieldset>
        );
      });
    } else {
      valueTags = value.map(makeValueTag);
    }

    return (
      <FormGroup className={`quickfire-field-tree-select ${!value.length? "quickfire-empty-field": ""} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`} validationState={validationState}>
        {label && <ControlLabel className={"quickfire-label"} onClick={this.handleFocus}>{label}</ControlLabel>}
        <div disabled={disabled} readOnly={readOnly} className={`form-control input-group ${classes.values}`} onClick={this.handleFocus}>
          {valueTags}

          <input style={{display:"none"}} type="text" name={"_"+path+"_value"} ref={ref=>this.hiddenInputRef = ref}/>
          <Button className={`${classes.openButton}`}
            disabled={(disabled || readOnly) || (max !== 1 && value.length >= max)}>
            <Glyphicon glyph="list-alt"/></Button>
        </div>

        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}

        <Modal show={this.state.showTree} onHide={this.handleHideModal}>
          <Modal.Header closeButton>
            <ControlLabel>{label}</ControlLabel>
            <div className={`form-control input-group ${classes.values}`}>
              {valueTags}
            </div>
          </Modal.Header>
          <Modal.Body>
            <Tree
              mappingLabel={mappingLabel}
              mappingChildren={mappingChildren}
              data={data || {}}
              onSelect={this.handleSelect}
              selectOnlyLeaf={selectOnlyLeaf}
              selectedNodes={value}
              expandToSelectedNodes={expandToSelectedNodes}
              defaultExpanded={defaultExpanded}
              showOnlySearchedNodes={showOnlySearchedNodes}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button className="quickfire-tree-select-modal-close" onClick={this.handleHideModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </FormGroup>
    );
  }

  renderReadMode(){
    let {
      label,
      value,
      disabled,
      readOnly
    } = this.props.field;

    const { classes } = this.props;

    return (
      <div className={`quickfire-field-tree-select ${!value.length? "quickfire-empty-field": ""} quickfire-readmode ${classes.readMode} ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        {label && <ControlLabel className={"quickfire-label"}>{label}</ControlLabel>}
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <span className={"quickfire-readmode-list"}>
            {value.map(value => {
              return (
                <span key={this.props.formStore.getGeneratedKey(value, "dropdown-read-item")} className={"quickfire-readmode-item"}>
                  {isFunction(this.props.valueLabelRendering)?
                    this.props.valueLabelRendering(this.props.field, value):
                    this.props.field.transformedValueLabel(value)}
                </span>
              );
            })}
          </span>
        }
        <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
      </div>
    );
  }
}
