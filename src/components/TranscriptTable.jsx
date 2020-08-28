import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, useTheme, useMediaQuery } from "@material-ui/core";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import moment from "moment";
import { onError } from "../libs/errorLib";

function TranscriptTable(props) {

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));

  const formatTranscript = (text) => {
    return (small) ? text.substring(0, 10) : text.substring(0, 100);
  }

  const formatDate = (date) => {
    return moment(date).format("MMMM Do YYYY");
  }

  const handleDelete = async(transcriptId) => {
    try {
      await API.del("transcripts", `/transcript/${transcriptId}`);
      props.setTranscripts(props.transcripts.filter((t) => t.transcriptId !== transcriptId));
    } catch (e) {
      onError(e);
      alert("Error deleting transcript. Please try again.");
    }
  }

  return (
    <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transcript Name</TableCell>
              <TableCell>Transcript Preview</TableCell>
              <TableCell>Transcript Date</TableCell>
              <TableCell id="editButtonRow"></TableCell>
              <TableCell id="deleteButtonRow"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.transcripts && props.transcripts.map((t, i) => (
              <TableRow style={{height: "10px"}} hover key={i}>
                <TableCell>{formatTranscript(t.transcriptName)}</TableCell>
                <TableCell>{t.transcript ? formatTranscript(t.transcript) : "No Transcript Data Yet"}</TableCell>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" component={Link} to={`/${t.transcriptId}`}>View</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="secondary" onClick={() => handleDelete(t.transcriptId)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default TranscriptTable;