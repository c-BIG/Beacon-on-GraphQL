const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

module.exports = new GraphQLObjectType({
  name: "BeaconOrganization",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    address: { type: GraphQLString },
    welcomeUrl: { type: GraphQLString },
    contactUrl: { type: GraphQLString },
    logoUrl: { type: GraphQLString },
  }),
});
