import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery
} from "@material-ui/core";
import { API } from "aws-amplify";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";
import IncorrectUser from "./IncorrectUser";
import EditName from "./EditName";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import TranscriptBlocks from "./TranscriptBlocks";
import LegacyTranscriptView from "./LegacyTranscriptView";

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
  }
});

function TranscriptDetail() {
  const { transcriptId } = useParams();
  const [transcript, setTranscript] = useState({});

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
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


  const saveChanges = async (block, index) => {

    let newBlocks = transcript.blocks;
    newBlocks[index] = block;

    let newTranscript = newBlocks.reduce((acc, block) => acc + block.text + " ", "");
    newTranscript = newTranscript.substring(0, newTranscript.length - 1);

    setTranscript({ ...transcript, transcript: newTranscript, blocks: newBlocks });
    try {
      await API.put("transcripts", `/transcript/${transcriptId}`, {
        body: {
          transcriptName: transcript.transcriptName,
          transcript: newTranscript,
          blocks: newBlocks
        },
      });
    } catch (e) {
      alert(e.message);
    }
  };

  const saveSpeakerName = async(block) => {
    const speakerId = block.speakerId;
    const newName = block.speakerName;
    const newBlocks = transcript.blocks.map((b) => (
      (speakerId === b.speakerId) ? {...b, speakerName: newName} : b
    ));

    setTranscript({...transcript, blocks: newBlocks});
    try {
      await API.put("transcripts", `/transcript/${transcriptId}`, {
        body: {
          transcriptName: transcript.transcriptName,
          transcript: transcript.transcript,
          blocks: newBlocks
        },
      });
    } catch (e) {
      alert(e);
    }
  }

  const renderTranscriptBlocks = () => {
    if(transcript.blocks) {
      return <TranscriptBlocks transcript={transcript} saveChanges={saveChanges} saveName={saveSpeakerName}/>
    }
  }
  
  const renderLegacyView = () => (
    <LegacyTranscriptView transcript={transcript} setTranscript={setTranscript}/>
  )

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
      {(!transcript.blocks || transcript.blocks.length === 0) ? renderLegacyView() : renderTranscriptBlocks()}
    </div>
  );

  return (
    <>
      {(authData.isAuthenticated && transcript) ? renderTranscriptDetail() : <IncorrectUser />}
    </>
  )
}

export default TranscriptDetail;
