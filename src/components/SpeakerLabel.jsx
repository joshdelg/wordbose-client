import React, { useState } from "react"
import { Typography, makeStyles, TextField, useTheme, useMediaQuery, IconButton } from "@material-ui/core"
import { Check, Clear } from "@material-ui/icons";

const useStyles = makeStyles({
  speakerLabel: {
    '&:hover': {
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

function SpeakerLabel(props) {

  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState(props.block.speakerName);
  const [fieldText, setFieldText] = useState(props.block.speakerName);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const renderSpeakerLabel = () => (
    <Typography className={classes.speakerLabel} variant="h6" onClick={(e) => setIsEditing(true)}>{props.block.speakerName}</Typography>
  );

  const saveChanges = () => {
    props.saveName({...props.block, speakerName: fieldText})
    setOriginalName(fieldText);
    setIsEditing(false);
  }

  const cancelChanges = () => {
    setFieldText(originalName);
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
  }

  return (
    <>
      {isEditing ? renderTextField() : renderSpeakerLabel()}
    </>
  )
}

export default SpeakerLabel;