import React, { useState } from "react";
import { TextField, IconButton, Typography, makeStyles } from "@material-ui/core";
import { Create, Check, Clear } from "@material-ui/icons";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";

const useStyles = makeStyles({
  nameTextField: {
    flex: "1"
  }
});

function EditName(props) {

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const classes = useStyles();

  const renderNameForm = () => {

    const saveChanges = async() => {
      try {
        await API.put("transcripts", `/transcript/${props.transcript.transcriptId}`, {
          body: {
            transcriptName: name,
            transcript: props.transcript.transcript,
            blocks: props.transcript.blocks || []
          }
        });
      } catch (e) {
        onError(e);
        alert("Error saving name, please try again.");
      }

      props.setTranscript({
        ...props.transcript,
        transcriptName: name
      });
      setName("");
      setIsEditing(false);
    };

    const cancelChanges = () => {
      setName("");
      setIsEditing(false);
    }

    return (
      <>
        <TextField className={classes.nameTextField} label="Transcript Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)}/>
        <IconButton onClick={saveChanges}>
          <Check color="primary"/>
        </IconButton>
        <IconButton onClick={cancelChanges}>
          <Clear color="secondary"/>
        </IconButton>
      </>
    );
  };

  const renderName = () => {

    const handleEditClick = () => {
      setIsEditing(true);
      setName(props.transcript.transcriptName);
    }

    return (
      <>
        <Typography variant="h3">
          {props.transcript.transcriptName}
          <IconButton onClick={handleEditClick}>
            <Create color="primary"/>
          </IconButton>
        </Typography>
      </>
    );
  };

  return (
    <>
      {isEditing ? renderNameForm() : renderName()}
    </>
  )

}

export default EditName;