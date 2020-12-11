/**
 * Contains an array of errors containing their description, errorCode, and errorMessage.
 * description is an error for developers or users querying on the API.
 * errorMessage is an error on the front-end.
 */

module.exports = [
  {
    description:
      "Error is raised if a request parameter is accidentally mentioned more than once",
    errorCode: 400,
    errorMessage:
      "Request parameter(s) are mentioned more than twice. Please check your request again",
  },
  {
    description:
      "Error is raised if madatory parameters are not filled (referenceName, referenceBases, assemblyId are mandatory)",
    errorCode: 400,
    errorMessage:
      "Chromosome, Reference Base(s), and Assembly are mandatory parameters to be filled",
  },
  {
    description:
      "Error is raised if referenceName does not follow the Chromosome enum",
    errorCode: 400,
    errorMessage: "Chromosome must be either 0-22, X or Y",
  },
  {
    description: "Error is raised if the regex of referenceBases are incorrect",
    errorCode: 400,
    errorMessage:
      "Reference Base(s) must follow the regex pattern of [ACTG]*, or value of N for wildcard query",
  },
  {
    description:
      "Error is raised if alternateBases XOR va riantType is not satisfied",
    errorCode: 400,
    errorMessage:
      "Either Alternate Base(s) or Variant Type must be specified, and not both",
  },
  {
    description: "Error is raised if either start or startMin is not specified",
    errorCode: 400,
    errorMessage:
      "Either start must be specified, or range queries (start and end, or startMin, startMax, endMin, and endMax) to be specified",
  },
  {
    description:
      "Error is raised if the regex of alternateBases - if specified - are incorrect",
    errorCode: 400,
    errorMessage:
      "Alternate Base(s) must follow the regex pattern of [ACTG]*, or value of 'N' for wildcard query",
  },
  {
    description:
      "Error is raised if variantType - if specified - is not supported in our database",
    errorCode: 400,
    errorMessage:
      "Variant Type in the database only supports 'SNP', 'DEL', 'INS' or 'MNP'",
  },
  {
    description:
      "Error is raised if datasetIds - if specified - does not exist in the database",
    errorCode: 400,
    errorMessage:
      "datasetIds specified does not exist in our database. datasetsIds currently supported: 'sg10kr3', 'sg10kr2', 'sg10kr1'. If you are querying in more than one databaseId, seperate each datasetId with a comma (',')",
  },
  {
    description:
      "Error is raised if start - if specified - is not a positive number",
    errorCode: 400,
    errorMessage: "start must be a number and not be negative (0 position)",
  },
  {
    description:
      "Error is raised if end - if specified - but start is not specified, or startMin, startMax, endMin, or endMax is in the query",
    errorCode: 400,
    errorMessaage:
      "If end is specfied, start must also be specified, and startMin, startMax, endMin, endMax should not be in the query and vice-versa",
  },
  {
    description: "Error is raised if end - if specfied - is less than start",
    errorCode: 400,
    errorMessage: "end must be a number and more than start (1 position based)",
  },
  {
    description:
      "Error is raised if startMin, startMax, endMin, and endMax is specified but one of the range query is empty or if start or end is in the query",
    errorCode: 400,
    errorMessage:
      "startMin, startMax, endMin, endMax must all be specified and start and end should not be in the query and vice-versa",
  },
  {
    description: "Error is raised if range queries are invalid",
    errorCode: 400,
    errorMessage:
      "Range queries must satisfy the following conditions: startMin <= startMax, endMin <= endMax, and startMin > endMin and startMax > endMax",
  },
  {
    description:
      "Error is raised if includeDatasetResponses does not follow the DatasetResponseEnum",
    errorCode: 400,
    errorMessage:
      "includeDatasetResponses must either be of value 'ALL', 'NONE', 'HIT' or 'MISS'",
  },
  {
    description:
      "Error is raised if referenceBases is not wildcarded when executing range query",
    errorCode: 400,
    errorMessage:
      "Reference Base(s) must be 'N' (wildcarded query) if querying for variants without specific base alterations (e.g. specifying variantType or range queries)",
  },
];
