const deduceVariantType = require("./deduceVariantType");

/**
 * This function pushes important meta-data information of the hit allele.
 * @param {String} variant is the allele variant in format "referenceName-position-referenceBases-alternateBases"
 * @param {String} variantType is the variantType defined in the search query, if specified.
 * @returns an array of key-value pairs in this structure:
 *  arr[0]: referenceName, String
 *  arr[1]: position, String
 *  arr[2]: referenceBases, String
 *  arr[3]: alternateBases, String
 *  arr[4]: variantType, String
 */
module.exports = (variant, variantType) => {
  var info = [];
  const variantArray = variant.split("-");
  info.push({
    key: "referenceName",
    value: `${variantArray[0]}`,
  });
  info.push({
    key: "position",
    value: `${variantArray[1]}`,
  });
  info.push({
    key: "referenceBases",
    value: `${variantArray[2]}`,
  });
  info.push({
    key: "alternateBases",
    value: `${variantArray[3]}`,
  });
  info.push({
    key: "variantType",
    value: `${deduceVariantType(variantArray[2], variantArray[3])}`,
  });
  return info;
};
