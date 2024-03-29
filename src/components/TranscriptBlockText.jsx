import React, { useState } from "react";
import { Typography, makeStyles, TextField, IconButton, useTheme, useMediaQuery } from "@material-ui/core";
import { Check, Clear } from "@material-ui/icons";

const useStyles = makeStyles({
  blockText: {
    "&:hover": {
      background: "#eeeeee"
    }
  },
  fieldContainer: {
    display: "flex",
    padding: "0.25em"
  },
  field: {
    margin: "0.25em"
  },
  fieldButton: {
    margin: "auto 0.25em",
  },
  buttonContainer: {
    display: "flex"
  }
});

function TranscriptBlockText(props) {

  const [isEditing, setIsEditing] = useState(false);
  const [originalText, setOriginalText] = useState(props.block.text);
  const [fieldText, setFieldText] = useState(props.block.text);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
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
      <div className={classes.fieldContainer} style={(isSmall) ? {flexDirection: "column"} : {flexDirection: "row", alignItems: "center"}}>
        <TextField className={classes.field} variant="outlined" multiline fullWidth value={fieldText} onChange={(e) => setFieldText(e.target.value)} />
        <div className={classes.buttonContainer} style={(isSmall) ? {flexDirection: "row"} : {flexDirection: "column", alignItems: "center"}}>
          <IconButton className={classes.fieldButton} color="primary" onClick={saveChanges}>
            <Check />
          </IconButton>
          <IconButton className={classes.fieldButton} color="secondary" onClick={cancelChanges}>
            <Clear />
          </IconButton>
        </div>
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