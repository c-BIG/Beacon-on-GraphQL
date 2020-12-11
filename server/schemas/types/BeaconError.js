const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

module.exports = new GraphQLObjectType({
  name: "BeaconError",
  fields: () => ({
    description: { type: GraphQLString },
    errorCode: { type: GraphQLNonNull(GraphQLInt) },
    errorMessage: { type: GraphQLString },
  }),
});
