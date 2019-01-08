/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import { FormGroup, Glyphicon, Alert, Button, DropdownButton, MenuItem } from "react-bootstrap";
import ReactDataSheet from "react-datasheet";
import injectStyles from "react-jss";
import { isFunction } from "lodash";

import SingleField from "./SingleField";
import FieldLabel from "./FieldLabel";
import { isArray, isObject } from "lodash";

const styles = {
  "@global":{
    "span.data-grid-container, span.data-grid-container:focus": ` 
      outline: none;
    `,

    ".data-grid-container .data-grid": ` 
      table-layout: fixed;
      border-collapse: collapse;
      width:100%;
    `,

    ".data-grid-container .data-grid .cell.updated": ` 
        background-color: rgba(0, 145, 253, 0.16);
        transition : background-color 0ms ease ;
    `,

    ".data-grid-container .data-grid .cell": ` 
      height: 17px;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      cursor: cell;
      background-color: white;
      transition : background-color 500ms ease;
      vertical-align: top;
      text-align: left;
      border: 1px solid #DDD;
      padding: 0;
    `,

    ".data-grid-container .data-grid .cell.selected": ` 
      border: 1px double rgb(33, 133, 208);
      transition: none;
      box-shadow: inset 0 -1000px 0 rgba(33, 133, 208, 0.15);
    `,

    ".quickfire-field-data-sheet:not(.quickfire-readmode) .data-grid-container .data-grid .cell.read-only, .data-grid-container .data-grid th.cell.read-only": ` 
      background: whitesmoke;
      color: #999;
      text-align: center;
      font-weight: normal;
    `,

    ".data-grid-container .data-grid .cell > .text": ` 
      padding: 2px 5px;
      text-overflow: ellipsis;
      overflow: hidden;
    `,

    ".data-grid-container .data-grid .cell > input": ` 
      outline: none !important;
      border: 1px solid rgb(33, 133, 208);
      text-align:right;
      width: 100%;
      height: 100%;
      background: none;
      display: block;
    `,

    ".data-grid-container .data-grid .cell, .data-grid-container .data-grid.wrap .cell, .data-grid-container .data-grid.wrap .cell.wrap, .data-grid-container .data-grid .cell.wrap, .data-grid-container .data-grid.nowrap .cell.wrap, .data-grid-container .data-grid.clip .cell.wrap": ` 
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;

      -webkit-hyphens: auto;
      -moz-hyphens: auto;
      hyphens: auto;
    `,

    ".data-grid-container .data-grid.nowrap .cell, .data-grid-container .data-grid.nowrap .cell.nowrap, .data-grid-container .data-grid .cell.nowrap, .data-grid-container .data-grid.wrap .cell.nowrap, .data-grid-container .data-grid.clip .cell.nowrap": ` 
      white-space: nowrap;
      overflow-x: visible;
    `,

    ".data-grid-container .data-grid.clip .cell, .data-grid-container .data-grid.clip .cell.clip, .data-grid-container .data-grid .cell.clip, .data-grid-container .data-grid.wrap .cell.clip, .data-grid-container .data-grid.nowrap .cell.clip": ` 
      white-space: nowrap;
      overflow-x: hidden;
    `,

    ".data-grid-container .data-grid .cell .value-viewer, .data-grid-container .data-grid .cell .data-editor": ` 
      padding: 2px 4px;
      display: block;
      min-height:24px;
    `,

    ".data-grid-container .data-grid .action-header": {
      width:"23px"
    },

    ".data-grid-container .data-grid .action-cell": {
      background:"white",
      border: "1px solid #DDD",
      "& .dropdown-toggle":{
        border:"none",
        borderRadius:"0"
      },
      "& .dropdown-menu":{
        left: "auto",
        right: 0
      }
    }
  },
  btnAddRow:{
    marginTop:"12px"
  },
  textareaLine:{
    "&:empty::before":{
      content:"'\\00a0'"
    }
  }
};

/**
 * Form component allowing to edit a spreadsheet-like data
 * It uses the react-datasheet npm package to display to field
 * @class DataSheetField
 * @memberof FormFields
 * @namespace DataSheetField
 */

@inject("formStore")
@injectStyles(styles)
@observer
export default class DataSheetField extends React.Component {
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

  handleCellChange = (changes, outOfScopeChanges) => {
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    const proceed = () => {
      field.applyChanges(changes, outOfScopeChanges);
      this.triggerOnChange();
    };
    if(isFunction(this.props.onBeforeSetValue)){
      this.props.onBeforeSetValue(proceed, field, changes, outOfScopeChanges);
    } else {
      proceed();
    }
  }

