const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const BeaconOrganization = require("./BeaconOrganization");
const BeaconDataset = require("./BeaconDataset");
const BeaconAlleleRequest = require("./BeaconAlleleRequest");

module.exports = new GraphQLObjectType({
  name: "Beacon",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    apiVersion: { type: GraphQLString },
    organization: { type: BeaconOrganization },
    description: { type: GraphQLString },
    version: { type: GraphQLString },
    welcomeUrl: { type: GraphQLString },
    alternativeUrl: { type: GraphQLString },
    createDateTime: { type: GraphQLString },
    updateDateTime: { type: GraphQLString },
    datasets: { type: new GraphQLList(BeaconDataset) },
    sampleAlleleRequests: { type: new GraphQLList(BeaconAlleleRequest) },
  }),
});
