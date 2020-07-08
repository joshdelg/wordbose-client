import React, { useState } from "react";
import { Typography, Paper, TextField, Button, makeStyles } from "@material-ui/core";
import { API } from "aws-amplify";

const useStyles = makeStyles({
  transcriptPaper: {
    padding: "0.5em",
    "&:hover": {
      background: "#eeeeee",
    }
  },
  transcriptText: {
    maxHeight: "50vh",
    oveflowX: "hidden",
    overflowY: "scroll",
    fontSize: "1.2em"
  },
  transcriptTextField: {
    width: "100%",
  },
  transcriptTextFieldInput: {
    lineHeight: "1.5em",
    padding: "0.5em",
    fontSize: "1.2em"
  },
  transcriptActionButtons: {
    margin: "0.5em 0.5em 0.5em 0",
  }
});

function LegacyTranscriptView(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const classes = useStyles();

  const handleClick = () => {
    setTranscriptText(props.transcript.transcript);
    setIsEditing(true);
  };

  const renderTranscriptPaper = () => (
    <Paper className={classes.transcriptPaper} onClick={handleClick}>
      <Typography className={classes.transcriptText} variant="body1">{props.transcript.transcript}</Typography>
    </Paper>
  );

  const cancelChanges = () => {
    setTranscriptText(props.transcript.transcript);
    setIsEditing(false);
  };

  const saveChanges = async() => {
    props.setTranscript({...props.transcript, transcript: transcriptText, blocks:[]});
    try {
      await API.put("transcripts", `/transcript/${props.transcript.transcriptId}`, {
        body: {
          transcriptName: props.transcript.transcriptName,
          transcript: transcriptText,
          blocks: []
        }
      })
      setIsEditing(false);
    } catch (e) {
      alert(e);
    }
  }

  const renderTranscriptForm = () => (
    <>
      <TextField
        className={classes.transcriptTextField}
        label="Transcript Text"
        variant="outlined"
        rows={12}
        InputProps={{
          className: classes.transcriptTextFieldInput
        }}
        multiline
        value={transcriptText}
        onChange={(e) => setTranscriptText(e.target.value)}
      />
      <Button
        className={classes.transcriptActionButtons}
        color="primary"
        variant="contained"
        onClick={saveChanges}
      >
        Save
      </Button>
      <Button
        className={classes.transcriptActionButtons}
        color="secondary"
        variant="outlined"
        onClick={cancelChanges}
      >
        Cancel
      </Button>
    </>
  );

  return (
    <>
      {isEditing ? renderTranscriptForm() : renderTranscriptPaper()}
    </>
  );

}

export default LegacyTranscriptView;