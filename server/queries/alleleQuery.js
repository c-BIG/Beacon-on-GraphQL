/**
 * This is a string that will be sent to the query of the /api of server, which is a graphQL
 * interface.
 * @param {*} params the params of the query.
 */
module.exports = (params) =>
  `
    query {
      alleleQuery(
        referenceName: _${params.referenceName}, 
        referenceBases: "${params.referenceBases}",
        assemblyId: "${params.assemblyId}",
        ${params.start !== undefined ? `start: ${params.start},` : ""}
        ${params.end !== undefined ? `end: ${params.end},` : ""}
        ${params.startMin !== undefined ? `startMin: ${params.startMin},` : ""}
        ${params.startMax !== undefined ? `startMax: ${params.startMax},` : ""}
        ${params.endMin !== undefined ? `endMin: ${params.endMin},` : ""}
        ${params.endMax !== undefined ? `endMax: ${params.endMax},` : ""}

        ${
          params.alternateBases !== undefined
            ? `alternateBases: "${params.alternateBases}",`
            : ""
        }
        ${
          params.variantType !== undefined
            ? `variantType: ${params.variantType},`
            : ""
        }
        ${
          params.includeDatasetResponses !== undefined
            ? `includeDatasetResponses: ${params.includeDatasetResponses},`
            : ""
        }
        ${
          params.datasetIds !== undefined
            ? `datasetIds: [${params.datasetIds.split(",")}]`
            : ""
        }
      ){
        beaconId
        apiVersion
        exists
        alleleRequest {
          referenceName
          referenceBases
          assemblyId
          start
          end
          startMin
          startMax
          endMin
          endMax
          alternateBases
          variantType
          datasetIds
          includeDatasetResponses
          variantType
        }
        beaconId
        apiVersion
        datasetAlleleResponses{
          datasetId
          exists
          callCount
          sampleCount
          variantCount
          frequency
          externalUrl
          note
          info
          {
            key
            value
          }
        }
        error {
          description
          errorMessage
        }
      }
    }
`;
