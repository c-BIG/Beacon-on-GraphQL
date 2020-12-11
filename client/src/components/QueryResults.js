import React from "react";
import queryString from "query-string";
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Link,
} from "@material-ui/core";
import axios from "axios";
import env from "react-dotenv";
import { withStyles } from "@material-ui/styles";
import AStarLogo from "../images/AStarLogo.png";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import ExpandMoreSharpIcon from "@material-ui/icons/ExpandMoreSharp";
import ExpandLessSharpIcon from "@material-ui/icons/ExpandLessSharp";
import ErrorBox from "./ErrorBox";

const styles = (theme) => ({
  queryResults: {
    marginBottom: "5rem",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    marginTop: "1rem",
    width: "100%",
  },
  secondaryText: {
    color: "#888888",
  },
  links: {
    "& > * + *": {
      marginLeft: "1rem",
    },
    paddingTop: "1rem",
    fontSize: "0.9rem",
  },
  successIcon: {
    color: "green",
  },
  failureIcon: {
    color: "red",
  },
  showMore: {
    backgroundColor: "#FDE286",
    "&:hover": {
      backgroundColor: "#F0C122",
    },
  },
  showLess: {
    backgroundColor: "#F0C122",
    "&:hover": {
      backgroundColor: "#FDE286",
    },
    minWidth: "9.3rem",
  },
  header: {
    fontWeight: "bold",
  },
  seperatorBlack: {
    borderBottom: "1px solid #000000",
  },
  seperatorGrey: {
    borderBottom: "2px solid #D7D7D7",
  },
  image: {
    width: "auto",
    height: "6rem",
    paddingLeft: "1rem",
  },
});

class QueryResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      exists: false,
      showMore: false,
      datasetAlleleResponses: [],
      errorMessage: "",
    };
  }

  obtainData = (params) => {
    axios
      .get(`${env.API_URL}/query`, {
        params: {
          assemblyId: params.assemblyId ? params.assemblyId : undefined,
          referenceName: params.referenceName
            ? params.referenceName
            : undefined,
          referenceBases: params.referenceBases
            ? params.referenceBases
            : undefined,
          alternateBases: params.alternateBases
            ? params.alternateBases
            : undefined,
          variantType: params.variantType ? params.variantType : undefined,
          start: params.start ? params.start : undefined,
          end: params.end ? params.end : undefined,
          startMin: params.startMin ? params.startMin : undefined,
          startMax: params.startMax ? params.startMax : undefined,
          endMin: params.endMin ? params.endMin : undefined,
          endMax: params.endMax ? params.endMax : undefined,
          datasetIds: params.datasetIds ? params.datasetIds : undefined,
          includeDatasetResponses: params.includeDatasetResponses
            ? params.includeDatasetResponses
            : undefined,
        },
      })
      .then((res) => {
        if (res.data.error) {
          this.setState({
            errorMessage: res.data.error.errorMessage,
            isLoading: false,
            exists: false,
          });
        } else {
          this.setState({
            isLoading: false,
            exists: res.data.exists,
            datasetAlleleResponses: res.data.datasetAlleleResponses,
            errorMessage: "",
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          exists: null,
          datasetAlleleResponses: "",
          errorMessage: "Connection Error. Please check that you have connection to the Internet, and have access to the API/Database.",
        });
      });
  };

  handleResultQuery = () => {
    this.setState({
      showMore: !this.state.showMore,
    });
  };

  componentDidMount() {
    this.obtainData(queryString.parse(this.props.location.search));
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({
        showMore: false,
        isLoading: true,
      });
      this.obtainData(queryString.parse(this.props.location.search));
    }
  }

  render() {
    const { classes } = this.props;

    const showResultIcon = (exists) => {
      return exists ? (
        <CheckCircleIcon fontSize="large" className={classes.successIcon} />
      ) : (
        <CancelIcon fontSize="large" className={classes.failureIcon} />
      );
    };

    const listAlleleResponses = () => {
      return this.state.datasetAlleleResponses.map(function (response) {
        return (
          <Grid
            container
            item
            className={classes.seperatorBlack}
            key={Object.entries(response).join()}
          >
            <Grid item xs={1}>
              <Typography> {response.exists ? "Yes" : "No"} </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography> {response.datasetId} </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                {response.exists
                  ? `${response.info[2].value} > ${response.info[3].value}`
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>
                {response.exists ? `${response.info[4].value}` : "-"}{" "}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                {response.exists
                  ? `${response.info[0].value}:${response.info[1].value}-${
                      parseInt(response.info[1].value) +
                      response.info[2].value.length
                    }`
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>
                {response.exists ? `${response.variantCount}` : "-"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>
                {response.exists ? `${response.callCount}` : "-"}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                {response.exists
                  ? `${parseFloat(response.frequency).toFixed(10)}`
                  : "-"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>
                {response.exists ? `${response.sampleCount}` : "-"}
              </Typography>
            </Grid>
          </Grid>
        );
      });
    };

    const showMoreDetails = (showMore) => {
      return showMore ? (
        <Grid container style={{ marginTop: "1em" }} spacing={1}>
          <Grid container className={classes.seperatorGrey} item xs={12}>
            <Grid item xs={1}>
              <Typography className={classes.header}>Exists</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.header}>Dataset</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.header}>Variant</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.header}>VT</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.header}>Region</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.header}>AC</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.header}>AN</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography className={classes.header}>AF</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography className={classes.header}>Sample</Typography>
            </Grid>
          </Grid>
          {listAlleleResponses()}
        </Grid>
      ) : (
        ""
      );
    };

    const showSuccess = () => {
      return (
        <Card className={classes.card} elevation={0} variant="outlined">
          <Grid container direction="row" justity="space-between">
            <Grid container item xs={8}>
              <img
                src={AStarLogo}
                className={classes.image}
                alt="website logo"
              />
              <CardContent>
                <Typography>A-STAR, Genome Institute of Singapore</Typography>
                <Typography className={classes.secondaryText}>
                  Production Beacon
                </Typography>
                <Typography className={classes.links}>
                  <Link href="https://www.a-star.edu.sg/gis">Visit Us</Link>
                  <Link href={`${process.env.API_URL}/api`}>BeaconAPI</Link>
                  <Link href="https://form.gov.sg/#!/5da7be432bf10c001247c26c">
                    Contact Us
                  </Link>
                </Typography>
              </CardContent>
            </Grid>
            <Grid container item xs={4} justify="flex-end">
              <CardContent>
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    {this.state.isLoading
                      ? "Loading data"
                      : showResultIcon(this.state.exists)}
                  </Grid>
                  <Grid item>
                    <Button
                      disableElevation={true}
                      variant="contained"
                      className={
                        this.state.showMore
                          ? classes.showLess
                          : classes.showMore
                      }
                      onClick={this.handleResultQuery}
                      endIcon={
                        this.state.showMore ? (
                          <ExpandLessSharpIcon />
                        ) : (
                          <ExpandMoreSharpIcon />
                        )
                      }
                    >
                      {this.state.showMore ? "show less" : "show more"}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      );
    };

    return (
      <Grid container className={classes.queryResults}>
        {this.state.errorMessage ? (
          <ErrorBox errorMessage={this.state.errorMessage} />
        ) : (
          <Grid container>
            {showSuccess()}
            {showMoreDetails(this.state.showMore)}
          </Grid>
        )}
      </Grid>
    );
  }
}
export default withStyles(styles)(QueryResults);
