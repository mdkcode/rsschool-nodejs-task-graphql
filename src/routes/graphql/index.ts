import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  createGqlResponseSchema,
  gqlGetRequestQuerystringSchema,
  gqlResponseSchema,
} from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './gqlSchemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
      });

      return result;
    },
  });

  fastify.route({
    url: '/',
    method: 'GET',
    schema: {
      querystring: gqlGetRequestQuerystringSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.query;
      let getVariables: Record<string, any> | undefined;
      if (variables) getVariables = JSON.parse(variables);
      const result = await graphql({
        schema,
        source: query,
        variableValues: getVariables,
        contextValue: { prisma },
      });

      return result;
    },
  });
};
export default plugin;
