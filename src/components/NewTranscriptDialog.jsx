import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField, makeStyles} from "@material-ui/core";
import { API, Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const useStyles = makeStyles({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  }
});

function NewTranscriptDialog(props) {

  const [file, setFile] = useState("");
  const [transcriptName, setTranscriptName] = useState("");
  const classes = useStyles();

  const formatFileName = (name) => {
    return name.substring(0, name.lastIndexOf('.')).replace(/\W/g, "") + name.substring(name.lastIndexOf('.'));
  };

  const onUpload = async () => {
    
    // Generate transciptId client side
    const transcriptId = uuidv4();
    const extension = file.name.substring(file.name.lastIndexOf('.'));
    
    try {
      // Call create route
      const newTranscript = await API.post("transcripts", '/transcript', {
        body: {
          transcriptId: transcriptId,
          transcriptName: transcriptName,
          date: moment(),
          fileName: file.name
        }
      });
      
      // Store attached file in S3 with name of transriptId
      // ! Filename: {transcriptId}.{ext} is necessary for backend
      const stored = await Storage.vault.put(transcriptId + extension, file, {
        contentType: file.type
      });

      // Append new transcript data to transcripts state
      props.setTranscripts([...props.transcripts, {
          transcriptName: newTranscript.transcriptName,
          date: newTranscript.date,
          transcriptId: newTranscript.transcriptId
      }]);

      // Close dialog box
      props.onClose();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Transcript</DialogTitle>
        <DialogContent>
          <DialogContentText>Transcript Details</DialogContentText>
          <form className={classes.formContainer}>
            <TextField label="Transcript Name" value={transcriptName} onChange={(e) => setTranscriptName(e.target.value)}/>
            <Input type="file" onChange={(e) => setFile(e.target.files[0])}/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={props.onClose}>Close</Button>
          <Button color="primary" variant="contained" onClick={onUpload}>Upload</Button>
        </DialogActions>
    </Dialog>
  );
}

export default NewTranscriptDialog;