import { parse, validate } from 'graphql';
import { schema } from './gqlSchemas.js';
import depthLimit from 'graphql-depth-limit';

export const checkDepthLimit = (query: string) => {
  const document = parse(query);
  const errors = validate(schema, document, [depthLimit(5)]);
  return errors;
};
