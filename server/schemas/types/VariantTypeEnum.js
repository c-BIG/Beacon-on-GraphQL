const { GraphQLEnumType } = require("graphql");

/**
 * This is an enum that filters/deduces what the allele is.
 * SNP: Reference and alternate bases are of length 1 and they different from one another.
 * DEL: Reference and alternate bases are not of the same length and length of referenceBases are longer than the length of alternate bases.
 * INS: Reference and alternate bases are not of the same length and length of referenceBases are longer than the length of alternate bases.
 * MNP: Reference and alternate bases are same length and have to be greater than one and they are different from one another.
 */
module.exports = new GraphQLEnumType({
  name: "VariantType",
  values: {
    SNP: {
      value: "SNP",
    },
    DEL: {
      value: "DEL",
    },
    INS: {
      value: "INS",
    },
    MNP: {
      value: "MNP",
    },
  },
});
