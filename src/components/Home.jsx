import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import { Auth, API } from "aws-amplify";
import TranscriptList from "./TranscriptList";

function Home() {

  const [transcripts, setTranscripts] = useState([]);

  const handleClick = async() => {
    const user = await Auth.signIn("admin@example.com", "Passw0rd!");
    
    const data = await API.get("transcripts", "/transcript");
    console.log(data);
    setTranscripts(data);
  
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Button onClick={handleClick}>Get Data</Button>
      </Grid>
      <Grid item>
        {transcripts && <TranscriptList transcripts={transcripts} />}
      </Grid>
    </Grid>
  );
}

export default Home;