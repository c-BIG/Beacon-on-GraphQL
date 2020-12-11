import React from "react";
import axios from "axios";
import env from "react-dotenv";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
  Switch,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
const parseURLParams = require("../utils/parseURLParams");

const styles = (theme) => ({
  heading: {
    marginLeft: "2rem",
    marginRight: "1rem",
  },
  headingRadio: {
    marginLeft: "2rem",
    marginRight: "1rem",
    paddingTop: "0.4rem",
  },
  title: {
    color: "#648BDE",
    marginTop: "0.5rem",
  },
  selectBox: {
    width: "10%",
    height: "100%",
  },
  textField: {
    width: "67%",
  },
  searchButton: {
    padding: "0.95rem 1rem",
    width: "20%",
    backgroundColor: "#65D3BC",
    "&:hover": {
      backgroundColor: "#AAD8CF",
    },
  },
  formControl: {
    backgroundColor: "#89ADDD",
    width: "13%",
  },
  button: {
    marginTop: "1rem",
    minWidth: "20%",
  },
  gridInput: {
    maxWidth: "24rem",
    maxHeight: "1.8rem",
    marginBottom: "0.3rem",
  },
  inputField: {
    maxWidth: "30%",
    height: "1.5rem",
  },
  advancedSearchButton: {
    height: "40%",
    width: "40%",
    backgroundColor: "#65D3BC",
    "&:hover": {
      backgroundColor: "#AAD8CF",
    },
  },
  searchQuery: {
    marginBottom: "1rem",
  },
});

// Reference and alternate bases follow this regular expression.
const regexBases = /^([ACGT]+|N)$/;

class QueryBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryInput: {
        assemblyId: "GRCh38",
        referenceName: "",
        referenceBases: "",
        alternateBases: "",
        start: "",
        end: "",
        variantType: "",
        startMin: "",
        startMax: "",
        endMin: "",
        endMax: "",
        includeDatasetResponses: "ALL",
        datasetIds: "",
      },
      datasetIds: {
        sg10kr3: true,
        sg10kr2: true,
        sg10kr1: true,
      },
      basicInput: "",
      isBasicQuery: true,
      position: "exact",
      transformation: "base",
    };
  }

  handleQueryChange = (e) => {
    let statusCopy = Object.assign({}, this.state);
    if (e.target.name === "basicInput") {
      this.setState({
        basicInput: e.target.value,
      });
    } else {
      statusCopy.queryInput[e.target.name] = e.target.value;
      this.setState(statusCopy);
    }
  };

  wipeInputs = (...args) => {
    let statusCopy = Object.assign({}, this.state);
    if (args.length) {
      Object.values(args).forEach((param) => {
        statusCopy.queryInput[param] = "";
      });
    } else {
      Object.keys(this.state.queryInput).forEach((param) => {
        if (param !== "assemblyId" && param !== "includeDatasetResponses") {
          statusCopy.queryInput[param] = "";
        }
      });
      Object.keys(this.state.datasetIds).forEach((id) => {
        statusCopy.datasetIds[id] = true;
      });
    }
    statusCopy.basicInput = "";
    this.setState(statusCopy);
  };

  toggleQuery = () => {
    this.wipeInputs();
    this.setState({
      isBasicQuery: !this.state.isBasicQuery,
      position: "exact",
      transformation: "base",
    });
  };

  toggleCheck = (e) => {
    let statusCopy = Object.assign({}, this.state);
    statusCopy.datasetIds[e.target.name] = e.target.checked;
    this.setState(statusCopy);
  };

  toggleRadio = (e) => {
    if (e.target.name === "position") {
      this.wipeInputs(
        "start",
        "end",
        "startMin",
        "startMax",
        "endMin",
        "endMax"
      );
    } else if (e.target.name === "transformation") {
      this.wipeInputs("alternateBases", "variantType");
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleRoute = () => {
    let statusCopy = Object.assign({}, this.state);
    if (this.state.basicInput) {
      var inputs = this.state.basicInput.split(" ");
      statusCopy.queryInput.referenceName = inputs[0];
      statusCopy.queryInput.start = inputs[2];
      statusCopy.queryInput.referenceBases = inputs[3];
      statusCopy.queryInput.alternateBases = regexBases.test(inputs[5])
        ? inputs[5]
        : "";
      statusCopy.queryInput.variantType = regexBases.test(inputs[5])
        ? ""
        : inputs[5];
    }
    this.setState(statusCopy);

    var paramsURLs = parseURLParams(
      this.state.queryInput,
      this.state.datasetIds
    );
    this.props.history.push(`/results?${paramsURLs}`);
  };

  fillInput = (e) => {
    axios
      .get(env.API_URL, {})
      .then((res) => {
        // If it is in basic query
        if (this.state.isBasicQuery) {
          var example = res.data.sampleAlleleRequests[0];
          var exampleInput = `${example.referenceName} : ${example.start} ${example.referenceBases} > ${example.alternateBases}`;
          this.setState({
            basicInput: exampleInput,
          });
        } else {
          let statusCopy = Object.assign({}, this.state);
          let example = {};
          if (
            this.state.position === "exact" &&
            this.state.transformation === "base"
          ) {
            example = res.data.sampleAlleleRequests[1];
          } else if (
            this.state.position === "exact" &&
            this.state.transformation !== "base"
          ) {
            example = res.data.sampleAlleleRequests[2];
          } else if (
            this.state.position === "range" &&
            this.state.transformation === "base"
          ) {
            example = res.data.sampleAlleleRequests[3];
          } else if (
            this.state.position === "range" &&
            this.state.transformation !== "base"
          ) {
            example = res.data.sampleAlleleRequests[4];
          }
          Object.entries(example).forEach((param) => {
            statusCopy.queryInput[param[0]] = param[1] !== null ? param[1] : "";
          });
          this.setState(statusCopy);
        }
      })
      .catch((err) => console.log(err));
  };

  render(styles) {
    const error =
      Object.entries(this.state.datasetIds).filter((id) => id[1]).length === 0;

    const { classes } = this.props;

    const inputField = (label, name) => {
      return (
        <Grid
          container
          direction="row"
          className={classes.gridInput}
          key={name}
        >
          <Typography variant="body1" className={classes.heading}>
            {label}:
          </Typography>
          {name === "assemblyId" ? (
            <Select
              name="assemblyId"
              className={classes.inputField}
              value={this.state.queryInput.assemblyId}
              onChange={this.handleQueryChange}
            >
              <MenuItem id="assemblyId" value="GRCh38">
                GRCh38
              </MenuItem>
              <MenuItem id="assemblyId" value="GRCh37">
                GRCh37
              </MenuItem>
            </Select>
          ) : (
            <TextField
              name={name}
              value={this.state.queryInput[name]}
              className={classes.inputField}
              onChange={this.handleQueryChange}
            />
          )}
        </Grid>
      );
    };

    const radioField = (label, name, opt1, value1, opt2, value2) => {
      return (
        <Grid
          container
          item
          className={classes.gridInput}
          direction="row"
          key={name}
        >
          <Typography variant="body1" className={classes.headingRadio}>
            {label}:
          </Typography>
          <RadioGroup row name={name} defaultValue={value1}>
            <FormControlLabel
              value={value1}
              control={
                <Radio color="primary" size="small" style={{ margin: "0 0" }} />
              }
              label={<Typography variant="body1">{opt1}</Typography>}
              onChange={this.toggleRadio}
            />
            <FormControlLabel
              value={value2}
              control={<Radio color="primary" size="small" />}
              label={<Typography variant="body1">{opt2}</Typography>}
              onChange={this.toggleRadio}
            />
          </RadioGroup>
        </Grid>
      );
    };

    const createDatasetSwitches = () => {
      let datasetCopy = Object.assign({}, this.state.datasetIds);
      let toggleCheck = this.toggleCheck;
      return Object.keys(this.state.datasetIds).map(function (id) {
        return (
          <FormControlLabel
            key={id}
            control={
              <Switch
                checked={datasetCopy[id]}
                onChange={toggleCheck}
                name={id}
                color="primary"
                size="small"
              />
            }
            label={id}
          />
        );
      });
    };

    const advancedSearchQuery = () => {
      return (
        <Grid container>
          <Grid container direction="column" className={classes.searchQuery}>
            <Grid container item direction="column">
              <Typography variant="h6" className={classes.title}>
                Variant Location
              </Typography>
              {inputField("Assembly", "assemblyId")}
              {inputField("Chromosome", "referenceName")}
              {radioField(
                "Coordinates",
                "position",
                "Exact",
                "exact",
                "Range",
                "range"
              )}
              {this.state.position === "exact" ? (
                <Grid container>
                  {inputField("Start", "start")}
                  {inputField("End", "end")}
                </Grid>
              ) : (
                <Grid container>
                  <Grid container item direction="row">
                    {inputField("StartMin", "startMin")}
                    {inputField("StartMax", "startMax")}
                  </Grid>
                  <Grid container item direction="row">
                    {inputField("EndMin", "endMin")}
                    {inputField("EndMax", "endMax")}
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid container item direction="column">
              <Typography variant="h6" className={classes.title}>
                Variant Transformation
              </Typography>
              {inputField("Reference Base(s)", "referenceBases")}
              {radioField(
                "Transformation",
                "transformation",
                "Base",
                "base",
                "Variant type",
                "variantType"
              )}
              {this.state.transformation === "base" ? (
                <Grid container item>
                  {inputField("Alternate Base(s)", "alternateBases")}
                </Grid>
              ) : (
                <Grid container item>
                  {inputField("Variant Type", "variantType")}
                </Grid>
              )}
            </Grid>

            <Grid container item direction="column">
              <Typography variant="h6" className={classes.title}>
                Filter Datasets
              </Typography>
              <Grid container direction="row" justify="space-between">
                <Grid item container xs={6}>
                  <FormControl
                    required
                    error={error}
                    className={classes.heading}
                  >
                    <FormGroup>{createDatasetSwitches()}</FormGroup>
                    <FormHelperText>Please select at least 1</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  container
                  xs={6}
                  justify="flex-end"
                  alignItems="flex-end"
                >
                  <Button
                    type="submit"
                    variant="outlined"
                    disableElevation={true}
                    onClick={this.handleRoute}
                    className={classes.advancedSearchButton}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    };

    const basicSearchQuery = () => {
      return (
        <Grid container className={classes.searchQuery}>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              name="assemblyId"
              value={this.state.queryInput.assemblyId}
              onChange={this.handleQueryChange}
            >
              <MenuItem id="assemblyId" value="GRCh38">
                GRCh38
              </MenuItem>
              <MenuItem id="assemblyId" value="GRCh37">
                GRCh37
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="basicInput"
            label="Chromosome : Position ReferenceBases > AlternateBases/Variant Type"
            variant="outlined"
            value={this.state.basicInput}
            onChange={this.handleQueryChange}
            className={classes.textField}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="outlined"
            disableElevation={true}
            className={classes.searchButton}
            onClick={this.handleRoute}
          >
            Search
          </Button>
        </Grid>
      );
    };

    return (
      <Grid container direction="column" alignItems="center">
        <Grid container>
          {this.state.isBasicQuery ? basicSearchQuery() : advancedSearchQuery()}
        </Grid>
        <Grid container justify="space-between">
          <Button
            className={classes.button}
            variant="outlined"
            onClick={this.fillInput}
          >
            Example Variant Query
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            onClick={this.toggleQuery}
          >
            {this.state.isBasicQuery ? "Advanced Search" : "Basic Search"}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

QueryBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(QueryBar));
