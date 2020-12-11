const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const BeaconAlleleRequest = require("./BeaconAlleleRequest");
const BeaconDatasetAlleleResponse = require("./BeaconDatasetAlleleResponse");
const BeaconError = require("./BeaconError");

module.exports = new GraphQLObjectType({
  name: "AlleleResponse",
  fields: () => ({
    beaconId: { type: GraphQLNonNull(GraphQLString) },
    apiVersion: { type: GraphQLString },
    exists: { type: GraphQLBoolean },
    alleleRequest: { type: BeaconAlleleRequest },
    datasetAlleleResponses: {
      type: new GraphQLList(BeaconDatasetAlleleResponse),
    },
    error: { type: BeaconError },
  }),
});
