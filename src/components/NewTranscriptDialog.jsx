import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input, TextField} from "@material-ui/core";
import { API, Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";


function NewTranscriptDialog(props) {

  const [file, setFile] = useState("");
  const [transcriptName, setTranscriptName] = useState("");

  const formatFileName = (name) => {
    return name.substring(0, name.lastIndexOf('.')).replace(/\W/g, "") + name.substring(name.lastIndexOf('.'));
  };

  const onUpload = async () => {
  
    const transcriptId = uuidv4();
    const extension = file.name.substring(file.name.lastIndexOf('.'));

    console.log(transcriptId);
    console.log(file);

    // Call create route
    API.post("transcripts", '/transcript', {
      body: {
        transcriptId: transcriptId,
        transcriptName: transcriptName,
        date: moment(),
        fileName: file.name
      }
    });
    
    try {
      const stored = await Storage.vault.put(transcriptId + extension, file, {
        contentType: file.type
      });

      console.log(stored);
      props.onClose();
    } catch(e) {
      alert(e);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Transcript</DialogTitle>
        <DialogContent>
          <DialogContentText>Upload your file here</DialogContentText>
          <TextField label="Transcript Name" value={transcriptName} onChange={(e) => setTranscriptName(e.target.value)}/>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])}/>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={props.onClose}>Close</Button>
          <Button color="primary" variant="contained" onClick={onUpload}>Upload</Button>
        </DialogActions>
    </Dialog>
  );
}

export default NewTranscriptDialog;