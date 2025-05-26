import { Static, Type } from '@fastify/type-provider-typebox';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const gqlGetRequestQuerystringSchema = Type.Object({
  query: Type.String(),
  variables: Type.Optional(Type.String()),
});

export type GqlGetRequestQuerystring = Static<typeof gqlGetRequestQuerystringSchema>;
