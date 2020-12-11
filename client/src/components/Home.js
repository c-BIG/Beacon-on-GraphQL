import React from "react";
import { Route } from "react-router-dom";
import { Grid } from "@material-ui/core";
import ChorusLogo from "../images/ChorusLogo.png";
import QueryBar from "./QueryBar";
import QueryResults from "./QueryResults";

class Home extends React.Component {
  render() {
    return (
      <div
        style={{
          marginLeft: "20rem",
          marginRight: "20rem",
          alignItems: "center",
        }}
      >
        <Route path="/" render={ () => (
          <Grid container>
            <img
              src={ChorusLogo}
              alt="website logo"
              style={{
                height: "10rem",
                width: "auto",
                display: "block",
                margin: "0 auto",
                padding: "0 auto",
              }}
            />
            <QueryBar />
          </Grid>
        )} />
  
        <Route path="/results" alignItems="flex" component={QueryResults} />
      </div>      
    );
  }
}

export default Home;
