import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Card, CardContent, CardActions } from "@material-ui/core";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";

function TranscriptList(props) {

  const [transcripts, setTranscripts] = useState([]);

  const formatDate = (date) => {
    // Format date using momentjs later lol
    return date;
  }

  const formatTranscript = (transcript) => {
    // Add maxlength parameter to config later lol
    return (transcript.length > 100) ? transcript.substring(0, 97) + "..." : transcript;
  }
  
  useEffect(() => {
    const getTranscripts = async() => {
      const data = await API.get("transcripts", "/transcript");
      setTranscripts(data);
    }

    getTranscripts();
  
  }, []);

  return (
    <Grid item container spacing={2}>
      {transcripts && transcripts.map((t, i) => (
      <Grid key={i} item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h4">{t.transcriptName}</Typography>
            <Typography variant="subtitle1">{formatDate(t.date)}</Typography>
            <Typography variant="body1">{formatTranscript(t.transcript)}</Typography>
          </CardContent>
          <CardActions>
            {/* Make link go to actual edit url */}
            <Button component={Link} to={`/${t.transcriptId}`}>Edit</Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
    </Grid>
  );

}

export default TranscriptList;