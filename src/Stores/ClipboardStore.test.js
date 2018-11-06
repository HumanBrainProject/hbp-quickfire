/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clipboardStore from "./ClipboardStore";
import clipboardStore2 from "./ClipboardStore";

test('Can only import an instance of the class ClipboardStore', () => {
  expect(clipboardStore.__proto__.constructor.name).toBe("ClipboardStore");
  expect(clipboardStore).toBe(clipboardStore2);
});

test('clipboardStore is initially empty', () => {
  expect(clipboardStore.selection).toBe("");
});

test('clipboardStore change value (trimmed) when selectionchange event is triggered on the document', () => {
  document.getSelection = function(){ return {value:" Hello!  ", toString: function(){return this.value;}} }
  document.dispatchEvent(new Event("selectionchange"));
  expect(clipboardStore.selection).toBe("Hello!");
  clipboardStore.reset();
  expect(clipboardStore.selection).toBe("");
  
  document.getSelection = function(){ return {value:"", toString: function(){return this.value;}} }
  document.dispatchEvent(new Event("selectionchange"));
  expect(clipboardStore.selection).toBe("");
});

test('clipboardStore is empty again after reset', () => {
  clipboardStore.reset();
  expect(clipboardStore.selection).toBe("");
});