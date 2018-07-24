import FormStore from "./FormStore";

describe('FormStore', () => {

  let structure = {
    fields:{
      text:{
        type:"InputText"
      },
      nested:{
        type:"Nested",
        min:0,
        fields:{
          subfield:{
            type:"InputText"
          }
        }
      },
      nested2:{
        type:"Nested",
        min:1,
        fields:{
          subfield:{
            type:"InputText"
          }
        }
      },
      dropdown:{
        type:"DropdownSelect",
        options:[{ "label": "op1-label", "value": "op1-value" }, { "label": "op2-label", "value": "op2-value" }],
        defaultValue:"op1-value",
        returnSingle:true,
        mappingReturn:"value"
      },
      dropdown2:{
        type:"DropdownSelect",
        options:[{ "label": "op1-label", "value": "op1-value" }, { "label": "op2-label", "value": "op2-value" }],
        defaultValue:[{value:"op1-value"}]
      },
      tree:{
        type:"TreeSelect",
        data:{ 
          "label": "root-label", 
          "value": "root-value"
        },
        defaultValue:"root-value",
      },
      tree2:{
        type:"TreeSelect",
        data:{ 
          "label": "root-label", 
          "value": "root-value",
          children:[
            {
              "label": "lv1-label", 
              "value": "lv1-value",
            }
          ]
        },
        defaultValue:[{value:"root-value"},"lv1-value"]
      }
    }
  };

  let values = {
    nested:[{subfield:"testvalue"}],
    dropdown:["op2-value"],
    tree:["root-value"]
  };

  it('should instantiate with a structure', () => {
    let formStore = new FormStore(structure);
    expect(formStore.structure.fields.tree.type).toBe("TreeSelect");
  });

  it('should allow to inject values', () => {
    let formStore = new FormStore(structure);
    formStore.injectValues(values);
    expect(formStore.structure.fields.nested.value[0].subfield.value).toBe("testvalue");
  });

  it('should allow to reset values', () => {
    let formStore = new FormStore(structure);
    formStore.injectValues(values);
    let valuesOut = formStore.getValues();
    expect(valuesOut.nested.length).toBe(1);
    expect(valuesOut.dropdown).toBe("op2-value");
    formStore.reset();
    valuesOut = formStore.getValues();
    expect(valuesOut.nested.length).toBe(0);
    expect(valuesOut.dropdown).toBe("op1-value");
  });

  it('should give sibling path', () => {
    let formStore = new FormStore(structure);
    let sibling = formStore.getField(formStore.genSiblingPath(formStore.getField("dropdown"), "tree"))
    expect(sibling.type).toBe("TreeSelect");
  });

  it("can return field or fields through the getField function", () => {
    let formStore = new FormStore(structure);
    expect(formStore.getField("/tree")).toBe(formStore.structure.fields.tree);
    expect(formStore.getField("tree")).toBe(formStore.structure.fields.tree);
    expect(formStore.getField("/")).toBe(formStore.structure.fields);
    expect(formStore.getField("/")).toBe(formStore.structure.fields);
  });

});
