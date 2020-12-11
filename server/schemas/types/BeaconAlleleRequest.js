const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");

const VariantTypeEnum = require("./VariantTypeEnum");
const DatasetIdEnum = require("./DatasetIdEnum");

module.exports = new GraphQLObjectType({
  name: "AlleleRequest",
  description: "Reference genome follows GRCh38 convention.",
  fields: () => ({
    referenceName: { type: new GraphQLNonNull(GraphQLString) },
    referenceBases: { type: new GraphQLNonNull(GraphQLString) },
    assemblyId: { type: new GraphQLNonNull(GraphQLString) },
    datasetIds: { type: GraphQLList(DatasetIdEnum) },
    start: { type: GraphQLInt },
    end: { type: GraphQLInt },
    startMin: { type: GraphQLInt },
    startMax: { type: GraphQLInt },
    endMin: { type: GraphQLInt },
    endMax: { type: GraphQLInt },
    // Either alternateBases or variantType should be specified
    alternateBases: { type: GraphQLString },
    variantType: { type: VariantTypeEnum },
    /** Indicator of whether responses for individual datasets (datasetAlleleResponses)
     * should be included in the response (BeaconAlleleResponse) to this request or not.
     * If null (not specified), the default value of NONE is assumed.
     */
    includeDatasetResponses: { type: GraphQLString },
  }),
});
