/**
 * This function filters the query results based on the parameters filled. There are 3 ways in
 * which the filter will query:
 * 1. Filter only by start position of the reference base (only args.start is defined)
 * 2. Filter by the start and end position of the reference base (args.start and args.end is defined)
 * 3. Filter by querying imprecise positions starting anywhere from a range of points
 * and ending anywhere from a range of points (args.startMin, args.startMax, args.endMin, args.endMax is defined)
 * referenceBases and alternateBases or variantType can be defined, and it will filter after the above filter.
 * @param {[string]} hitsArray is an array of variants split by the chromosome,position,
 *  refBase and altBase respectively.
 * @param {BeaconAlleleRequest} args is an object containing the query parameters.
 * @returns The filtered variants that fits the user query.
 */
module.exports = (hitsArray, args) => {
  if (hitsArray.length > 0) {
    // Filter if referenceBases is not wildcarded
    if (args.referenceBases !== "N") {
      hitsArray = hitsArray.filter(
        (hit) => hit.info[2].value === args.referenceBases
      );
    }
    // Filter if alternateBases is not wildcarded
    if (args.alternateBases && args.alternateBases !== "N") {
      hitsArray = hitsArray.filter(
        (hit) => hit.info[3].value === args.alternateBases
      );
    }
    // Filter if start and end are defined
    if (args.start && args.end) {
      hitsArray = hitsArray.filter(
        (hit) => hit.info[2].value.length === args.end - args.start
      );
    }
    // Filter if startMin, startMax, endMin endMax are defined
    if (args.startMin && args.startMax && args.endMin && args.endMax) {
      hitsArray = hitsArray.filter(
        (hit) =>
          hit.info[2].value.length >=
            args.endMin - parseInt(hit.info[1].value) &&
          hit.info[2].value.length <= args.endMax - parseInt(hit.info[1].value)
      );
    }
    // Filter if variantType is defined
    if (args.variantType) {
      switch (args.variantType) {
        case "SNP":
          return hitsArray.filter((hit) => hit.info[4].value === "SNP");
        case "INS":
          return hitsArray.filter((hit) => hit.info[4].value === "INS");
        case "DEL":
          return hitsArray.filter((hit) => hit.info[4].value === "DEL");
        case "MNP":
          return hitsArray.filter((hit) => hit.info[4].value === "MNP");
        // Does not support other variant types for now.
        default:
          return [];
      }
    }
  }
  return hitsArray;
};
