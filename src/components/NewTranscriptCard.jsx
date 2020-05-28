import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Dialog,
         DialogContent, DialogContentText, DialogActions, DialogTitle} from "@material-ui/core";
import NewTranscriptDialog from "./NewTranscriptDialog";

function NewTranscriptCard() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card style={{height: "100%"}}>
        <CardContent style={{padding: "0", height: "100%", justifyContent: "center", alignItems: "center"}}>
          <Button variant="contained" color="primary" onClick={handleClickOpen} style={{width: "100%", height: "100%"}}>
            <Typography variant="h1">+</Typography>
          </Button>
        </CardContent>
      </Card>
      <NewTranscriptDialog open={open} onClose={handleClose} />
    </>
  );
}

export default NewTranscriptCard;