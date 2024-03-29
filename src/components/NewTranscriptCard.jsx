import React, { useState } from "react";
import { Button } from "@material-ui/core";
import NewTranscriptDialog from "./NewTranscriptDialog";
import { Add } from "@material-ui/icons";
import { Link } from "react-router-dom";

function NewTranscriptCard(props) {

  // const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    // setOpen(true);
    
  };

  /*const handleClose = () => {
    setOpen(false);
  };*/

  return (
    <>
      <Button component={Link} to="/new" variant="contained" color="primary" startIcon={<Add />}>New</Button>
      {/*<NewTranscriptDialog open={open} 
        onClose={handleClose}
        transcripts={props.transcripts}
        setTranscripts={props.setTranscripts}
  />*/}
    </>
  );
}

export default NewTranscriptCard;