import React, { useEffect, useContext } from "react";
import { Grid, Typography } from "@material-ui/core";
import TranscriptList from "./TranscriptList";
import { AuthContext } from "../contexts/AuthContext";
import UnauthHome from "./UnauthHome";
import { Auth } from "aws-amplify";

function Home() {

  const { authData, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const onLoad = async() => {
      try {
        await Auth.currentSession();
        dispatch({type: 'LOG_IN'});
      } catch (e) {
        if (e !== 'No current user') {
          alert(e);
        }
      }
    }

    onLoad();
  }, [dispatch]);

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h2">Your Transcripts</Typography>
      </Grid>
      <Grid item>
        {(authData.isAuthenticated) ? <TranscriptList /> : <UnauthHome />}
      </Grid>
    </Grid>
  );
}

export default Home;