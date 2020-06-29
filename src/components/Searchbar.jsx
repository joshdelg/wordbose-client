import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, makeStyles, Select, MenuItem } from "@material-ui/core";
import { Search, Clear } from "@material-ui/icons";

const useStyles = makeStyles({
  searchbar: {
    flex: "1",
    margin: "0 0.5em 0 0"
  },
  clearButton: {
    margin: "0 0.5em 0 0"
  }
});

function Searchbar(props) {

  const [isQuerying, setIsQuerying] = useState(false);
  const [searchCategory, setSearchCategory] = useState('name');
  const [searchQuery, setSearchQuery] = useState("");
  const [originalTranscripts, setOriginalTranscripts] = useState([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState([]);

  const classes = useStyles();

  /* For automatic querying
  useEffect(() => {
    if(isQuerying) {
      query();
    }
  }, [searchCategory, searchQuery]); */

  const query = () => {
    if(originalTranscripts.length === 0) {
      setOriginalTranscripts(props.transcripts);
      const filtered = props.transcripts.filter((t) => {
        switch(searchCategory) {
          case 'name':
            return t.transcriptName && (t.transcriptName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
          case 'transcript':
            return t.transcript && (t.transcript.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
          default:
            return t.transcriptName && (t.transcriptName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
        }
      });
      setFilteredTranscripts(filtered);
      props.setTranscripts(filtered);
    } else {
      const filtered = originalTranscripts.filter((t) => {
        switch(searchCategory) {
          case 'name':
            return t.transcriptName && (t.transcriptName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
          case 'transcript':
            return t.transcript && (t.transcript.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
          default:
            return t.transcriptName && (t.transcriptName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
        }
      });
      setFilteredTranscripts(filtered);
      props.setTranscripts(filtered);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setIsQuerying(true);
    query(); 
  }

  const handleClearQuery = () => {
    setIsQuerying(false);
    props.setTranscripts(originalTranscripts);
    setOriginalTranscripts([]);
    setFilteredTranscripts([]);
    setSearchQuery("");
  }

  return (
    <>
      <form className={classes.searchbar} onSubmit={handleSearchSubmit}>
        <TextField fullWidth variant="outlined" label="Search Transcripts" InputProps={{
          startAdornment: <InputAdornment position="start">
            <Select label="Search By" value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
              <MenuItem value='name'>Name</MenuItem>
              <MenuItem value='transcript'>Transcript</MenuItem>
            </Select>
          </InputAdornment>,
          endAdornment: <InputAdornment position="end"><IconButton type="submit"><Search /></IconButton></InputAdornment>
        }} value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); /*For automatic querying: setIsQuerying(true);*/}}/>
      </form>
      {isQuerying && <IconButton className={classes.clearButton} variant="outlined" color="secondary" onClick={handleClearQuery}>
        <Clear />  
      </IconButton>}
    </>
  )
}

export default Searchbar;