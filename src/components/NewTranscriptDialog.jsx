import React, { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField, makeStyles, Typography} from "@material-ui/core";
import { API, Storage, Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import config from "../config";
import Checkout from "./Checkout";

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
  const [requiresPayment, setRequiresPayment] = useState(false);

  const classes = useStyles();

  const formatFileName = (name) => {
    return name.substring(0, name.lastIndexOf('.')).replace(/\W/g, "") + name.substring(name.lastIndexOf('.'));
  };

  const validateFileType = (file) => {
    return file.type.indexOf("audio") != -1 || file.type.indexOf("video") != -1;
  }

  const validateFileDuration = (fileDuration) => {
    console.log("Duration:", fileDuration);
    // !!!!! PLEASE UNCOMMENT
    // if(fileDuration <= config.MAX_FILE_DURATION) {
    //   return true;
    // } else {
    //   alert(`Please choose a file shorter than ${config.MAX_FILE_DURATION} seconds.`);
    //   return false;
    // }
    if(fileDuration > config.DURATION_FREE_THRESHOLD) {
      setRequiresPayment(true);
      console.log("File is", fileDuration, "which requires payment");
    } else {
      setRequiresPayment(false);
      console.log("file is short enough so free");
    }
    return true;
  }

  const onFileSelect = (e) => {
    // Check if file is of audio or video MIME type
    if(e.target.files[0]) {
      if(validateFileType(e.target.files[0])) {
        setFile(e.target.files[0]);
        if(!transcriptName) setTranscriptName(formatFileName(e.target.files[0].name));

        // Determine audio duration
        const player = document.createElement(e.target.files[0].type.substring(0, e.target.files[0].type.indexOf("/")));
        player.preload = 'metadata';
        player.onloadedmetadata = () => {
          setFileDuration(player.duration);
          validateFileDuration(player.duration);
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
      setRequiresPayment(false);
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
      return validateFileType(file) && validateFileDuration(fileDuration);
    } else {
      return false;
    }
  }

  const uploadFile = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(fileDuration <= config.DURATION_FREE_THRESHOLD) {
      uploadFile();
    }
  }

  const handleClose = () => {

    setFile("");
    setTranscriptName("");
    setNumSpeakers(1);
    setIsLoading(false);
    setFileDuration(0);
    setRequiresPayment(false);

    props.onClose();
  }

  const calculatePrice = () => {
    const mins = Math.round(fileDuration / 60);
    const chargedMins = mins - 15;
    const cents = Math.max(chargedMins * 10, 50);
    return cents / 100;
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Transcript</DialogTitle>
      <DialogContent>
        <DialogContentText>Transcript Details</DialogContentText>
        <form className={classes.formContainer} onSubmit={handleSubmit}>
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
          {fileDuration != 0 && 
          <>
            <Typography className={classes.formItem} variant="body1">{`Duration: ${Math.floor(fileDuration / 60)} minutes ${Math.round(fileDuration % 60)} seconds`}</Typography>
            <Typography className={classes.formItem} variant="body1">{`Price: ${(fileDuration > (15 * 60)) ? "$" + calculatePrice() : "Free!"}`}</Typography>
          </>}
        </form>
        {requiresPayment && <Checkout validateForm={validateForm} upload={uploadFile} fileDuration={fileDuration}/>}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          disabled={isLoading}
          onClick={handleClose}
        >
          Close
        </Button>
        {!requiresPayment && 
          <Button
          color="primary"
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Upload
        </Button>}
      </DialogActions>
    </Dialog>
  );
}

export default NewTranscriptDialog;