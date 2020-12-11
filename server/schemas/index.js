const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

const Beacon = require("./types/Beacon");
const { beaconInfo } = require("../config/beacon");
const BeaconAlleleResponse = require("./types/BeaconAlleleResponse");
const {
  getAllDatasetIds,
  getExtUrl,
} = require("../config/beaconDatasets");
const DatasetResponseEnum = require("./types/DatasetResponseEnum");
const Chromosome = require("./types/Chromosome");
const VariantTypeEnum = require("./types/VariantTypeEnum");
const DatasetIdEnum = require("./types/DatasetIdEnum");
const checkVariantExists = require("./utils/checkVariantExists");
const filterQuery = require("./utils/filterQuery");
const resolveQuery = require("./utils/resolveQuery");

/**
 * This main schema follows the GA4GH convention for genomic data sharing.
 * @read https://app.swaggerhub.com/apis/ELIXIR-Finland/ga-4_gh_beacon_api_specification/1.0.0-rc1#/
 */
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    alleleQuery: {
      type: BeaconAlleleResponse,
      args: {
        referenceName: { type: GraphQLNonNull(Chromosome) },
        referenceBases: { type: GraphQLNonNull(GraphQLString) },
        assemblyId: { type: GraphQLNonNull(GraphQLString) },
        start: { type: GraphQLInt },
        end: { type: GraphQLInt },
        startMin: { type: GraphQLInt },
        startMax: { type: GraphQLInt },
        endMin: { type: GraphQLInt },
        endMax: { type: GraphQLInt },
        alternateBases: { type: GraphQLString },
        variantType: { type: VariantTypeEnum },
        datasetIds: {
          type: GraphQLList(DatasetIdEnum),
          defaultValue: getAllDatasetIds,
        },
        includeDatasetResponses: {
          type: DatasetResponseEnum,
          defaultValue: DatasetResponseEnum.parseValue("NONE"),
        },
      },
      resolve: (parent, args, ctx) => {
        if (args.assemblyId !== "GRCh38") {
          return resolveQuery(
            args,
            false,
            args.datasetIds.map((datasetId) => {
              return {
                datasetId: datasetId,
                exists: false,
                externalUrl: getExtUrl(datasetId),
              };
            }),
            null
          );
        }

        // Fetches data from ES DB, and returns the object containing the array of bases and respective datasetId.
        let promiseQuery = [...new Set(args.datasetIds)].map((datasetId) => {
          return checkVariantExists(ctx, datasetId, args);
        });

        // Returns all async promises and resolves the query.
        return Promise.all(promiseQuery).then((results) => {
          var existsInDatabase = false;
          var datasetAlleleResponses = [];
          // Iterate each dataset to filter based on alternateBases or variantType
          for (i = 0; i < results.length; i++) {
            var filterResult = filterQuery(results[i].hitsArray, {
              ...args,
            });
            if (filterResult.length > 0) {
              datasetAlleleResponses = datasetAlleleResponses.concat(
                filterResult
              );
              existsInDatabase = true;
            } else {
              datasetAlleleResponses.push({
                datasetId: results[i].datasetId,
                exists: false,
                externalUrl: getExtUrl(results[i].datasetId),
              });
            }
          }
          return resolveQuery(
            args,
            existsInDatabase,
            datasetAlleleResponses,
            null
          );
        });
      },
    },
    beacon: {
      type: Beacon,
      resolve: () => {
        return beaconInfo;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

module.exports = { schema };
