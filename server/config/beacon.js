const beaconOrganization = require("./organizationInfo");
const { beaconDatasets } = require("./beaconDatasets");
const sampleAlleleRequests = require("./sampleAlleleRequests");

const beacon = {
  id: "sg.edu.a-star.gis.beacon",
  name: "Chorus Beacon",
  apiVersion: "v1.0.0-rc1",
  organization: beaconOrganization,
  description:
    "Beacon API web server based on GA4GH specification implemented using ElasticSearch/GraphQL/Node stack",
  version: "v1.0",
  welcomeUrl: "Not yet published",
  alternativeUrl: "Not yet published",
  createDateTime: "2020-07-07",
  updateDateTime: "2020-12-11",
  datasets: beaconDatasets,
  sampleAlleleRequests: sampleAlleleRequests,
};

const beaconInfo = JSON.parse(JSON.stringify(beacon));

module.exports = { beaconInfo };
