import { merge } from 'lodash';
import { isNil } from 'lodash';

export const getParamQuery = (
  fields: string,
  skip?: number,
  top?: number,
  query?: string,
): Record<string, unknown> => {
  let params = { fields: fields };
  if (!isNil(query)) {
    params = merge(params, { query: query });
  }
  if (!isNil(skip)) {
    params = merge(params, { $skip: skip });
  }
  if (!isNil(top)) {
    params = merge(params, { $top: top });
  }
  return params;
};
