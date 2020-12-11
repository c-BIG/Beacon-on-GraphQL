module.exports = [
  // Basic query w/ alternateBases
  // RESTFUL query:
  // http://localhost:4000/query?referenceName=3&referenceBases=C&start=10212&alternateBases=T&assemblyId=GRCh38&includeDatasetResponses=ALL&datasetIds=sg10kr3
  {
    referenceName: "3",
    referenceBases: "C",
    start: 10212,
    alternateBases: "T",
    assemblyId: "GRCh38",
    datasetIds: ["sg10kr3"],
    includeDatasetResponses: "ALL",
  },
  // Advanced query w/ start and end
  // RESTFUL query:
  // http://localhost:4000/query?referenceName=2&referenceBases=N&start=6420993&end=6420995&alternateBases=N&assemblyId=GRCh38&datasetIds=sg10kr3&includeDatasetResponses=ALL
  {
    referenceName: "2",
    referenceBases: "N",
    start: 6420993,
    end: 6420995,
    alternateBases: "N",
    assemblyId: "GRCh38",
    datasetIds: ["sg10kr3"],
    includeDatasetResponses: "ALL",
  },
  // Basic query w/ wildcarded alternateBases
  // RESTFUL query:
  // http://localhost:4000/query?referenceName=3&referenceBases=C&start=10212&alternateBases=N&assemblyId=GRCh38&includeDatasetResponses=ALL&datasetIds=sg10kr3
  {
    referenceName: "3",
    referenceBases: "N",
    start: 10212,
    end: 10213,
    variantType: "SNP",
    assemblyId: "GRCh38",
    datasetIds: ["sg10kr3"],
    includeDatasetResponses: "ALL",
  },
  // Advanced query w/ range for startMin, startMax, endMin, endMax
  // RESTFUL query: http://localhost:4000/query?referenceName=3&referenceBases=N&startMin=10210&startMax=10215&endMin=10211&endMax=10216&variantType=SNP&assemblyId=GRCh38&datasetIds=sg10kr3&includeDatasetResponses=ALL
  {
    referenceName: "3",
    referenceBases: "N",
    startMin: 10210,
    startMax: 10215,
    endMin: 10211,
    endMax: 10216,
    alternateBases: "N",
    assemblyId: "GRCh38",
    datasetIds: ["sg10kr3"],
    includeDatasetResponses: "ALL",
  },
  // Advanced query w/ range for startMin, startMax, endMin, endMax
  // RESTFUL query: http://localhost:4000/query?referenceName=3&referenceBases=N&startMin=10210&startMax=10215&endMin=10211&endMax=10216&variantType=SNP&assemblyId=GRCh38&datasetIds=sg10kr3&includeDatasetResponses=ALL
  {
    referenceName: "3",
    referenceBases: "N",
    startMin: 10210,
    startMax: 10215,
    endMin: 10211,
    endMax: 10216,
    variantType: "SNP",
    assemblyId: "GRCh38",
    datasetIds: ["sg10kr3"],
    includeDatasetResponses: "ALL",
  },
];
