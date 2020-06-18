import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles, Button, TableContainer, Table, Paper, TableHead, TableCell, TableBody, TableRow, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { API } from "aws-amplify";
import NewTranscriptCard from "./NewTranscriptCard";
import TranscriptCard from "./TranscriptCard";
import TranscriptTable from "./TranscriptTable";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0px"
  }
});

function TranscriptList(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [transcripts, setTranscripts] = useState([]);
  const [viewMode, setViewMode] = useState('card');

  const classes = useStyles();

  useEffect(() => {

    const getTranscripts = async() => {
      console.log("Fetching transcripts");
      try {
        const data = await API.get("transcripts", "/transcript");
        setTranscripts(data);
      } catch (e) {
        alert(e);
      }
    }

    getTranscripts();
    setIsLoading(false);

  }, []);

  const renderTranscriptCards = () => (
    <Grid item container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <NewTranscriptCard transcripts={transcripts} setTranscripts={setTranscripts}/>
      </Grid>
      {isLoading && <Typography>Loading...</Typography>}
      {transcripts && transcripts.map((t, i) => (
      <Grid key={i} item xs={12} sm={6} md={4}>
        <TranscriptCard transcripts={transcripts} t={t} setTranscripts={setTranscripts}/>
      </Grid>
    ))}
    </Grid>
  )

  return (
    <div className="transcript-list">
      <div className={classes.header}>
        <Typography variant="h2">Your Transcripts</Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">View Mode</FormLabel>
          <RadioGroup row value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <FormControlLabel value="card" control={<Radio />} label="Card View" />
            <FormControlLabel value="list" control={<Radio />} label="List View" />
          </RadioGroup>
        </FormControl>
      </div>
      {viewMode === "card" ? renderTranscriptCards() : <TranscriptTable setTranscripts={setTranscripts} transcripts={transcripts} />}
    </div>
  );

}

export default TranscriptList;