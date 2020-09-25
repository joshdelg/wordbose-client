import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles, Typography, useTheme, useMediaQuery, IconButton } from "@material-ui/core";
import { GetApp, Delete } from "@material-ui/icons";
import { API } from "aws-amplify";
import moment from "moment";
import { AuthContext } from "../contexts/AuthContext";
import IncorrectUser from "./IncorrectUser";
import EditName from "./EditName";
import CustomBreadcrumbs from "./CustomBreadcrumbs";
import TranscriptBlocks from "./TranscriptBlocks";
import LegacyTranscriptView from "./LegacyTranscriptView";
import { onError } from "../libs/errorLib";
import download from "downloadjs";

const useStyles = makeStyles({
  transcriptDetailContainer: {
    width: "100%",
  },
  heading: {
    margin: "16px 0px",
  },
  dateRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
});

function TranscriptDetail() {
  const { transcriptId } = useParams();
  let history = useHistory();

  const [transcript, setTranscript] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();

  const { authData } = useContext(AuthContext);

  useEffect(() => {
    const fetchTranscript = async () => {

      try {
        const fetched = await API.get("transcripts", `/transcript/${transcriptId}`);
        setTranscript(fetched.Item);
      } catch (e) {
        onError(e);
        alert("Error fetching transcript data. Please reload to try again.");
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
      onError(e);
      alert("Error saving changes. Please try again.");
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
      onError(e);
      alert("Error saving speaker name. Please try again.");
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

  const renderTranscriptDetail = () => {

    const downloadTranscript = () => {
      // Format transcript
      let output = "";

      transcript.blocks.forEach((block, i) => {
        output += `[${block.speakerName}]: ${block.text}\n`;
      });
      output = output.substring(0, output.length - 1);

      download(output, `${transcript.transcriptName}.txt`, "text/plain");
    };

    const deleteTranscript = async() => {
      setIsDeleting(true);

      try {
        await API.del("transcripts", `/transcript/${transcript.transcriptId}`);

        // Redirect
        history.push("/");
      } catch (err) {
        onError(err);
        alert("Error deleting transcript. Please try again.");
      }
    }

    return (
      <div className={classes.transcriptDetailContainer}>
        <CustomBreadcrumbs steps={[{url: "/", text: "Wordbose"}]} final="Edit" />
        <Typography className={classes.heading} variant="h2">
          Edit Your Transcript
        </Typography>
        <div>
          <EditName transcript={transcript} setTranscript={setTranscript}/>
        </div>
        <div className={classes.dateRow}>
          <Typography variant="h5">
            {moment(transcript.date).format("MMMM Do YYYY")}
          </Typography>
          <span>
            <IconButton color="primary" onClick={downloadTranscript}><GetApp /></IconButton>
            <IconButton color="primary" onClick={deleteTranscript}><Delete /></IconButton>
          </span>
        </div>
        {(!transcript.blocks || transcript.blocks.length === 0) ? renderLegacyView() : renderTranscriptBlocks()}
      </div>
    );
  };

  return (
    <>
      {(authData.isAuthenticated && transcript) ? renderTranscriptDetail() : <IncorrectUser />}
    </>
  )
}

export default TranscriptDetail;
