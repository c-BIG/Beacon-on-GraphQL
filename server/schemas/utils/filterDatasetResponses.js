/**
 * Filters the datasetAlleleResponses based on the value of includeDatasetResponses. If ALL, every dataset will show if it exists or not. If HIT, only hit alleles. If MISS, only datasets that do not contain the query. If NONE (default), datasetAlleleResponses will be null.
 * @param {*} datasetAlleleResponses
 * @param {*} includeDatasetResponses
 */
module.exports = (datasetAlleleResponses, includeDatasetResponses) => {
  switch (includeDatasetResponses) {
    case "NONE":
      return null;
    case "ALL":
      return datasetAlleleResponses;
    case "MISS":
      return datasetAlleleResponses.filter((res) => !res.exists);
    case "HIT":
      return datasetAlleleResponses.filter((res) => res.exists);
  }
};
