import React from "react";
import { Container, Typography, makeStyles, Button, useMediaQuery, useTheme } from "@material-ui/core";
import { Link } from "react-router-dom"

const useStyles = makeStyles({
  container: {
    textAlign: "center",
    padding: "4em 0"
  },
  mainHeaders: {
    margin: "1em"
  },
  buttonGroup: {
    margin: "1em"
  },
  buttons: {
    fontSize: "1.25em",
    margin: "0.5em"
  }
});

function UnauthHome() {

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  return (
    <Container className={classes.container} maxWidth="sm">
      <div className={classes.mainHeaders}>
        <Typography variant="h1" style={(isSmall) ? {fontSize: "3.25rem"} : {}}>Wordbose</Typography>
        <Typography variant="h5" style={(isSmall) ? {fontSize: "1.5rem"} : {}}>AI-Powered Audio Transcription</Typography>
      </div>
      <div className={classes.buttonGroup}>
        <Typography>
          <Button className={classes.buttons} variant="contained" color="primary" component={Link} to="/login">Log In</Button>
          <Button className={classes.buttons} variant="outlined" color="secondary" component={Link} to="/signup">Sign Up</Button>
        </Typography>
      </div>
    </Container>
  );
}

export default UnauthHome;