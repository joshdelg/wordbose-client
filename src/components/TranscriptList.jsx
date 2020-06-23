import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, IconButton, InputAdornment } from "@material-ui/core";
import { API } from "aws-amplify";
import NewTranscriptCard from "./NewTranscriptCard";
import TranscriptCard from "./TranscriptCard";
import TranscriptTable from "./TranscriptTable";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0px"
  },
  searchAndNew: {
    display: "flex",
    margin: "1em 0 1em 0"
  },
  searchbar: {
    flex: "1",
    margin: "0 1em 0 0"
  },
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
      {isLoading && <Typography>Loading...</Typography>}
      {transcripts && transcripts.map((t, i) => (
      <Grid key={i} item xs={12} sm={6} md={4}>
        <TranscriptCard transcripts={transcripts} t={t} setTranscripts={setTranscripts}/>
      </Grid>
    ))}
    </Grid>
  )
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("searching!");
  }

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
      <div className={classes.searchAndNew}>
        <form className={classes.searchbar} onSubmit={handleSearchSubmit}>
          <TextField fullWidth variant="outlined" label="Search Transcripts" InputProps={{
            endAdornment: <InputAdornment position="end"><IconButton type="submit"><Search /></IconButton></InputAdornment>
          }} />
        </form>
        <NewTranscriptCard className={classes.newButton} transcripts={transcripts} setTranscripts={setTranscripts}/>
      </div>
      {viewMode === "card" ? renderTranscriptCards() : <TranscriptTable setTranscripts={setTranscripts} transcripts={transcripts} />}
    </div>
  );

}

export default TranscriptList;