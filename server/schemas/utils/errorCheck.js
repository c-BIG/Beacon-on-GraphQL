// Enum to be followed for includeDatasetResponses
const DatasetResponseEnum = require("../types/DatasetResponseEnum");
// Enum to be followed for referenceName
const Chromosome = require("../types/Chromosome");
const DatasetIdEnum = require("../types/DatasetIdEnum");
// Reference and alternate bases follow this regular expression
const regexBases = /^([ACGT]+|N)$/;
// Currently our database only supports these variant types
const variantTypes = ["SNP", "DEL", "INS", "MNP"];

/**
 * Checks for arguments validity and returns the int number that is reflected in
 * the file errors.js
 * @param {*} args the request parameters
 * @returns {number} the error code reflected, and 0 if the parsing is correct
 */
module.exports = (args) => {
  switch (true) {
    // Checks if any argument was accidentally mentioned more than once
    case Object.entries(args).some((arg) => arg[1] instanceof Array):
      return 1;
    // Checks for mandatory arguments (referenceName, referenceBases, assemblyId)
    case args.referenceName === undefined ||
      args.referenceBases === undefined ||
      args.assemblyId === undefined:
      return 2;
    // Checks for mandatory args validity
    case !Chromosome.getValue("_".concat(args.referenceName)):
      return 3;
    case !regexBases.test(args.referenceBases):
      return 4;
    // Only one of alternateBases or variantType must be defined and checks for their validity.
    case !(args.alternateBases !== undefined
      ? args.variantType === undefined
      : args.variantType !== undefined):
      return 5;
    // Check if position parameters are queried
    case args.start === undefined && args.startMin === undefined:
      return 6;
    case args.alternateBases !== undefined &&
      !regexBases.test(args.alternateBases):
      return 7;
    case args.variantType !== undefined &&
      !variantTypes.includes(args.variantType):
      return 8;
    // Check for validity of datasetIds - if defined - if it exists in the database
    case args.datasetIds !== undefined &&
      args.datasetIds
        .split(",")
        .some((dataset) => !DatasetIdEnum.getValue(dataset)):
      return 9;
    // Checks for validty of start - if defined.
    case args.start !== undefined && (isNaN(args.start) || args.start < 0):
      return 10;
    // Defining end needs start as well, while not defining the range args
    case args.end !== undefined &&
      (args.start === undefined ||
        args.startMin !== undefined ||
        args.startMax !== undefined ||
        args.endMin !== undefined ||
        args.endMax !== undefined):
      return 11;
    // end needs to be more than start if both are defined (1 position)
    case args.end !== undefined && (isNaN(args.end) || args.start >= args.end):
      return 12;
    // Range queries need all args of min and max to be defined, and not have start or end to be defined.
    case (args.startMin !== undefined ||
      args.startMax !== undefined ||
      args.endMin !== undefined ||
      args.endMax !== undefined) &&
      (args.startMin === undefined ||
        args.startMax === undefined ||
        args.endMin === undefined ||
        args.endMax === undefined ||
        args.start !== undefined ||
        args.end !== undefined):
      return 13;
    // Check for range queries validity
    case args.startMin !== undefined &&
      (isNaN(args.startMin) ||
        isNaN(args.startMax) ||
        isNaN(args.endMin) ||
        isNaN(args.endMax) ||
        args.startMin < 0 ||
        args.endMin < 0 ||
        args.startMin > args.startMax ||
        args.endMin > args.endMax ||
        args.startMin > args.endMin ||
        args.startMax > args.endMax):
      return 14;
    // Check for the includeDatasetResponses enum
    case args.includeDatasetResponses !== undefined &&
      !DatasetResponseEnum.getValue(args.includeDatasetResponses):
      return 15;
    // Check if referenceBases are wildcarded if range is specified.
    case (args.startMin !== undefined || args.variantType !== undefined) &&
      args.referenceBases !== "N":
      return 16;
    default:
      return 0;
  }
};
