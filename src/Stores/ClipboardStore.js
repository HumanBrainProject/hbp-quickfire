import { observable, action } from "mobx";

/**
 * A Store handling a virtual clipboard of text selected inside the current browser window.
 * Importing this module will always return the same instance of that store
 * @memberof Stores
 * @namespace ClipboardStore
 * @class ClipboardStore
 */
class ClipboardStore {
  @observable selection = "";

  constructor() {
    document.addEventListener("selectionchange", this._selectionEventHandler);
  }

  @action.bound
  _selectionEventHandler() {
    let currentSelection = document
      .getSelection()
      .toString()
      .trim();
    if (currentSelection) {
      this.selection = currentSelection.trim();
    }
  }

  @action
  /**
   * Clear the value stored in the virtual clipboard
   * @memberof Stores.ClipboardStore
   */
  reset() {
    this.selection = "";
  }
}

export default new ClipboardStore();
