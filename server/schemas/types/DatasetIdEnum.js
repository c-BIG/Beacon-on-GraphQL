const { GraphQLEnumType } = require("graphql");
const { getDatasetEnum } = require("../../config/beaconDatasets");

/**
 * This is an enum of datasets that are supported by our beaconAPI. Updating the datasetId values on server/config/beaconDatasets.js will
 * automatically update the enum values here through the function getDatasetEnum
 */
module.exports = new GraphQLEnumType({
  name: "DatasetId",
  values: getDatasetEnum,
});
