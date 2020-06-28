import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  Typography,
  Paper,
  TextField,
  Button,
  useTheme,
  useMediaQuery
} from "@material-ui/core";
import { API } from "aws-amplify";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";
import IncorrectUser from "./IncorrectUser";
import EditName from "./EditName";
import CustomBreadcrumbs from "./CustomBreadcrumbs";

const useStyles = makeStyles({
  transcriptDetailContainer: {
    width: "100%",
  },
  heading: {
    margin: "16px 0px",
  },
  transcriptHeaders: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.25em"
  },
  titleAndButton: {
    flex: "1",
    display: "flex"
  },
  transcriptPaper: {
    padding: "0.5em",
    "&:hover": {
      background: "#eeeeee",
    }
  },
  transcriptText: {
    maxHeight: "50vh",
    oveflowX: "hidden",
    overflowY: "scroll",
    fontSize: "1.2em"
  },
  transcriptTextField: {
    width: "100%",
  },
  transcriptTextFieldInput: {
    lineHeight: "1.5em",
    padding: "0.5em",
    fontSize: "1.2em"
  },
  transcriptActionButtons: {
    margin: "0.5em 0.5em 0.5em 0",
  },
});

function TranscriptDetail() {
  const { transcriptId } = useParams();
  const [transcript, setTranscript] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [transcriptText, setTranscriptText] = useState("");

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  const { authData } = useContext(AuthContext);

  useEffect(() => {
    const fetchTranscript = async () => {
      console.log("Fetching single transcript");
      try {
        const fetched = await API.get(
          "transcripts",
          `/transcript/${transcriptId}`
        );
        setTranscript(fetched.Item);
      } catch (e) {
        alert(e.message);
      }
    };

    fetchTranscript();
  }, [transcriptId]);

  const handleClick = () => {
    setTranscriptText(transcript.transcript);
    setIsEditing(true);
  };

  const renderTranscriptPaper = () => (
    <Paper className={classes.transcriptPaper} onClick={handleClick}>
      <Typography className={classes.transcriptText} variant="body1">{transcript.transcript}</Typography>
    </Paper>
  );

  const cancelChanges = () => {
    setTranscriptText(transcript.transcript);
    setIsEditing(false);
  };

  const saveChanges = async () => {
    setTranscript({ ...transcript, transcript: transcriptText });
    try {
      await API.put("transcripts", `/transcript/${transcriptId}`, {
        body: {
          transcriptName: transcript.transcriptName,
          transcript: transcriptText,
        },
      });
    } catch (e) {
      alert(e.message);
    }
    setTranscriptText(transcript.transcript);
    setIsEditing(false);
  };

  const renderTranscriptForm = () => (
    <>
      <TextField
        className={classes.transcriptTextField}
        label="Transcript Text"
        variant="outlined"
        rows={12}
        InputProps={{
          className: classes.transcriptTextFieldInput
        }}
        multiline
        value={transcriptText}
        onChange={(e) => setTranscriptText(e.target.value)}
      />
      <Button
        className={classes.transcriptActionButtons}
        color="primary"
        variant="contained"
        onClick={saveChanges}
      >
        Save
      </Button>
      <Button
        className={classes.transcriptActionButtons}
        color="secondary"
        variant="outlined"
        onClick={cancelChanges}
      >
        Cancel
      </Button>
    </>
  );

  const renderTranscriptDetail = () => (
    <div className={classes.transcriptDetailContainer}>
      <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Edit" />
      <Typography className={classes.heading} variant="h2">
        Edit Your Transcript
      </Typography>
      <div
        className={classes.transcriptHeaders}
        style={
          small
            ? { flexDirection: "column" }
            : { flexDirection: "row", alignItems: "flex-end" }
        }
      >
        <span className={classes.titleAndButton}>
          <EditName transcript={transcript} setTranscript={setTranscript}/>
        </span>
        <Typography variant="h5">
          {moment(transcript.date).format("MMMM Do YYYY")}
        </Typography>
      </div>
      {isEditing ? renderTranscriptForm() : renderTranscriptPaper()}
    </div>
  );

  return (
    <>
      {(authData.isAuthenticated && transcript) ? renderTranscriptDetail() : <IncorrectUser />}
    </>
  )
}

export default TranscriptDetail;
