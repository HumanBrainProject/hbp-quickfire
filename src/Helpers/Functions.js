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
