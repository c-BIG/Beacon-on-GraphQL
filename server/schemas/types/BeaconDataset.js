const { GraphQLObjectType, GraphQLString, GraphQLInt } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "BeaconDataset",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    assemblyId: { type: GraphQLString },
    createDateTime: { type: GraphQLString },
    updateDateTime: { type: GraphQLString },
    version: { type: GraphQLString },
    variantCount: { type: GraphQLInt },
    callCount: { type: GraphQLInt },
    sampleCount: { type: GraphQLInt },
    externalUrl: { type: GraphQLString },
  }),
});
