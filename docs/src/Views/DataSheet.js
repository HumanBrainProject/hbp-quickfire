import React from "react";
import View from "./_View";
import { SingleField } from "hbp-quickfire";

export default class DataSheetView extends View {

  render() {
    return (
      <div>
        <h2>Datasheet (WIP)</h2>

        <View.ShowField 
          definition={{
            type:"DataSheet",
            label:"Test datasheet",
            max:25,
            min:1,
            headers:[{
              key:"id",
              label:"ID",
              show:false,
              defaultValue:0,
              duplicatedValue:0
            },{
              key:"col1",
              label:"Col1"
            },{
              key:"col2",
              label:"Col2"
            },{
              key:"col3",
              label:"Col3"
            },{
              key:"col4",
              label:"Col4"
            },{
              key:"ro_value",
              label:"ReadOnly value",
              readOnly:true,
              defaultValue:"unknown",
              duplicatedValue:"duplicated"
            }],
            value:[
              {id:1,ro_value:"Lorem",col1:"col1value", col2:"col2value"},
              {id:2,ro_value:"Ipsum",col1:"asdfasdf", col2:"qwefqeffdfasdf"}
            ]
          }}
        />

      </div>
    );
  }
}


