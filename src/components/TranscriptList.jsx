import React from "react";
import { Grid, Typography, Button, Card, CardContent, CardActions } from "@material-ui/core";
import { Link } from "react-router-dom";

function TranscriptList(props) {

  const formatDate = (date) => {
    // Format date using momentjs later lol
    return date;
  }

  const formatTranscript = (transcript) => {
    // Add maxlength parameter to config later lol
    return (transcript.length > 100) ? transcript.substring(0, 97) + "..." : transcript;
  }

  return (
    <Grid item container spacing={2}>
      {props.transcripts.map((t, i) => (
      <Grid item xs={4}>
        <Card>
          <CardContent>
            <Typography variant="h3">{t.transcriptName}</Typography>
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