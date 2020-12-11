/**
 * This is a string that will be sent to the query of the /api of server, which is a graphQL
 * interface.
 */
module.exports = `
    query {
      beacon {
        id
        name
        apiVersion
        organization {
          id
          name
          description
          address
          welcomeUrl
          contactUrl
          logoUrl
        }
        description
        version
        welcomeUrl
        alternativeUrl
        createDateTime
        updateDateTime
        datasets {
          id
          name
          description
          assemblyId
          createDateTime
          updateDateTime
          version
          callCount
          variantCount
          sampleCount
          externalUrl
        }
        sampleAlleleRequests {
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
      }
    }
`;
