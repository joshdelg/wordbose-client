import React from "react";
import { Card, CardContent, Typography, CardActions, Button, makeStyles} from "@material-ui/core";
import moment from "moment";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  transcriptContainer: {
    height: "100%"
  },
  transcriptContent: {
    height: "65%"
  }
});

function TranscriptCard(props) {

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
    // TODO make maxLength a parameter in config
    return (transcript.length > 100) ? transcript.substring(0, 97) + "..." : transcript;
  }

  return (
    <Card className={classes.transcriptContainer}>
      <CardContent className={classes.transcriptContent}>
        <Typography variant="h4">{props.t.transcriptName}</Typography>
        <Typography variant="subtitle2">{formatDate(props.t.date)}</Typography>
        {props.t.transcript && <Typography variant="body1">{formatTranscript(props.t.transcript)}</Typography>}
      </CardContent>
      <CardActions>
        {
          //TODO make link go to actual edit url
        }
        <Button component={Link} to={`/${props.t.transcriptId}`}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}

export default TranscriptCard;
