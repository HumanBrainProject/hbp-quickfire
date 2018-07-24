import React from "react";
import View from "./_View";


export default class InputText extends View {

  render() {
    return (
      <div>
        <h2>Clipboard Store</h2>
        <p>The Clipboard Store is a Mobx store to hanlde a virtual clipboard of text selected inside the current browser window.</p>
        <p>You can find more information in the <a href="https://www.npmjs.com/package/hbp-quickfire#clipboardstore">API docs</a></p>
      </div>
    );
  }
}


