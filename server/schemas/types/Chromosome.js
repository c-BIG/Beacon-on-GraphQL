const { GraphQLEnumType } = require("graphql");

/**
 * The Enum class for Chrosome. This implemenation is slightly different from GA4GH specifications
 * (GA4GH Beacon enum values are string and is 1-22, X-Y, while our Beacon enum values are _1-_22, _X-_Y)
 * as GraphQL has a strict regex pattern for Enum types such that we are unable to implement them as
 * specified. This change is handled in the RESTFUL API layer and users can query referenceName as 1-22, X-Y, but when querying for values under the
 * GraphQL layer, the need for _1-_22, _X-_Y is required.
 */
module.exports = new GraphQLEnumType({
  name: "Chromosome",
  values: {
    _1: {
      value: "1",
    },
    _2: {
      value: "2",
    },
    _3: {
      value: "3",
    },
    _4: {
      value: "4",
    },
    _5: {
      value: "5",
    },
    _6: {
      value: "6",
    },
    _7: {
      value: "7",
    },
    _8: {
      value: "8",
    },
    _9: {
      value: "9",
    },
    _10: {
      value: "10",
    },
    _11: {
      value: "11",
    },
    _12: {
      value: "12",
    },
    _13: {
      value: "13",
    },
    _14: {
      value: "14",
    },
    _15: {
      value: "15",
    },
    _16: {
      value: "16",
    },
    _17: {
      value: "17",
    },
    _18: {
      value: "18",
    },
    _19: {
      value: "19",
    },
    _20: {
      value: "20",
    },
    _21: {
      value: "21",
    },
    _22: {
      value: "22",
    },
    _X: {
      value: "X",
    },
    _Y: {
      value: "Y",
    },
  },
});
