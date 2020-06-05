import React, { useState } from "react";
import { Card, CardContent, Typography, Button, makeStyles} from "@material-ui/core";
import NewTranscriptDialog from "./NewTranscriptDialog";

const useStyles = makeStyles({
  cardContainer: {
    height: "100%"
  },
  cardContent: {
    padding: "0",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  newButton: {
    width: "100%",
    height: "100%"
  }
});

function NewTranscriptCard(props) {

  const [open, setOpen] = useState(false);
  
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Card className={classes.cardContainer}>
        <CardContent className={classes.cardContent}>
          <Button className={classes.newButton} variant="contained" color="primary" onClick={handleClickOpen} >
            <Typography variant="h1">+</Typography>
          </Button>
        </CardContent>
      </Card>
      <NewTranscriptDialog open={open} 
        onClose={handleClose}
        transcripts={props.transcripts}
        setTranscripts={props.setTranscripts}
      />
    </>
  );
}

export default NewTranscriptCard;