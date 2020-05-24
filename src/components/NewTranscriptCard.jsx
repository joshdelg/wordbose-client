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
      <Card sytle={{textAlign: "center"}}>
        <CardContent>
          <Typography variant="h4">New Transcript</Typography>
          <Button onClick={handleClickOpen}>+</Button>
        </CardContent>
      </Card>
      <NewTranscriptDialog open={open} onClose={handleClose} />
    </>
  );
}

export default NewTranscriptCard;