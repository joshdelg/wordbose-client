import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField, makeStyles} from "@material-ui/core";
import { API, Storage, Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import config from "../config";

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
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const formatFileName = (name) => {
    return name.substring(0, name.lastIndexOf('.')).replace(/\W/g, "") + name.substring(name.lastIndexOf('.'));
  };

  const validateFileType = (file) => {
    return file.type.indexOf("audio") != -1 || file.type.indexOf("video") != -1;
  }

  const validateFileSize = (file) => {
    return file.size <= config.MAX_FILE_SIZE * 1024 * 1024;
  }

  const onFileSelect = (e) => {
    // Check if file is of audio or video MIME type
    if(e.target.files[0]) {
      if(validateFileType(e.target.files[0])) {
        if(validateFileSize(e.target.files[0])) {
          setFile(e.target.files[0]);
          if(!transcriptName) setTranscriptName(formatFileName(e.target.files[0].name));
        } else {
          alert(`Please select a file smaller than ${config.MAX_FILE_SIZE} MB`);
        }
      } else {
        alert("Please select an audio or video file");
        setFile("");
      }
    } else {
      setFile("");
    }
  }

  const validateForm = () => {
    if(file && transcriptName) {
      return validateFileType(file) && validateFileSize(file);
    } else {
      return false;
    }
  }

  const onUpload = async (e) => {
    e.preventDefault();
    
    if(validateForm()) {

      setIsLoading(true);
      
      // Generate transciptId client side
      const transcriptId = uuidv4();
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      
      try {

        const user = await Auth.currentAuthenticatedUser();

        // Call create route
        const newTranscript = await API.post("transcripts", '/transcript', {
          body: {
            transcriptId: transcriptId,
            transcriptName: transcriptName,
            date: moment(),
            fileName: file.name,
            email: user.attributes.email
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

      } catch (e) {
        alert(e);
      }
      setTranscriptName("");
      setIsLoading(false);
      // Close dialog box
      props.onClose();
    } else {
      alert("One or more fields are invalid");
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Transcript</DialogTitle>
        <DialogContent>
          <DialogContentText>Transcript Details</DialogContentText>
          <form className={classes.formContainer} onSubmit={onUpload}>
            <TextField label="Transcript Name" value={transcriptName} onChange={(e) => setTranscriptName(e.target.value)}/>
            <Input type="file" onChange={onFileSelect}/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="outlined" disabled={isLoading} onClick={props.onClose}>Close</Button>
          <Button color="primary" variant="contained" disabled={isLoading} onClick={onUpload}>Upload</Button>
        </DialogActions>
    </Dialog>
  );
}

export default NewTranscriptDialog;