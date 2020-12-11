const { getExtUrl } = require("../../config/beaconDatasets");
const addInfo = require("./addInfo");

/**
 * An async function that queries from the ElasticSearch Database.
 * @param {*} ctx
 * @param {*} datasetId the datasetId in the database
 * @param {*} args query arguments
 * @return A Promise of information regarding the alleles hit, if any.
 */
module.exports = async (ctx, datasetId, args) => {
  let search;
  if (args.startMin && args.startMax) {
    search = ctx.database.client.search({
      index: datasetId,
      type: "documents",
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "locus.contig.keyword": `chr${args.referenceName}`,
                },
              },
              {
                range: {
                  "locus.position": {
                    gte: `${args.startMin}`,
                    lte: `${args.startMax}`,
                  },
                },
              },
            ],
          },
        },
      },
    });
  } else {
    search = ctx.database.client.search({
      index: datasetId,
      type: "documents",
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  "locus.contig.keyword": `chr${args.referenceName}`,
                },
              },
              {
                term: {
                  "locus.position": `${args.start}`,
                },
              },
            ],
          },
        },
      },
    });
  }
  return search.then((response) => {
    var hitsArray = [];
    var info = [];
    if (response.body.hits.hits.length !== 0) {
      response.body.hits.hits.map((hit) => {
        info = addInfo(hit._source.variant_id, args.variantType);
        const frequency = hit._source.freq.adj.total.AF;
        const variantCount = hit._source.freq.adj.total.AC;
        const callCount = hit._source.freq.adj.total.AN;
        const sampleCount = callCount / 2;
        const chorusURL = `http://i2e-chorusbrowser-772821793.ap-southeast-1.elb.amazonaws.com`
        const hitURL = `${chorusURL}/variant/${hit._source.variant_id}?dataset=${getExtUrl(datasetId)}`
        hitsArray.push({
          datasetId: datasetId,
          exists: true,
          frequency: frequency,
          variantCount: variantCount,
          callCount: callCount,
          sampleCount: sampleCount,
          externalUrl: hitURL,
          info: info,
        });
      });
    }
    return {
      datasetId: datasetId,
      hitsArray: hitsArray,
    };
  });
};
