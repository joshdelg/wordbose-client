import React, { useEffect, useContext } from "react";
import { Grid, Typography } from "@material-ui/core";
import TranscriptList from "./TranscriptList";
import { AuthContext } from "../contexts/AuthContext";
import UnauthHome from "./UnauthHome";
import { Auth } from "aws-amplify";

function Home() {

  const { authData } = useContext(AuthContext);

  return (
    <Grid container direction="column">
      <Grid item>
        {(authData.isAuthenticated) ? <TranscriptList /> : <UnauthHome />}
      </Grid>
    </Grid>
  );
}

export default Home;