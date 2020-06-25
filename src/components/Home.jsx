import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import TranscriptList from "./TranscriptList";
import { AuthContext } from "../contexts/AuthContext";
import UnauthHome from "./UnauthHome";
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