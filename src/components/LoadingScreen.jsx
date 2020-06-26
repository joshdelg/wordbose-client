import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
    color: "#bbbbbb"
  }
});

function LoadingScreen() {

  const classes = useStyles();
  
  return (
    <Container className={classes.container}>
      <Typography variant="h3">Wordbose</Typography>
      <Typography variant="body1">Loading...</Typography>
    </Container>
  );
}

export default LoadingScreen;