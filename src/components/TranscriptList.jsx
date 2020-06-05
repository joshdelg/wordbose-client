import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { API } from "aws-amplify";
import NewTranscriptCard from "./NewTranscriptCard";
import TranscriptCard from "./TranscriptCard";

const useStyles = makeStyles({
  heading: {
    margin: "16px 0px"
  }
});

function TranscriptList(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [transcripts, setTranscripts] = useState([]);

  const classes = useStyles();
  
  const getTranscripts = async() => {
    console.log("fetching transcripts");
    try {
      const data = await API.get("transcripts", "/transcript");
      setTranscripts(data);
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {

    getTranscripts();
    setIsLoading(false);

  }, []);

  return (
    <div className="transcript-list">
      <Typography className={classes.heading} variant="h2">Your Transcripts</Typography>
      <Grid item container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <NewTranscriptCard transcripts={transcripts} setTranscripts={setTranscripts}/>
        </Grid>
        {isLoading && <Typography>Loading...</Typography>}
        {transcripts && transcripts.map((t, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <TranscriptCard t={t} setTranscripts={setTranscripts}/>
        </Grid>
      ))}
      </Grid>
    </div>
  );

}

export default TranscriptList;