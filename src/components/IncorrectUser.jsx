import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  },
  text: {
    magin: "0.125em"
  }
});

function IncorrectUser() {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.text} variant="h1">Invalid User</Typography>
      <Typography variant="subtitle1">Log in to the correct account to view this transcript</Typography>
    </div>
  );
}

export default IncorrectUser;