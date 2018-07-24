class OptionsStore {
  optionsCache = new Map();
  pendingPromises = new Map();
}

export default new OptionsStore();