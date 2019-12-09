/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import injectStyles from "react-jss";
import {FormControl, FormGroup, Glyphicon, InputGroup, Button, Label} from "react-bootstrap";

import { intersection, find, isString } from "lodash";

export default class Tree extends React.Component {

  static defaultProps = {
    mappingLabel: "label",
    mappingChildren: "children",
    selectOnlyLeaf: false,
    selectedNodes: [],
    expandToSelectedNodes: false,
    defaultExpanded: []
  };

  state = {query:null, queryInput:""};
  //Timer identifier bound to the triggering of the search into the tree structure
  //Gets reset if a key is stroke by user before the end of the timer
  //Is triggered if no keys are stroke before the end of the timer
  //Limits the number of time the search is done on the entire tree structure
  timer = null;

  render() {
    let defaultExpanded = this.props.defaultExpanded;
    if(!defaultExpanded || defaultExpanded.length === undefined){
      defaultExpanded = [];
    } else if(defaultExpanded.length > 0 && isString(defaultExpanded[0])){
      defaultExpanded = [defaultExpanded];
    }

    return (
      <div className="quickfire-tree">
        <FormGroup controlId="Tree Node Search" className="quickfire-tree-search">
          <InputGroup>
            <InputGroup.Addon>
              <Glyphicon glyph="search" />
            </InputGroup.Addon>
            <FormControl type="text"
              className={"quickfire-tree-search-input"}
              placeholder="Search"
              onChange={this.handleChange.bind(this)}
              value={this.state.queryInput}/>
            <InputGroup.Button>
              <Button onClick={this.reset.bind(this)}><Glyphicon glyph="remove" /></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        <TreeNode
          data={this.props.data}
          onSelect={this.props.onSelect}
          query={this.state.query}
          mappingLabel={this.props.mappingLabel}
          mappingChildren={this.props.mappingChildren}
          selectOnlyLeaf={this.props.selectOnlyLeaf}
          selectedNodes={this.props.selectedNodes}
          expandToSelectedNodes={this.props.expandToSelectedNodes}
          defaultExpanded={defaultExpanded}
          showOnlySearchedNodes={this.props.showOnlySearchedNodes}
          level={0}
        />
      </div>
    );
  }

  handleChange(e){
    e.stopPropagation();
    const self = this;
    const newQuery = e.target.value;
    self.setState({queryInput: e.target.value});
    if(this.timer){
      clearTimeout(this.timer);
    }
    let newQueryRegexp;
    try{
      //We use a regexp to search into the serialized tree structure as it's fast and practical to be able to use a regexp for search
      newQueryRegexp = newQuery.length >= 1? new RegExp(":\".*?"+newQuery+".*?\"","i"): null;
      this.timer = setTimeout(function(){
        self.setState({query: newQueryRegexp});
      }, 750);
    }
    catch(e){ ""; } //Silent fail is intended to prevent errors thrown during the type of a regexp by the user
  }

  reset(){
    this.setState({query: null, queryInput: ""});
  }

}


let treeNodeStyles = {
  node:{
    listStyleType:"none",
    "& .quickfire-tree-node-selector":{
      marginLeft:"3px"
    },
    "& .quickfire-tree-node-expand:focus":{
      outline:"none"
    },
    "&.hidden":{
      display:"none"
    }
  },
  childrenList:{
    marginLeft:"20px",
    paddingLeft:0
  },
  leafPlaceHolder:{
    width:"23px",
    display:"inline-block"
  },
  labelSelected:{
    display: "inline-block",
    marginRight: "4px",
    padding: "2px 3px 3px 2px",
    fontSize: "0.6em",
    verticalAlign: "middle"
  }
};

@injectStyles(treeNodeStyles)
class TreeNode extends React.Component {

  constructor(props) {
    super(props);
    this.matchesExpanded = [];
    if(props.expandToSelectedNodes && this.hasSelectedChildren(props.data)){
      this.state = {expand: true};
    } else if(props.query && props.data.children){
      this.state = {expand: props.query.test(JSON.stringify(props.data.children))};
    } else if(this.matchDefaultExpanded()){
      this.state = {expand: true};
    } else {
      this.state = {expand: false};
    }
  }

