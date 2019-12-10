/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import axios from "axios";
import GenericList from "./GenericList";
import ActionIcon from "./ActionIcon";

const fakeListSimple = [1, 2, 3];
const fakeListComplex = [
  {
    name: "France",
    inhabitants: "67 million",
    motto: "Liberté, égalité, fraternité "
  },
  {
    name: "Germany",
    inhabitants: "82 million",
    motto: "Einigkeit und Recht und Freiheit"
  },
  {
    name: "Switzerland",
    inhabitants: "8 million",
    motto: "Sure, we'll take your money"
  }
];

describe("GenericList", () => {
  it("should render without throwing an error", () => {
    let wrapper = mount(<GenericList items={fakeListSimple} />);
    let panels = wrapper.find(".panel-group").children();
    expect(panels).toHaveLength(fakeListSimple.length);
    for (let [index, item] of fakeListSimple.entries()) {
      expect(
        panels
          .at(index)
          .find("itemTitle")
          .props().item
      ).toBe(item);
    }
  });

  it("should render a complex list", () => {
    const items = fakeListComplex;
    let wrapper = mount(
      <GenericList
        items={fakeListComplex}
        itemTitle={({ item }) => (
          <div>
            {item.name}
            <br />
            {item.inhabitants}
          </div>
        )}
        itemBody={({ item }) => `Country Motto: ${item.motto}`}
        expanded={true}
        actions={[
          <ActionIcon
            className="test-action"
            onClick={item => (item.name = "test")}
          />
        ]}
      />
    );
    let panels = wrapper.find(".panel-group").children();
    expect(panels).toHaveLength(fakeListComplex.length);
    for (let [index, item] of fakeListComplex.entries()) {
      expect(
        panels
          .at(index)
          .find("itemTitle")
          .props().item
      ).toBe(item);
    }
    wrapper
      .find(".test-action")
      .first()
      .simulate("click"); // sets name of first item to test
    expect(items[0].name).toBe("test");
  });
});
