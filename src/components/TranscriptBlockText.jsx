import React, { useState } from "react";
import { Typography, makeStyles, TextField, IconButton } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";

const useStyles = makeStyles({
  blockText: {
    "&:hover": {
      background: "#eeeeee"
    }
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "0.25em"
  },
  field: {
    margin: "0.25em"
  },
  fieldButton: {
    margin: "auto 0.25em",
  }
});

function TranscriptBlockText(props) {

  const [isEditing, setIsEditing] = useState(false);
  const [originalText, setOriginalText] = useState(props.block.text);
  const [fieldText, setFieldText] = useState(props.block.text);
  const classes = useStyles();

  const handleClickText = (e) => {
    setIsEditing(true);
  }

  const renderBlockText = () => (
    <Typography variant="body1" className={classes.blockText} onClick={handleClickText}>{props.block.text}</Typography>
  );

  const saveChanges = () => {
    props.saveChanges({...props.block, text: fieldText}, props.index);
    setOriginalText(fieldText);
    setIsEditing(false);
  }

  const cancelChanges = () => {
    setFieldText(originalText);
    setIsEditing(false);
  }

  const renderTextField = () => {
    return (
      <div className={classes.fieldContainer}>
        <TextField className={classes.field} variant="outlined" multiline fullWidth value={fieldText} onChange={(e) => setFieldText(e.target.value)} />
        <IconButton className={classes.fieldButton} color="primary" onClick={saveChanges}>
          <Check />
        </IconButton>
        <IconButton className={classes.fieldButton} color="secondary" onClick={cancelChanges}>
          <Clear />
        </IconButton>
      </div>
    );
  };

  return (
    <>
      {isEditing ? renderTextField() : renderBlockText()}
    </>
  )
}

export default TranscriptBlockText;