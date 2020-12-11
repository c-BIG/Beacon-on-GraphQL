const { GraphQLEnumType } = require("graphql");

/**
 * This is an enum according to the GA4GH Beacon API specifications.
 * ALL: Outputs hit queries and missed queries into beaconDatasetAlleleResponses
 * HIT: Outputs only hit queries into beaconDatasetAlleleResponses.
 * MISS: Outputs only queries that do not exist in specified databases in beaconDatasetAlleleResponses.
 * NONE: Value of beaconDatasetAlleleResponses is null.
 */
module.exports = new GraphQLEnumType({
  name: "DatasetResponseEnum",
  values: {
    ALL: {
      value: "ALL",
    },
    HIT: {
      value: "HIT",
    },
    MISS: {
      value: "MISS",
    },
    NONE: {
      value: "NONE",
    },
  },
});
