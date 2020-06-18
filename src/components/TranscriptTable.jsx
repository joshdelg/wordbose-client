import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, useTheme, useMediaQuery } from "@material-ui/core";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";

function TranscriptTable(props) {

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const formatTranscript = (text) => {
    return (small) ? text.substring(0, 10) : text.substring(0, 100);
  }

  const handleDelete = async(transcriptId) => {
    try {
      await API.del("transcripts", `/transcript/${transcriptId}`);
      props.setTranscripts(props.transcripts.filter((t) => t.transcriptId !== transcriptId));
    } catch (err) {
      alert(err.message);
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
                <TableCell>{t.date}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" component={Link} to={`/${t.transcriptId}`}>Edit</Button>
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