import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Card, CardContent, CardActions } from "@material-ui/core";
import { API } from "aws-amplify";
import NewTranscriptCard from "./NewTranscriptCard";
import TranscriptCard from "./TranscriptCard";

function TranscriptList(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [transcripts, setTranscripts] = useState([]);
  
  useEffect(() => {
    const getTranscripts = async() => {
      const data = await API.get("transcripts", "/transcript");
      setTranscripts(data);
    }

    getTranscripts();
    setIsLoading(false);
  
  }, []);

  return (
    <>
      <Typography variant="h2" style={{margin: "16px 0px"}}>Your Transcripts</Typography>
      <Grid item container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <NewTranscriptCard />
        </Grid>
        {isLoading && <Typography>Loading...</Typography>}
        {transcripts && transcripts.map((t, i) => (
        <Grid key={i} item xs={12} sm={6} md={4}>
          <TranscriptCard t={t}/>
        </Grid>
      ))}
      </Grid>
    </>
  );

}

export default TranscriptList;