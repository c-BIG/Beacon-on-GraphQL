/**
 * These are loosely based variant types and might not be accurate.
 *
 * @param {String} ref is the referenceBases of the allele.
 * @param {String} alt is the alternateBases of the allele.
 * @param {String} vt is the variantType of the allele.
 * @returns a string that represents the variantType of the allele specified.
 */

module.exports = (ref, alt) => {
  if (ref.length === 1 && alt.length == 1 && ref !== alt) {
    return "SNP";
  } else if (ref.length === 1 && alt.length > 1) {
    return "INS";
  } else if (ref.length > 1 && alt.length === 1) {
    return "DEL";
  } else if (ref.length === alt.length && ref !== alt) {
    return "MNP";
  }
  return "OTH";
};
