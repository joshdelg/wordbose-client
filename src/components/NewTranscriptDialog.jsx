import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Input} from "@material-ui/core";
import { Storage } from "aws-amplify";


function NewTranscriptDialog(props) {

  const [file, setFile] = useState("");

  const onUpload = async () => {
    console.log(file);
    
    try {
      const stored = await Storage.vault.put(file.name, file, {
        contentType: file.type
      });
      console.log(stored);
    } catch(e) {
      alert(e);
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>New Transcript</DialogTitle>
        <DialogContent>
          <DialogContentText>Upload your file here</DialogContentText>
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