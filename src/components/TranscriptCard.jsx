import React, { useState } from "react";
import { Card, CardContent, Typography, CardActions, Button, makeStyles} from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import config from "../config";

const useStyles = makeStyles({
  transcriptContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  transcriptContent: {
    flexGrow: "1"
  },
  transcriptText: {
    fontFamily: "serif"
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
});

function TranscriptCard(props) {

  const [isDeleting, setIsDeleting] = useState(false);
  const classes = useStyles();

  const formatDate = (date) => {
    if(date) {
      const niceDate = moment(date).format("MMMM Do YYYY");
      const timePassed = moment(date).fromNow();
      return `${niceDate} (${timePassed})`;
    } else {
      return "No Date Specified";
    }
  }

  const formatTranscript = (transcript) => {
    return transcript.length > config.TRANSCRIPT_CARD_TRUNCATION
      ? transcript.substring(0, config.TRANSCRIPT_CARD_TRUNCATION - 3) + "..."
      : transcript;
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await API.del("transcripts", `/transcript/${props.t.transcriptId}`);
      props.setTranscripts(
        props.transcripts.filter(
          (val) => val.transcriptId !== props.t.transcriptId
        )
      );
    } catch (err) {
      alert(err);
    }
    
    setIsDeleting(false);
  };

  return (
    <Card className={classes.transcriptContainer}>
      <CardContent className={classes.transcriptContent}>
        <Typography noWrap variant="h4">{props.t.transcriptName}</Typography>
        <Typography variant="subtitle2">{formatDate(props.t.date)}</Typography>
        <Typography className={classes.transcriptText} variant="body1">
          {(props.t.transcript ? formatTranscript(props.t.transcript) : "No Transcript Data Yet")}
        </Typography>
      </CardContent>
      <CardActions className={classes.actionsContainer}>
        {
          //TODO make link go to actual edit url
        }
        <Button className={classes.editButton} disabled={isDeleting} color="primary" variant="contained" component={Link} to={`/${props.t.transcriptId}`}>
          Edit
        </Button>
        <Button disabled={isDeleting} color="secondary" variant="outlined" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default TranscriptCard;
