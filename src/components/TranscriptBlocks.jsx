import React from "react";
import { Typography, Paper, makeStyles } from "@material-ui/core";
import TranscriptBlockText from "./TranscriptBlockText";
import SpeakerLabel from "./SpeakerLabel";

const useStyles = makeStyles({
  transcriptPaper: {
  },
  transcriptBlock: {
    padding: "0.5em"
  }
});

function TranscriptBlocks(props) {

  const classes = useStyles();

  return (
    <Paper className={classes.transcriptPaper}>
      {props.transcript.blocks.map((block, i) => (
        <div key={i} className={classes.transcriptBlock}>
          <SpeakerLabel block={block} saveName={props.saveName} />
          <TranscriptBlockText block={block} index={i} saveChanges={props.saveChanges} />
          {/*<Typography className={classes.blockText} variant="body1"><strong>{block.speakerName}</strong>: {block.text}</Typography>*/}
        </div>
      ))}
    </Paper>
  );
}

export default TranscriptBlocks;