  matchDefaultExpanded(){
    this.matchesExpanded = [];
    if(this.props.defaultExpanded && this.props.defaultExpanded.length > 0){
      this.props.defaultExpanded.forEach(path => {
        if(path.length > this.props.level && (new RegExp(path[this.props.level],"gi")).test(this.props.data[this.props.mappingLabel])){
          this.matchesExpanded.push(path);
        }
      });
    }
    return this.matchesExpanded.length > 0;
  }

  hasSelectedChildren(node){
    return (node.children !== undefined && node.children.length !== 0) &&
      (intersection(this.props.selectedNodes, node.children).length > 0 ||
      find(node.children, child => this.hasSelectedChildren(child)));
  }

  render() {
    let { classes, data, mappingLabel, mappingChildren, selectOnlyLeaf, selectedNodes, expandToSelectedNodes, showOnlySearchedNodes } = { ...this.props };

    let hideThisNode = false;
    //showOnlySearchedNodes: If search doesnt match the node and we want to hide parts of the tree that are not relevant to the search
    if(showOnlySearchedNodes && this.props.query){
      let dataCopy = JSON.parse(JSON.stringify(data));
      if(dataCopy[mappingChildren]){
        delete dataCopy[mappingChildren];
      }
      let match = this.props.query.test(JSON.stringify(dataCopy));
      if(!match && !this.state.expand){
        hideThisNode = true;
      } else if(match && this.state.expand){
        showOnlySearchedNodes = false;
      }
    }

    const label = data[mappingLabel];

    let children = undefined;

    let isSelected = this.props.selectedNodes.indexOf(this.props.data) !== -1;

    if (data[mappingChildren] && data[mappingChildren].length !== undefined) {
      if(this.state.expand){
        children = data[mappingChildren].map((child, index) => {
          return (
            <TreeNode
              data={child}
              onSelect={this.props.onSelect}
              key={index}
              query={this.props.query}
              classes={this.props.classes}
              mappingLabel={mappingLabel}
              mappingChildren={mappingChildren}
              selectOnlyLeaf={selectOnlyLeaf}
              selectedNodes={selectedNodes}
              expandToSelectedNodes={expandToSelectedNodes}
              defaultExpanded={this.props.defaultExpanded}
              showOnlySearchedNodes={showOnlySearchedNodes}
              level={this.props.level+1}
            />
          );
        });
      } else {
        children = [];
      }
    }

    return (
      <li className={`${classes.node} ${hideThisNode && "hidden"} quickfire-tree-node`}>
        { children != undefined?
          <Button className={"quickfire-tree-node-expand"} bsStyle={"link"} bsSize={"xsmall"} onClick={this.toggle.bind(this)}>
            <Glyphicon glyph={this.state.expand?"minus":"plus"}/>
          </Button>
          :
          <span className={classes.leafPlaceHolder}/>
        }
        <a className={"quickfire-tree-node-selector"} onClick={this.handleClickSelect.bind(this)} style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
          {isSelected?
            <Label bsStyle={"success"} className={classes.labelSelected}><Glyphicon glyph={"ok"}/></Label>
            :null}
          {label}
        </a>

        { (children != undefined && this.state.expand) &&
          <ul className={`${classes.childrenList} quickfire-tree-node-children`}>{children}</ul>
        }
      </li>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.query !== this.props.query){
      if(nextProps.query && nextProps.data.children){
        this.setState({expand:nextProps.query.test(JSON.stringify(nextProps.data.children))});
      } else if(this.matchDefaultExpanded()){
        this.setState({expand:true});
      } else {
        this.setState({expand:false});
      }
    }
  }

  handleClickSelect() {
    let { mappingChildren } = { ...this.props };
    if(this.props.selectOnlyLeaf && this.props.data[mappingChildren] !== undefined && this.props.data[mappingChildren].length > 0){
      this.toggle();
    } else if(this.props.onSelect){
      this.props.onSelect(this.props.data);
    }
  }

  toggle() {
    this.setState({expand: !this.state.expand});
  }

}
