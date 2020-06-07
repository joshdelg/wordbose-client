import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles, Typography, Paper, TextField } from "@material-ui/core";
import { API } from "aws-amplify";

const useStyles = makeStyles({
  transcriptDetailContainer: {
    width: "100%"
  },
  heading: {
    margin: "16px 0px"
  },
  transcriptContainer: {
    padding: "1em",
    "&:hover": {
      background: "#eeeeee"
    }
  },
  types: {
    "&:hover": {
      background: "#eeeeee"
    }
  },
  transcriptForm: {
    width: "100%"
  }
});

function TranscriptDetail() {

  const { transcriptId } = useParams();
  const [transcript, setTranscript] = useState({});
  const [editing, setEditing] = useState(false);

  const classes = useStyles();

  useEffect(() => {

    const fetchTranscript = async() => {
      console.log('Fetching single transcript');
      try {
        const fetched = await API.get("transcripts", `/transcript/${transcriptId}`);
        setTranscript(fetched.Item);
      } catch (e) {
        alert(e.message);
      }
    };

    fetchTranscript();

  }, [transcriptId]);

  const renderTranscriptPaper = () => (
    <Paper className={classes.transcriptContainer} onClick={handleClick}>
      <Typography variant="body1">{transcript.transcript}</Typography>
    </Paper>
  );

  const renderTranscriptForm = () => (
    <TextField className={classes.transcriptForm} label="Transcript" multiline value={transcript.transcript}/>
  );

  const handleClick = () => {
    setEditing(true);
  }

  return (
    <div className={classes.transcriptDetailContainer}>
      <Typography className={classes.heading} variant="h2">Edit Your Transcript</Typography>
      <Typography className={classes.types} variant="h4">{transcript.transcriptName}</Typography>
      <Typography variant="subtitle2">{transcript.date}</Typography>
      {
        editing ? renderTranscriptForm() :  renderTranscriptPaper()
        
      }
    </div>
  );
}

export default TranscriptDetail;