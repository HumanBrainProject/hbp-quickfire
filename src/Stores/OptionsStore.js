class OptionsStore {
  optionsCache = new Map();
  pendingPromises = new Map();

  getOptions(url){
    return this.optionsCache.get(url);
  }

  setOptions(url, data){
    return this.optionsCache.set(url, data);
  }
}

export default new OptionsStore();