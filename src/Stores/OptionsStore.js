/*
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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