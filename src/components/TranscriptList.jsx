import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useMediaQuery, useTheme, Button } from "@material-ui/core";
import { API } from "aws-amplify";
import TranscriptCard from "./TranscriptCard";
import TranscriptTable from "./TranscriptTable";
import Searchbar from "./Searchbar";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import { Link } from "react-router-dom";
import { Add } from "@material-ui/icons";
import { onError } from "../libs/errorLib";

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
  }
});

function TranscriptList(props) {

  const [isLoading, setIsLoading] = useState(true);
  const [transcripts, setTranscripts] = useState([]);
  const [viewMode, setViewMode] = useState('card');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  useEffect(() => {

    const getTranscripts = async() => {

      try {
        const data = await API.get("transcripts", "/transcript");
        setTranscripts(data);
      } catch (e) {
        onError(e);
        alert("Error fetching transcripts. Please reload to try again.");
      }
    }

    getTranscripts();
    setIsLoading(false);

  }, []);

  const renderTranscriptCards = () => (
    <Grid container spacing={2}>
      {isLoading && <Typography>Loading...</Typography>}
      {transcripts.map((t, i) => (
      <Grid key={i} item xs={12} sm={6} md={4}>
        <TranscriptCard transcripts={transcripts} t={t} setTranscripts={setTranscripts}/>
      </Grid>
    ))}
    </Grid>
  )

  return (
    <div className="transcript-list">
      <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Home" />
      <div className={classes.header} style={(isSmall) ? {flexDirection: "column"} : {}}>
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
        <Searchbar transcripts={transcripts} setTranscripts={setTranscripts}/>
        {/*<NewTranscriptCard className={classes.newButton} transcripts={transcripts} setTranscripts={setTranscripts}/>*/}
        <Button className={classes.newButton} component={Link} to="/new" variant="contained" color="primary" startIcon={<Add />}>New</Button>
      </div>
      {viewMode === "card" ? renderTranscriptCards() : <TranscriptTable setTranscripts={setTranscripts} transcripts={transcripts} />}
    </div>
  );

}

export default TranscriptList;