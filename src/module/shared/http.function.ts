import { merge } from 'lodash';

export const getParamQuery = (
  fields: string,
  skip?: number,
  top?: number,
): Record<string, unknown> => {
  let params = { fields: fields };
  if (skip) {
    params = merge(params, { $skip: skip });
  }
  if (top) {
    params = merge(params, { $top: top });
  }
  return params;
};