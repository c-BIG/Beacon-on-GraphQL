const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
} = require("graphql");

const KeyValuePair = require("./KeyValuePair");
const DatasetIdEnum = require("./DatasetIdEnum");

module.exports = new GraphQLObjectType({
  name: "DatasetAlelleResponse",
  fields: () => ({
    datasetId: { type: DatasetIdEnum },
    exists: { type: GraphQLBoolean },
    frequency: { type: GraphQLFloat },
    variantCount: { type: GraphQLInt },
    callCount: { type: GraphQLInt },
    sampleCount: { type: GraphQLInt },
    externalUrl: { type: GraphQLString },
    note: { type: GraphQLString },
    info: { type: GraphQLList(KeyValuePair) },
  }),
});
