type SupabaseMethod = 'eq' | 'desc' | 'asc';

export type SupabaseQueryRequest<T extends Record<string, unknown>> =
  | {
      [key in keyof T]?: {
        value: T[key];
        type: SupabaseMethod;
      };
    }
  | undefined;

export function generateParams<T extends Record<string, unknown>>(params: SupabaseQueryRequest<T>) {
  return params
    ? Object.entries(params).reduce(
        (acc, [key, object]: [string, { value: unknown; type: SupabaseMethod }] | [string, undefined]) => {
          return object
            ? {
                ...acc,
                [key]: getQueryStringByType(object),
              }
            : { ...acc };
        },
        {}
      )
    : {};
}

function getQueryStringByType(object: { value: unknown; type: SupabaseMethod }) {
  let queryString = '';
  switch (object.type) {
    case 'eq':
      queryString = `${object.type}.${object.value}`;
      break;
    case 'desc':
    case 'asc':
      queryString = `${object.value}.${object.type}`;
      break;
    default:
      break;
  }
  return queryString;
}
