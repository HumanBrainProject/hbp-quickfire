/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Tree from "./Tree";

let fakeTree = {
  "value": "HBP_MEM:0000000",
  "name": "Method",
  "children": [
    {
      "value": "HBP_MEM:0000119",
      "name": "Endogenous genes manipulation",
      "children": [
        {
          "value": "HBP_MEM:0000125",
          "name": "Dominant-negative inhibition"
        },
        {
          "value": "HBP_MEM:0000124",
          "name": "Morpholino"
        },
        {
          "value": "HBP_MEM:0000121",
          "name": "Knockin"
        },
        {
          "value": "HBP_MEM:0000120",
          "name": "Knockout"
        },
        {
          "value": "HBP_MEM:0000122",
          "name": "Conditional knockout"
        },
        {
          "value": "HBP_MEM:0000123",
          "name": "RNA interference"
        }
      ]
    }
  ]
};

describe("Tree Component", () => {
  it("should mount without throwing any error", () => {
    let mountPoint = mount(
      <Tree data={fakeTree} expandToSelectedNodes={true}/>
    );
    expect(mountPoint.find('TreeNode').length).toBe(1);
  });

  it("should handle search", () => {
    let mountPoint = mount(
      <Tree data={fakeTree}/>
    );

    mountPoint.find('input.quickfire-tree-search-input').first().simulate("change", {target:{value:"?"}});
    mountPoint.find('input.quickfire-tree-search-input').first().simulate("change", {target:{value:"interferenc"}});
    mountPoint.find('input.quickfire-tree-search-input').first().simulate("change", {target:{value:"interference"}});

    mountPoint.setState({query:new RegExp(":\".*?"+"interference"+".*?\"","i")})
    
    expect(mountPoint.find('TreeNode').length).toBeGreaterThan(1);
  });
});