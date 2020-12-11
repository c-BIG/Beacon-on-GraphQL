const beaconDatasets = [
  {
    id: "sg10kr3",
    name: "SG10K_Health v3.1",
    description:
      "QCed variants of SG10K Health dataset including imputed gender",
    assemblyId: "GRCh38",
    createDateTime: "2020-05-10",
    updateDateTime: "2020-05-10",
    version: "3.1",
    variantCount: 182763035,
    callCount: 726527482260,
    sampleCount: 9913,
    externalUrl:
      "http://i2e-chorusbrowser-772821793.ap-southeast-1.elb.amazonaws.com/?dataset=sg10k_r3_1",
  },
  {
    id: "sg10kr2",
    name: "SG10K_Health v2.0",
    description:
      "QCed variants of SG10K Health dataset with Hardy-Weinberg desequilibrium sites included",
    assemblyId: "GRCh38",
    createDateTime: "2020-04-20",
    updateDateTime: "2020-04-20",
    version: "2.0",
    variantCount: 183268396,
    callCount: 713578000818,
    sampleCount: 9894,
    externalUrl:
      "http://i2e-chorusbrowser-772821793.ap-southeast-1.elb.amazonaws.com/?dataset=sg10k_r2_0",
  },
  {
    id: "sg10kr1",
    name: "SG10K_Health v1.0",
    description:
      "QCed variants of SG10K Health dataset with Hardy-Weinberg desequilibrium sites excluded",
    assemblyId: "GRCh38",
    createDateTime: "2020-04-13",
    updateDateTime: "2020-04-13",
    version: "1.0",
    variantCount: 174415712,
    callCount: 664570021777,
    sampleCount: 9894,
    externalUrl:
      "http://i2e-chorusbrowser-772821793.ap-southeast-1.elb.amazonaws.com/?dataset=sg10k_r1.0",
  },
];
const getAllDatasetIds = beaconDatasets.map((datasets) => datasets.id);

const getDatasetEnum = getAllDatasetIds.reduce(
  (obj, item) => (
    (obj[item] = {
      value: item,
    }),
    obj
  ),
  {}
);

const getExtUrl = (datasetId) => {
  var index = beaconDatasets.findIndex(function (dataset) {
    return dataset.id === datasetId;
  });
  return beaconDatasets[index].externalUrl.split('=')[1];
};

module.exports = {
  beaconDatasets,
  getAllDatasetIds,
  getDatasetEnum,
  getExtUrl,
};
