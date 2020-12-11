/**
 * This object is to provide more structured  information of a schema/object based on its
 * key-value pair.
 * Example: { key: alternateBase, value: "C" }
 */
const graphQL = require("graphql");

const { GraphQLObjectType, GraphQLString } = graphQL;

module.exports = new GraphQLObjectType({
  name: "KeyValuePair",
  fields: () => ({
    key: { type: GraphQLString },
    value: { type: GraphQLString },
  }),
});
