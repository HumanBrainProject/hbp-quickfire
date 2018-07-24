import * as HBPQuickFire from "./";

describe("HBP QuickFire", () => {
  it("should export Form component", () => {
    expect(HBPQuickFire.Form).toBeDefined();
  });
  it("should export Field component", () => {
    expect(HBPQuickFire.Field).toBeDefined();
  });
  it("should export SingleField component", () => {
    expect(HBPQuickFire.SingleField).toBeDefined();
  });
  it("should export Tree component", () => {
    expect(HBPQuickFire.Tree).toBeDefined();
  });
  it("should export ActionIcon component", () => {
    expect(HBPQuickFire.ActionIcon).toBeDefined();
  });
  it("should export GenericList component", () => {
    expect(HBPQuickFire.GenericList).toBeDefined();
  });
  it("should export FormStore component", () => {
    expect(HBPQuickFire.FormStore).toBeDefined();
  });
  it("should export ClipboardStore component", () => {
    expect(HBPQuickFire.ClipboardStore).toBeDefined();
  });
});