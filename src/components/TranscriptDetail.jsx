import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";

function TranscriptDetail() {

  const { transcriptId } = useParams();
  const [transcript, setTranscript] = useState({});

  useEffect(() => {

    const fetchTranscript = async() => {
      console.log('Fetching single transcript');
      try {
        const fetched = await API.get("transcripts", `/transcript/${transcriptId}`);
        setTranscript(fetched.Item);
      } catch (e) {
        alert(e.message);
      }
    };

    fetchTranscript();

  }, [transcriptId]);

  return (
    <>
      <h1>{transcript.transcriptName && transcript.transcriptName}</h1>
      <p>{transcript.transcript && transcript.transcript}</p>
    </>
  );
}

export default TranscriptDetail;