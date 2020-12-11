const Bottleneck = require("bottleneck");
const express = require("express");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const beaconQuery = require("./queries/beaconQuery");
const bodyParser = require("body-parser");
const { schema } = require("./schemas/index");
const graphqlHTTP = require("express-graphql");
const alleleQuery = require("./queries/alleleQuery");
const cors = require("cors");
const errorCheck = require("./schemas/utils/errorCheck");
const resolveQuery = require("./schemas/utils/resolveQuery");
const { Client } = require("@elastic/elasticsearch");

const cookieParser = require('cookie-parser');
const jwt_decode = require('jwt-decode');

// Load environment variable
dotenv.config();
const PORT = process.env.API_PORT || "4000";
const API_URL = new URL("api", process.env.API_URL);
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Setup the server routing with express.
const server = express();
server.use(cors());
server.options("*", cors());

server.use(cookieParser())
server.set('trust proxy', true)

server.use((request, response, next) => {
  // get cookies
  var isRedirect = process.env.REDIRECT === 'false' ? false : true;
  var cookieVal = request.cookies['auth_accessToken']

  if (typeof cookieVal !== 'undefined' && cookieVal !== null ) {
    let decoded = jwtDecode(cookieVal)

    if ((new Date().getTime() / 1000) < decoded.exp // Check if not expired
      && decoded.iss.includes(process.env.TOKEN_ISSUER) // Check if same ISS
    ) { 
      console.log('Cookie is valid')
      isRedirect = false
    }
  }

  if (isRedirect === true) { //redirect to authentication page
    console.log('COOKIE:', 'redirected')
    response.clearCookie('auth_accessToken', {path: '/'}) //clear cookies
    response.clearCookie('auth_idToken', {path: '/'}) //clear cookies
    response.redirect(302, `http://${request.get('host')}/auth`)
  }else {
    console.log('action', "GO ON")
    next() // continue to next block of code
  }

})

// Setup the ElasticSearch Client.
const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
});

// Test code to check console if connected to database.
client.cluster.health((err, res) => {
  if (err) throw err;
  console.log("Connected to Elastic Database for sg.edu.a-star.gis.beacon");
});

const esLimiter = new Bottleneck({
  maxConcurrent: JSON.parse("100" || process.env.MAX_CONCURRENT_ES_REQUESTS),
  highWater: JSON.parse("1000" || process.env.MAX_QUEUED_ES_REQUESTS),
  strategy: Bottleneck.strategy.OVERFLOW,
});

esLimiter.on("error", (error) => {
  logger.error(error);
});

const scheduleElasticsearchRequest = (fn) => {
  return new Promise((resolve, reject) => {
    let canceled = false;

    // If task sits in the queue for more than 30s, cancel it and notify the user.
    const timeout = setTimeout(() => {
      canceled = true;
      // warnRequestTimedOut()
      reject(new UserVisibleError("Request timed out"));
    }, 30000);

    esLimiter
      .schedule(() => {
        // When the request is taken out of the queue...

        // Cancel timeout timer.
        clearTimeout(timeout);

        // If the timeout has expired since the request was queued, do nothing.
        if (canceled) {
          return Promise.resolve(undefined);
        }

        // Otherwise, make the request.
        return fn();
      })
      .then(resolve, (err) => {
        // If Bottleneck refuses to schedule the request because the queue is full,
        // notify the user and cancel the timeout timer.
        if (err.message === "This job has been dropped by Bottleneck") {
          clearTimeout(timeout);
          // warnRequestDropped()
          reject(new UserVisibleError("Service overloaded"));
        }

        // Otherwise, forward the error.
        reject(err);
      });
  });
};

// This wraps the ES methods used by the API and sends them through the rate limiter
const limitedClient = {
  clearScroll: client.clearScroll.bind(client),
  search: (...args) =>
    scheduleElasticsearchRequest(() => client.search(...args)),
};

/**
 * Uses PATH variable to get a JSON response of this beaconAPI information.
 * @returns {JSON} Object type of beaconInfo (read: ./schemas/beacon/beaconInformation)
 */
server.get("/", (req, res) => {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: beaconQuery }),
  })
    .then((res) => res.json())
    .then((data) => res.send(data.data ? data.data.beacon : data.errors))
    .catch((error) => console.error("Error:", error));
});

/**
 * Uses Query variable to get a JSON response indicating if the specified allele exists in the ElasticSearch Database,
 *   using graphql as middle-ware.
 * @param {String} referenceName The chromosome identification of the allele.
 * @param {String} referenceBases The reference bases of the allele.
 * @param {Number} start The position of the allele.
 * @param {String} alternateBases The alternate bases of the allele.
 * @param {Enum} includeDatasetResponses the enumerator on type of exists data to display.
 * @returns {JSON} Object type of alleleResponse of the resultant query (read: ./schemas/allele_request/alleleResponse).
 * @example http://localhost:4000/query?referenceName=1&referenceBases=C&start=124863813&alternateBases=A&assemblyId=GRCh38&includeDatasetResponses=ALL&datasetIds=sg10kr3,sg10kr1
 */
server.get("/query", (req, res) => {
  const errorValue = errorCheck(req.query);
  if (errorValue) {
    res.send(resolveQuery(req.query, null, null, errorValue));
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: alleleQuery(req.query) }),
    })
      .then((res) => res.json())
      .then((data) => {
        res.send(data.data ? data.data.alleleQuery : data.errors);
      })
      .catch((error) => console.error("Error:", error));
  }
});

/**
 * Uses POST method to get a JSON response indicating if the specified allele exists in the ElasticSearch Database,
 *   using graphql as middle-ware.
 * @param {String} referenceName The chromosome identification of the allele.
 * @param {String} referenceBases The reference bases of the allele.
 * @param {Number} start The position of the allele.
 * @param {String} alternateBases The alternate bases of the allele.
 * @returns {JSON} Object type of alleleResponse of the resultant query (read: ./schemas/allele_request/alleleResponse).
 * @example go to localhost:4000/postform and fill up the following:
 *   Reference Name: 1
 *   Reference Bases: C
 *   Start: 124863813
 *   Alternate Bases: A
 *   Assembly Id: GRCh38
 *   includeDatasetResponses: All
 *   datasetIds = ["sg10kr3", "sg10kr1"]
 */
server.post("/query", urlencodedParser, (req, res) => {
  const errorValue = errorCheck(req.body);
  if (errorValue) {
    res.send(resolveQuery(req.body, null, null, errorValue));
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: alleleQuery(req.body) }),
    })
      .then((res) => res.json())
      .then((data) => {
        res.send(data.data ? data.data.alleleQuery : data.errors);
      })
      .catch((error) => console.error("Error:", error));
  }
});

server.use(
  "/api",
  graphqlHTTP({
    schema,
    graphiql: true,
    // ctx argument in graphql resolve function.
    context: {
      database: {
        client: limitedClient,
      },
    },
  })
);

server.listen(PORT, () => {
  console.log("Local server setup on " + PORT);
});