  handleAddRow = () => {
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    if(field.value.length < field.max){
      const proceed = () => {
        field.addRow();
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeAddRow)){
        this.props.onBeforeAddRow(proceed, field);
      } else {
        proceed();
      }
    }
  }

  handleRemoveRow(row, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(field.value.length > field.min){
      const proceed = () => {
        field.removeRow(row);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeRemoveRow)){
        this.props.onBeforeRemoveRow(proceed, field, row);
      } else {
        proceed();
      }
    }
  }

  handleMoveUpRow(rowIndex, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(rowIndex > 0){
      const proceed = () => {
        field.moveRow(rowIndex, rowIndex-1);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeMoveUpRow)){
        this.props.onBeforeMoveUpRow(proceed, field, rowIndex);
      } else {
        proceed();
      }
    }
  }

  handleMoveDownRow(rowIndex, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(rowIndex < field.value.length - 1){
      const proceed = () => {
        field.moveRow(rowIndex, rowIndex+1);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeMoveDownRow)){
        this.props.onBeforeMoveDownRow(proceed, field, rowIndex);
      } else {
        proceed();
      }
    }
  }

  handleDuplicateRow(rowIndex, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(field.value.length < field.max){
      const proceed = () => {
        this.props.field.duplicateRow(rowIndex);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeDuplicateRow)){
        this.props.onBeforeDuplicateRow(proceed, field, rowIndex);
      } else {
        proceed();
      }
    }
  }

  handleAddRowAbove(rowIndex, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(field.value.length < field.max){
      const proceed = () => {
        this.props.field.addRow(rowIndex);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeAddRow)){
        this.props.onBeforeAddRow(proceed, field, rowIndex);
      } else {
        proceed();
      }
    }
  }

  handleAddRowBelow(rowIndex, e){
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    e.stopPropagation();
    if(field.value.length < field.max){
      const proceed = () => {
        this.props.field.addRow(rowIndex+1);
        this.triggerOnChange();
      };
      if(isFunction(this.props.onBeforeAddRow)){
        this.props.onBeforeAddRow(proceed, field, rowIndex+1);
      } else {
        proceed();
      }
    }
  }

  handleChange(e){
    e.preventDefault();
  }

  handleKeyDown = (e) => {
    const { field, formStore } = this.props;
    if(field.readOnly || field.disabled || field.readMode || formStore.readMode){
      return;
    }
    if(e.target.matches("input, textarea, select") //We are in the input of editing mode
    && e.keyCode === 13 //We pressed "Enter"
    && this.dataSheetRef.state.end.i !== undefined
    && this.dataSheetRef.state.end.i === field.value.length-1
    && field.value.length < field.max){
      field.addRow();
      //Set state of the child component to manually change the selected position
      //Without havind to go in full control mode of the position.
      this.dataSheetRef.setState({
        start:{i:this.dataSheetRef.state.end.i+1, j:this.dataSheetRef.state.end.j},
        end:{i:this.dataSheetRef.state.end.i+1, j:this.dataSheetRef.state.end.j}
      });
      this.triggerOnChange();
    } else if(e.keyCode === 9//We pressed "Tab"
    && !e.shiftKey//But not shift + Tab
    && this.dataSheetRef.state.end.i !== undefined
    && this.dataSheetRef.state.end.i === field.value.length-1
    && this.dataSheetRef.state.end.j !== undefined
    && this.dataSheetRef.state.end.j === field.headers.filter(header => header.show !== false).length-1
    && field.value.length < field.max){
      e.preventDefault();
      field.addRow();
      //Set state of the child component to manually change the selected position
      //Without havind to go in full control mode of the position.
      this.dataSheetRef.setState({
        start:{i:this.dataSheetRef.state.end.i+1, j:0},
        end:{i:this.dataSheetRef.state.end.i+1, j:0}
      });
      this.triggerOnChange();
    } else if(e.keyCode === 113
    && this.dataSheetRef.state.start.i !== undefined
    && this.dataSheetRef.state.start.j !== undefined
    && field.headers.filter(header => header.show !== false)[this.dataSheetRef.state.end.j].readOnly !== true){
      this.dataSheetRef.setState({
        editing:{i:this.dataSheetRef.state.start.i, j:this.dataSheetRef.state.start.j}
      });
      this.triggerOnChange();
    }
  }

  keyGenerator = (row) => {
    return this.props.formStore.getGeneratedKey(this.props.field.value[row], "DataSheetFieldRow");
  }

  renderCell = ({cell}) => {
    let result = null;
    const { classes } = this.props;
    if(cell.header.field && cell.header.field.type === "TextArea"){
      result = cell.value.split("\n").map((line, index) => <div className={classes.textareaLine} key={index}>{line}</div>);
    } else {
      result = toJS(cell.value);
      if(!isArray(result)){
        result = [result];
      }
      result = result.map(value => isObject(value)? value[(cell.header.field && cell.header.field.mappingLabel) || "label"]: value).join(", ");
    }
    return (
      <div className="value-viewer">
        { result }
      </div>
    );
  }

  renderRow = (props) => {
    const { field, formStore } = this.props;
    const { rowControlRemove, rowControlMove, rowControlDuplicate, rowControlAdd, readOnly, disabled } = field;
    return (
      <tr>
        {props.children}
        {(rowControlRemove || rowControlMove || rowControlDuplicate || rowControlAdd)
        && !readOnly && !disabled && !field.readMode && !formStore.readMode && props.cells[0].row?
          <td className={"action-cell"}>
            <DropdownButton
              bsSize="xsmall"
              title={<Glyphicon glyph={"menu-hamburger"}/>}
              id={`row-actions-${props.row}`}
              noCaret
            >
              {rowControlMove? <MenuItem disabled={props.row <= 0} onClick={this.handleMoveUpRow.bind(this, props.row)}><Glyphicon glyph="arrow-up"/>&nbsp;Move up</MenuItem>:null}
              {rowControlMove? <MenuItem disabled={props.row >= field.value.length - 1} onClick={this.handleMoveDownRow.bind(this, props.row)}><Glyphicon glyph="arrow-down"/>&nbsp;Move down</MenuItem>:null}
              {rowControlMove && (rowControlDuplicate || rowControlRemove || rowControlAdd)? <MenuItem divider />:null}
              {rowControlDuplicate? <MenuItem disabled={field.value.length >= field.max} onClick={this.handleDuplicateRow.bind(this, props.row)}><Glyphicon glyph="duplicate"/>&nbsp;Duplicate</MenuItem>:null}
              {rowControlDuplicate && (rowControlRemove || rowControlAdd)? <MenuItem divider />:null}
              {rowControlRemove? <MenuItem disabled={field.value.length <= field.min} onClick={this.handleRemoveRow.bind(this, props.cells[0].row)}><Glyphicon glyph="trash"/>&nbsp;Delete</MenuItem>:null}
              {rowControlRemove && rowControlAdd? <MenuItem divider />:null}
              {rowControlAdd? <MenuItem disabled={field.value.length >= field.max} onClick={this.handleAddRowAbove.bind(this, props.row)}><Glyphicon glyph="plus"/>&nbsp;Add a new row above</MenuItem>:null}
              {rowControlAdd? <MenuItem disabled={field.value.length >= field.max} onClick={this.handleAddRowBelow.bind(this, props.row)}><Glyphicon glyph="plus"/>&nbsp;Add a new row below</MenuItem>:null}
            </DropdownButton>
          </td>
          :null}
      </tr>
    );
  }

  renderDataEditor = props => (<FieldEditor {...props}/>);

  renderSheet = props => {
    const { field, formStore } = this.props;
    const { rowControlRemove, rowControlMove, rowControlDuplicate, rowControlAdd, readOnly, disabled } = field;
    return (
      <table className={props.className}>
        <thead>
          <tr>
            {field.headers.map(header => {
              if(header.show !== false){
                return <th key={header.key} className={"cell read-only"} style={{width:header.width}}>{header.label}</th>;
              }
            }).filter(cell => cell !== undefined)}
            {(rowControlRemove || rowControlMove || rowControlDuplicate || rowControlAdd)
              && !readOnly && !disabled && !field.readMode && !formStore.readMode? <th className={"action-header"} />: null}
          </tr>
        </thead>
        <tbody>
          {props.children}
        </tbody>
      </table>
    );
  };

  prepareData(){
    const grid = [];
    const { field, formStore } = this.props;
    const { value: values, headers, disabled, readOnly } = field;

    values.forEach((value) => {
      grid.push(headers.map(header => {
        if(header.show !== false){
          return {
            value: value[header.key],
            row: value,
            key: header.key,
            header: header,
            readOnly: disabled || readOnly || field.readMode || formStore.readMode || !!header.readOnly
          };
        }
      }).filter(cell => cell !== undefined));
    });

    return grid;
  }

  render() {
    if(this.props.formStore.readMode || this.props.field.readMode){
      return this.renderReadMode();
    }

    const { field, classes } = this.props;
    const { value: values, disabled, readOnly, validationState, validationErrors, max, clipContent } = field;

    const grid = this.prepareData();

    return (
      <FormGroup
        className={`quickfire-field-data-sheet ${!values.length? "quickfire-empty-field": ""}  ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}
        validationState={validationState}>
        <FieldLabel field={this.props.field}/>

        <div>
          <div className={"quickfire-data-sheet-container"} onChange={this.handleChange} onKeyDown={this.handleKeyDown}>
            <ReactDataSheet
              ref={ref => this.dataSheetRef = ref}
              overflow={clipContent?"clip":"wrap"}
              data={grid}
              valueRenderer={cell => cell.value}
              valueViewer={this.renderCell}
              onCellsChanged={this.handleCellChange}
              rowRenderer={this.renderRow}
              sheetRenderer={this.renderSheet}
              keyFn={this.keyGenerator}
              dataEditor={this.renderDataEditor}
            />
            <Button disabled={values.length >= max || readOnly || disabled} bsClass={`${classes.btnAddRow} quickfire-data-sheet-add-button btn btn-primary btn-xs`} onClick={this.handleAddRow}>Add a row</Button>
          </div>
          <input style={{display:"none"}} type="text" ref={ref=>this.hiddenInputRef = ref}/>
        </div>

        {validationErrors && <Alert bsStyle="danger">
          {validationErrors.map(error => <p key={error}>{error}</p>)}
        </Alert>}

      </FormGroup>
    );
  }

  renderReadMode(){
    const {field} = this.props;
    const {value, disabled, readOnly, clipContent} = field;
    const grid = this.prepareData();

    return (
      <div className={`quickfire-field-data-sheet ${!value.length? "quickfire-empty-field":""} quickfire-readmode ${disabled? "quickfire-field-disabled": ""} ${readOnly? "quickfire-field-readonly": ""}`}>
        <FieldLabel field={this.props.field}/>
        {isFunction(this.props.readModeRendering)?
          this.props.readModeRendering(this.props.field)
          :
          <div className={"quickfire-data-sheet-container"}>
            <ReactDataSheet
              ref={ref => this.dataSheetRef = ref}
              overflow={clipContent?"clip":"wrap"}
              data={grid}
              valueRenderer={this.renderCell}
              rowRenderer={this.renderRow}
              sheetRenderer={this.renderSheet}
              keyFn={this.keyGenerator}
            />
          </div>
        }
      </div>
    );
  }
}

const editorStyle = {
  container:{
    "& .form-group":{
      marginBottom: 0
    },
    "& .form-control":{
      borderRadius: 0,
      padding: "1px 4px",
      height:"auto"
    },
    "& select.form-control":{
      appearance:"none"
    }
  }
};

@injectStyles(editorStyle)
class FieldEditor extends React.Component{
  handleChange = () => {
    this.props.onChange(this.fieldRef.field.getValue());
  }

  componentDidMount(){
    this.containerRef.querySelectorAll("input, select, textarea")[0].focus();
    this.handleChange();
  }

  handleKeyDown = e => {
    let isTextArea = this.props.cell.header.field && this.props.cell.header.field.type === "TextArea";
    let isInputTextMultiple = this.props.cell.header.field && this.props.cell.header.field.type === "InputTextMultiple";
    let isDropdownSelect = this.props.cell.header.field && this.props.cell.header.field.type === "DropdownSelect";
    if(e.keyCode !== 13 || (!isTextArea && !isInputTextMultiple && !isDropdownSelect)){
      this.props.onKeyDown(e);
    } else {
      e.stopPropagation();
    }
  }

  render(){
    const {value, classes, cell} = this.props;
    let field = cell.header.field !== undefined? toJS(cell.header.field): {type:"InputText"};

    field.cacheOptionsUrl = field.cacheOptionsUrl !== undefined? field.cacheOptionsUrl: true;
    field.cacheDataUrl = field.cacheDataUrl !== undefined? field.cacheOptionsUrl: true;
    field.value = toJS(value);

    return (
      <div ref={ref => this.containerRef = ref} className={`quickfire-data-sheet-editor-field ${classes.container}`}>
        <SingleField
          {...field}
          ref={ref => this.fieldRef = ref}
          onChange={this.handleChange}
          onLoad={this.handleChange}
          onKeyDown={this.handleKeyDown}/>
      </div>
    );
  }
}