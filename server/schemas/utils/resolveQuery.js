const { beaconInfo } = require("../../config/beacon");
const errors = require("../errors/errors");
const filterDatasetResponses = require("../utils/filterDatasetResponses");

/**
 * Takes in the parameters and returns an Object of BeaconAlleleResponse schema.
 * @param {*} args the arguments of the query
 * @param {*} existsInDatabase if the query exists in the database, null if there is an error
 * @param {*} datasetAlleleResponses an array of detailed allele responses in the datasets, if specified
 * @param {*} errorValue if there is an error, specify the value as an element in errors.js, else 0
 * @return An Object that satisfies the BeaconAlleleResponse schema
 */
module.exports = (
  args,
  existsInDatabase,
  datasetAlleleResponses,
  errorValue
) => {
  return {
    beaconId: beaconInfo.id,
    apiVersion: beaconInfo.apiVersion,
    exists: existsInDatabase,
    alleleRequest: { ...args },
    datasetAlleleResponses:
      datasetAlleleResponses !== null
        ? filterDatasetResponses(
            datasetAlleleResponses,
            args.includeDatasetResponses
          )
        : null,
    error: errorValue ? errors[errorValue - 1] : null,
  };
};
