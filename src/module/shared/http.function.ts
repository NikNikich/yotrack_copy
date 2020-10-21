import { merge } from 'lodash';

export const getParamQuery = (
  fields: string,
  skip?: number,
  top?: number,
  query?: string,
): Record<string, unknown> => {
  let params = { fields: fields };
  if (query) {
    params = merge(params, { query: query });
  }
  if (skip) {
    params = merge(params, { $skip: skip });
  }
  if (top) {
    params = merge(params, { $top: top });
  }
  return params;
};