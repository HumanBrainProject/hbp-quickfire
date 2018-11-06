/**
 * Copyright (c) Human Brain Project
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { isNumber } from "lodash";

export function getPrecision(float) {
  if (isNumber(float) && !Number.isInteger(float)) {
    return (float + "").split(".")[1].length;
  } else {
    return 0;
  }
}

export function lowerPrecision(number, precision) {
  if (!isNumber(number) || Number.isInteger(number)) {
    return number;
  }
  return parseFloat(number.toFixed(precision));
}
