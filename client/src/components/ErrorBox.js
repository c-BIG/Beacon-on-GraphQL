import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  errorText: {
    backgroundColor: "#F9E6E3",
    color: "#EE0754",
    borderLeft: "5px solid red",
    width: "100%",
    padding: "1rem 1rem",
    marginTop: "1rem",
  },
}));

const ErrorBar = (prop) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Typography className={classes.errorText}>{prop.errorMessage}</Typography>
    </Grid>
  );
};

export default ErrorBar;
