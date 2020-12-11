# Chorus Beacon
The Beacon protocol defines an open standard for genomics data discovery, developed by members of the [Global Alliance for Genomics & Health](https://www.ga4gh.org/). It provides a framework for public web services responding to queries against genomic data collections, for instance from population based or disease specific genome repositories.
This implementation of the Beacon protocol leverages on graphQL to query an ElasticSearch database in which genomic data collections are stored, translating [beacon API version 1.1.0](https://app.swaggerhub.com/apis/ELIXIR-Finland/ga-4_gh_beacon_api_specification/1.0.0-rc1) RESTFUL queries to ElasticSearch via graphQL.

## Description
- client<br>
  The client folder contains a React App that provides an example of a use-case for the API. It follows the interface of the [Elixir beacon network](https://beacon-network.elixir-europe.org/).
- server<br>
  The server folder contains the code for the API translation of RESTFUL queries to Elasticsearch database via graphQL.

## Requirements
- [node.js] installed on the system (https://node.js.org)
- [yarn] installed on the system (https://yarnpkg.com)

### Getting started
- Clone repository and download the dependencies for the server and client:
  ```shell
  git clone --recursive https://github.com/c-BIG/chorus-beacon.git
  ```
- Inside `chorus-beacon`, execute the following commands:
  ```shell
  cd server
  yarn
  cd ../client
  yarn
  ```
- You can then test out either the server or both the `server` and `client`

### Running the server locally
- Create a .env file inside `chorus-beacon/server`, and type in the following:
```shell
ELASTICSEARCH_URL='insert elastic search link here'
API_PORT='specify the port of the server.'
API_URL='specify the URL and port of the server'
REDIRECT='true or false (string)'
TOKEN_ISSUER='jwt token issuer'
```
- Start a local instance of the server (be sure to be in `./server`)
```shell
node server
```
- If you are connected, the console should show where the local instance is set up and a message showing it is connected.
```
Local server setup on http://localhost:4000/
Connected to Elastic Database for sg.edu.a-star.gis.beacon
```

### Running the client locally
- Create a .env file inside `chorus-beacon/client`, and type in the following:
```shell
API_URL = 'specify the URL and port of the server'
REDIRECT = 'true or false (string)'
TOKEN_ISSUER='jwt token issuer'
```
- Start a local instance of the client (be sure to be in `./client`)
```shell
yarn run dev
```
- This will run the client on http://localhost:4000 by default.

#### Testing API on GraphQL interface
- While server is running, open up http://localhost:4000/api
- The API supports the following parameters:
  - referenceName: !Chromosome (Custom class. See `./server/types/Chromosome.js` for more info)
  - referenceBases: !String (Must folow the regex ^([ACGT]+|N)$)
  - assemblyId: !String (currently our database only has GRCh38 conventions and will always output false otherwise)
  - alternateBases: String (Must follow the regex ^([ACGT]+|N)$. Either alternateBases or variantType must be filled, but not both. Can be a wildcard query, simply enter value as "N" when querying)
  - variantType: VariantTypeEnum (Custom class. See `./server/types/VariantTypeEnum.js` for more info)
  - start: Number (Precise start coordinate position. Either 1) Fill only start 2) Fill start and end, 3) Fill startMin, startMax, endMin, endMax is required)
  - end: Number (Precise end coordinate. To be used with start)
  - startMin: Number (Minimum start coordinate)
  - startMax: Number (Maximum start coordinate)
  - endMin: Number (Minimum end coordinate)
  - endMax: Number (Maximum end cooridnate)
  - datasetIds: Array[DatasetIdEnum] (for the full list of dataset ids, see `./server/data_offline/beaconDatasets.js`)
  - includeDatasetResponses: DatasetResponseEnum (Custom class. See `./server/schemas/BeaconDatasetEnum.js` for more info)

- Working example (without optional parameters):
    ```
    {
    alleleQuery(referenceName: _1, referenceBases: "C", start: 124863813,
      alternateBases: "A", assemblyId: "GRCh38"){
        beaconId
        apiVersion
        exists
        alleleRequest {
          referenceName
          assemblyId
          referenceBases
          alternateBases
          start
        }
        error {
          description
          errorMessage
          errorCode
        }
      }
    }
    ```
  - Working example (with optional parameters):
    ```
    {
    alleleQuery(referenceName: _3, referenceBases: "N", startMin: 10210, startMax: 10215, endMin: 10211, endMax: 10216,
      alternateBases: "N", assemblyId: "GRCh38", datasetIds: [sg10kr3], includeDatasetResponses: ALL){
        beaconId
        apiVersion
        exists
        alleleRequest {
          referenceName
          assemblyId
          referenceBases
          alternateBases
          startMin
          startMax
          endMin
          endMax
          datasetIds
          includeDatasetResponses
        }
        datasetAlleleResponses{
          datasetId
          exists
          frequency
          variantCount
          callCount
          sampleCount
          externalUrl
          info {
            key
            value
          }
        }
        error {
          description
          errorMessage
          errorCode
        }
      }
    }
    ```
- Following examples should return a JSON object with the request body.

#### Testing API on /GET query
- This implements a RESTFUL layer wrapped in the GraphQL interface in order to ease the use for retrieving data.
- Provide request params in http://localhost:4000/query?
- While the server is running, copy and paste this link to test the RESTFUL query of the server.
```
localhost:4000/query?referenceName=3&referenceBases=C&start=10212&alternateBases=T&assemblyId=GRCh38&includeDatasetResponses=ALL&datasetIds=sg10kr3
```
- The resulting response will appear on the browser as response.data

#### Testing API on React App
- While client and server is running, open up http://localhost:3000 (by default)
- This will bring you to the browser page where you can then experiment with the querying.
- Click on "Example Variant Query" to generate an allele query which exists in our database and click on "Search".
- The browser should show up as following:
<img width="1061" alt="Screenshot 2020-11-10 at 8 17 48 PM" src="https://user-images.githubusercontent.com/42372568/98673391-3a956a00-2392-11eb-9978-cd82e01eae70.png">

## Contact Us
- Website: https://www.a-star.edu.sg/gis
- Github: https://github.com/c-BIG
