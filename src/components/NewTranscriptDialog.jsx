import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField, makeStyles, Typography} from "@material-ui/core";
import { API, Storage, Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import config from "../config";

const useStyles = makeStyles({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  formItem: {
    margin: "0.25em"
  }
});

function NewTranscriptDialog(props) {

  const [file, setFile] = useState("");
  const [transcriptName, setTranscriptName] = useState("");
  const [numSpeakers, setNumSpeakers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fileDuration, setFileDuration] = useState(0);
  const classes = useStyles();

  const formatFileName = (name) => {
    return name.substring(0, name.lastIndexOf('.')).replace(/\W/g, "") + name.substring(name.lastIndexOf('.'));
  };

  const validateFileType = (file) => {
    return file.type.indexOf("audio") != -1 || file.type.indexOf("video") != -1;
  }

  const validateFileDuration = (file) => {
    console.log("Duration:", fileDuration);
    if(fileDuration <= config.MAX_FILE_DURATION) {
      return true;
    } else {
      alert(`Please choose a file shorter than ${config.MAX_FILE_DURATION} seconds.`);
      return false;
    }
  }

  const onFileSelect = (e) => {
    // Check if file is of audio or video MIME type
    if(e.target.files[0]) {
      if(validateFileType(e.target.files[0])) {
        setFile(e.target.files[0]);
        if(!transcriptName) setTranscriptName(formatFileName(e.target.files[0].name));

        const player = document.createElement(e.target.files[0].type.substring(0, e.target.files[0].type.indexOf("/")));
        player.preload = 'metadata';
        player.onloadedmetadata = () => {
          setFileDuration(player.duration);
        }
        player.src = URL.createObjectURL(e.target.files[0]);
      } else {
        alert("Please select an audio or video file");
        setFileDuration(0);
        setFile("");
      }
    } else {
      setFileDuration(0);
      setFile("");
    }
  }

  const handleNumSpeakersChange = (e) => {
    const num = e.target.value;
    if(num < 1) {
      setNumSpeakers(1);
    } else if(num > 10) {
      setNumSpeakers(10);
    } else {
      setNumSpeakers(num);
    }
  }

  const validateForm = () => {
    if(file && transcriptName) {
      return validateFileType(file) && validateFileDuration(file);
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
            email: user.attributes.email,
            numSpeakers: numSpeakers
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
      setNumSpeakers(1);
      setFileDuration(0);
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
          <TextField
            className={classes.formItem}
            label="Transcript Name"
            value={transcriptName}
            onChange={(e) => setTranscriptName(e.target.value)}
          />
          <TextField
            className={classes.formItem}
            label="Maximum Number of Speakers"
            type="number"
            value={numSpeakers}
            onChange={handleNumSpeakersChange}
          />
          <Input
            className={classes.formItem}
            type="file"
            onChange={onFileSelect}
          />
          {fileDuration != 0 && <Typography className={classes.formItem} variant="body1">{`Duration: ${Math.floor(fileDuration / 60)} minutes ${Math.round(fileDuration % 60)} seconds`}</Typography>}
        </form>
        
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          disabled={isLoading}
          onClick={props.onClose}
        >
          Close
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={isLoading}
          onClick={onUpload}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewTranscriptDialog;